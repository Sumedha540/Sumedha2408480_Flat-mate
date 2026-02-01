import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, HeartIcon, MessageCircleIcon, CalendarIcon, BellIcon, SettingsIcon, LogOutIcon, SearchIcon, ChevronRightIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { PropertyCard } from '../components/PropertyCard';
import { PieChart } from '../components/charts/PieChart';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
const savedProperties = [{
  id: '1',
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
  title: 'Modern 2BHK Apartment',
  location: 'Thamel, Kathmandu',
  rent: 25000,
  bedrooms: 2,
  bathrooms: 1,
  isFavorite: true
}, {
  id: '2',
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
  title: 'Cozy Studio Room',
  location: 'Patan, Lalitpur',
  rent: 12000,
  bedrooms: 1,
  bathrooms: 1,
  isFavorite: true
}, {
  id: '3',
  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  title: 'Spacious 3BHK Flat',
  location: 'Bhaktapur',
  rent: 35000,
  bedrooms: 3,
  bathrooms: 2,
  isFavorite: true
}];
const bookings = [{
  id: '1',
  property: 'Modern 2BHK Apartment',
  location: 'Thamel, Kathmandu',
  date: '2024-01-15',
  status: 'approved' as const,
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop',
  ownerName: 'Ram Bahadur Thapa'
}, {
  id: '2',
  property: 'Spacious 3BHK Flat',
  location: 'Bhaktapur',
  date: '2024-01-18',
  status: 'submitted' as const,
  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop',
  ownerName: 'Krishna Prasad Adhikari'
}, {
  id: '3',
  property: 'Cozy Studio Room',
  location: 'Patan, Lalitpur',
  date: '2024-01-20',
  status: 'rejected' as const,
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop',
  ownerName: 'Sita Devi Shrestha'
}];
const messages = [{
  id: '1',
  name: 'Rajesh Sharma',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  message: 'The apartment is available for viewing tomorrow.',
  time: '2 hours ago',
  unread: true
}, {
  id: '2',
  name: 'Sita Gurung',
  message: 'Thank you for your interest!',
  time: '1 day ago',
  unread: false
}, {
  id: '3',
  name: 'Krishna Thapa',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
  message: 'Please let me know your preferred time for the visit.',
  time: '2 days ago',
  unread: false
}];
const notifications = [{
  id: '1',
  title: 'Booking Approved',
  message: 'Your booking for Modern 2BHK Apartment has been approved!',
  time: '1 hour ago',
  type: 'success'
}, {
  id: '2',
  title: 'New Property Match',
  message: 'A new property matching your preferences is available.',
  time: '3 hours ago',
  type: 'info'
}, {
  id: '3',
  title: 'Price Drop Alert',
  message: 'A property in your favorites has reduced its rent.',
  time: '1 day ago',
  type: 'warning'
}];
// Analytics data
const propertyTypeData = [{
  label: 'Rooms',
  value: 40,
  color: '#2F7D5F'
}, {
  label: '1BHK',
  value: 30,
  color: '#4A9B7F'
}, {
  label: '2BHK',
  value: 20,
  color: '#6BB89F'
}, {
  label: '3BHK+',
  value: 10,
  color: '#D7EDE4'
}];
const monthlySearchData = [{
  label: 'Jan',
  value: 12
}, {
  label: 'Feb',
  value: 19
}, {
  label: 'Mar',
  value: 15
}, {
  label: 'Apr',
  value: 25
}, {
  label: 'May',
  value: 22
}, {
  label: 'Jun',
  value: 30
}];
const savedPropertiesOverTime = [{
  label: 'Week 1',
  value: 2
}, {
  label: 'Week 2',
  value: 5
}, {
  label: 'Week 3',
  value: 8
}, {
  label: 'Week 4',
  value: 12
}];
export function TenantDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const sidebarItems = [{
    id: 'overview',
    label: 'Overview',
    icon: HomeIcon
  }, {
    id: 'saved',
    label: 'Saved Properties',
    icon: HeartIcon
  }, {
    id: 'bookings',
    label: 'My Bookings',
    icon: CalendarIcon
  }, {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircleIcon
  }, {
    id: 'notifications',
    label: 'Notifications',
    icon: BellIcon
  }, {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon
  }];
  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };
  const handleSettingsClick = () => {
    navigate('/profile');
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'saved':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">
              Saved Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map(property => <PropertyCard key={property.id} {...property} />)}
            </div>
          </motion.div>;
      case 'bookings':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">
              My Bookings
            </h2>
            <Card className="divide-y divide-gray-100">
              {bookings.map(booking => <motion.div key={booking.id} whileHover={{
              backgroundColor: 'rgba(215, 237, 228, 0.3)'
            }} className="p-4 flex items-center gap-4 cursor-pointer transition-colors">
                  <img src={booking.image} alt={booking.property} className="w-20 h-20 rounded-button object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">
                      {booking.property}
                    </h3>
                    <p className="text-sm text-gray-500">{booking.location}</p>
                    <p className="text-xs text-gray-400">
                      Owner: {booking.ownerName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Visit: {booking.date}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </motion.div>)}
            </Card>
          </motion.div>;
      case 'messages':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">
              Messages
            </h2>
            <Card className="divide-y divide-gray-100">
              {messages.map(msg => <motion.div key={msg.id} whileHover={{
              backgroundColor: 'rgba(215, 237, 228, 0.3)'
            }} className="p-4 flex items-center gap-4 cursor-pointer transition-colors" onClick={() => navigate('/messages')}>
                  <Avatar src={msg.avatar} name={msg.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-primary">{msg.name}</h3>
                      {msg.unread && <span className="w-2 h-2 bg-button-primary rounded-full" />}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{msg.time}</span>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>)}
            </Card>
          </motion.div>;
      case 'notifications':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">
              Notifications
            </h2>
            <Card className="divide-y divide-gray-100">
              {notifications.map(notif => <motion.div key={notif.id} whileHover={{
              backgroundColor: 'rgba(215, 237, 228, 0.3)'
            }} className="p-4 flex items-start gap-4 cursor-pointer transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'success' ? 'bg-green-100' : notif.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    {notif.type === 'success' ? <CheckCircleIcon className="w-5 h-5 text-green-600" /> : notif.type === 'warning' ? <ClockIcon className="w-5 h-5 text-yellow-600" /> : <BellIcon className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">
                      {notif.title}
                    </h3>
                    <p className="text-sm text-gray-500">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                </motion.div>)}
            </Card>
          </motion.div>;
      default:
        return <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[{
              icon: HeartIcon,
              value: savedProperties.length,
              label: 'Saved Properties',
              delay: 0
            }, {
              icon: CalendarIcon,
              value: bookings.length,
              label: 'Active Bookings',
              delay: 0.1
            }, {
              icon: MessageCircleIcon,
              value: messages.filter(m => m.unread).length,
              label: 'Unread Messages',
              delay: 0.2
            }, {
              icon: SearchIcon,
              value: 12,
              label: 'Properties Viewed',
              delay: 0.3
            }].map((stat, index) => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: stat.delay
            }} whileHover={{
              y: -5,
              transition: {
                duration: 0.2
              }
            }}>
                  <Card className="p-6 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-background-accent rounded-full flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-button-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>)}
            </div>

            {/* Analytics Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="mb-8">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Activity Overview
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <PieChart data={propertyTypeData} title="Property Types Searched" size={180} />
                </Card>
                <Card className="p-6">
                  <BarChart data={monthlySearchData.map(d => ({
                  ...d,
                  color: '#2F7D5F'
                }))} title="Monthly Searches" />
                </Card>
              </div>
              <div className="mt-6">
                <Card className="p-6">
                  <LineChart data={savedPropertiesOverTime} title="Saved Properties Over Time" height={200} />
                </Card>
              </div>
            </motion.div>

            {/* Bookings Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">
                  Recent Bookings
                </h2>
                <button onClick={() => setActiveTab('bookings')} className="text-button-primary hover:underline text-sm">
                  View All
                </button>
              </div>
              <Card className="divide-y divide-gray-100">
                {bookings.slice(0, 2).map(booking => <div key={booking.id} className="p-4 flex items-center gap-4">
                    <img src={booking.image} alt={booking.property} className="w-16 h-16 rounded-button object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">
                        {booking.property}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {booking.location}
                      </p>
                      <p className="text-xs text-gray-400">
                        Visit: {booking.date}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>)}
              </Card>
            </motion.div>

            {/* Saved Properties */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">
                  Saved Properties
                </h2>
                <button onClick={() => setActiveTab('saved')} className="text-button-primary hover:underline text-sm">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedProperties.slice(0, 2).map(property => <PropertyCard key={property.id} {...property} />)}
              </div>
            </motion.div>
          </>;
    }
  };
  return <main className="min-h-screen bg-background-light">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 min-h-screen sticky top-0 hidden lg:block">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">FM</span>
              </div>
              <span className="text-primary font-bold text-xl">Flat-Mate</span>
            </Link>

            <div className="flex items-center gap-3 mb-8 p-3 bg-background-light rounded-xl">
              <Avatar src={user?.avatar} name={user?.name || 'User'} size="lg" />
              <div>
                <h3 className="font-semibold text-primary">{user?.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map(item => {
              const Icon = item.icon;
              return <motion.button key={item.id} onClick={() => item.id === 'settings' ? handleSettingsClick() : setActiveTab(item.id)} whileHover={{
                x: 4
              }} whileTap={{
                scale: 0.98
              }} className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-button transition-colors
                      ${activeTab === item.id ? 'bg-background-accent text-button-primary font-medium' : 'text-gray-600 hover:bg-background-light'}
                    `}>
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {item.id === 'messages' && messages.filter(m => m.unread).length > 0 && <span className="ml-auto w-5 h-5 bg-button-primary text-white text-xs rounded-full flex items-center justify-center">
                          {messages.filter(m => m.unread).length}
                        </span>}
                  </motion.button>;
            })}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <motion.button onClick={handleSignOut} whileHover={{
              x: 4
            }} whileTap={{
              scale: 0.98
            }} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-button transition-colors">
                <LogOutIcon className="w-5 h-5" />
                Sign Out
              </motion.button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your rentals
              </p>
            </div>
            <Link to="/properties">
              <Button className="gap-2">
                <SearchIcon className="w-4 h-4" />
                Find Properties
              </Button>
            </Link>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {sidebarItems.map(item => {
              const Icon = item.icon;
              return <button key={item.id} onClick={() => item.id === 'settings' ? handleSettingsClick() : setActiveTab(item.id)} className={`
                      flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors
                      ${activeTab === item.id ? 'bg-button-primary text-white' : 'bg-white text-gray-600'}
                    `}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>;
            })}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} transition={{
            duration: 0.2
          }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>;
}