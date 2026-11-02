import mongoose from 'mongoose';

const giveawaySchema = new mongoose.Schema(
  {
    giveawayId: { type: String, required: true, unique: true, index: true },
    campaign: { type: String, default: 'Exclusive Rewards Pool' },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    prizeId: { type: String, required: true, ref: 'Prize' },
    status: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'ENDED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    },
    winnersStatus: {
      type: String,
      enum: ['PENDING', 'FINALIZED'],
      default: 'PENDING'
    },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true, index: true },
    entry: {
      currency: { type: String, enum: ['VE', 'SVE', 'TOKEN'], required: true },
      amount: { type: Number, required: true, min: 1 }
    },
    winnerCount: { type: Number, default: 1, min: 1 },
    rules: [{ type: String }],
    eligibility: [{ type: String }],
    terms: [{ type: String }],
    claimWindowDays: { type: Number, default: 7 },
    participantsCount: { type: Number, default: 0, min: 0 },
    finalizedAt: { type: Date }
  },
  { timestamps: true }
);

giveawaySchema.index({ status: 1, endAt: 1 });

export const Giveaway = mongoose.models.Giveaway || mongoose.model('Giveaway', giveawaySchema);
export default Giveaway;
