// routes/subscription.js
import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get subscription status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('videoSubscription');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isActive = user.videoSubscription?.isSubscribed && 
                     user.videoSubscription?.expiresAt > new Date();

    res.json({
      isSubscribed: isActive,
      subscription: user.videoSubscription
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe to video upload feature
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { plan } = req.body; // 'monthly', 'quarterly', 'yearly'
    
    if (!['monthly', 'quarterly', 'yearly'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate expiry date based on plan
    const now = new Date();
    let expiresAt = new Date(now);
    
    switch (plan) {
      case 'monthly':
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        break;
      case 'quarterly':
        expiresAt.setMonth(expiresAt.getMonth() + 3);
        break;
      case 'yearly':
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        break;
    }

    user.videoSubscription = {
      isSubscribed: true,
      subscribedAt: now,
      expiresAt: expiresAt,
      plan: plan
    };

    await user.save();

    res.json({
      message: 'Subscription activated successfully',
      subscription: user.videoSubscription
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
router.post('/cancel', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.videoSubscription = {
      isSubscribed: false,
      subscribedAt: null,
      expiresAt: null,
      plan: null
    };

    await user.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
