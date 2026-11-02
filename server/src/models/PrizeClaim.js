import mongoose from 'mongoose';

const prizeClaimSchema = new mongoose.Schema(
  {
    giveawayId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    winnerId: { type: String, default: null },
    prizeId: { type: String, required: true },
    prizeType: {
      type: String,
      enum: ['PHYSICAL', 'GIFT_CARD', 'DIGITAL'],
      required: true
    },
    status: {
      type: String,
      enum: ['NOT_SUBMITTED', 'SUBMITTED', 'PROCESSING', 'COMPLETED', 'EXPIRED'],
      default: 'SUBMITTED',
      index: true
    },
    // select: false ensures PII is never exposed in queries unless explicitly requested by admin
    details: {
      type: mongoose.Schema.Types.Mixed,
      select: false,
      default: {}
    },
    deadlineAt: { type: Date, required: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

prizeClaimSchema.index({ giveawayId: 1, userId: 1 }, { unique: true });

export const PrizeClaim =
  mongoose.models.PrizeClaim || mongoose.model('PrizeClaim', prizeClaimSchema);
export default PrizeClaim;
