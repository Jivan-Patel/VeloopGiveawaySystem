import mongoose from 'mongoose';

const giveawayWinnerSchema = new mongoose.Schema(
  {
    giveawayId: { type: String, required: true, index: true },
    prizeId: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    selectionMethod: { type: String, default: 'CRYPTO_RANDOM' },
    selectedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['CONFIRMED', 'DISQUALIFIED', 'REDRAWN'],
      default: 'CONFIRMED'
    }
  },
  { timestamps: true }
);

giveawayWinnerSchema.index({ giveawayId: 1, userId: 1 }, { unique: true });

export const GiveawayWinner =
  mongoose.models.GiveawayWinner || mongoose.model('GiveawayWinner', giveawayWinnerSchema);
export default GiveawayWinner;
