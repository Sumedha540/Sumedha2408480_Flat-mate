import React, { useEffect, useState, createElement, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon, MoreVerticalIcon, SendIcon, ImageIcon, VideoIcon, MicIcon, SmileIcon, PhoneIcon, VideoIcon as VideoCallIcon, InfoIcon, MessageCircleIcon } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { generateOwnerResponse, simulateTypingDelay } from '../utils/chatbot';
import { toast } from 'sonner';
interface Message {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  timestamp: Date;
  isOwn: boolean;
}
interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  online: boolean;
  propertyTitle?: string;
}
const mockConversations: Conversation[] = [{
  id: '1',
  name: 'Nirakar Shrestha',
  avatar: null,
  lastMessage: "Hello! Yes, it's still available. Would you like to schedule a visit?",
  lastMessageTime: new Date(Date.now() - 300000),
  unread: 2,
  online: true,
  propertyTitle: 'Modern 3BHK Apartment'
}, {
  id: '2',
  name: 'Sita Maharjan',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
  lastMessage: 'The property is available from next month',
  lastMessageTime: new Date(Date.now() - 3600000),
  unread: 0,
  online: false,
  propertyTitle: 'Cozy Studio Room'
}, {
  id: '3',
  name: 'Rajesh Thapa',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  lastMessage: 'Sure, you can visit tomorrow at 3 PM',
  lastMessageTime: new Date(Date.now() - 7200000),
  unread: 0,
  online: true,
  propertyTitle: 'Spacious 3BHK Flat'
}];
export function MessagesPage() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    senderId: '1',
    text: "Hi! I'm interested in your property listing.",
    timestamp: new Date(Date.now() - 600000),
    isOwn: true
  }, {
    id: '2',
    senderId: '2',
    text: "Hello! Yes, it's still available. Would you like to schedule a visit?",
    timestamp: new Date(Date.now() - 300000),
    isOwn: false
  }]);
  const [isOwnerTyping, setIsOwnerTyping] = useState(false);
  // Handle dynamic routing from roommate profiles
  useEffect(() => {
    const userId = searchParams.get('userId');
    const userName = searchParams.get('userName');
    if (userId && userName) {
      // Check if conversation exists
      let conversation = conversations.find(c => c.id === userId);
      if (!conversation) {
        // Create new conversation
        conversation = {
          id: userId,
          name: decodeURIComponent(userName),
          avatar: undefined,
          lastMessage: 'Start a conversation',
          lastMessageTime: new Date(),
          unread: 0,
          online: true,
          propertyTitle: undefined
        };
        setConversations(prev => [conversation!, ...prev]);
      }
      setSelectedConversation(conversation);
      // Show welcome message
      setMessages([{
        id: '1',
        senderId: userId,
        text: `Hi! Thanks for reaching out. How can I help you?`,
        timestamp: new Date(),
        isOwn: false
      }]);
    } else {
      setSelectedConversation(conversations[0]);
    }
  }, [searchParams]);
  const filteredConversations = conversations.filter(conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: '1',
      text: message,
      timestamp: new Date(),
      isOwn: true
    };
    setMessages(prev => [...prev, userMessage]);
    const userMessageText = message;
    setMessage('');
    // Simulate owner typing and response
    setIsOwnerTyping(true);
    const ownerResponse = generateOwnerResponse(userMessageText);
    const typingDelay = simulateTypingDelay(ownerResponse.length);
    setTimeout(() => {
      const ownerMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: '2',
        text: ownerResponse,
        timestamp: new Date(),
        isOwn: false
      };
      setMessages(prev => [...prev, ownerMessage]);
      setIsOwnerTyping(false);
    }, typingDelay);
  };
  const handleFileUpload = (type: 'image' | 'video' | 'audio') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: '1',
          [type]: url,
          timestamp: new Date(),
          isOwn: true
        };
        setMessages(prev => [...prev, newMessage]);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sent!`);
      }
    };
    input.click();
  };
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <main className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-12 h-full bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Conversations Sidebar */}
          <div className="col-span-12 md:col-span-4 border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-primary">Messages</h1>
                <motion.button whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(0,0,0,0.05)'
              }} whileTap={{
                scale: 0.9
              }} className="p-2 hover:bg-background-light rounded-full transition-colors">
                  <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Search */}
              <motion.div initial={{
              opacity: 0,
              y: -10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.1
            }} className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-button-primary transition-all" />
              </motion.div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredConversations.map((conv, index) => <motion.button key={conv.id} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -20
              }} transition={{
                delay: index * 0.05
              }} onClick={() => setSelectedConversation(conv)} whileHover={{
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }} whileTap={{
                scale: 0.98
              }} className={`w-full p-4 flex items-start gap-3 text-left transition-colors border-b border-gray-100 ${selectedConversation?.id === conv.id ? 'bg-background-accent' : ''}`}>
                    <div className="relative flex-shrink-0">
                      {conv.avatar ? <img src={conv.avatar} alt={conv.name} className="w-14 h-14 rounded-full object-cover" /> : <div className="w-14 h-14 bg-button-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {conv.name.split(' ').map(n => n[0]).join('')}
                        </div>}
                      <AnimatePresence>
                        {conv.online && <motion.span initial={{
                      scale: 0
                    }} animate={{
                      scale: 1
                    }} exit={{
                      scale: 0
                    }} className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />}
                      </AnimatePresence>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-primary truncate">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      {conv.propertyTitle && <p className="text-xs text-gray-500 mb-1 truncate">
                          {conv.propertyTitle}
                        </p>}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {conv.lastMessage}
                        </p>
                        <AnimatePresence>
                          {conv.unread > 0 && <motion.span initial={{
                        scale: 0
                      }} animate={{
                        scale: 1
                      }} exit={{
                        scale: 0
                      }} className="ml-2 w-5 h-5 bg-button-primary text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                              {conv.unread}
                            </motion.span>}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.button>)}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-12 md:col-span-8 flex flex-col">
            {selectedConversation ? <>
                {/* Chat Header */}
                <motion.div initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {selectedConversation.avatar ? <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 bg-button-primary rounded-full flex items-center justify-center text-white font-bold">
                          {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                        </div>}
                      <AnimatePresence>
                        {selectedConversation.online && <motion.span initial={{
                      scale: 0
                    }} animate={{
                      scale: [0, 1.2, 1]
                    }} exit={{
                      scale: 0
                    }} transition={{
                      duration: 0.3
                    }} className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                      </AnimatePresence>
                    </div>
                    <div>
                      <h2 className="font-semibold text-primary">
                        {selectedConversation.name}
                      </h2>
                      <motion.p className="text-xs text-gray-500" animate={{
                    opacity: selectedConversation.online ? [0.7, 1, 0.7] : 1
                  }} transition={{
                    duration: 2,
                    repeat: selectedConversation.online ? Infinity : 0
                  }}>
                        {selectedConversation.online ? 'Active now' : 'Offline'}
                      </motion.p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }} whileTap={{
                  scale: 0.9
                }} className="p-2 text-gray-600 hover:bg-background-light rounded-full transition-colors">
                      <PhoneIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }} whileTap={{
                  scale: 0.9
                }} className="p-2 text-gray-600 hover:bg-background-light rounded-full transition-colors">
                      <VideoCallIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }} whileTap={{
                  scale: 0.9
                }} className="p-2 text-gray-600 hover:bg-background-light rounded-full transition-colors">
                      <InfoIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-background-light">
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {messages.map((msg, index) => <motion.div key={msg.id} initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.8
                  }} animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }} exit={{
                    opacity: 0,
                    scale: 0.8
                  }} transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 200
                  }} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                          <motion.div whileHover={{
                      scale: 1.02
                    }} className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.isOwn ? 'bg-button-primary text-white rounded-br-md' : 'bg-white text-primary rounded-bl-md shadow-sm'}`}>
                            {msg.text && <p className="text-sm leading-relaxed">
                                {msg.text}
                              </p>}
                            {msg.image && <motion.img initial={{
                        opacity: 0
                      }} animate={{
                        opacity: 1
                      }} src={msg.image} alt="Shared" className="rounded-lg max-w-full h-auto" />}
                            {msg.video && <video src={msg.video} controls className="rounded-lg max-w-full h-auto" />}
                            {msg.audio && <audio src={msg.audio} controls className="w-full" />}
                            <p className={`text-xs mt-1 ${msg.isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                              {formatMessageTime(msg.timestamp)}
                            </p>
                          </motion.div>
                        </motion.div>)}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isOwnerTyping && <motion.div initial={{
                    opacity: 0,
                    y: 10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: -10
                  }} className="flex justify-start">
                          <div className="bg-white text-primary rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                            <div className="flex gap-1">
                              {[0, 1, 2].map(i => <motion.div key={i} animate={{
                          y: [0, -8, 0]
                        }} transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15
                        }} className="w-2 h-2 bg-gray-400 rounded-full" />)}
                            </div>
                          </div>
                        </motion.div>}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Message Input */}
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2
            }} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.button whileHover={{
                  scale: 1.1,
                  color: '#2F7D5F'
                }} whileTap={{
                  scale: 0.9
                }} onClick={() => handleFileUpload('image')} className="p-2 text-gray-500 hover:bg-background-light rounded-full transition-colors" title="Send image">
                      <ImageIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1,
                  color: '#2F7D5F'
                }} whileTap={{
                  scale: 0.9
                }} onClick={() => handleFileUpload('video')} className="p-2 text-gray-500 hover:bg-background-light rounded-full transition-colors" title="Send video">
                      <VideoIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1,
                  color: '#2F7D5F'
                }} whileTap={{
                  scale: 0.9
                }} onClick={() => handleFileUpload('audio')} className="p-2 text-gray-500 hover:bg-background-light rounded-full transition-colors" title="Send voice message">
                      <MicIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button whileHover={{
                  scale: 1.1,
                  color: '#2F7D5F'
                }} whileTap={{
                  scale: 0.9
                }} className="p-2 text-gray-500 hover:bg-background-light rounded-full transition-colors">
                      <SmileIcon className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." disabled={isOwnerTyping} whileFocus={{
                  scale: 1.01
                }} className="flex-1 px-4 py-3 bg-background-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-button-primary disabled:opacity-50 transition-all" />
                    <motion.button whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }} onClick={handleSendMessage} disabled={isOwnerTyping || !message.trim()} className="p-3 bg-button-primary text-white rounded-full hover:bg-[#3d9970] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message">
                      <SendIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </> : <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <motion.div animate={{
                y: [0, -10, 0]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }}>
                    <MessageCircleIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </motion.div>}
          </div>
        </div>
      </div>
    </main>;
}