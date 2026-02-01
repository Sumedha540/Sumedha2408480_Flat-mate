import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, PlusIcon, DollarSignIcon, UsersIcon, SettingsIcon, LogOutIcon, TrendingUpIcon, MessageCircleIcon, BellIcon, ChevronRightIcon, CheckCircleIcon, EyeIcon, HeartIcon, CalendarIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { PropertyCard } from '../components/PropertyCard';
import { PieChart } from '../components/charts/PieChart';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { Heatmap } from '../components/charts/Heatmap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
const myProperties = [{
  id: '1',
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
  title: 'Modern 2BHK Apartment',
  location: 'Thamel, Kathmandu',
  rent: 25000,
  bedrooms: 2,
  bathrooms: 1,
  views: 245,
  status: 'verified' as const,
  inquiries: 12,
  saved: 8
}, {
  id: '2',
  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  title: 'Spacious 3BHK Flat',
  location: 'Bhaktapur',
  rent: 35000,
  bedrooms: 3,
  bathrooms: 2,
  views: 312,
  status: 'active' as const,
  inquiries: 18,
  saved: 15
}, {
  id: '3',
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
  title: 'Cozy Studio Room',
  location: 'Patan, Lalitpur',
  rent: 12000,
  bedrooms: 1,
  bathrooms: 1,
  views: 189,
  status: 'pending' as const,
  inquiries: 5,
  saved: 3
}];
const tenants = [{
  id: '1',
  name: 'Anita Thapa',
  property: 'Modern 2BHK Apartment',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
  rentDue: '2024-02-01',
  status: 'paid'
}, {
  id: '2',
  name: 'Bikash Shrestha',
  property: 'Family Apartment',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  rentDue: '2024-02-05',
  status: 'pending'
}];
const messages = [{
  id: '1',
  name: 'Anita Thapa',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
  message: 'Thank you for the quick response!',
  time: '1 hour ago',
  unread: true
}, {
  id: '2',
  name: 'Potential Tenant',
  message: 'Is the 3BHK still available?',
  time: '3 hours ago',
  unread: true
}];
const notifications = [{
  id: '1',
  title: 'Rent Received',
  message: 'Anita Thapa paid rent for Modern 2BHK Apartment',
  time: '2 hours ago',
  type: 'success'
}, {
  id: '2',
  title: 'New Inquiry',
  message: 'Someone is interested in your Spacious 3BHK Flat',
  time: '5 hours ago',
  type: 'info'
}];
// Analytics Data
const occupancyData = [{
  label: 'Occupied',
  value: 60,
  color: '#2F7D5F'
}, {
  label: 'Vacant',
  value: 25,
  color: '#D7EDE4'
}, {
  label: 'Maintenance',
  value: 15,
  color: '#F59E0B'
}];
const revenueData = [{
  label: 'Jan',
  value: 180000,
  color: '#2F7D5F'
}, {
  label: 'Feb',
  value: 200000,
  color: '#2F7D5F'
}, {
  label: 'Mar',
  value: 195000,
  color: '#2F7D5F'
}, {
  label: 'Apr',
  value: 220000,
  color: '#2F7D5F'
}, {
  label: 'May',
  value: 235000,
  color: '#2F7D5F'
}, {
  label: 'Jun',
  value: 250000,
  color: '#2F7D5F'
}];
const inquiriesData = [{
  label: 'Week 1',
  value: 12
}, {
  label: 'Week 2',
  value: 18
}, {
  label: 'Week 3',
  value: 15
}, {
  label: 'Week 4',
  value: 25
}];
const viewsOverTimeData = [{
  label: 'Mon',
  value: 45
}, {
  label: 'Tue',
  value: 52
}, {
  label: 'Wed',
  value: 38
}, {
  label: 'Thu',
  value: 65
}, {
  label: 'Fri',
  value: 72
}, {
  label: 'Sat',
  value: 58
}, {
  label: 'Sun',
  value: 48
}];
export function OwnerDashboard() {
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
    id: 'properties',
    label: 'My Properties',
    icon: HomeIcon
  }, {
    id: 'tenants',
    label: 'Tenants',
    icon: UsersIcon
  }, {
    id: 'analytics',
    label: 'Analytics',
    icon: TrendingUpIcon
  }, {
    id: 'revenue',
    label: 'Revenue',
    icon: DollarSignIcon
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
  const handlePostProperty = () => {
    navigate('/post-property');
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">
                My Properties
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map(property => <div key={property.id} className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant={property.status === 'verified' ? 'success' : property.status === 'active' ? 'primary' : 'warning'}>
                      {property.status}
                    </Badge>
                  </div>
                  <PropertyCard {...property} />
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2 rounded-lg text-center">
                      <EyeIcon className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                      <p className="font-semibold">{property.views}</p>
                      <p className="text-gray-500">Views</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <MessageCircleIcon className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                      <p className="font-semibold">{property.inquiries}</p>
                      <p className="text-gray-500">Inquiries</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg text-center">
                      <HeartIcon className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                      <p className="font-semibold">{property.saved}</p>
                      <p className="text-gray-500">Saved</p>
                    </div>
                  </div>
                </div>)}
            </div>
          </motion.div>;
      case 'analytics':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">
              Analytics Dashboard
            </h2>

            {/* Stats Grid - Fixed Equal Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[{
              icon: EyeIcon,
              value: '1,245',
              label: 'Total Views'
            }, {
              icon: MessageCircleIcon,
              value: '35',
              label: 'Inquiries'
            }, {
              icon: HeartIcon,
              value: '26',
              label: 'Saved'
            }, {
              icon: CalendarIcon,
              value: '3',
              label: 'Bookings'
            }].map((stat, index) => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }} whileHover={{
              y: -5
            }} className="h-full">
                  <Card className="p-6 h-full flex items-center">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-background-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <stat.icon className="w-6 h-6 text-button-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold text-primary truncate">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>)}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <PieChart data={occupancyData} title="Property Status" size={200} />
              </Card>
              <Card className="p-6">
                <BarChart data={revenueData} title="Monthly Revenue (NPR)" />
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <LineChart data={viewsOverTimeData} title="Views This Week" height={250} />
              </Card>
              <Card className="p-6">
                <LineChart data={inquiriesData} title="Inquiries This Month" height={250} />
              </Card>
            </div>

            <div className="mt-6">
              <Card className="p-6">
                <Heatmap data={[[5, 12, 8, 15, 20, 18, 10], [8, 15, 12, 18, 22, 20, 14], [10, 18, 15, 22, 28, 25, 16], [7, 14, 10, 16, 24, 22, 12]]} title="Property Performance Heatmap" xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} yLabels={['Week 1', 'Week 2', 'Week 3', 'Week 4']} />
              </Card>
            </div>
          </motion.div>;
      case 'revenue':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">
              Revenue Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <BarChart data={revenueData} title="Monthly Revenue (NPR)" />
              </Card>
              <Card className="p-6">
                <PieChart data={occupancyData} title="Revenue Distribution" size={200} />
              </Card>
            </div>
            <Card className="p-6">
              <LineChart data={revenueData.map(item => ({
              label: item.label,
              value: item.value
            }))} title="Revenue Trend" height={300} />
            </Card>
          </motion.div>;
      case 'tenants':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">Tenants</h2>
            <Card className="divide-y divide-gray-100">
              {tenants.map(tenant => <motion.div key={tenant.id} whileHover={{
              backgroundColor: 'rgba(215, 237, 228, 0.3)'
            }} className="p-4 flex items-center gap-4 cursor-pointer transition-colors">
                  <Avatar src={tenant.avatar} name={tenant.name} size="lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">
                      {tenant.name}
                    </h3>
                    <p className="text-sm text-gray-500">{tenant.property}</p>
                    <p className="text-xs text-gray-400">
                      Rent due: {tenant.rentDue}
                    </p>
                  </div>
                  <Badge variant={tenant.status === 'paid' ? 'success' : 'warning'}>
                    {tenant.status === 'paid' ? 'Paid' : 'Pending'}
                  </Badge>
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {notif.type === 'success' ? <CheckCircleIcon className="w-5 h-5 text-green-600" /> : <BellIcon className="w-5 h-5 text-blue-600" />}
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
            {/* Stats Cards - Fixed Equal Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[{
              icon: HomeIcon,
              value: '11',
              label: 'Total Properties'
            }, {
              icon: DollarSignIcon,
              value: 'रू 250K',
              label: 'Monthly Revenue'
            }, {
              icon: UsersIcon,
              value: '8',
              label: 'Active Tenants'
            }, {
              icon: TrendingUpIcon,
              value: '73%',
              label: 'Occupancy Rate'
            }].map((stat, index) => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }} whileHover={{
              y: -5
            }} className="h-full">
                  <Card className="p-6 h-full flex items-center cursor-pointer">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-background-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <stat.icon className="w-6 h-6 text-button-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold text-primary truncate">
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
                Analytics Overview
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <PieChart data={occupancyData} title="Property Occupancy" size={180} />
                </Card>
                <Card className="p-6">
                  <BarChart data={revenueData} title="Monthly Revenue (NPR)" />
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="p-6">
                  <LineChart data={viewsOverTimeData} title="Views This Week" height={200} />
                </Card>
                <Card className="p-6">
                  <LineChart data={inquiriesData} title="Inquiries This Month" height={200} />
                </Card>
              </div>
            </motion.div>

            {/* My Properties */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">
                  My Properties
                </h2>
                <button onClick={() => setActiveTab('properties')} className="text-button-primary hover:underline text-sm">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {myProperties.slice(0, 2).map(property => <PropertyCard key={property.id} {...property} />)}
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
                <p className="text-sm text-gray-500">Property Owner</p>
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
                    <Icon className="w-5 h-5 stroke-[1.5]" />
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
                Manage your properties and track performance
              </p>
            </div>
            {activeTab === 'overview' && <Button className="gap-2" onClick={handlePostProperty}>
                <PlusIcon className="w-4 h-4" />
                Add Property
              </Button>}
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