// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email: {
      type: String, required: true, unique: true,
      lowercase: true, trim: true,
    },
    password:  { type: String, required: true },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    role: {
      type: String,
      enum: ['tenant', 'landlord', 'admin'],
      default: 'tenant',
    },
    profilePicture: { type: String, default: null }, // URL or base64 image

    // Signup verification
    isVerified:  { type: Boolean, default: false },
    otp:         { type: String,  default: null },
    otpExpiry:   { type: Date,    default: null },

    // Login OTP (separate from signup OTP)
    loginOtp:        { type: String, default: null },
    loginOtpExpiry:  { type: Date,   default: null },

    // Google OAuth
    isGoogleUser: { type: Boolean, default: false },
    googleId:     { type: String,  default: null },

    // Admin actions
    blocked:      { type: Boolean, default: false },
    blockReason:  { type: String,  default: null },

    // Notifications
    notifications: [{
      id: { type: String, required: true },
      type: { type: String, required: true }, // 'property_approved', 'property_rejected', 'booking', etc.
      title: { type: String, required: true },
      message: { type: String, required: true },
      propertyId: { type: String, default: null },
      propertyTitle: { type: String, default: null },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }],

    // Roommate matching
    lookingForRoom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
