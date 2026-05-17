// models/AdminLog.js
import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  // Admin details
  adminId: { type: String, required: true },
  adminName: { type: String, required: true },
  adminEmail: { type: String, default: '' },
  
  // Action details
  action: { 
    type: String, 
    required: true,
    enum: [
      'approved_property', 'rejected_property', 'deleted_property', 'restored_property',
      'blocked_user', 'unblocked_user', 'deleted_user', 'restored_user',
      'approved_booking', 'rejected_booking', 'cancelled_booking',
      'refunded_payment', 'flagged_review', 'deleted_review',
      'modified_data', 'system_settings_changed', 'bulk_action',
      'exported_data', 'imported_data', 'backup_created'
    ]
  },
  
  // Target details
  targetType: { 
    type: String, 
    enum: ['property', 'user', 'booking', 'payment', 'review', 'system', 'data'],
    required: true
  },
  targetId: { type: String, default: '' },
  targetName: { type: String, default: '' },
  
  // Change tracking (for undo functionality)
  previousState: { type: mongoose.Schema.Types.Mixed, default: null },
  newState: { type: mongoose.Schema.Types.Mixed, default: null },
  
  // Additional context
  reason: { type: String, default: '' },
  details: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // Undo tracking
  canUndo: { type: Boolean, default: false },
  undone: { type: Boolean, default: false },
  undoneAt: { type: Date, default: null },
  undoneBy: { type: String, default: '' },
  
  // Security
  ipAddress: { type: String, default: '' },
  
}, { timestamps: true });

adminLogSchema.index({ adminId: 1, createdAt: -1 });
adminLogSchema.index({ action: 1, createdAt: -1 });
adminLogSchema.index({ targetType: 1, targetId: 1 });
adminLogSchema.index({ canUndo: 1, undone: 1 });

export default mongoose.model('AdminLog', adminLogSchema);
