import mongoose from 'mongoose';
import crypto from 'crypto';
import { Giveaway } from '../models/Giveaway.js';
import { Wallet } from '../models/Wallet.js';
import { GiveawayParticipation } from '../models/GiveawayParticipation.js';
import { GiveawayEntryTransaction } from '../models/GiveawayEntryTransaction.js';
import { IdempotencyKey } from '../models/IdempotencyKey.js';
import { AuditLog } from '../models/AuditLog.js';
import { getEffectiveStatus } from '../utils/statusHelper.js';

const CURRENCY_FIELD_MAP = {
  VE: 'ves',
  SVE: 'sves',
  TOKEN: 'tokens'
};

/**
 * Executes the atomic join pipeline conforming strictly to PRD Section 7.
 * 
 * Flow:
 * 1. Idempotency check (returns stored response if seen)
 * 2. Giveaway existence & serverTime status verification
 * 3. Pre-check existing participation
 * 4. ACID Transaction:
 *    a. Conditional atomic wallet debit: findOneAndUpdate({ userId, [field]: { $gte: fee } }, { $inc: { [field]: -fee } })
 *    b. Create GiveawayParticipation within session
 *    c. Create append-only GiveawayEntryTransaction
 *    d. Increment participantsCount on Giveaway
 *    e. Write AuditLog
 *    f. Save Idempotency record
 *    g. Commit. Duplicate key error auto-aborts and maps to ALREADY_PARTICIPATING.
 */
export async function joinGiveaway({ userId, giveawayIdentifier, idempotencyKey, deviceId = 'unknown', ip = '127.0.0.1' }) {
  if (!userId) {
    const err = new Error('Please login to participate.');
    err.statusCode = 401;
    err.code = 'LOGIN_REQUIRED';
    throw err;
  }

  // 1. Idempotency check
  const route = `/api/giveaways/${giveawayIdentifier}/join`;
  if (idempotencyKey) {
    const existingKey = await IdempotencyKey.findOne({ key: idempotencyKey, userId, route });
    if (existingKey && existingKey.response) {
      return {
        isReplay: true,
        statusCode: existingKey.statusCode || 200,
        data: existingKey.response
      };
    }
  }

  // 2. Load giveaway by id or slug
  const giveaway = await Giveaway.findOne({
    $or: [{ giveawayId: giveawayIdentifier }, { slug: giveawayIdentifier }]
  });

  if (!giveaway) {
    const err = new Error("We couldn't find this giveaway.");
    err.statusCode = 404;
    err.code = 'GIVEAWAY_NOT_FOUND';
    throw err;
  }

  // 3. Authoritative serverTime status derivation
  const serverTime = new Date();
  const effStatus = getEffectiveStatus(giveaway, serverTime);
  if (effStatus !== 'ACTIVE') {
    const code = effStatus === 'ENDED' ? 'GIVEAWAY_ENDED' : 'GIVEAWAY_NOT_ACTIVE';
    const err = new Error(code === 'GIVEAWAY_ENDED' ? 'This giveaway has ended. Check the winners.' : "This giveaway isn't open yet.");
    err.statusCode = 409;
    err.code = code;
    throw err;
  }

  // 4. Quick pre-check for existing participation
  const existing = await GiveawayParticipation.findOne({
    userId,
    giveawayId: giveaway.giveawayId
  });

  if (existing) {
    const err = new Error("You're already participating. You can join again in the next giveaway.");
    err.statusCode = 409;
    err.code = 'ALREADY_PARTICIPATING';
    throw err;
  }

  // 5. Derive currency and fee STRICTLY from Giveaway document (ignore any client tampering)
  const currency = giveaway.entry.currency;
  const fee = giveaway.entry.amount;
  const walletField = CURRENCY_FIELD_MAP[currency];

  if (!walletField) {
    const err = new Error('Invalid currency configuration.');
    err.statusCode = 400;
    err.code = 'INVALID_CURRENCY';
    throw err;
  }

  // 6. Start MongoDB Session & Transaction
  const session = await mongoose.startSession();
  const transactionId = `tx_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  try {
    session.startTransaction();

    // Conditional atomic debit
    const wallet = await Wallet.findOneAndUpdate(
      {
        userId,
        [walletField]: { $gte: fee }
      },
      {
        $inc: { [walletField]: -fee }
      },
      { session, new: false } // returns document BEFORE modification
    );

    if (!wallet) {
      const err = new Error(`Not enough ${currency} in your wallet.`);
      err.statusCode = 402;
      err.code = `INSUFFICIENT_${currency}_BALANCE`;
      throw err;
    }

    const balanceBefore = wallet[walletField];
    const balanceAfter = balanceBefore - fee;

    // Create participation record
    const [participation] = await GiveawayParticipation.create(
      [
        {
          userId,
          giveawayId: giveaway.giveawayId,
          prizeId: giveaway.prizeId,
          entryCurrency: currency,
          entryAmount: fee,
          deviceHash: deviceId,
          status: 'ACTIVE',
          riskScore: 0,
          transactionId,
          joinedAt: serverTime
        }
      ],
      { session }
    );

    // Create append-only entry transaction
    await GiveawayEntryTransaction.create(
      [
        {
          transactionId,
          userId,
          giveawayId: giveaway.giveawayId,
          prizeId: giveaway.prizeId,
          currency,
          amount: fee,
          type: 'ENTRY_FEE',
          status: 'SUCCESS',
          balanceBefore,
          balanceAfter,
          createdAt: serverTime
        }
      ],
      { session }
    );

    // Increment participantsCount on giveaway
    await Giveaway.updateOne(
      { giveawayId: giveaway.giveawayId },
      { $inc: { participantsCount: 1 } },
      { session }
    );

    // Write append-only audit log
    await AuditLog.create(
      [
        {
          action: 'JOIN_GIVEAWAY',
          userId,
          giveawayId: giveaway.giveawayId,
          amount: fee,
          currency,
          result: 'SUCCESS',
          details: { transactionId, balanceBefore, balanceAfter },
          timestamp: serverTime
        }
      ],
      { session }
    );

    const resultData = {
      giveawayId: giveaway.giveawayId,
      transactionId,
      entryCurrency: currency,
      entryAmount: fee,
      balanceAfter,
      ticket: {
        ticketNumber: `TKT-${giveaway.giveawayId.toUpperCase().slice(-6)}-${Date.now().toString().slice(-4)}`,
        joinedAt: serverTime.toISOString()
      }
    };

    // Store idempotency record if key provided
    if (idempotencyKey) {
      await IdempotencyKey.create(
        [
          {
            key: idempotencyKey,
            userId,
            route,
            response: resultData,
            statusCode: 200,
            createdAt: serverTime
          }
        ],
        { session }
      );
    }

    await session.commitTransaction();
    return {
      isReplay: false,
      statusCode: 200,
      data: resultData
    };
  } catch (err) {
    await session.abortTransaction();

    // Handle duplicate key or write conflict from concurrent requests
    const isWriteConflict =
      err.code === 112 ||
      err.name === 'WriteConflict' ||
      err.message?.includes('Write conflict') ||
      err.hasErrorLabel?.('TransientTransactionError');
    const isDuplicateKey = err.code === 11000 || err.message?.includes('E11000');

    if (isDuplicateKey || isWriteConflict) {
      // Allow the winning concurrent transaction a microsecond to finish committing
      await new Promise((resolve) => setTimeout(resolve, 25));
      const alreadyJoined = await GiveawayParticipation.findOne({
        userId,
        giveawayId: giveaway.giveawayId
      });
      if (alreadyJoined || isDuplicateKey || isWriteConflict) {
        const duplicateError = new Error("You're already participating. You can join again in the next giveaway.");
        duplicateError.statusCode = 409;
        duplicateError.code = 'ALREADY_PARTICIPATING';
        throw duplicateError;
      }
    }

    throw err;
  } finally {
    await session.endSession();
  }
}
