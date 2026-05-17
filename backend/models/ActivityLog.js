// models/ActivityLog.js
import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  // User details
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, default: '' },
  userRole: { 
    type: String, 
    enum: ['tenant', 'landlord', 'admin', 'owner'], 
    required: true 
  },
  
  // Activity details
  action: { 
    type: String, 
    required: true,
    enum: [
      'registered', 'logged_in', 'logged_out', 'updated_profile',
      'booked_property', 'cancelled_booking', 'confirmed_booking',
      'added_property', 'edited_property', 'deleted_property',
      'approved_property', 'rejected_property',
      'payment_made', 'payment_failed', 'payment_refunded',
      'reviewed_property', 'flagged_review', 'deleted_review',
      'blocked_user', 'unblocked_user', 'deleted_user',
      'viewed_property', 'saved_property', 'unsaved_property',
      'sent_message', 'reported_user', 'reported_property',
      'password_reset', 'email_verified', 'profile_updated'
    ]
  },
  
  // Target details (what was acted upon)
  targetType: { 
    type: String, 
    enum: ['property', 'booking', 'user', 'payment', 'review', 'message', 'profile', 'system'],
    default: 'system'
  },
  targetId: { type: String, default: '' },
  targetName: { type: String, default: '' },
  
  // Additional context
  details: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // Security tracking
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  location: { type: String, default: '' },
  
  // Flags
  isSuspicious: { type: Boolean, default: false },
  suspiciousReason: { type: String, default: '' },
  
}, { timestamps: true });

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ userRole: 1, createdAt: -1 });
activityLogSchema.index({ isSuspicious: 1 });

export default mongoose.model('ActivityLog', activityLogSchema);
