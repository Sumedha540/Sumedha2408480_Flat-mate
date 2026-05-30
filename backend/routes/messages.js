/**
 * MESSAGES ROUTES - API endpoints for real-time messaging system
 * 
 * PURPOSE:
 * - Handles chat conversations between tenants and property owners
 * - Provides CRUD operations for chats and messages
 * - Manages read receipts and unread message counts
 * 
 * ENDPOINTS:
 * 
 * 1. GET /api/messages/chats
 *    - Fetches all chat conversations for a specific user
 *    - Called by: TenantDashboard, OwnerDashboard (Messages tab)
 *    - Query params: userName (required), userRole (tenant/owner)
 *    - Response: Array of Chat objects with messages and unread counts
 *    - Sorted by: lastUpdated (most recent first)
 *    - Polling: Frontend calls every 3 seconds for real-time updates
 * 
 * 2. POST /api/messages/chats
 *    - Creates new chat or retrieves existing conversation
 *    - Called by: PropertyDetailPage (Chat with Owner button)
 *    - Request body: { tenantName, ownerName, propertyTitle?, propertyId? }
 *    - Logic: Checks if chat exists between tenant and owner
 *    - Response: Chat object with unique ID
 *    - Creates empty messages array if new chat
 * 
 * 3. POST /api/messages/messages
 *    - Sends a new message to an existing chat
 *    - Called by: TenantDashboard, OwnerDashboard (Send button)
 *    - Request body: { chatId, text?, image?, video?, audio?, senderName, senderRole }
 *    - Supports: Text, images (base64), videos, audio files
 *    - Response: Created message object with timestamp
 *    - Updates: Chat's lastUpdated field and increments unread count
 * 
 * 4. PUT /api/messages/messages/seen
 *    - Marks all messages in a chat as read by viewer
 *    - Called by: TenantDashboard, OwnerDashboard (when chat opened)
 *    - Request body: { chatId, viewerRole (tenant/owner) }
 *    - Logic: Sets seen=true for messages sent by other party
 *    - Response: { success: true, modifiedCount: X }
 *    - Resets unread count for the viewer
 * 
 * DATA MODELS:
 * 
 * Chat Model:
 * - tenantName: String (participant 1)
 * - ownerName: String (participant 2)
 * - propertyTitle: String (optional, context)
 * - propertyId: String (optional, reference)
 * - messages: Array of Message objects
 * - lastUpdated: Date (auto-updated on new message)
 * - unreadCount: Number (for each participant)
 * 
 * Message Model:
 * - text: String (optional, for text messages)
 * - image: String (optional, base64 or URL)
 * - video: String (optional, base64 or URL)
 * - audio: String (optional, base64 or URL)
 * - senderName: String (who sent it)
 * - senderRole: String (tenant/owner)
 * - timestamp: Date (auto-generated)
 * - seen: Boolean (read receipt)
 * 
 * REAL-TIME UPDATES:
 * - Frontend polls GET /chats every 3 seconds
 * - New messages appear automatically
 * - Unread counts update in real-time
 * - Read receipts show double check marks
 * 
 * FRONTEND INTEGRATION:
 * - chatStorage.ts provides wrapper functions
 * - TenantDashboard Messages tab displays conversations
 * - OwnerDashboard Messages tab displays conversations
 * - PropertyDetailPage initiates new chats
 * 
 * MESSAGE FLOW:
 * 1. Tenant clicks "Chat with Owner" on property
 * 2. POST /chats creates conversation
 * 3. Dashboard loads with GET /chats
 * 4. User sends message with POST /messages
 * 5. Recipient sees message via polling
 * 6. Opening chat triggers PUT /messages/seen
 * 7. Sender sees double check mark (seen=true)
 */

// routes/messages.js
import express from 'express';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const router = express.Router();

// Get all chats for a user (tenant or owner)
router.get('/chats', async (req, res) => {
  try {
    const { userName, userRole } = req.query;
    
    if (!userName || !userRole) {
      return res.status(400).json({ error: 'userName and userRole are required' });
    }

    let chats;
    if (userRole === 'tenant') {
      // For tenants, find chats where they are either tenant OR owner (for user-to-user chats)
      chats = await Chat.find({
        $or: [
          { tenantName: userName },
          { ownerName: userName }
        ]
      }).sort({ lastUpdated: -1 });
    } else if (userRole === 'owner' || userRole === 'landlord') {
      // For owners, find chats where they are either owner OR tenant
      chats = await Chat.find({
        $or: [
          { ownerName: userName },
          { tenantName: userName }
        ]
      }).sort({ lastUpdated: -1 });
    } else {
      return res.status(400).json({ error: 'Invalid userRole' });
    }

    // For each chat, get messages and unread count
    const chatsWithDetails = await Promise.all(
      chats.map(async (chat) => {
        const messages = await Message.find({ chatId: chat._id.toString() })
          .sort({ createdAt: 1 });
        
        // Calculate unread count - messages sent by the OTHER person that haven't been seen
        const unreadMessages = messages.filter(
          m => m.senderName !== userName && !m.seen
        );
        const unreadCount = unreadMessages.length;

        console.log(`Chat ${chat._id} for user ${userName}:`, {
          totalMessages: messages.length,
          unreadCount,
          unreadMessages: unreadMessages.map(m => ({
            id: m._id,
            senderName: m.senderName,
            text: m.text,
            seen: m.seen
          }))
        });

        return {
          id: chat._id.toString(),
          tenantName: chat.tenantName,
          ownerName: chat.ownerName,
          propertyTitle: chat.propertyTitle,
          propertyId: chat.propertyId,
          lastUpdated: chat.lastUpdated,
          messages: messages.map(m => ({
            id: m._id.toString(),
            text: m.text,
            image: m.image,
            video: m.video,
            audio: m.audio,
            timestamp: m.createdAt,
            senderName: m.senderName,
            senderRole: m.senderRole,
            seen: m.seen,
          })),
          unreadCount,
        };
      })
    );

    res.json(chatsWithDetails);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get or create a chat
router.post('/chats', async (req, res) => {
  try {
    const { tenantName, ownerName, propertyTitle, propertyId } = req.body;

    if (!tenantName || !ownerName) {
      return res.status(400).json({ error: 'tenantName and ownerName are required' });
    }

    // Find existing chat - check both directions for user-to-user chats
    let chat = await Chat.findOne({
      $or: [
        // Original direction
        {
          tenantName,
          ownerName,
          $or: [
            { propertyTitle: propertyTitle || '' },
            { propertyId: propertyId || '' }
          ]
        },
        // Reverse direction (for user-to-user chats)
        {
          tenantName: ownerName,
          ownerName: tenantName,
          $or: [
            { propertyTitle: propertyTitle || '' },
            { propertyId: propertyId || '' }
          ]
        }
      ]
    });

    // If no exact match with property, try to find by participants only
    if (!chat && propertyTitle) {
      chat = await Chat.findOne({
        $or: [
          { tenantName, ownerName, propertyTitle },
          { tenantName: ownerName, ownerName: tenantName, propertyTitle }
        ]
      });
    }

    if (!chat) {
      // Create new chat
      chat = new Chat({
        tenantName,
        ownerName,
        propertyTitle: propertyTitle || '',
        propertyId: propertyId || '',
        lastUpdated: new Date(),
      });
      await chat.save();
      console.log('Created new chat:', chat._id);
    } else {
      console.log('Found existing chat:', chat._id);
    }

    // Get messages for this chat
    const messages = await Message.find({ chatId: chat._id.toString() })
      .sort({ createdAt: 1 });

    res.json({
      id: chat._id.toString(),
      tenantName: chat.tenantName,
      ownerName: chat.ownerName,
      propertyTitle: chat.propertyTitle,
      propertyId: chat.propertyId,
      lastUpdated: chat.lastUpdated,
      messages: messages.map(m => ({
        id: m._id.toString(),
        text: m.text,
        image: m.image,
        video: m.video,
        audio: m.audio,
        timestamp: m.createdAt,
        senderName: m.senderName,
        senderRole: m.senderRole,
        seen: m.seen,
      })),
    });
  } catch (error) {
    console.error('Error creating/fetching chat:', error);
    res.status(500).json({ error: 'Failed to create/fetch chat' });
  }
});

// Send a message
router.post('/messages', async (req, res) => {
  try {
    const { chatId, text, image, video, audio, senderName, senderRole } = req.body;

    if (!chatId || !senderName || !senderRole) {
      return res.status(400).json({ error: 'chatId, senderName, and senderRole are required' });
    }

    // Normalize role (landlord -> owner for consistency)
    const normalizedRole = senderRole === 'landlord' ? 'owner' : senderRole;

    // Create message
    const message = new Message({
      chatId,
      text: text || '',
      image: image || '',
      video: video || '',
      audio: audio || '',
      senderName,
      senderRole: normalizedRole,
      seen: false,
    });

    await message.save();
    console.log('Message saved:', message._id);

    // Update chat's lastUpdated
    await Chat.findByIdAndUpdate(chatId, { lastUpdated: new Date() });

    res.json({
      id: message._id.toString(),
      text: message.text,
      image: message.image,
      video: message.video,
      audio: message.audio,
      timestamp: message.createdAt,
      senderName: message.senderName,
      senderRole: message.senderRole,
      seen: message.seen,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark messages as seen
router.put('/messages/seen', async (req, res) => {
  try {
    const { chatId, viewerRole, viewerName } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    console.log('Mark as seen request:', { chatId, viewerRole, viewerName });

    // Get all messages in this chat
    const allMessages = await Message.find({ chatId });
    console.log(`Total messages in chat: ${allMessages.length}`);
    console.log('All messages:', allMessages.map(m => ({
      id: m._id,
      senderName: m.senderName,
      senderRole: m.senderRole,
      seen: m.seen,
      text: m.text?.substring(0, 30)
    })));

    // Build query to mark messages as seen
    let query;
    if (viewerName) {
      // Use name-based filtering (more reliable for tenant-to-tenant chats)
      query = {
        chatId,
        senderName: { $ne: viewerName },
        seen: false
      };
      console.log('Using name-based query:', query);
    } else if (viewerRole) {
      // Fallback to role-based filtering
      const normalizedRole = viewerRole === 'landlord' ? 'owner' : viewerRole;
      query = {
        chatId,
        senderRole: { $ne: normalizedRole },
        seen: false
      };
      console.log('Using role-based query:', query);
    } else {
      return res.status(400).json({ error: 'Either viewerRole or viewerName is required' });
    }

    // Find messages that match our query
    const messagesToMark = await Message.find(query);
    console.log(`Found ${messagesToMark.length} messages to mark as seen:`, messagesToMark.map(m => ({
      id: m._id,
      senderName: m.senderName,
      senderRole: m.senderRole,
      text: m.text?.substring(0, 30),
      seen: m.seen
    })));

    // Mark messages as seen
    const result = await Message.updateMany(query, { $set: { seen: true } });

    console.log(`Successfully marked ${result.modifiedCount} messages as seen in chat ${chatId}`);

    res.json({ 
      success: true, 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error marking messages as seen:', error);
    res.status(500).json({ error: 'Failed to mark messages as seen' });
  }
});

export default router;
