// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, index: true },
    text: { type: String, default: '' },
    image: { type: String, default: '' },
    video: { type: String, default: '' },
    audio: { type: String, default: '' },
    senderName: { type: String, required: true },
    senderRole: { 
      type: String, 
      enum: ['tenant', 'owner', 'admin'], 
      required: true 
    },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
