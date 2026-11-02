import mongoose from 'mongoose';

const giveawayParticipationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    giveawayId: { type: String, required: true, index: true },
    prizeId: { type: String, required: true },
    entryCurrency: { type: String, enum: ['VE', 'SVE', 'TOKEN'], required: true },
    entryAmount: { type: Number, required: true },
    deviceHash: { type: String, index: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'FLAGGED', 'DISQUALIFIED'],
      default: 'ACTIVE',
      index: true
    },
    riskScore: { type: Number, default: 0 },
    transactionId: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Strict compound unique index: one participation per user per giveaway pool
giveawayParticipationSchema.index({ userId: 1, giveawayId: 1 }, { unique: true });
giveawayParticipationSchema.index({ giveawayId: 1, deviceHash: 1 });

export const GiveawayParticipation =
  mongoose.models.GiveawayParticipation ||
  mongoose.model('GiveawayParticipation', giveawayParticipationSchema);
export default GiveawayParticipation;
