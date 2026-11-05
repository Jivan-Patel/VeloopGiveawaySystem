import crypto from 'crypto';
import { DeviceRecord } from '../models/DeviceRecord.js';
import { FraudEvent } from '../models/FraudEvent.js';
import { User } from '../models/User.js';
import { GiveawayParticipation } from '../models/GiveawayParticipation.js';

const DEVICE_HASH_SECRET = process.env.DEVICE_HASH_SECRET || 'dev-device-hmac-secret-replace-in-production';

/**
 * Computes deterministic HMAC hash of visitor ID and User-Agent.
 * Raw device fingerprint data is never stored per PRD Section 10.
 */
export function computeDeviceHash(deviceId, userAgent = '') {
  if (!deviceId) return null;
  return crypto.createHmac('sha256', DEVICE_HASH_SECRET).update(`${deviceId}::${userAgent}`).digest('hex');
}

/**
 * Evaluates fraud signals and calculates a risk score conforming to PRD Section 10.
 *
 * Signal Weights:
 * - Same deviceHash already joined this giveaway on another account: +40
 * - Device seen on 3 or more accounts overall: +20
 * - Account younger than 24h: +15
 * - Tampered request fields detected: +25
 * - Missing device header: +10
 */
export async function evaluateRisk({ userId, giveawayId, deviceHash, hasTamperedFields = false }) {
  let riskScore = 0;
  const signals = [];

  if (!deviceHash) {
    riskScore += 10;
    signals.push('MISSING_DEVICE_HEADER');
  }

  if (hasTamperedFields) {
    riskScore += 25;
    signals.push('TAMPERED_REQUEST_FIELDS');
  }

  if (userId) {
    const user = await User.findOne({ userId });
    if (user && user.createdAt) {
      const ageHours = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60);
      if (ageHours < 24) {
        riskScore += 15;
        signals.push('ACCOUNT_YOUNGER_THAN_24H');
      }
    }
  }

  if (deviceHash) {
    // Check if device seen on other accounts in this giveaway
    const otherParticipant = await GiveawayParticipation.findOne({
      giveawayId,
      deviceHash,
      userId: { $ne: userId }
    });

    if (otherParticipant) {
      riskScore += 40;
      signals.push('DUPLICATE_DEVICE_DIFFERENT_ACCOUNT');
    }

    // Atomically upsert device record to prevent duplicate key race conditions
    const deviceRecord = await DeviceRecord.findOneAndUpdate(
      { deviceHash },
      {
        $addToSet: { userIds: userId, giveawayIds: giveawayId },
        $setOnInsert: { firstSeen: new Date() },
        $set: { lastSeen: new Date() }
      },
      { upsert: true, new: true }
    );

    if (deviceRecord && deviceRecord.userIds.length >= 3) {
      riskScore += 20;
      signals.push('DEVICE_LINKED_TO_MULTIPLE_ACCOUNTS');
    }
  }

  // Determine Action Band
  let action = 'ALLOW';
  if (riskScore >= 80) {
    action = 'CRITICAL';
  } else if (riskScore >= 60) {
    action = 'BLOCK';
  } else if (riskScore >= 30) {
    action = 'FLAG';
  }

  // Record FraudEvent for Medium, High and Critical
  if (riskScore >= 30) {
    await FraudEvent.create({
      userId,
      giveawayId,
      deviceHash,
      riskScore,
      reason: signals.join(', '),
      signals,
      action: action === 'CRITICAL' ? 'RESTRICTED' : action === 'BLOCK' ? 'BLOCKED' : 'FLAGGED'
    });
  }

  return {
    riskScore,
    signals,
    action,
    isBlocked: action === 'BLOCK' || action === 'CRITICAL'
  };
}
