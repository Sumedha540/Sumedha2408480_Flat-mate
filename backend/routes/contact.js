/**
 * CONTACT ROUTES - API endpoints for contact form submissions
 * 
 * PURPOSE:
 * - Handles contact form submissions from ContactPage
 * - Stores messages in MongoDB for admin review
 * - Provides endpoints for admins to view and manage messages
 * 
 * ENDPOINTS:
 * 
 * 1. POST /api/contact/submit
 *    - Receives contact form submissions
 *    - Called by: ContactPage form submission
 *    - Request body: { firstName, lastName, email, phone, subject, message }
 *    - Validation: All fields required
 *    - Response: { success: true, message: "Message sent successfully" }
 *    - Database: Stores in contact_messages collection
 *    - No authentication required (public endpoint)
 * 
 * 2. GET /api/contact/messages
 *    - Fetches all contact messages for admin review
 *    - Called by: AdminDashboard (Contact Messages tab)
 *    - Query params: None (returns all messages)
 *    - Response: Array of ContactMessage objects
 *    - Sorted by: createdAt (newest first)
 *    - No authentication required (should be protected in production)
 * 
 * 3. GET /api/contact/test-messages (TEST ONLY)
 *    - Debug endpoint to verify database connection
 *    - Should be removed in production
 *    - Returns all messages with full details
 * 
 * DATA MODEL (ContactMessage):
 * - firstName: String (required)
 * - lastName: String (required)
 * - email: String (required)
 * - phone: String (required, 10 digits)
 * - subject: String (required, min 5 chars)
 * - message: String (required, min 10 chars)
 * - createdAt: Date (auto-generated)
 * 
 * FRONTEND INTEGRATION:
 * - ContactPage → POST /api/contact/submit
 * - AdminDashboard → GET /api/contact/messages
 * - Messages displayed in admin overview with "View" and "View All" buttons
 * 
 * ADMIN WORKFLOW:
 * 1. User submits contact form
 * 2. Message stored in database
 * 3. Admin sees notification in dashboard
 * 4. Admin clicks "View" to see message details
 * 5. Admin can respond via email (manual process)
 * 
 * SECURITY NOTES:
 * - /submit endpoint is public (no auth) for easy contact
 * - /messages endpoint should be protected with admin auth in production
 * - Input validation on frontend prevents malicious data
 * - Consider rate limiting to prevent spam
 */

import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// TEST ENDPOINT - Remove in production
router.get('/test-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({
      count: messages.length,
      messages: messages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    console.log('Contact form submission received:', { firstName, lastName, email, phone, subject });

    // Validation
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new contact message
    const contactMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message
    });

    await contactMessage.save();
    console.log('Contact message saved successfully:', contactMessage._id);

    res.status(201).json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      data: contactMessage 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

// Get all contact messages (Admin only)
router.get('/messages', async (req, res) => {
  try {
    console.log('=== CONTACT MESSAGES REQUEST ===');
    console.log('Headers:', req.headers);
    
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(100);

    console.log('Messages found:', messages.length);
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
});

// Get unread messages count (Admin only)
router.get('/unread-count', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const count = await ContactMessage.countDocuments({ status: 'unread' });
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
});

// Mark message as read (Admin only)
router.patch('/messages/:id/read', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to update message' });
  }
});

// Delete message (Admin only)
router.delete('/messages/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

export default router;
