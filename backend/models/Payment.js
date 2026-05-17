// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, required: true },
  bookingId: { type: String, required: true },
  receiptId: { type: String, required: true },
  
  // User details
  tenantName: { type: String, required: true },
  tenantId: { type: String, default: '' },
  tenantEmail: { type: String, required: true },
  
  // Property details
  propertyId: { type: String, required: true },
  propertyTitle: { type: String, required: true },
  ownerId: { type: String, default: '' },
  ownerName: { type: String, default: '' },
  
  // Payment details
  amount: { type: Number, required: true },
  paymentType: { 
    type: String, 
    enum: ['full', 'advance', 'half'], 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Khalti', 'Cash', 'Bank Transfer', 'eSewa'], 
    required: true 
  },
  
  // Status
  status: { 
    type: String, 
    enum: ['success', 'failed', 'pending', 'refunded'], 
    default: 'pending' 
  },
  failureReason: { type: String, default: '' },
  refundReason: { type: String, default: '' },
  refundDate: { type: Date, default: null },
  
  // Metadata
  paymentDate: { type: Date, default: Date.now },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  
}, { timestamps: true });

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ tenantId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);
