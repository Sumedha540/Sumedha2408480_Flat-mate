// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  propertyId: { type: String, required: true },
  propertyTitle: { type: String, required: true },
  propertyLocation: { type: String, default: '' },
  ownerName: { type: String, default: '' },
  ownerId: { type: String, default: '' },
  ownerEmail: { type: String, default: '' },
  ownerPhone: { type: String, default: '' },
  tenantName: { type: String, required: true },
  tenantId: { type: String, default: '' },
  tenantEmail: { type: String, required: true },
  tenantPhone: { type: String, required: true },
  
  // Booking details
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  bookingDate: { type: Date, default: Date.now },
  
  // Payment details
  rent: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['Khalti', 'Cash', 'Bank Transfer', 'eSewa'], 
    required: true 
  },
  paymentType: { 
    type: String, 
    enum: ['full', 'advance', 'half'], 
    required: true 
  },
  transactionId: { type: String, default: '' },
  receiptId: { type: String, unique: true, required: true },
  
  // Status
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'], 
    default: 'pending' 
  },
  rejectionReason: { type: String, default: '' },
  cancellationReason: { type: String, default: '' },
  
  // Additional info
  moveInDate: { type: String, default: '' },
  specialRequests: { type: String, default: '' },
  
}, { timestamps: true });

bookingSchema.index({ propertyId: 1, createdAt: -1 });
bookingSchema.index({ tenantId: 1 });
bookingSchema.index({ ownerId: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model('Booking', bookingSchema);
