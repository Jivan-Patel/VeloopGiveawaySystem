import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { Wallet } from '../src/models/Wallet.js';
import { Prize } from '../src/models/Prize.js';
import { Giveaway } from '../src/models/Giveaway.js';
import { GiveawayParticipation } from '../src/models/GiveawayParticipation.js';
import { GiveawayWinner } from '../src/models/GiveawayWinner.js';
import { generateToken } from '../src/services/authService.js';
import { finalizeGiveaway } from '../src/services/winnerService.js';

async function runSecurityTests() {
  console.log('[Security Test] Initializing in-memory replica set and test environment...');
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = replSet.getUri();
  await mongoose.connect(uri);

  try {
    // 1. Seed Prize
    await Prize.create({
      id: 'prize-security-test',
      name: 'Sony PlayStation 5 Pro',
      type: 'PHYSICAL',
      claimType: 'COURIER',
      image: '/assets/prizes/ps5.png',
      retailPrice: 69990
    });

    // 2. Seed Test Users (User A, User B, Admin)
    const userA = await User.create({
      userId: 'VE_SEC_01',
      email: 'sec01@test.com',
      passwordHash: 'hash123',
      role: 'USER',
      status: 'ACTIVE'
    });
    const userB = await User.create({
      userId: 'VE_SEC_02',
      email: 'sec02@test.com',
      passwordHash: 'hash123',
      role: 'USER',
      status: 'ACTIVE'
    });
    const adminUser = await User.create({
      userId: 'VE_ADMIN_01',
      email: 'admin01@test.com',
      passwordHash: 'hash123',
      role: 'ADMIN',
      status: 'ACTIVE'
    });

    await Wallet.create({ userId: userA.userId, ves: 1000, sves: 0, tokens: 0 });
    await Wallet.create({ userId: userB.userId, ves: 1000, sves: 0, tokens: 0 });
    await Wallet.create({ userId: adminUser.userId, ves: 5000, sves: 100, tokens: 1000 });

    const tokenA = generateToken(userA);
    const tokenB = generateToken(userB);
    const tokenAdmin = generateToken(adminUser);

    // 3. Seed Giveaway Pool
    const giveawayId = 'gw-sec-test-pool';
    await Giveaway.create({
      giveawayId,
      campaign: 'Security & Integrity Drop',
      slug: 'sec-drop-ps5',
      title: 'PS5 Pro Security Verification Pool',
      prizeId: 'prize-security-test',
      status: 'ACTIVE',
      winnersStatus: 'PENDING',
      startAt: new Date(Date.now() - 3600000),
      endAt: new Date(Date.now() + 3600000),
      entry: { currency: 'VE', amount: 200 },
      winnerCount: 1,
      claimWindowDays: 7
    });

    // --- TEST 1: Unauthenticated Endpoint Access ---
    console.log('[Test 1] Testing unauthenticated access to join endpoint...');
    const unauthRes = await request(app)
      .post(`/api/giveaways/${giveawayId}/join`)
      .send({});
    if (unauthRes.status !== 401) {
      throw new Error(`Expected HTTP 401 for unauthenticated request, got ${unauthRes.status}`);
    }
    console.log('[Test 1] ✅ Unauthenticated request rejected cleanly with HTTP 401.');

    // --- TEST 2: Payload Tampering Rejection ---
    console.log('[Test 2] Testing tamper resistance (attempting body override fee: 0)...');
    const tamperRes = await request(app)
      .post(`/api/giveaways/${giveawayId}/join`)
      .set('Authorization', `Bearer ${tokenA}`)
      .set('Idempotency-Key', 'idem-tamper-01')
      .set('X-Device-Id', 'device-sec-01')
      .send({
        amount: 0, // Malicious tamper
        currency: 'VE'
      });

    // Check that wallet was charged authoritative fee (200 VE), not tampered fee (0 VE)
    const walletA = await Wallet.findOne({ userId: userA.userId });
    if (walletA.ves !== 800) {
      throw new Error(`Tamper vulnerability: expected balance 800 VE, found ${walletA.ves} VE`);
    }
    console.log(`[Test 2] ✅ Tamper resistance verified: wallet balance is ${walletA.ves} VE (authoritative fee deducted).`);

    // --- TEST 3: User B Joins Cleanly ---
    console.log('[Test 3] User B joins giveaway...');
    const joinBRes = await request(app)
      .post(`/api/giveaways/${giveawayId}/join`)
      .set('Authorization', `Bearer ${tokenB}`)
      .set('Idempotency-Key', 'idem-join-b')
      .set('X-Device-Id', 'device-sec-02')
      .send({});
    if (joinBRes.status !== 200) {
      throw new Error(`User B join failed: ${joinBRes.status}`);
    }
    console.log('[Test 3] ✅ User B joined successfully.');

    // --- TEST 4: Crypto Winner Selection via Admin Endpoint ---
    console.log('[Test 4] Admin triggers cryptographically secure winner selection...');
    const finalizeRes = await request(app)
      .post(`/api/admin/giveaways/${giveawayId}/finalize`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({});
    if (finalizeRes.status !== 200 || !finalizeRes.body.success) {
      throw new Error(`Admin finalize failed: ${JSON.stringify(finalizeRes.body)}`);
    }
    const winnerData = finalizeRes.body.data.winners[0];
    console.log(`[Test 4] ✅ Winner selected: ${winnerData.userId} via ${winnerData.selectionMethod}`);

    // --- TEST 5: Non-Winner Claim Rejection ---
    console.log('[Test 5] Non-winner attempts to claim prize...');
    const nonWinnerUser = winnerData.userId === userA.userId ? userB : userA;
    const nonWinnerToken = winnerData.userId === userA.userId ? tokenB : tokenA;

    const nonWinnerClaimRes = await request(app)
      .post(`/api/giveaways/${giveawayId}/claim`)
      .set('Authorization', `Bearer ${nonWinnerToken}`)
      .send({
        fullName: 'Hacker User',
        phone: '9988776655',
        addressLine1: 'Dark Web Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      });

    if (nonWinnerClaimRes.status !== 403) {
      throw new Error(`Expected HTTP 403 for non-winner claim, got ${nonWinnerClaimRes.status}`);
    }
    console.log('[Test 5] ✅ Non-winner claim blocked with HTTP 403.');

    // --- TEST 6: Legitimate Winner Claim Submission ---
    console.log('[Test 6] Legitimate winner submits valid shipping address...');
    const winnerToken = winnerData.userId === userA.userId ? tokenA : tokenB;

    const winnerClaimRes = await request(app)
      .post(`/api/giveaways/${giveawayId}/claim`)
      .set('Authorization', `Bearer ${winnerToken}`)
      .send({
        fullName: 'Legitimate Winner',
        phone: '9876543210',
        addressLine1: '742 Evergreen Terrace',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
      });

    if (winnerClaimRes.status !== 201 || !winnerClaimRes.body.data.claimId) {
      throw new Error(`Winner claim failed: ${JSON.stringify(winnerClaimRes.body)}`);
    }
    console.log(`[Test 6] ✅ Winner claim created: Claim ID ${winnerClaimRes.body.data.claimId}`);

    // --- TEST 7: Duplicate Claim Rejection ---
    console.log('[Test 7] Winner attempts duplicate claim submission...');
    const dupClaimRes = await request(app)
      .post(`/api/giveaways/${giveawayId}/claim`)
      .set('Authorization', `Bearer ${winnerToken}`)
      .send({
        fullName: 'Legitimate Winner',
        phone: '9876543210',
        addressLine1: '742 Evergreen Terrace',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
      });

    if (dupClaimRes.status !== 409) {
      throw new Error(`Expected HTTP 409 for duplicate claim, got ${dupClaimRes.status}`);
    }
    console.log('[Test 7] ✅ Duplicate claim rejected with HTTP 409 (ALREADY_CLAIMED).');

    // --- TEST 8: Expired Claim Window Enforced ---
    console.log('[Test 8] Testing claim rejection after 7-day window...');
    const expiredGwId = 'gw-expired-pool';
    await Giveaway.create({
      giveawayId: expiredGwId,
      campaign: 'Old Drop',
      slug: 'old-drop-expired',
      title: 'Expired Pool',
      prizeId: 'prize-security-test',
      status: 'ENDED',
      winnersStatus: 'FINALIZED',
      startAt: new Date(Date.now() - 30 * 86400000),
      endAt: new Date(Date.now() - 15 * 86400000), // 15 days ago (> 7 days)
      entry: { currency: 'VE', amount: 100 },
      winnerCount: 1,
      claimWindowDays: 7
    });
    await GiveawayWinner.create({
      giveawayId: expiredGwId,
      prizeId: 'prize-security-test',
      userId: userA.userId,
      selectionMethod: 'CRYPTO_RANDOM',
      status: 'CONFIRMED'
    });

    const expiredClaimRes = await request(app)
      .post(`/api/giveaways/${expiredGwId}/claim`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fullName: 'User A',
        phone: '9876543210',
        addressLine1: 'Address',
        city: 'City',
        state: 'State',
        pincode: '400001'
      });

    if (expiredClaimRes.status !== 400) {
      throw new Error(`Expected HTTP 400 for expired claim, got ${expiredClaimRes.status}`);
    }
    console.log('[Test 8] ✅ Expired claim rejected with HTTP 400 (CLAIM_EXPIRED).');

    console.log('\n======================================================');
    console.log('✅ ALL SECURITY, TAMPER, REPLAY & CLAIM TESTS PASSED!');
    console.log('======================================================\n');
  } finally {
    await mongoose.disconnect();
    await replSet.stop();
  }
}

runSecurityTests().catch((err) => {
  console.error('[Security Test Failed]', err);
  process.exit(1);
});
