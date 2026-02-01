import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, XIcon, HeartIcon, MessageCircleIcon, LayoutDashboardIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Avatar } from './ui/Avatar';
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const navLinks = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Properties',
    path: '/properties'
  }, {
    name: 'Find Roommate',
    path: '/find-roommate'
  }, {
    name: 'About Us',
    path: '/about'
  }, {
    name: 'Contact',
    path: '/contact'
  }];
  const getDashboardPath = () => {
    if (!user) return '/dashboard/tenant';
    return `/dashboard/${user.role}`;
  };
  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };
  return <header className="sticky top-0 z-50 shadow-sm border-b border-white/10 relative overflow-hidden bg-gradient-to-br from-button-primary via-primary to-button-primary">
      {/* Animated Background Pattern */}
      <motion.div animate={{
      backgroundPosition: ['0% 0%', '100% 100%']
    }} transition={{
      duration: 20,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'linear'
    }} className="absolute inset-0 opacity-10" style={{
      backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
      backgroundSize: '60px 60px'
    }} />

      {/* Floating Orbs */}
      <motion.div animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3]
    }} transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }} className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div whileHover={{
            scale: 1.05,
            rotate: 5
          }} whileTap={{
            scale: 0.95
          }} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-primary font-bold text-xl">F</span>
            </motion.div>
            <span className="text-xl font-bold text-white">Flat-Mate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => <Link key={link.path} to={link.path} className="relative px-4 py-2">
                <motion.span className={`relative z-10 text-sm font-medium transition-colors ${isActive(link.path) ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  {link.name}
                </motion.span>

                {/* Active Indicator */}
                {isActive(link.path) && <motion.div layoutId="navbar-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" initial={false} transition={{
              type: 'spring',
              stiffness: 380,
              damping: 30
            }} />}
              </Link>)}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? <div className="flex items-center gap-4">
                <motion.div whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }}>
                  <Link to="/favorites" className="text-white/80 hover:text-white transition-colors">
                    <HeartIcon className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }}>
                  <Link to="/messages" className="text-white/80 hover:text-white transition-colors">
                    <MessageCircleIcon className="w-5 h-5" />
                  </Link>
                </motion.div>

                <NotificationDropdown />

                <div className="relative pl-4 border-l border-white/20">
                  <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => setShowUserDropdown(!showUserDropdown)} className="flex items-center gap-3">
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-medium text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-white/70 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <Avatar src={user?.avatar} alt={user?.name || 'User'} fallback={user?.name?.charAt(0) || 'U'} />
                    <ChevronDownIcon className="w-4 h-4 text-white/70" />
                  </motion.button>

                  <AnimatePresence>
                    {showUserDropdown && <>
                        <motion.div initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }} className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)} />
                        <motion.div initial={{
                    opacity: 0,
                    y: -10,
                    scale: 0.95
                  }} animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }} exit={{
                    opacity: 0,
                    y: -10,
                    scale: 0.95
                  }} transition={{
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1]
                  }} className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                          <motion.button whileHover={{
                      backgroundColor: 'rgba(215, 237, 228, 0.5)'
                    }} onClick={() => {
                      navigate(getDashboardPath());
                      setShowUserDropdown(false);
                    }} className="w-full px-4 py-2 text-left text-sm text-gray-700 flex items-center gap-2">
                            <LayoutDashboardIcon className="w-4 h-4" />
                            Dashboard
                          </motion.button>
                          <div className="border-t border-gray-100 my-1" />
                          <motion.button whileHover={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)'
                    }} onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 flex items-center gap-2">
                            Logout
                          </motion.button>
                        </motion.div>
                      </>}
                  </AnimatePresence>
                </div>
              </div> : <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>}
          </div>

          {/* Mobile Menu Button */}
          <motion.button whileTap={{
          scale: 0.9
        }} className="md:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }} className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${isActive(link.path) ? 'bg-white/20 text-white font-medium' : 'text-white/80 hover:bg-white/10'}`}>
                  {link.name}
                </Link>)}
            </div>
          </motion.div>}
      </AnimatePresence>
    </header>;
}