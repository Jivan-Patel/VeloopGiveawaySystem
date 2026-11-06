import { Giveaway } from '../models/Giveaway.js';
import { GiveawayWinner } from '../models/GiveawayWinner.js';
import { PrizeClaim } from '../models/PrizeClaim.js';
import { Prize } from '../models/Prize.js';
import { AuditLog } from '../models/AuditLog.js';

/**
 * Validates and processes a user prize claim with strict 7-day window and field validation.
 *
 * @param {string} userId - ID of the claiming user
 * @param {string} giveawayId - ID of the giveaway
 * @param {object} claimData - Shipping address or voucher email payload
 * @returns {Promise<object>} Created claim confirmation
 */
export async function submitClaim(userId, giveawayId, claimData = {}) {
  // 1. Verify user is a confirmed winner for this giveaway
  const winner = await GiveawayWinner.findOne({
    giveawayId,
    userId,
    status: 'CONFIRMED'
  });

  if (!winner) {
    const error = new Error('You are not a confirmed winner for this giveaway');
    error.statusCode = 403;
    error.errorCode = 'NOT_A_WINNER';
    throw error;
  }

  // 2. Verify giveaway exists and is finalized
  const giveaway = await Giveaway.findOne({ giveawayId });
  if (!giveaway || giveaway.winnersStatus !== 'FINALIZED') {
    const error = new Error('Giveaway is not yet finalized for prize claims');
    error.statusCode = 400;
    error.errorCode = 'GIVEAWAY_NOT_FINALIZED';
    throw error;
  }

  // 3. Enforce authoritative claim window (default 7 days)
  const windowDays = giveaway.claimWindowDays || 7;
  const deadline = new Date(giveaway.endAt.getTime() + windowDays * 24 * 60 * 60 * 1000);
  if (new Date() > deadline) {
    const error = new Error('Prize claim deadline has expired');
    error.statusCode = 400;
    error.errorCode = 'CLAIM_EXPIRED';
    throw error;
  }

  // 4. Enforce idempotency: prevent double claim submissions
  const existingClaim = await PrizeClaim.findOne({ giveawayId, userId });
  if (existingClaim) {
    const error = new Error('Prize claim has already been submitted');
    error.statusCode = 409;
    error.errorCode = 'ALREADY_CLAIMED';
    throw error;
  }

  // 5. Determine prize type and validate payload
  const prize = await Prize.findOne({ id: giveaway.prizeId });
  const prizeType = prize?.type || claimData.prizeType || 'PHYSICAL';

  if (prizeType === 'PHYSICAL') {
    const { fullName, phone, addressLine1, city, state, pincode } = claimData;
    const phoneValid = typeof phone === 'string' && /^[6-9]\d{9}$/.test(phone.trim());
    const pincodeValid = typeof pincode === 'string' && /^\d{6}$/.test(pincode.trim());

    if (!fullName || !addressLine1 || !city || !state || !phoneValid || !pincodeValid) {
      const error = new Error('Invalid physical shipping address. Full name, 10-digit mobile, address, and 6-digit PIN are required.');
      error.statusCode = 400;
      error.errorCode = 'INVALID_CLAIM_PAYLOAD';
      throw error;
    }
  } else if (prizeType === 'GIFT_CARD') {
    const { email, phone } = claimData;
    const emailValid = typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email.trim());
    const phoneValid = typeof phone === 'string' && /^[6-9]\d{9}$/.test(phone.trim());

    if (!emailValid || !phoneValid) {
      const error = new Error('Invalid gift card details. Valid email and 10-digit phone number are required.');
      error.statusCode = 400;
      error.errorCode = 'INVALID_CLAIM_PAYLOAD';
      throw error;
    }
  }

  // 6. Create claim record with protected PII details
  const claim = await PrizeClaim.create({
    giveawayId,
    userId,
    winnerId: winner._id ? winner._id.toString() : winner.id,
    prizeId: giveaway.prizeId,
    prizeType,
    status: 'SUBMITTED',
    details: claimData,
    deadlineAt: deadline,
    submittedAt: new Date()
  });

  // 7. Audit logging
  await AuditLog.create({
    action: 'PRIZE_CLAIM_SUBMITTED',
    userId,
    giveawayId,
    result: 'SUCCESS',
    details: {
      claimId: claim._id,
      prizeType
    }
  });

  return {
    success: true,
    claimId: claim._id,
    status: 'SUBMITTED',
    prizeType,
    deadlineAt: deadline,
    submittedAt: claim.submittedAt
  };
}

/**
 * Fetch paginated claims for administrative review (includes details).
 *
 * @param {object} filter - Query filter
 * @param {number} page - Page index
 * @param {number} limit - Items per page
 * @returns {Promise<object>} Paginated claims
 */
export async function getAdminClaims(filter = {}, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [claims, total] = await Promise.all([
    PrizeClaim.find(filter)
      .select('+details')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PrizeClaim.countDocuments(filter)
  ]);

  return {
    claims,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
}

/**
 * Administrative update of claim status (e.g. adding tracking number, setting to SHIPPED).
 *
 * @param {string} claimId - Prize claim ID
 * @param {object} updateData - Status and tracking details
 * @param {string} adminUserId - Admin ID executing the update
 * @returns {Promise<object>} Updated claim
 */
export async function updateClaimStatus(claimId, updateData = {}, adminUserId = 'admin') {
  const claim = await PrizeClaim.findById(claimId).select('+details');
  if (!claim) {
    const error = new Error('Prize claim not found');
    error.statusCode = 404;
    error.errorCode = 'CLAIM_NOT_FOUND';
    throw error;
  }

  const { status, trackingNumber, courierPartner, notes } = updateData;
  if (status) claim.status = status;
  if (trackingNumber) claim.details = { ...claim.details, trackingNumber };
  if (courierPartner) claim.details = { ...claim.details, courierPartner };
  if (notes) claim.details = { ...claim.details, adminNotes: notes };

  await claim.save();

  await AuditLog.create({
    action: 'CLAIM_STATUS_UPDATED',
    userId: adminUserId,
    giveawayId: claim.giveawayId,
    result: 'SUCCESS',
    details: {
      claimId,
      newStatus: claim.status,
      trackingNumber: trackingNumber || null
    }
  });

  return {
    success: true,
    claim
  };
}

export default {
  submitClaim,
  getAdminClaims,
  updateClaimStatus
};
