import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, index: true },
    userId: { type: String, default: null, index: true },
    giveawayId: { type: String, default: null, index: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: null },
    result: { type: String, enum: ['SUCCESS', 'FAILURE'], required: true },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipHash: { type: String, default: null },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
