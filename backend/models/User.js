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
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
