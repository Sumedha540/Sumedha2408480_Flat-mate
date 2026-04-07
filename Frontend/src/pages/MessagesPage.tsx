import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  SearchIcon, MoreVerticalIcon, SendIcon, ImageIcon, VideoIcon,
  MicIcon, SmileIcon, PhoneIcon, InfoIcon, MessageCircleIcon,
  ArrowLeftIcon, XIcon, CheckIcon, CheckCheckIcon,
} from 'lucide-react'
import { getChats, getOrCreateChat, sendMessage, markChatAsSeen, Chat } from '../utils/chatStorage'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

function formatMsgTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function AvatarCircle({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-10 h-10 text-base', md: 'w-12 h-12 text-lg', lg: 'w-14 h-14 text-xl' }
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  return (
    <div className={`${sizes[size]} bg-button-primary rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}>
      {initials}
    </div>
  )
}

export function MessagesPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState<Chat[]>([])
  const [selectedConv, setSelectedConv]   = useState<Chat | null>(null)
  const [searchQuery, setSearchQuery]     = useState('')
  const [message, setMessage]             = useState('')
  const [showInfo, setShowInfo]           = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll inside effect whenever messages length changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConv?.messages])

  // Polling mechanism
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      const userRole = (user.role === 'landlord' ? 'owner' : user.role) as 'tenant' | 'owner';
      const myChats = await getChats(user.name, userRole);
      setConversations(myChats);
      
      // If we have a selected conversation, refresh it
      if (selectedConv) {
        const updated = myChats.find(c => c.id === selectedConv.id);
        if (updated) {
          setSelectedConv(updated);
        }
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [user, selectedConv?.id]);

  // Ensure read receipts whenever active conv changes
  useEffect(() => {
    const markSeen = async () => {
      if (selectedConv && user) {
        const userRole = (user.role === 'landlord' ? 'owner' : user.role) as 'tenant' | 'owner';
        await markChatAsSeen(selectedConv.id, userRole);
      }
    };
    markSeen();
  }, [selectedConv?.id, selectedConv?.messages?.length, user]);

  // Initial Check from URL query strings (Owner contact init)
  useEffect(() => {
    const initChat = async () => {
      if (!user) return;
      const ownerName = searchParams.get('userName');
      const propTitle = searchParams.get('propertyTitle');
      const propId = searchParams.get('propertyId');

      if (ownerName) {
        const decodedOwner = decodeURIComponent(ownerName);
        const decodedTitle = propTitle ? decodeURIComponent(propTitle) : undefined;
        const decodedPropId = propId ? decodeURIComponent(propId) : undefined;
        
        const newChat = await getOrCreateChat(user.name, decodedOwner, decodedTitle, decodedPropId);
        if (newChat) {
          setSelectedConv(newChat);
        }
      }
    };
    
    initChat();
    // eslint-disable-next-line
  }, [searchParams, user]);

  const filteredConvs = conversations.filter(c => {
    const displayName = user?.role === 'tenant' ? c.ownerName : c.tenantName;
    return displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.propertyTitle && c.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleSend = async () => {
    if (!message.trim() || !selectedConv || !user) return;
    const txt = message;
    setMessage('');
    
    const userRole = (user.role === 'landlord' ? 'owner' : user.role) as 'tenant' | 'owner';
    await sendMessage(selectedConv.id, {
      text: txt,
      senderName: user.name,
      senderRole: userRole
    });
    
    // Refresh the conversation
    const myChats = await getChats(user.name, userRole);
    const updated = myChats.find(c => c.id === selectedConv.id);
    if (updated) setSelectedConv(updated);
  };

  const handleFileUpload = async (type: 'image' | 'video' | 'audio') => {
    if (!selectedConv || !user) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      // Show loading toast
      const loadingToast = toast.loading(`Uploading ${type}...`);
      
      try {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        const userRole = (user.role === 'landlord' ? 'owner' : user.role) as 'tenant' | 'owner';
        await sendMessage(selectedConv.id, {
          [type]: base64,
          senderName: user.name,
          senderRole: userRole
        });
        
        toast.dismiss(loadingToast);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sent!`);
        
        // Refresh the conversation
        const myChats = await getChats(user.name, userRole);
        const updated = myChats.find(c => c.id === selectedConv.id);
        if (updated) setSelectedConv(updated);
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(`Failed to upload ${type}`);
        console.error('Error uploading file:', error);
      }
    };
    input.click();
  };

  return (
    <main className="min-h-screen bg-background-light pt-20 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <nav className="text-sm">
            <ol className="flex items-center gap-2 text-gray-500">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><span className="text-gray-400">›</span></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">Properties</Link></li>
              <li><span className="text-gray-400">›</span></li>
              <li className="text-primary font-medium">Messages</li>
            </ol>
          </nav>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:text-primary hover:border-button-primary/40 shadow-sm transition-all self-start">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </motion.button>
        </div>

        <div className="grid grid-cols-12 h-[calc(100vh-12rem)] bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* SIDEBAR */}
          <div className={`col-span-12 md:col-span-4 border-r border-gray-100 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-2xl font-black text-gray-900 mb-4">Messages</h1>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search owners or properties..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-button-primary/30 transition-all" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConvs.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No conversations found</div>
              ) : (
                filteredConvs.map((conv, idx) => {
                  const unreadCount = conv.unreadCount || 0;
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  const displayName = user?.role === 'tenant' ? conv.ownerName : conv.tenantName;
                  return (
                  <motion.button key={conv.id} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: idx*0.05 }} onClick={() => setSelectedConv(conv)}
                    className={`w-full p-4 flex items-start gap-3 text-left border-b border-gray-50 transition-colors hover:bg-gray-50 ${selectedConv?.id === conv.id ? 'bg-button-primary/5 border-l-2 border-l-button-primary' : ''}`}>
                    <div className="relative flex-shrink-0">
                      <AvatarCircle name={displayName} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-bold text-gray-900 truncate text-sm">{displayName}</h3>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatTime(new Date(conv.lastUpdated))}</span>
                      </div>
                      {conv.propertyTitle && (
                        <p className="text-xs text-button-primary font-medium truncate mb-0.5">{conv.propertyTitle}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 truncate flex-1">{lastMsg ? (lastMsg.text || 'Media message') : 'Start a conversation'}</p>
                        {unreadCount > 0 && (
                          <span className="ml-2 w-5 h-5 bg-button-primary text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                )})
              )}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className={`col-span-12 md:col-span-8 flex flex-col ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
            {selectedConv ? (
              <>
                {/* Chat header */}
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedConv(null)}
                      className="md:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <AvatarCircle name={user?.role === 'tenant' ? selectedConv.ownerName : selectedConv.tenantName} size="sm" />
                    </div>
                    <div>
                      <h2 className="font-black text-gray-900 text-sm">{user?.role === 'tenant' ? selectedConv.ownerName : selectedConv.tenantName}</h2>
                      {selectedConv.propertyTitle && (
                        <p className="text-xs text-button-primary font-medium">{selectedConv.propertyTitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={() => toast.info('Calling...')} className="p-2.5 text-gray-500 hover:text-button-primary hover:bg-button-primary/10 rounded-full">
                      <PhoneIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={() => setShowInfo(!showInfo)} className={`p-2.5 rounded-full ${showInfo ? 'text-button-primary bg-button-primary/10' : 'text-gray-500 hover:text-button-primary hover:bg-button-primary/10'}`}>
                      <InfoIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {showInfo && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                      className="bg-button-primary/5 border-b border-button-primary/10 px-5 py-3 text-sm overflow-hidden">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-black text-gray-900">{user?.role === 'tenant' ? selectedConv.ownerName : selectedConv.tenantName}</p>
                          {selectedConv.propertyTitle && <p className="text-button-primary font-medium">{selectedConv.propertyTitle}</p>}
                        </div>
                        <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="w-4 h-4" /></button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <div className="overflow-y-auto p-5 bg-gray-50 space-y-3" style={{ height: 'calc(100vh - 28rem)' }}>
                  <AnimatePresence initial={false}>
                    {selectedConv.messages.map(msg => {
                      const isOwn = msg.senderName === user?.name;
                      const senderDisplayName = isOwn ? 'You' : msg.senderName;
                      return (
                      <motion.div key={msg.id} initial={{ opacity:0, y:12, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
                        exit={{ opacity:0, scale:0.9 }} transition={{ duration:0.25, type:'spring', stiffness:300 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        {!isOwn && (
                          <div className="mr-2 flex-shrink-0 self-end">
                            <AvatarCircle name={msg.senderName} size="sm" />
                          </div>
                        )}
                        <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl shadow-sm ${isOwn ? 'bg-button-primary text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'}`}>
                          {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                          {msg.image && <img src={msg.image} alt="Shared" className="rounded-xl max-w-full h-auto mt-2" />}
                          {msg.video && <video src={msg.video} controls className="rounded-xl max-w-full mt-2" />}
                          {msg.audio && <audio src={msg.audio} controls className="w-full mt-2" />}
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
                            <span className="text-[10px]">{formatMsgTime(msg.timestamp)}</span>
                            {isOwn && (
                              msg.seen ? <CheckCheckIcon className="w-3.5 h-3.5 text-blue-300" /> : <CheckIcon className="w-3 h-3 text-white/60" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )})}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input - Fixed at bottom */}
                <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    {[
                      { icon: ImageIcon,  label: 'image',  title:'Send image' },
                      { icon: VideoIcon,  label: 'video',  title:'Send video' },
                      { icon: MicIcon,    label: 'audio',  title:'Send voice' },
                    ].map(btn => (
                      <motion.button key={btn.label} whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                        onClick={() => handleFileUpload(btn.label as any)} title={btn.title}
                        className="p-2 text-gray-400 hover:text-button-primary hover:bg-button-primary/10 rounded-full transition-colors">
                        <btn.icon className="w-5 h-5" />
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="text" value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder={`Message ${user?.role === 'tenant' ? selectedConv.ownerName : selectedConv.tenantName}...`}
                      className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-button-primary focus:bg-white transition-all" />
                    <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                      onClick={handleSend} disabled={!message.trim()}
                      className="p-3 bg-button-primary text-white rounded-2xl hover:bg-button-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md">
                      <SendIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageCircleIcon className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Select a conversation</h3>
                  <p className="text-gray-400 text-sm">Choose a conversation from the list to start messaging</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
