// 

// routes/messages.js
import express from 'express';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const router = express.Router();

// GET /api/messages/chats - Get all chats for a user
router.get('/chats', async (req, res) => {
  try {
    const { userName, userRole } = req.query;
    
    if (!userName || !userRole) {
      return res.status(400).json({ error: 'userName and userRole are required' });
    }

    let chats;
    if (userRole === 'tenant') {
      chats = await Chat.find({
        $or: [{ tenantName: userName }, { ownerName: userName }]
      }).sort({ lastUpdated: -1 });
    } else if (userRole === 'owner' || userRole === 'landlord') {
      chats = await Chat.find({
        $or: [{ ownerName: userName }, { tenantName: userName }]
      }).sort({ lastUpdated: -1 });
    } else {
      return res.status(400).json({ error: 'Invalid userRole' });
    }

    const chatsWithDetails = await Promise.all(
      chats.map(async (chat) => {
        const messages = await Message.find({ chatId: chat._id.toString() })
          .sort({ createdAt: 1 });
        
        const unreadMessages = messages.filter(m => m.senderName !== userName && !m.seen);
        const unreadCount = unreadMessages.length;

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

// POST /api/messages/chats - Get or create a chat
router.post('/chats', async (req, res) => {
  try {
    const { tenantName, ownerName, propertyTitle, propertyId } = req.body;

    if (!tenantName || !ownerName) {
      return res.status(400).json({ error: 'tenantName and ownerName are required' });
    }

    let chat = await Chat.findOne({
      $or: [
        {
          tenantName,
          ownerName,
          $or: [
            { propertyTitle: propertyTitle || '' },
            { propertyId: propertyId || '' }
          ]
        },
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

    if (!chat && propertyTitle) {
      chat = await Chat.findOne({
        $or: [
          { tenantName, ownerName, propertyTitle },
          { tenantName: ownerName, ownerName: tenantName, propertyTitle }
        ]
      });
    }

    if (!chat) {
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

// POST /api/messages/messages - Send a message
router.post('/messages', async (req, res) => {
  try {
    const { chatId, text, image, video, audio, senderName, senderRole } = req.body;

    if (!chatId || !senderName || !senderRole) {
      return res.status(400).json({ error: 'chatId, senderName, and senderRole are required' });
    }

    const normalizedRole = senderRole === 'landlord' ? 'owner' : senderRole;

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

// PUT /api/messages/messages/seen - Mark messages as seen
router.put('/messages/seen', async (req, res) => {
  try {
    const { chatId, viewerRole, viewerName } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    let query;
    if (viewerName) {
      query = { chatId, senderName: { $ne: viewerName }, seen: false };
    } else if (viewerRole) {
      const normalizedRole = viewerRole === 'landlord' ? 'owner' : viewerRole;
      query = { chatId, senderRole: { $ne: normalizedRole }, seen: false };
    } else {
      return res.status(400).json({ error: 'Either viewerRole or viewerName is required' });
    }

    const result = await Message.updateMany(query, { $set: { seen: true } });
    console.log(`Marked ${result.modifiedCount} messages as seen in chat ${chatId}`);

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error marking messages as seen:', error);
    res.status(500).json({ error: 'Failed to mark messages as seen' });
  }
});

// PUT /api/messages/update-name - Update user name across all chats & messages
// Called when a user changes their name in Profile Settings
router.put('/update-name', async (req, res) => {
  try {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({ error: 'oldName and newName are required' });
    }

    if (oldName === newName) {
      return res.json({ success: true, message: 'Name unchanged' });
    }

    console.log(`🔄 Updating name across chats: "${oldName}" → "${newName}"`);

    // Update Chat documents where user appears as tenantName or ownerName
    const [chatTenantUpdate, chatOwnerUpdate] = await Promise.all([
      Chat.updateMany({ tenantName: oldName }, { $set: { tenantName: newName } }),
      Chat.updateMany({ ownerName: oldName },  { $set: { ownerName: newName } }),
    ]);

    // Update all Message documents where senderName matches
    const messageUpdate = await Message.updateMany(
      { senderName: oldName },
      { $set: { senderName: newName } }
    );

    console.log(`✅ Chats updated (as tenant): ${chatTenantUpdate.modifiedCount}`);
    console.log(`✅ Chats updated (as owner):  ${chatOwnerUpdate.modifiedCount}`);
    console.log(`✅ Messages updated:           ${messageUpdate.modifiedCount}`);

    res.json({
      success: true,
      updated: {
        chatsAsTenant: chatTenantUpdate.modifiedCount,
        chatsAsOwner:  chatOwnerUpdate.modifiedCount,
        messages:      messageUpdate.modifiedCount,
      },
    });
  } catch (error) {
    console.error('Error updating name across chats:', error);
    res.status(500).json({ error: 'Failed to update name' });
  }
});

export default router;
