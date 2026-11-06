import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
import { Wallet } from '../src/models/Wallet.js';
import { Prize } from '../src/models/Prize.js';
import { Giveaway } from '../src/models/Giveaway.js';
import { GiveawayParticipation } from '../src/models/GiveawayParticipation.js';
import { finalizeGiveaway, redrawWinner } from '../src/services/winnerService.js';
import { submitClaim } from '../src/services/claimService.js';

async function runTests() {
  console.log('[Test] Starting Winner Selection & Prize Claims Verification...');
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = replSet.getUri();
  await mongoose.connect(uri);

  try {
    // 1. Seed Prize
    await Prize.create({
      id: 'prize-iphone15pro',
      name: 'iPhone 15 Pro (128GB)',
      type: 'PHYSICAL',
      claimType: 'COURIER',
      image: '/assets/prizes/iphone15pro.png',
      retailPrice: 134900
    });

    // 2. Seed Users & Wallets
    const userIds = ['VE10001', 'VE10002', 'VE10003', 'VE10004'];
    for (const uid of userIds) {
      await User.create({
        userId: uid,
        email: `${uid.toLowerCase()}@test.com`,
        passwordHash: 'hash123',
        role: uid === 'VE10004' ? 'ADMIN' : 'USER',
        status: 'ACTIVE'
      });
      await Wallet.create({ userId: uid, ves: 5000, sves: 100, tokens: 1000 });
    }

    // 3. Seed Giveaway
    const giveawayId = 'gw-test-pool-01';
    await Giveaway.create({
      giveawayId,
      campaign: 'Tech Drop 2026',
      slug: 'tech-drop-iphone',
      title: 'iPhone 15 Pro Exclusive Pool',
      prizeId: 'prize-iphone15pro',
      status: 'ACTIVE',
      winnersStatus: 'PENDING',
      startAt: new Date(Date.now() - 3600000),
      endAt: new Date(Date.now() + 3600000),
      entry: { currency: 'VE', amount: 250 },
      winnerCount: 1,
      claimWindowDays: 7
    });

    // 4. Seed Participations for 3 users (VE10001, VE10002, VE10003)
    for (const uid of ['VE10001', 'VE10002', 'VE10003']) {
      await GiveawayParticipation.create({
        userId: uid,
        giveawayId,
        prizeId: 'prize-iphone15pro',
        entryCurrency: 'VE',
        entryAmount: 250,
        deviceHash: `device-${uid}`,
        status: 'ACTIVE',
        transactionId: `tx-${uid}`
      });
    }

    // --- TEST 1: Winner Selection Finalize ---
    console.log('[Test 1] Executing crypto.randomInt winner selection...');
    const finalizeRes = await finalizeGiveaway(giveawayId, 'VE10004');
    if (!finalizeRes.success || finalizeRes.winners.length !== 1) {
      throw new Error(`Finalize failed: ${JSON.stringify(finalizeRes)}`);
    }
    const chosenWinner = finalizeRes.winners[0];
    console.log(`[Test 1] ✅ Winner selected: ${chosenWinner.userId} via ${chosenWinner.selectionMethod}`);

    // --- TEST 2: Idempotent Re-finalization ---
    console.log('[Test 2] Testing duplicate finalization guard (idempotency)...');
    const duplicateFinalize = await finalizeGiveaway(giveawayId, 'VE10004');
    if (!duplicateFinalize.idempotent || duplicateFinalize.winners[0].userId !== chosenWinner.userId) {
      throw new Error('Idempotency failed: duplicate finalization did not return matching winner');
    }
    console.log('[Test 2] ✅ Idempotency guard verified: duplicate finalization safely returned existing winner.');

    // --- TEST 3: Non-Winner Claim Rejection ---
    console.log('[Test 3] Testing non-winner claim rejection...');
    const nonWinnerId = ['VE10001', 'VE10002', 'VE10003'].find((uid) => uid !== chosenWinner.userId);
    try {
      await submitClaim(nonWinnerId, giveawayId, {
        fullName: 'Test User',
        phone: '9876543210',
        addressLine1: '123 Fake Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      });
      throw new Error('Expected non-winner claim to fail, but it succeeded');
    } catch (err) {
      if (err.errorCode !== 'NOT_A_WINNER') {
        throw new Error(`Unexpected error code for non-winner: ${err.errorCode}`);
      }
      console.log('[Test 3] ✅ Non-winner rejected cleanly with NOT_A_WINNER (HTTP 403).');
    }

    // --- TEST 4: Invalid Shipping Details Payload ---
    console.log('[Test 4] Testing invalid shipping details validation...');
    try {
      await submitClaim(chosenWinner.userId, giveawayId, {
        fullName: 'Test User',
        phone: '123', // invalid phone
        addressLine1: '123 Fake Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400' // invalid pincode
      });
      throw new Error('Expected invalid payload to fail, but it succeeded');
    } catch (err) {
      if (err.errorCode !== 'INVALID_CLAIM_PAYLOAD') {
        throw new Error(`Unexpected error code for invalid payload: ${err.errorCode}`);
      }
      console.log('[Test 4] ✅ Invalid payload rejected cleanly with INVALID_CLAIM_PAYLOAD.');
    }

    // --- TEST 5: Legitimate Winner Claim Submission ---
    console.log('[Test 5] Testing valid winner prize claim...');
    const claimRes = await submitClaim(chosenWinner.userId, giveawayId, {
      fullName: 'Winner User',
      phone: '9876543210',
      addressLine1: '456 Winner Blvd, Penthouse 4B',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001'
    });
    if (!claimRes.success || claimRes.status !== 'SUBMITTED') {
      throw new Error(`Claim failed: ${JSON.stringify(claimRes)}`);
    }
    console.log(`[Test 5] ✅ Claim submitted successfully: ClaimId ${claimRes.claimId}`);

    // --- TEST 6: Duplicate Claim Rejection ---
    console.log('[Test 6] Testing duplicate claim submission prevention...');
    try {
      await submitClaim(chosenWinner.userId, giveawayId, {
        fullName: 'Winner User',
        phone: '9876543210',
        addressLine1: '456 Winner Blvd',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
      });
      throw new Error('Expected duplicate claim to fail, but it succeeded');
    } catch (err) {
      if (err.errorCode !== 'ALREADY_CLAIMED') {
        throw new Error(`Unexpected error code for duplicate claim: ${err.errorCode}`);
      }
      console.log('[Test 6] ✅ Duplicate claim rejected cleanly with ALREADY_CLAIMED (HTTP 409).');
    }

    // --- TEST 7: Winner Redraw ---
    console.log('[Test 7] Testing winner redraw on administrative disqualification...');
    const redrawRes = await redrawWinner(giveawayId, chosenWinner.userId, 'Address verification failed', 'VE10004');
    if (!redrawRes.success || redrawRes.newWinner.userId === chosenWinner.userId) {
      throw new Error('Redraw failed to select a distinct new winner');
    }
    console.log(`[Test 7] ✅ Redraw verified: Previous ${redrawRes.disqualifiedUserId} disqualified, New Winner drawn: ${redrawRes.newWinner.userId}`);

    console.log('\n========================================');
    console.log('✅ ALL WINNER & CLAIM TESTS PASSED CLEANLY');
    console.log('========================================\n');
  } finally {
    await mongoose.disconnect();
    await replSet.stop();
  }
}

runTests().catch((err) => {
  console.error('[Test Failed]', err);
  process.exit(1);
});
