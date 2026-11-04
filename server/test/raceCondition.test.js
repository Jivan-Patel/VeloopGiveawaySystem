import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { seedDatabase } from '../src/scripts/seed.js';
import { login } from '../src/services/authService.js';
import { Wallet } from '../src/models/Wallet.js';
import { GiveawayParticipation } from '../src/models/GiveawayParticipation.js';

async function runRaceTest() {
  console.log('[Test] Initializing in-memory MongoDB Replica Set for ACID transactions...');
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = replSet.getUri();

  await mongoose.connect(uri);
  console.log('[Test] Connected to MongoDB replica set.');

  // Seed standard active database
  await seedDatabase('active');

  // Authenticate user VE10025 (password: Password123!)
  const auth = await login({ email: 'jivan@veloop.io', password: 'Password123!' });
  const token = auth.token;
  const initialWallet = await Wallet.findOne({ userId: 'VE10025' });
  const initialVes = initialWallet.ves; // 2500 VE
  console.log(`[Test] User authenticated: VE10025 | Initial Balance: ${initialVes} VE`);

  // Target giveaway: Apple iPhone 15 Pro Max (Fee: 250 VE)
  const giveawaySlug = 'iphone-15-pro-max';

  console.log('[Test] Firing 20 simultaneous parallel join requests...');
  const parallelRequests = Array.from({ length: 20 }, (_, idx) =>
    request(app)
      .post(`/api/giveaways/${giveawaySlug}/join`)
      .set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', `test-race-key-${idx}`)
      .set('X-Device-Id', 'test-device-race')
  );

  const results = await Promise.all(parallelRequests);

  const successful = results.filter((r) => r.status === 200);
  const alreadyParticipating = results.filter((r) => r.status === 409 && r.body.code === 'ALREADY_PARTICIPATING');

  console.log(`[Test] Results -> 200 OK: ${successful.length} | 409 ALREADY_PARTICIPATING: ${alreadyParticipating.length}`);

  if (successful.length !== 1) {
    throw new Error(`CRITICAL FAILURE: Expected exactly 1 successful join, but got ${successful.length}!`);
  }

  if (alreadyParticipating.length !== 19) {
    throw new Error(`CRITICAL FAILURE: Expected 19 409 ALREADY_PARTICIPATING responses, but got ${alreadyParticipating.length}!`);
  }

  // Verify wallet balance deduction
  const finalWallet = await Wallet.findOne({ userId: 'VE10025' });
  const expectedBalance = initialVes - 250;
  console.log(`[Test] Final Wallet Balance: ${finalWallet.ves} VE (Expected: ${expectedBalance} VE)`);

  if (finalWallet.ves !== expectedBalance) {
    throw new Error(`CRITICAL FAILURE: Wallet balance deducted incorrectly! Expected ${expectedBalance}, got ${finalWallet.ves}`);
  }

  // Verify database records count
  const participations = await GiveawayParticipation.find({ userId: 'VE10025', giveawayId: 'gw-iphone-15-pro' });
  console.log(`[Test] Participation rows in database: ${participations.length} (Expected: 1)`);

  if (participations.length !== 1) {
    throw new Error(`CRITICAL FAILURE: Expected exactly 1 participation record in database, got ${participations.length}!`);
  }

  await mongoose.disconnect();
  await replSet.stop();
  console.log('[Test] ✅ 20-Parallel Race Condition Test PASSED PERFECTLY!');
}

runRaceTest().catch((err) => {
  console.error('[Test] ❌ Test Failed:', err);
  process.exit(1);
});
