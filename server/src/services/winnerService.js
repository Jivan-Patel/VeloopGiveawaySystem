import crypto from 'crypto';
import { Giveaway } from '../models/Giveaway.js';
import { GiveawayParticipation } from '../models/GiveawayParticipation.js';
import { GiveawayWinner } from '../models/GiveawayWinner.js';
import { AuditLog } from '../models/AuditLog.js';

/**
 * Finalize a giveaway pool using cryptographically secure random winner selection.
 * Enforces idempotency: once finalized, returns existing winners without duplicate selection.
 *
 * @param {string} idOrSlug - Giveaway ID or Slug
 * @param {string} adminUserId - User ID of the admin triggering the draw
 * @returns {Promise<object>} Result containing winners and giveaway status
 */
export async function finalizeGiveaway(idOrSlug, adminUserId = 'system') {
  const giveaway = await Giveaway.findOne({
    $or: [{ giveawayId: idOrSlug }, { slug: idOrSlug }]
  });

  if (!giveaway) {
    const error = new Error('Giveaway not found');
    error.statusCode = 404;
    error.errorCode = 'GIVEAWAY_NOT_FOUND';
    throw error;
  }

  // Idempotency guard: If already finalized, return existing confirmed winners
  if (giveaway.winnersStatus === 'FINALIZED') {
    const existingWinners = await GiveawayWinner.find({
      giveawayId: giveaway.giveawayId,
      status: 'CONFIRMED'
    });
    return {
      success: true,
      idempotent: true,
      giveawayId: giveaway.giveawayId,
      winnersStatus: 'FINALIZED',
      winnerCount: existingWinners.length,
      winners: existingWinners
    };
  }

  // Fetch all active, valid participations
  const participations = await GiveawayParticipation.find({
    giveawayId: giveaway.giveawayId,
    status: 'ACTIVE'
  });

  if (participations.length === 0) {
    const error = new Error('No eligible active participants found to draw winners');
    error.statusCode = 400;
    error.errorCode = 'NO_PARTICIPANTS';
    throw error;
  }

  // Uniform cryptographically secure random selection using Node.js crypto.randomInt
  const targetCount = Math.min(giveaway.winnerCount || 1, participations.length);
  const candidates = [...participations];
  const selectedParticipations = [];

  for (let i = 0; i < targetCount; i++) {
    const randomIndex = crypto.randomInt(0, candidates.length);
    const chosen = candidates.splice(randomIndex, 1)[0];
    selectedParticipations.push(chosen);
  }

  // Persist winners with upsert to prevent duplicates
  const confirmedWinners = [];
  for (const p of selectedParticipations) {
    const winner = await GiveawayWinner.findOneAndUpdate(
      { giveawayId: giveaway.giveawayId, userId: p.userId },
      {
        $setOnInsert: {
          giveawayId: giveaway.giveawayId,
          prizeId: giveaway.prizeId,
          userId: p.userId,
          selectionMethod: 'CRYPTO_RANDOM',
          selectedAt: new Date(),
          status: 'CONFIRMED'
        }
      },
      { upsert: true, new: true }
    );
    confirmedWinners.push(winner);
  }

  // Atomically update giveaway state to FINALIZED
  giveaway.winnersStatus = 'FINALIZED';
  giveaway.status = 'ENDED';
  giveaway.finalizedAt = new Date();
  await giveaway.save();

  // Immutable audit logging
  await AuditLog.create({
    action: 'GIVEAWAY_FINALIZED',
    userId: adminUserId,
    giveawayId: giveaway.giveawayId,
    result: 'SUCCESS',
    details: {
      winnerCount: confirmedWinners.length,
      winners: confirmedWinners.map((w) => w.userId)
    }
  });

  return {
    success: true,
    idempotent: false,
    giveawayId: giveaway.giveawayId,
    winnersStatus: 'FINALIZED',
    winnerCount: confirmedWinners.length,
    winners: confirmedWinners
  };
}

/**
 * Redraw a replacement winner if a previously confirmed winner is disqualified or rejected.
 *
 * @param {string} giveawayId - ID of the giveaway
 * @param {string} disqualifiedUserId - User ID being disqualified
 * @param {string} reason - Administrative reason for disqualification
 * @param {string} adminUserId - Admin ID executing the redraw
 * @returns {Promise<object>} Redraw result with new winner
 */
export async function redrawWinner(giveawayId, disqualifiedUserId, reason = 'Administrative disqualification', adminUserId = 'system') {
  const winner = await GiveawayWinner.findOne({
    giveawayId,
    userId: disqualifiedUserId,
    status: 'CONFIRMED'
  });

  if (!winner) {
    const error = new Error('Confirmed winner not found for disqualification');
    error.statusCode = 404;
    error.errorCode = 'WINNER_NOT_FOUND';
    throw error;
  }

  // Mark previous winner as disqualified
  winner.status = 'DISQUALIFIED';
  await winner.save();

  await GiveawayParticipation.updateOne(
    { giveawayId, userId: disqualifiedUserId },
    { status: 'DISQUALIFIED' }
  );

  // Find remaining active participants not already confirmed as winners
  const activeWinners = await GiveawayWinner.find({ giveawayId, status: 'CONFIRMED' });
  const activeWinnerUserIds = activeWinners.map((w) => w.userId);

  const eligible = await GiveawayParticipation.find({
    giveawayId,
    status: 'ACTIVE',
    userId: { $nin: [...activeWinnerUserIds, disqualifiedUserId] }
  });

  if (eligible.length === 0) {
    const error = new Error('No eligible replacement participants available');
    error.statusCode = 400;
    error.errorCode = 'NO_ELIGIBLE_REPLACEMENTS';
    throw error;
  }

  // Draw replacement with crypto.randomInt
  const replacementIndex = crypto.randomInt(0, eligible.length);
  const replacementParticipant = eligible[replacementIndex];

  const newWinner = await GiveawayWinner.create({
    giveawayId,
    prizeId: winner.prizeId,
    userId: replacementParticipant.userId,
    selectionMethod: 'CRYPTO_RANDOM',
    selectedAt: new Date(),
    status: 'CONFIRMED'
  });

  // Audit log the redraw
  await AuditLog.create({
    action: 'WINNER_REDRAWN',
    userId: adminUserId,
    giveawayId,
    result: 'SUCCESS',
    details: {
      disqualifiedUserId,
      reason,
      newWinnerUserId: newWinner.userId
    }
  });

  return {
    success: true,
    giveawayId,
    disqualifiedUserId,
    reason,
    newWinner
  };
}

export default {
  finalizeGiveaway,
  redrawWinner
};
