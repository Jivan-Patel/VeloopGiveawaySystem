import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { seedDatabase } from '../src/scripts/seed.js';
import { login } from '../src/services/authService.js';
import { Wallet } from '../src/models/Wallet.js';
import { FraudEvent } from '../src/models/FraudEvent.js';

async function runFraudTest() {
  console.log('[Test] Running Fraud Engine & Risk Scoring Tests...');
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(replSet.getUri());
  await seedDatabase('active');

  // Authenticate user VE10025 and user VE10082
  const user1 = await login({ email: 'jivan@veloop.io', password: 'Password123!' });
  const user2 = await login({ email: 'aarav.m@gmail.com', password: 'Password123!' });

  const giveawaySlug = 'iphone-15-pro-max';
  const sharedDeviceId = 'shared-hardware-device-hash';

  // Step 1: User 1 joins normally with device
  const res1 = await request(app)
    .post(`/api/giveaways/${giveawaySlug}/join`)
    .set('Authorization', `Bearer ${user1.token}`)
    .set('Idempotency-Key', 'fraud-test-key-1')
    .set('X-Device-Id', sharedDeviceId);

  console.log('[Test] User 1 Join Status:', res1.status);
  if (res1.status !== 200) throw new Error('User 1 join failed!');

  // Step 2: User 2 tries to join the same giveaway from the SAME device
  // Points: +40 (Duplicate device different account in same giveaway) + other signals
  const initialWalletUser2 = await Wallet.findOne({ userId: 'VE10082' });

  const res2 = await request(app)
    .post(`/api/giveaways/${giveawaySlug}/join`)
    .set('Authorization', `Bearer ${user2.token}`)
    .set('Idempotency-Key', 'fraud-test-key-2')
    .set('X-Device-Id', sharedDeviceId)
    .send({ amount: 10, currency: 'VE' }); // Client tampering (+25 points) -> Total risk score >= 65 (HIGH / BLOCKED!)

  console.log('[Test] User 2 High-Risk Join Status:', res2.status, 'Code:', res2.body.code);

  if (res2.status !== 403 || res2.body.code !== 'PARTICIPATION_BLOCKED') {
    throw new Error(`CRITICAL: High risk fraud join was NOT blocked! Status: ${res2.status}`);
  }

  // Verify User 2 wallet balance was NOT deducted
  const finalWalletUser2 = await Wallet.findOne({ userId: 'VE10082' });
  if (finalWalletUser2.ves !== initialWalletUser2.ves) {
    throw new Error('CRITICAL: Blocked fraud attempt caused unauthorized balance deduction!');
  }
  console.log('[Test] User 2 wallet was NOT deducted (0 deduction on blocked fraud).');

  // Verify FraudEvent was recorded in database
  const fraudEvents = await FraudEvent.find({ userId: 'VE10082' });
  console.log('[Test] Fraud events recorded:', fraudEvents.length, 'Action:', fraudEvents[0]?.action);

  if (fraudEvents.length === 0) {
    throw new Error('CRITICAL: FraudEvent was not persisted to database!');
  }

  await mongoose.disconnect();
  await replSet.stop();
  console.log('[Test] ✅ Fraud Risk Engine & Security Blocking Verified Successfully!');
}

runFraudTest().catch((err) => {
  console.error('[Test] ❌ Fraud Test Failed:', err);
  process.exit(1);
});
