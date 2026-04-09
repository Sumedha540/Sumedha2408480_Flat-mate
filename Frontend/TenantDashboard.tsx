/**
 * TENANT DASHBOARD - Main dashboard interface for tenant users
 * 
 * PURPOSE:
 * - Provides a centralized hub for tenants to manage their rental activities
 * - Displays saved properties, bookings, messages, notifications, and profile settings
 * 
 * KEY FEATURES:
 * 1. Overview: Stats cards showing saved properties, bookings, messages, and viewed properties
 * 2. Saved Properties: List of favorited properties (connected to FavoritesContext)
 * 3. My Bookings: Display of property booking requests and their status
 * 4. Messages: Real-time chat with property owners (connected to chatStorage API)
 * 5. Notifications: Alerts for booking approvals, new matches, price drops
 * 6. Settings: Profile management with photo upload and form validation
 * 
 * DATA FLOW:
 * - Auth: useAuth() hook provides user data and logout function
 * - Favorites: useFavorites() hook manages saved properties list
 * - Messages: chatStorage.ts API handles chat CRUD operations with backend
 * - Profile: localStorage stores profile data under key `fm_profile_${email}`
 * - URL Params: Reads ?tab=messages&userName=X to auto-open specific chats
 * 
 * BACKEND CONNECTIONS:
 * - GET /api/messages/chats - Fetches all conversations for the user
 * - POST /api/messages/chats - Creates new chat conversation
 * - POST /api/messages/messages - Sends a new message
 * - PUT /api/messages/messages/seen - Marks messages as read
 * 
 * COMPONENT STRUCTURE:
 * - ProfileSettingsPanel: Nested component for profile editing
 * - StatusBadge: Displays booking status (approved/pending/rejected)
 * - AvatarCircle: User avatar with initials
 * - Main Dashboard: Tab-based navigation with sidebar and content area
 */

// src/pages/TenantDashboard.tsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  HomeIcon, HeartIcon, MessageCircleIcon, CalendarIcon, BellIcon,
  SettingsIcon, LogOutIcon, SearchIcon, ChevronRightIcon, CheckCircleIcon,
  ClockIcon, ArrowLeftIcon, SendIcon, PhoneIcon, VideoIcon, InfoIcon,
  ImageIcon, MicIcon, SmileIcon, CheckCheckIcon, XIcon, MenuIcon,
  UserIcon, MailIcon, PhoneIcon as PhoneIconSolid, MapPinIcon, CameraIcon,
  ShieldCheckIcon, BedDoubleIcon, BathIcon, TrashIcon, BarChart2Icon,
  ThumbsUpIcon, ListIcon, SendIcon as SendIcon2, EyeIcon, MessageSquareIcon,
  CheckIcon,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { PropertyCard } from '../components/PropertyCard'
import { useAuth } from '../contexts/AuthContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { generateOwnerResponse, simulateTypingDelay } from '../utils/chatbot'
import { getChats, getOrCreateChat, sendMessage, markChatAsSeen, Chat } from '../utils/chatStorage'
import { toast } from 'sonner'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockBookings = [
  { id:'1', property:'Modern 2BHK Apartment', location:'Thamel, Kathmandu', date:'2024-01-15', status:'approved', image:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop', ownerName:'Ram Thapa' },
  { id:'2', property:'Spacious 3BHK Flat',    location:'Bhaktapur',          date:'2024-01-18', status:'submitted', image:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop', ownerName:'Bikash Shrestha' },
  { id:'3', property:'Cozy Studio Room',      location:'Patan, Lalitpur',    date:'2024-01-20', status:'rejected', image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop', ownerName:'Sita Sharma' },
]

const mockNotifications = [
  { id:'1', title:'Booking Approved',    message:'Your booking for Modern 2BHK Apartment has been approved!', time:'1 hour ago',  type:'success' },
  { id:'2', title:'New Property Match',  message:'A new property matching your preferences is available.',    time:'3 hours ago', type:'info' },
  { id:'3', title:'Price Drop Alert',    message:'A property in your favorites has reduced its rent.',        time:'1 day ago',   type:'warning' },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    approved:  { label:'Approved',  cls:'bg-green-100 text-green-700' },
    submitted: { label:'Pending',   cls:'bg-yellow-100 text-yellow-700' },
    rejected:  { label:'Rejected',  cls:'bg-red-100 text-red-700' },
  }
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-600' }
  return <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.cls}`}>{s.label}</span>
}

function AvatarCircle({ name, size = 'md' }: { name: string; size?: 'sm'|'md'|'lg' }) {
  const sz = { sm:'w-10 h-10 text-sm', md:'w-12 h-12 text-base', lg:'w-14 h-14 text-lg' }
  return (
    <div className={`${sz[size]} bg-button-primary rounded-full flex items-center justify-center text-white font-black flex-shrink-0`}>
      {name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
    </div>
  )
}

// Helper functions for messages
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

// ─── Inline Profile Settings ───────────────────────────────────────────────────
function ProfileSettingsPanel() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', bio: '' })
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Load saved profile data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem(`fm_profile_${user?.email}`)
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setForm(parsed.form || form)
        setProfilePhoto(parsed.photo || null)
      } catch {}
    }
  }, [user?.email])

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate phone (exactly 10 digits)
  const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '')
    return digits.length === 10
  }

  // Validate address (must contain letters, numbers, and common address characters)
  const validateAddress = (address: string): boolean => {
    // Must be at least 5 characters
    if (address.trim().length < 5) return false
    
    // Must contain at least one letter
    if (!/[a-zA-Z]/.test(address)) return false
    
    // Must not be just random characters - should have spaces or commas (typical address format)
    // Allow letters, numbers, spaces, commas, hyphens, periods, and forward slashes
    const validAddressRegex = /^[a-zA-Z0-9\s,.\-/]+$/
    if (!validAddressRegex.test(address)) return false
    
    // Should have at least one space or comma (typical address structure)
    if (!/[\s,]/.test(address)) return false
    
    return true
  }

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setProfilePhoto(base64)
      
      // Update localStorage immediately
      try {
        const savedProfile = localStorage.getItem(`fm_profile_${user?.email}`)
        const profileData = savedProfile ? JSON.parse(savedProfile) : { form }
        profileData.photo = base64
        localStorage.setItem(`fm_profile_${user?.email}`, JSON.stringify(profileData))
        window.dispatchEvent(new Event('profilePhotoUpdated'))
      } catch {}
      
      toast.success('Photo uploaded successfully!')
    }
    reader.onerror = () => {
      toast.error('Failed to read image file')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    // Validate all fields
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (form.phone && !validatePhone(form.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits'
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required'
    } else if (!validateAddress(form.address)) {
      newErrors.address = 'Please enter a valid address (e.g., "123 Main St, Kathmandu")'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fix the errors before saving')
      return
    }

    setErrors({})
    setSaving(true)

    // Save to localStorage
    try {
      const profileData = {
        form,
        photo: profilePhoto,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(`fm_profile_${user?.email}`, JSON.stringify(profileData))
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('profilePhotoUpdated'))
      
      setTimeout(() => {
        setSaving(false)
        toast.success('Profile updated successfully!')
      }, 1000)
    } catch (error) {
      setSaving(false)
      toast.error('Failed to save profile')
    }
  }

  const handlePhoneChange = (value: string) => {
    // Only allow digits and limit to 10
    const digits = value.replace(/\D/g, '').slice(0, 10)
    setForm({ ...form, phone: digits })
    
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors({ ...errors, phone: '' })
    }
  }

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
      <h2 className="text-xl font-bold text-primary mb-6">Profile Settings</h2>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="relative">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 bg-button-primary rounded-full flex items-center justify-center text-white font-black text-2xl">
              {(user?.name || 'U').charAt(0)}
            </div>
          )}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-button-primary rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-button-primary/90 transition-colors">
            <CameraIcon className="w-3.5 h-3.5 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="font-bold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-button-primary font-semibold mt-1 hover:underline">
            Change Photo
          </button>
          {profilePhoto && (
            <button 
              onClick={() => {
                setProfilePhoto(null)
                // Update localStorage immediately
                try {
                  const savedProfile = localStorage.getItem(`fm_profile_${user?.email}`)
                  if (savedProfile) {
                    const parsed = JSON.parse(savedProfile)
                    parsed.photo = null
                    localStorage.setItem(`fm_profile_${user?.email}`, JSON.stringify(parsed))
                    window.dispatchEvent(new Event('profilePhotoUpdated'))
                  }
                } catch {}
                toast.info('Photo removed')
              }}
              className="text-xs text-red-500 font-semibold mt-1 ml-3 hover:underline">
              Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              value={form.name} 
              placeholder="Your full name"
              onChange={e => {
                setForm({...form, name: e.target.value})
                if (errors.name) setErrors({...errors, name: ''})
              }}
              className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                errors.name ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-button-primary'
              }`} />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input 
              type="email" 
              value={form.email} 
              placeholder="you@example.com"
              onChange={e => {
                setForm({...form, email: e.target.value})
                if (errors.email) setErrors({...errors, email: ''})
              }}
              className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                errors.email ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-button-primary'
              }`} />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone (10 digits)</label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input 
              type="tel" 
              value={form.phone} 
              placeholder="98XXXXXXXX"
              maxLength={10}
              inputMode="numeric"
              onChange={e => handlePhoneChange(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                errors.phone ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-button-primary'
              }`} />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          {form.phone && !errors.phone && (
            <p className="text-gray-400 text-xs mt-1">{form.phone.length}/10 digits</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address *</label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              value={form.address} 
              placeholder="Your address"
              onChange={e => {
                setForm({...form, address: e.target.value})
                if (errors.address) setErrors({...errors, address: ''})
              }}
              className={`w-full pl-9 pr-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                errors.address ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-button-primary'
              }`} />
          </div>
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
        <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
          placeholder="Tell others about yourself..."
          rows={3}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-button-primary resize-none transition-all" />
      </div>

      {/* Security section */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-6 flex items-start gap-3">
        <ShieldCheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800 text-sm">Account Security</p>
          <p className="text-blue-600 text-xs mt-0.5">Your account is verified and secure.</p>
          <button className="text-xs text-blue-700 font-bold mt-1 hover:underline">Change Password</button>
        </div>
      </div>

      <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-button-primary text-white font-bold rounded-xl shadow-md hover:bg-button-primary/90 disabled:opacity-60 transition-all">
        {saving ? <><motion.div animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Saving...</> : 'Save Changes'}
      </motion.button>
    </motion.div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export function TenantDashboard() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { favorites, clearAll: clearFavorites } = useFavorites()

  // Load profile photo from localStorage
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    try {
      const savedProfile = localStorage.getItem(`fm_profile_${user?.email}`)
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        return parsed.photo || null
      }
    } catch {}
    return null
  })

  // Listen for profile updates
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedProfile = localStorage.getItem(`fm_profile_${user?.email}`)
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile)
          setProfilePhoto(parsed.photo || null)
        }
      } catch {}
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event from ProfileSettingsPanel
    window.addEventListener('profilePhotoUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profilePhotoUpdated', handleStorageChange)
    }
  }, [user?.email])

  // Role verification - redirect if not tenant
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'tenant') {
      toast.error('Access denied. This page is for tenants only.');
      if (user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (user.role === 'landlord' || user.role === 'owner') {
        navigate('/dashboard/owner', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  // ── Roommate requirements from localStorage (written by FindRoommatePage) ──
  const [requirements, setRequirements] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('fm_requirements') || '[]') } catch { return [] }
  })
  const [userNotifs, setUserNotifs] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(`fm_notifs_${user?.name || 'user'}`) || '[]') } catch { return [] }
  })

  // Reload from storage when tab becomes active
  useEffect(() => {
    const reload = () => {
      try {
        setRequirements(JSON.parse(localStorage.getItem('fm_requirements') || '[]'))
        setUserNotifs(JSON.parse(localStorage.getItem(`fm_notifs_${user?.name || 'user'}`) || '[]'))
      } catch {}
    }
    window.addEventListener('focus', reload)
    return () => window.removeEventListener('focus', reload)
  }, [user?.name])

  const toggleLike = (id: string) => {
    const userName = user?.name || 'You'
    const updated = requirements.map((r: any) => {
      if (r.id !== id) return r
      const liked = (r.likes || []).includes(userName)
      return { ...r, likes: liked ? r.likes.filter((n: string) => n !== userName) : [...(r.likes||[]), userName] }
    })
    setRequirements(updated)
    localStorage.setItem('fm_requirements', JSON.stringify(updated))
  }

  const addComment = (id: string, author: string, text: string) => {
    const updated = requirements.map((r: any) => r.id !== id ? r : {
      ...r, comments: [...(r.comments||[]), { id: Date.now().toString(), author, text, timestamp: Date.now() }]
    })
    setRequirements(updated)
    localStorage.setItem('fm_requirements', JSON.stringify(updated))
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Read tab from URL param (set by "Chat with Owner" / message icon / Find Roommate message)
  const urlTab = searchParams.get('tab')
  const fromPage = searchParams.get('from') || 'properties'
  const [activeTab, setActiveTab] = useState(urlTab || 'overview')

  // Messages params from PropertyDetailPage / FindRoommatePage (must be declared before useEffect)
  const msgUserId        = searchParams.get('userId')        || undefined
  const msgUserName      = searchParams.get('userName')      || undefined
  const msgPropertyTitle = searchParams.get('propertyTitle') || undefined

  // Messages state
  const [conversations, setConversations] = useState<Chat[]>([])
  const [selectedConv, setSelectedConv]   = useState<Chat | null>(null)
  const [searchQuery, setSearchQuery]     = useState('')
  const [message, setMessage]             = useState('')
  const [showInfo, setShowInfo]           = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Update tab when URL changes
  useEffect(() => { if (urlTab) setActiveTab(urlTab) }, [urlTab])

  // Remove redirect - messages will be shown in dashboard
  // useEffect(() => {
  //   if (activeTab === 'messages') {
  //     if (msgUserName) {
  //       navigate(`/messages?userName=${encodeURIComponent(msgUserName)}${msgPropertyTitle ? `&propertyTitle=${encodeURIComponent(msgPropertyTitle)}` : ''}${msgUserId ? `&propertyId=${encodeURIComponent(msgUserId)}` : ''}`)
  //     } else {
  //       navigate('/messages')
  //     }
  //   }
  // }, [activeTab, msgUserName, msgPropertyTitle, msgUserId, navigate])

  // Auto-scroll for messages (only when messages change, not on initial load)
  const prevMessagesLengthRef = useRef<number>(0)
  useEffect(() => {
    if (selectedConv?.messages) {
      const currentLength = selectedConv.messages.length
      // Only scroll if messages were added (not on initial load or conversation switch)
      if (prevMessagesLengthRef.current > 0 && currentLength > prevMessagesLengthRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
      prevMessagesLengthRef.current = currentLength
    } else {
      prevMessagesLengthRef.current = 0
    }
  }, [selectedConv?.messages?.length, selectedConv?.id])

  // Polling mechanism for messages
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

    if (activeTab === 'messages') {
      fetchChats();
      const interval = setInterval(fetchChats, 3000);
      return () => clearInterval(interval);
    }
  }, [user, selectedConv?.id, activeTab]);

  // Mark messages as seen
  useEffect(() => {
    const markSeen = async () => {
      if (selectedConv && user && activeTab === 'messages') {
        const userRole = (user.role === 'landlord' ? 'owner' : user.role) as 'tenant' | 'owner';
        await markChatAsSeen(selectedConv.id, userRole);
      }
    };
    markSeen();
  }, [selectedConv?.id, selectedConv?.messages?.length, user, activeTab]);

  // Initial Check from URL query strings (Owner contact init)
  useEffect(() => {
    const initChat = async () => {
      if (!user || activeTab !== 'messages') return;
      
      if (msgUserName) {
        const decodedOwner = decodeURIComponent(msgUserName);
        const decodedTitle = msgPropertyTitle ? decodeURIComponent(msgPropertyTitle) : undefined;
        const decodedPropId = msgUserId ? decodeURIComponent(msgUserId) : undefined;
        
        const newChat = await getOrCreateChat(user.name, decodedOwner, decodedTitle, decodedPropId);
        if (newChat) {
          setSelectedConv(newChat);
        }
      }
    };
    
    initChat();
  }, [msgUserName, msgPropertyTitle, msgUserId, user, activeTab]);

  const tabs = [
    { id:'overview',       label:'Overview',          icon: HomeIcon },
    { id:'saved',          label:'Saved Properties',  icon: HeartIcon },
    { id:'bookings',       label:'My Bookings',       icon: CalendarIcon },
    { id:'messages',       label:'Messages',          icon: MessageCircleIcon },
    { id:'notifications',  label:'Notifications',     icon: BellIcon },
    { id:'settings',       label:'Settings',          icon: SettingsIcon },
  ]

  const handleLogout = () => {
    logout()
    toast('Signed out', {
      style: {
        background: '#D1D5DB',
        color: '#374151',
      },
    })
    navigate('/')
  }

  // Message handlers
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

  const renderContent = () => {
    switch (activeTab) {

      case 'saved':
        return (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-primary">Saved Properties</h2>
                <p className="text-gray-500 text-sm">{favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}</p>
              </div>
              {favorites.length > 0 && (
                <button onClick={() => { clearFavorites(); toast.success('All favorites cleared') }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all">
                  <TrashIcon className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>
            {favorites.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <HeartIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No saved properties yet. Heart any property to save it here.</p>
                <button onClick={() => navigate('/properties')} className="mt-4 px-6 py-2.5 bg-button-primary text-white text-sm font-bold rounded-full">Browse Properties</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favorites.map(p => <PropertyCard key={p.id} {...p} />)}
              </div>
            )}
          </motion.div>
        )

      case 'bookings':
        return (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <h2 className="text-xl font-bold text-primary mb-6">My Bookings</h2>
            <div className="space-y-3">
              {mockBookings.map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                  <img src={b.image} alt={b.property} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{b.property}</p>
                    <p className="text-gray-500 text-xs">{b.location}</p>
                    <p className="text-gray-400 text-xs">Owner: {b.ownerName} · Visit: {b.date}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          </motion.div>
        )

      case 'messages':
        const filteredConvs = conversations.filter(c => {
          const displayName = user?.role === 'tenant' ? c.ownerName : c.tenantName;
          return displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (c.propertyTitle && c.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()));
        });

        return (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="h-[calc(100vh-12rem)]">
            <div className="grid grid-cols-12 h-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
              
              {/* SIDEBAR */}
              <div className={`col-span-12 md:col-span-4 border-r border-gray-100 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-2xl font-black text-gray-900 mb-4">Messages</h2>
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
                    <div className="overflow-y-auto p-5 bg-gray-50 space-y-3 flex-1">
                      <AnimatePresence initial={false}>
                        {selectedConv.messages.map(msg => {
                          const isOwn = msg.senderName === user?.name;
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
          </motion.div>
        )

      case 'notifications':
        const allNotifs = userNotifs || []
        const allNotifsDisplay = [...mockNotifications, ...allNotifs.map(n => ({ id:n.id, title:n.title, message:n.message, time:n.time, type:n.type }))]
        return (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <h2 className="text-xl font-bold text-primary mb-6">Notifications</h2>
            {allNotifsDisplay.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <BellIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allNotifsDisplay.map(n => (
                  <div key={n.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.type==='success' ? 'bg-green-100' : n.type==='warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                      {n.type==='success' ? <CheckCircleIcon className="w-5 h-5 text-green-600" /> : n.type==='warning' ? <ClockIcon className="w-5 h-5 text-yellow-600" /> : <BellIcon className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{n.title}</p>
                      <p className="text-gray-500 text-xs">{n.message}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )

      case 'settings':
        return <ProfileSettingsPanel />

      default: // overview
        return (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: HeartIcon,          value: favorites.length, label:'Saved Properties',  color:'bg-pink-50 text-pink-500' },
                { icon: CalendarIcon,        value: mockBookings.length, label:'Active Bookings', color:'bg-blue-50 text-blue-500' },
                { icon: MessageCircleIcon,   value: 0,  label:'Unread Messages',  color:'bg-purple-50 text-purple-500' },
                { icon: SearchIcon,          value: 12, label:'Properties Viewed', color:'bg-green-50 text-green-500' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                  whileHover={{ y:-4 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer">
                  <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent bookings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recent Bookings</h3>
                <button onClick={() => setActiveTab('bookings')} className="text-button-primary text-xs font-semibold hover:underline">View All</button>
              </div>
              <div className="space-y-2">
                {mockBookings.slice(0,2).map(b => (
                  <div key={b.id} className="bg-white rounded-xl p-3 border border-gray-100 flex gap-3 items-center">
                    <img src={b.image} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" alt="" />
                    <div className="flex-1 min-w-0"><p className="font-bold text-sm text-gray-900 truncate">{b.property}</p><p className="text-xs text-gray-500">{b.location}</p></div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Saved properties preview */}
            {favorites.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Saved Properties</h3>
                  <button onClick={() => setActiveTab('saved')} className="text-button-primary text-xs font-semibold hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.slice(0,2).map(p => <PropertyCard key={p.id} {...p} />)}
                </div>
              </div>
            )}
          </motion.div>
        )
    }
  }

  return (
    <main className="min-h-screen bg-background-light">
      <div className="flex">

        {/* ── SIDEBAR ── */}
        <aside className="w-64 bg-white border-r border-gray-100 min-h-screen sticky top-0 hidden lg:flex flex-col">
          <div className="p-6 flex flex-col h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-gradient-to-br from-button-primary to-primary rounded-xl flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-primary font-black text-lg">Flat-Mate</span>
            </Link>

            {/* User avatar */}
            <div className="flex items-center gap-3 mb-7 p-3 bg-gray-50 rounded-xl border border-gray-100">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 bg-button-primary rounded-full flex items-center justify-center text-white font-black text-base flex-shrink-0">
                  {(user?.name || 'U').charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role || 'tenant'}</p>
              </div>
            </div>

            {/* Nav items */}
            <nav className="space-y-1 flex-1">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <motion.button key={tab.id} whileHover={{ x:3 }} whileTap={{ scale:0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-button-primary/10 text-button-primary font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {tab.label}
                  </motion.button>
                )
              })}
            </nav>

            {/* Back nav + Logout */}
            <div className="pt-6 border-t border-gray-100 space-y-1">
              <Link to="/properties">
                <motion.div whileHover={{ x:3 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                  <SearchIcon className="w-4 h-4" /> Browse Properties
                </motion.div>
              </Link>
              <Link to="/">
                <motion.div whileHover={{ x:3 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                  <ArrowLeftIcon className="w-4 h-4" /> Back to Home
                </motion.div>
              </Link>
              <motion.button whileHover={{ x:3 }} whileTap={{ scale:0.98 }} onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all">
                <LogOutIcon className="w-4 h-4" /> Sign Out
              </motion.button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col min-h-screen">

          {/* Top bar */}
          <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileMenuOpen(v => !v)} className="lg:hidden p-1.5 rounded-xl bg-gray-50 border border-gray-200 mr-2">
                <MenuIcon className="w-5 h-5 text-gray-600" />
              </button>
              <nav className="text-sm flex items-center gap-2 text-gray-500">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>›</span>
                {fromPage === 'find-roommate' ? (
                  <Link to="/find-roommate" className="hover:text-primary transition-colors">Find Roommate</Link>
                ) : fromPage === 'property' ? (
                  <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
                ) : (
                  <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
                )}
                <span>›</span>
                <span className="text-primary font-semibold capitalize">{activeTab === 'overview' ? 'Dashboard' : tabs.find(t => t.id === activeTab)?.label || activeTab}</span>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:text-primary hover:border-button-primary/40 transition-all">
                <ArrowLeftIcon className="w-3.5 h-3.5" /> Back
              </motion.button>
              <span className="hidden sm:block text-sm font-semibold text-gray-700">Welcome, {user?.name?.split(' ')[0]}!</span>
            </div>
          </header>

          {/* Mobile nav */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                className="lg:hidden bg-white border-b border-gray-100 overflow-hidden">
                <div className="px-4 py-3 flex flex-wrap gap-2">
                  {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                      <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false) }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all ${activeTab===tab.id ? 'bg-button-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <Icon className="w-3.5 h-3.5" /> {tab.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.2 }}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}
