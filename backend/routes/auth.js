import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// --- 1. SIGNUP & SEND INITIAL OTP ---
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📨 Generated OTP for ${email}: ${otpCode}`);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      otp: otpCode,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 mins
      isVerified: false
    });

    await user.save();
    console.log(`✅ User saved with OTP: ${otpCode}`);

    // Send Real Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your Flat-Mate Account',
        otp: otpCode
      });
      console.log(`✅ Email sent for ${email} with OTP: ${otpCode}`);
    } catch (emailError) {
      console.error(`❌ Email send error: ${emailError.message}`);
      return res.status(500).json({ message: 'Email configuration error. Please try again later.' });
    }

    res.status(201).json({ message: 'Registration successful. OTP sent to email.' });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// --- 2. VERIFY OTP ---
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`🔍 Verifying OTP for ${email}. Received: ${otp}`);

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user with matching OTP and check expiry
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if OTP exists and matches
    if (!user.otp || user.otp !== otp) {
      console.log(`❌ OTP mismatch for ${email}. Stored: ${user.otp}, Received: ${otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP has expired
    if (!user.otpExpires || user.otpExpires < new Date(Date.now())) {
      console.log(`❌ OTP expired for ${email}`);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    console.log(`✅ OTP verified for ${email}`);
    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// --- 3. RESEND OTP ---
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📨 Generated new OTP for ${email}: ${newOtp}`);
    
    user.otp = newOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    console.log(`✅ New OTP saved for ${email}`);

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your New Verification Code',
        otp: newOtp
      });
      console.log(`✅ Resend email sent to ${email}`);
    } catch (emailError) {
      console.error(`❌ Resend email error: ${emailError.message}`);
      return res.status(500).json({ message: 'Email configuration error. Please try again later.' });
    }

    res.status(200).json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    console.error('❌ Resend OTP error:', error);
    res.status(500).json({ message: 'Error resending OTP' });
  }
});

// --- 4. LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Account not verified.', 
        notVerified: true 
      });
    }

    res.status(200).json({ 
        message: 'Login successful!', 
        user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;