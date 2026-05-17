// routes/history.js
import express from 'express';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import ActivityLog from '../models/ActivityLog.js';
import AdminLog from '../models/AdminLog.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════
// BOOKING HISTORY
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/history/bookings - Get all bookings with filters
router.get('/bookings', async (req, res) => {
  try {
    const { status, startDate, endDate, search, limit = 100 } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) query.bookingDate.$lte = new Date(endDate);
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { tenantName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { propertyTitle: { $regex: search, $options: 'i' } },
        { receiptId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Calculate statistics
    const stats = {
      total: await Booking.countDocuments(query),
      confirmed: await Booking.countDocuments({ ...query, status: 'confirmed' }),
      pending: await Booking.countDocuments({ ...query, status: 'pending' }),
      rejected: await Booking.countDocuments({ ...query, status: 'rejected' }),
      cancelled: await Booking.countDocuments({ ...query, status: 'cancelled' }),
    };
    
    res.json({ success: true, bookings, stats });
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/history/bookings/:id - Get single booking details
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT HISTORY
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/history/payments - Get all payments with filters
router.get('/payments', async (req, res) => {
  try {
    const { status, method, startDate, endDate, search, limit = 100 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') query.status = status;
    if (method && method !== 'all') query.paymentMethod = method;
    
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }
    
    if (search) {
      query.$or = [
        { tenantName: { $regex: search, $options: 'i' } },
        { propertyTitle: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
        { receiptId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Calculate revenue statistics
    const successfulPayments = await Payment.find({ ...query, status: 'success' });
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const stats = {
      total: await Payment.countDocuments(query),
      success: await Payment.countDocuments({ ...query, status: 'success' }),
      failed: await Payment.countDocuments({ ...query, status: 'failed' }),
      pending: await Payment.countDocuments({ ...query, status: 'pending' }),
      refunded: await Payment.countDocuments({ ...query, status: 'refunded' }),
      totalRevenue,
    };
    
    res.json({ success: true, payments, stats });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// USER ACTIVITY HISTORY
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/history/user-activity - Get user activity logs
router.get('/user-activity', async (req, res) => {
  try {
    const { userId, action, role, startDate, endDate, search, limit = 100 } = req.query;
    
    let query = {};
    
    if (userId) query.userId = userId;
    if (action && action !== 'all') query.action = action;
    if (role && role !== 'all') query.userRole = role;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }
    
    const activities = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const stats = {
      total: await ActivityLog.countDocuments(query),
      suspicious: await ActivityLog.countDocuments({ ...query, isSuspicious: true }),
    };
    
    res.json({ success: true, activities, stats });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN LOGS
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/history/admin-logs - Get admin action logs
router.get('/admin-logs', async (req, res) => {
  try {
    const { adminId, action, targetType, startDate, endDate, limit = 100 } = req.query;
    
    let query = {};
    
    if (adminId) query.adminId = adminId;
    if (action && action !== 'all') query.action = action;
    if (targetType && targetType !== 'all') query.targetType = targetType;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const logs = await AdminLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const stats = {
      total: await AdminLog.countDocuments(query),
      canUndo: await AdminLog.countDocuments({ ...query, canUndo: true, undone: false }),
    };
    
    res.json({ success: true, logs, stats });
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/history/admin-logs/undo/:id - Undo an admin action
router.post('/admin-logs/undo/:id', async (req, res) => {
  try {
    const log = await AdminLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }
    
    if (!log.canUndo) {
      return res.status(400).json({ success: false, message: 'This action cannot be undone' });
    }
    
    if (log.undone) {
      return res.status(400).json({ success: false, message: 'Action already undone' });
    }
    
    // Restore previous state based on target type
    if (log.targetType === 'property' && log.previousState) {
      await Property.findByIdAndUpdate(log.targetId, log.previousState);
    } else if (log.targetType === 'user' && log.previousState) {
      await User.findByIdAndUpdate(log.targetId, log.previousState);
    }
    
    // Mark as undone
    log.undone = true;
    log.undoneAt = new Date();
    log.undoneBy = req.body.adminId || 'admin';
    await log.save();
    
    res.json({ success: true, message: 'Action undone successfully', log });
  } catch (error) {
    console.error('Error undoing action:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMELINE VIEW
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/history/timeline - Get combined timeline of all activities
router.get('/timeline', async (req, res) => {
  try {
    const { limit = 50, startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }
    
    // Fetch recent activities from all sources
    const [bookings, payments, activities, adminLogs] = await Promise.all([
      Booking.find(dateFilter.createdAt ? { createdAt: dateFilter } : {})
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Payment.find(dateFilter.createdAt ? { createdAt: dateFilter } : {})
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      ActivityLog.find(dateFilter.createdAt ? { createdAt: dateFilter } : {})
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      AdminLog.find(dateFilter.createdAt ? { createdAt: dateFilter } : {})
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
    ]);
    
    // Combine and format timeline events
    const timeline = [];
    
    bookings.forEach(b => {
      timeline.push({
        type: 'booking',
        icon: 'calendar',
        message: `${b.tenantName} booked ${b.propertyTitle}`,
        subtitle: `${b.status} • NPR ${b.amount.toLocaleString()} via ${b.paymentMethod}`,
        timestamp: b.createdAt,
        data: b,
        color: b.status === 'confirmed' ? 'green' : b.status === 'rejected' ? 'red' : 'amber'
      });
    });
    
    payments.forEach(p => {
      timeline.push({
        type: 'payment',
        icon: 'dollar',
        message: `Payment ${p.status} from ${p.tenantName}`,
        subtitle: `NPR ${p.amount.toLocaleString()} • ${p.paymentMethod}`,
        timestamp: p.createdAt,
        data: p,
        color: p.status === 'success' ? 'green' : p.status === 'failed' ? 'red' : 'blue'
      });
    });
    
    activities.forEach(a => {
      timeline.push({
        type: 'activity',
        icon: 'user',
        message: `${a.userName} ${a.action.replace(/_/g, ' ')}`,
        subtitle: a.details || `${a.userRole} activity`,
        timestamp: a.createdAt,
        data: a,
        color: a.isSuspicious ? 'red' : 'purple'
      });
    });
    
    adminLogs.forEach(l => {
      timeline.push({
        type: 'admin',
        icon: 'shield',
        message: `Admin ${l.action.replace(/_/g, ' ')}`,
        subtitle: `${l.targetType}: ${l.targetName}`,
        timestamp: l.createdAt,
        data: l,
        color: 'gray'
      });
    });
    
    // Sort by timestamp and limit
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedTimeline = timeline.slice(0, parseInt(limit));
    
    res.json({ success: true, timeline: limitedTimeline, total: timeline.length });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SUSPICIOUS ACTIVITY DETECTION
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/history/suspicious - Get suspicious activities
router.get('/suspicious', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Find suspicious patterns
    const suspiciousActivities = await ActivityLog.find({ isSuspicious: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Find multiple failed payments
    const failedPayments = await Payment.aggregate([
      { $match: { status: 'failed' } },
      { $group: { 
        _id: '$tenantId', 
        count: { $sum: 1 },
        tenantName: { $first: '$tenantName' },
        lastAttempt: { $max: '$createdAt' }
      }},
      { $match: { count: { $gte: 3 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Find spam booking patterns (multiple bookings in short time)
    const spamBookings = await Booking.aggregate([
      { $match: { 
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
      }},
      { $group: { 
        _id: '$tenantId', 
        count: { $sum: 1 },
        tenantName: { $first: '$tenantName' },
        bookings: { $push: '$$ROOT' }
      }},
      { $match: { count: { $gte: 5 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const alerts = [
      ...suspiciousActivities.map(a => ({
        type: 'suspicious_activity',
        severity: 'high',
        message: `${a.userName}: ${a.suspiciousReason}`,
        timestamp: a.createdAt,
        data: a
      })),
      ...failedPayments.map(p => ({
        type: 'failed_payments',
        severity: 'high',
        message: `${p.count} failed payment attempts from ${p.tenantName}`,
        timestamp: p.lastAttempt,
        data: p
      })),
      ...spamBookings.map(b => ({
        type: 'spam_bookings',
        severity: 'high',
        message: `${b.count} bookings in 24h from ${b.tenantName}`,
        timestamp: new Date(),
        data: b
      }))
    ];
    
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({ success: true, alerts: alerts.slice(0, parseInt(limit)) });
  } catch (error) {
    console.error('Error fetching suspicious activities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// STATISTICS & ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/history/stats - Get overall statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalBookings,
      totalPayments,
      totalRevenue,
      totalUsers,
      totalProperties
    ] = await Promise.all([
      Booking.countDocuments(),
      Payment.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      User.countDocuments(),
      Property.countDocuments()
    ]);
    
    const stats = {
      bookings: {
        total: totalBookings,
        confirmed: await Booking.countDocuments({ status: 'confirmed' }),
        pending: await Booking.countDocuments({ status: 'pending' }),
        rejected: await Booking.countDocuments({ status: 'rejected' })
      },
      payments: {
        total: totalPayments,
        success: await Payment.countDocuments({ status: 'success' }),
        failed: await Payment.countDocuments({ status: 'failed' }),
        revenue: totalRevenue[0]?.total || 0
      },
      users: {
        total: totalUsers,
        tenants: await User.countDocuments({ role: 'tenant' }),
        landlords: await User.countDocuments({ role: 'landlord' })
      },
      properties: {
        total: totalProperties,
        approved: await Property.countDocuments({ status: 'approved' }),
        pending: await Property.countDocuments({ status: 'pending' })
      }
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
