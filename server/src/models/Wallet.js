import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    ves: { type: Number, required: true, default: 0, min: 0 },
    sves: { type: Number, required: true, default: 0, min: 0 },
    tokens: { type: Number, required: true, default: 0, min: 0 }
  },
  { timestamps: true }
);

export const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);
export default Wallet;
