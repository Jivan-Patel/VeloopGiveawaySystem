import mongoose from 'mongoose';

const prizeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['PHYSICAL', 'GIFT_CARD', 'DIGITAL'], required: true },
    claimType: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    retailPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Prize = mongoose.models.Prize || mongoose.model('Prize', prizeSchema);
export default Prize;
