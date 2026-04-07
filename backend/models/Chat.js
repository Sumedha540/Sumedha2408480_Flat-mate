// models/Chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    tenantName: { type: String, required: true },
    ownerName: { type: String, required: true },
    propertyTitle: { type: String, default: '' },
    propertyId: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

chatSchema.index({ tenantName: 1, ownerName: 1, propertyTitle: 1 });

export default mongoose.model('Chat', chatSchema);
