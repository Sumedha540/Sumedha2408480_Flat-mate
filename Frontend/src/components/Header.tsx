import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  motion, AnimatePresence, useScroll, useMotionValueEvent,
} from 'framer-motion'
import {
  MenuIcon, XIcon, HeartIcon, MessageCircleIcon,
  LayoutDashboardIcon, ChevronDownIcon, SparklesIcon,
} from 'lucide-react'
import { Button } from './ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { NotificationDropdown } from './NotificationDropdown'
import { Avatar } from './ui/Avatar'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollY } = useScroll()

  // Load profile photo from localStorage
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    if (!user?.email) return null
    try {
      const savedProfile = localStorage.getItem(`fm_profile_${user.email}`)
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        return parsed.photo || null
      }
    } catch {}
    return null
  })

  // Listen for profile photo updates
  React.useEffect(() => {
    const handleProfileUpdate = () => {
      if (!user?.email) return
      try {
        const savedProfile = localStorage.getItem(`fm_profile_${user.email}`)
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile)
          setProfilePhoto(parsed.photo || null)
        }
      } catch {}
    }

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate)
    window.addEventListener('storage', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfileUpdate)
      window.removeEventListener('storage', handleProfileUpdate)
    }
  }, [user?.email])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)
  })

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { name: 'Home',          path: '/' },
    { name: 'Properties',    path: '/properties' },
    { name: 'Find Roommate', path: '/find-roommate' },
    { name: 'About Us',      path: '/about' },
    { name: 'Contact',       path: '/contact' },
  ]

  const getDashboardPath = () => {
    if (!user) return '/dashboard/tenant'
    return `/dashboard/${user.role}`
  }

  const handleLogout = () => {
    logout()
    setShowUserDropdown(false)
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg'
          : 'bg-gradient-to-r from-button-primary via-primary to-button-primary'
      }`}
    >
      {/* Animated Background Pattern — only when not scrolled */}
      {!isScrolled && (
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
            backgroundSize: '60px 60px',
          }}
        />
      )}

      {/* Floating Orbs — only when not scrolled */}
      {!isScrolled && (
        <>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-0 left-40 w-24 h-24 bg-white/10 rounded-full blur-2xl"
          />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isScrolled
                  ? 'bg-gradient-to-br from-button-primary to-primary'
                  : 'bg-white/20 backdrop-blur-sm'
              }`}
            >
              <span className="text-white font-bold text-xl">F</span>
            </motion.div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-white'}`}>
                Flat-Mate
              </span>
              <span className={`text-[10px] font-medium tracking-widest uppercase transition-colors duration-300 ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                Find Your Home
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center">
            <div className={`flex items-center gap-1 p-1.5 rounded-full transition-all duration-300 ${isScrolled ? 'bg-gray-100' : 'bg-white/10 backdrop-blur-sm'}`}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? isScrolled ? 'bg-button-primary text-white shadow-lg' : 'bg-white text-primary shadow-lg'
                        : isScrolled ? 'text-gray-600 hover:text-primary hover:bg-gray-200' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.name}
                  </motion.div>
                </Link>
              ))}
            </div>
          </nav>

          {/* Auth / User area */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">

                {/* Heart icon */}
                <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to="/favorites"
                    className={`transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'}`}
                  >
                    <HeartIcon className="w-5 h-5" />
                  </Link>
                </motion.div>

                {/* Message icon */}
                <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to="/dashboard/tenant?tab=messages"
                    className={`transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'}`}
                  >
                    <MessageCircleIcon className="w-5 h-5" />
                  </Link>
                </motion.div>

                {/* ✅ NotificationDropdown now receives isScrolled so its bell icon
                    matches HeartIcon and MessageCircleIcon above exactly */}
                <NotificationDropdown isScrolled={isScrolled} />

                {/* User dropdown */}
                <div className={`relative pl-4 border-l ${isScrolled ? 'border-gray-200' : 'border-white/20'}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-3"
                  >
                    <div className="text-right hidden lg:block">
                      <p className={`text-sm font-medium ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                        {user?.name}
                      </p>
                      <p className={`text-xs capitalize ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                        {user?.role}
                      </p>
                    </div>
                    <Avatar src={profilePhoto || user?.avatar} name={user?.name || 'User'} />
                    <ChevronDownIcon className={`w-4 h-4 ${isScrolled ? 'text-gray-500' : 'text-white/80'}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserDropdown(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                        >
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(215, 237, 228, 0.5)', x: 4 }}
                            onClick={() => { navigate(getDashboardPath()); setShowUserDropdown(false) }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 flex items-center gap-2"
                          >
                            <LayoutDashboardIcon className="w-4 h-4" />
                            Dashboard
                          </motion.button>
                          <div className="border-t border-gray-100 my-1" />
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', x: 4 }}
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-sm text-red-600 flex items-center gap-2"
                          >
                            Logout
                          </motion.button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                      isScrolled
                        ? 'bg-gradient-to-r from-button-primary to-primary text-white shadow-lg'
                        : 'bg-white text-primary shadow-lg'
                    }`}
                  >
                    <SparklesIcon className="w-4 h-4" />
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`md:hidden p-2 rounded-xl ${isScrolled ? 'text-gray-700 bg-gray-100' : 'text-white bg-white/10'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl transition-all ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-button-primary to-primary text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {!isAuthenticated && (
                <div className="pt-4 space-y-2 border-t border-gray-100 mt-4">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button className="w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-left">
                      Log In
                    </motion.button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-button-primary to-primary text-white font-medium flex items-center justify-center gap-2">
                      <SparklesIcon className="w-4 h-4" />
                      Sign Up Free
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
