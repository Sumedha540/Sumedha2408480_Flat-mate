// routes/users.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users - Get all verified users (excluding admins)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isVerified: true, role: { $ne: 'admin' } })
      .select('-password -otp -otpExpiry -loginOtp -loginOtpExpiry -googleId')
      .sort({ createdAt: -1 });

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || 'N/A',
      role: user.role,
      status: 'active',
      joined: user.createdAt.toISOString().split('T')[0],
      lastAccess: user.updatedAt.toISOString().split('T')[0],
      reports: 0,
      billings: 0,
      bookings: 0,
      muted: false,
      blocked: false,
      archived: false,
      reportReason: '',
      isGoogleUser: user.isGoogleUser || false
    }));

    res.json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -otp -otpExpiry -loginOtp -loginOtpExpiry -googleId');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || 'N/A',
        role: user.role,
        status: user.isVerified ? 'active' : 'pending',
        joined: user.createdAt.toISOString().split('T')[0],
        lastAccess: user.updatedAt.toISOString().split('T')[0],
        isGoogleUser: user.isGoogleUser || false
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, role, phone } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email.toLowerCase().trim();
    if (role) user.role = role;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || 'N/A',
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
