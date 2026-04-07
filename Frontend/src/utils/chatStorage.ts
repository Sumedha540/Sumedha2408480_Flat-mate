/**
 * CHAT STORAGE API - Frontend utility for messaging functionality
 * 
 * PURPOSE:
 * - Provides a clean API interface for chat operations between frontend and backend
 * - Handles all messaging-related HTTP requests to the backend
 * - Manages chat conversations between tenants and property owners
 * 
 * KEY FUNCTIONS:
 * 
 * 1. getChats(userName, userRole)
 *    - Fetches all chat conversations for a specific user
 *    - Called by: TenantDashboard, OwnerDashboard (Messages tab)
 *    - Backend: GET /api/messages/chats?userName=X&userRole=Y
 *    - Returns: Array of Chat objects with messages and unread counts
 * 
 * 2. getOrCreateChat(tenantName, ownerName, propertyTitle?, propertyId?)
 *    - Creates a new chat or retrieves existing one between tenant and owner
 *    - Called by: PropertyDetailPage (Chat with Owner button), MessagesPage
 *    - Backend: POST /api/messages/chats
 *    - Returns: Chat object with unique ID
 * 
 * 3. sendMessage(chatId, message)
 *    - Sends a new message (text, image, video, or audio) to a chat
 *    - Called by: TenantDashboard, OwnerDashboard, MessagesPage
 *    - Backend: POST /api/messages/messages
 *    - Returns: Created message object with timestamp
 * 
 * 4. markChatAsSeen(chatId, viewerRole)
 *    - Marks all messages in a chat as read by the viewer
 *    - Called by: TenantDashboard, OwnerDashboard (when chat is opened)
 *    - Backend: PUT /api/messages/messages/seen
 *    - Returns: Success status
 * 
 * DATA TYPES:
 * - ChatMessage: Individual message with text/media, sender info, timestamp, seen status
 * - Chat: Conversation container with participants, messages array, last updated time
 * 
 * USAGE FLOW:
 * 1. User clicks "Chat with Owner" on property → getOrCreateChat()
 * 2. Dashboard loads messages tab → getChats() to fetch all conversations
 * 3. User opens a conversation → markChatAsSeen() to mark as read
 * 4. User sends message → sendMessage() to add to conversation
 * 5. Polling every 3 seconds → getChats() to check for new messages
 * 
 * BACKEND INTEGRATION:
 * - All functions connect to backend/routes/messages.js
 * - Uses MongoDB Chat and Message models
 * - Real-time updates via polling (3-second intervals)
 */

// src/utils/chatStorage.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ChatMessage {
  id: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  timestamp: string;
  senderName: string;
  senderRole: 'tenant' | 'owner' | 'admin' | 'landlord';
  seen: boolean;
}

export interface Chat {
  id: string;
  tenantName: string;
  ownerName: string;
  propertyTitle?: string;
  propertyId?: string;
  messages: ChatMessage[];
  lastUpdated: string;
  unreadCount?: number;
}

// Fetch all chats for a user
export const getChats = async (userName: string, userRole: 'tenant' | 'owner' | 'landlord'): Promise<Chat[]> => {
  try {
    const normalizedRole = userRole === 'landlord' ? 'owner' : userRole;
    const response = await fetch(`${API_URL}/api/messages/chats?userName=${encodeURIComponent(userName)}&userRole=${normalizedRole}`);
    if (!response.ok) {
      console.error('Failed to fetch chats:', response.status, response.statusText);
      return [];
    }
    const data = await response.json();
    console.log('Fetched chats:', data.length);
    return data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    return [];
  }
};

// Get or create a chat
export const getOrCreateChat = async (
  tenantName: string,
  ownerName: string,
  propertyTitle?: string,
  propertyId?: string
): Promise<Chat | null> => {
  try {
    console.log('Creating/fetching chat:', { tenantName, ownerName, propertyTitle, propertyId });
    const response = await fetch(`${API_URL}/api/messages/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantName, ownerName, propertyTitle, propertyId }),
    });
    if (!response.ok) {
      console.error('Failed to create/fetch chat:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    console.log('Chat created/fetched:', data.id);
    return data;
  } catch (error) {
    console.error('Error creating/fetching chat:', error);
    return null;
  }
};

// Send a message
export const sendMessage = async (
  chatId: string,
  message: Omit<ChatMessage, 'id' | 'timestamp' | 'seen'>
): Promise<ChatMessage | null> => {
  try {
    console.log('Sending message to chat:', chatId);
    const response = await fetch(`${API_URL}/api/messages/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, ...message }),
    });
    if (!response.ok) {
      console.error('Failed to send message:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    console.log('Message sent:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

// Mark messages as seen
export const markChatAsSeen = async (chatId: string, viewerRole: 'tenant' | 'owner' | 'admin' | 'landlord'): Promise<boolean> => {
  try {
    const normalizedRole = viewerRole === 'landlord' ? 'owner' : viewerRole;
    const response = await fetch(`${API_URL}/api/messages/messages/seen`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, viewerRole: normalizedRole }),
    });
    if (!response.ok) {
      console.error('Failed to mark messages as seen:', response.status, response.statusText);
      return false;
    }
    const result = await response.json();
    console.log('Marked messages as seen:', result.modifiedCount);
    return result.success;
  } catch (error) {
    console.error('Error marking messages as seen:', error);
    return false;
  }
};

