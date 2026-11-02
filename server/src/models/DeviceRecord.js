import mongoose from 'mongoose';

const deviceRecordSchema = new mongoose.Schema(
  {
    deviceHash: { type: String, required: true, unique: true, index: true },
    userIds: [{ type: String }],
    giveawayIds: [{ type: String }],
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const DeviceRecord =
  mongoose.models.DeviceRecord || mongoose.model('DeviceRecord', deviceRecordSchema);
export default DeviceRecord;
