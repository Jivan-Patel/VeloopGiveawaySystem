import mongoose from 'mongoose';

const idempotencyKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    userId: { type: String, required: true },
    route: { type: String, required: true },
    requestHash: { type: String, default: null },
    response: { type: mongoose.Schema.Types.Mixed, default: null },
    statusCode: { type: Number, default: 200 },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // 24-hour TTL index
  },
  { timestamps: true }
);

idempotencyKeySchema.index({ key: 1, userId: 1, route: 1 }, { unique: true });

export const IdempotencyKey =
  mongoose.models.IdempotencyKey || mongoose.model('IdempotencyKey', idempotencyKeySchema);
export default IdempotencyKey;
