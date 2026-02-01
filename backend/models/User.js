import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tenant', 'owner', 'admin'], default: 'tenant' },
  isVerified: { type: Boolean, default: false }, // For the OTP check
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

