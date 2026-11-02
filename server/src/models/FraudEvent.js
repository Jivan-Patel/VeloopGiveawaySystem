import mongoose from 'mongoose';

const fraudEventSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    giveawayId: { type: String, default: null, index: true },
    deviceHash: { type: String, default: null, index: true },
    riskScore: { type: Number, required: true },
    reason: { type: String, required: true },
    signals: [{ type: String }],
    action: {
      type: String,
      enum: ['LOGGED', 'FLAGGED', 'BLOCKED', 'RESTRICTED'],
      required: true
    },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const FraudEvent =
  mongoose.models.FraudEvent || mongoose.model('FraudEvent', fraudEventSchema);
export default FraudEvent;
