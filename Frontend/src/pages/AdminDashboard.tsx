import React, { useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, BuildingIcon, SettingsIcon, LogOutIcon, TrendingUpIcon, MessageCircleIcon, BellIcon, ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon, ChevronRightIcon, BarChart3Icon, Inbox } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { PieChart } from '../components/charts/PieChart';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { UserActionModal } from '../components/modals/UserActionModal';
import { UserManagementFilters } from '../components/UserManagementFilters';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
interface User {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'owner';
  avatar?: string;
  joinedDate: string;
  status: 'active' | 'pending';
}
const initialUsers: User[] = [{
  id: '1',
  name: 'Anita Thapa',
  email: 'anita@example.com',
  role: 'tenant',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
  joinedDate: '2024-01-15',
  status: 'active'
}, {
  id: '2',
  name: 'Rajesh Sharma',
  email: 'rajesh@example.com',
  role: 'owner',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  joinedDate: '2024-01-14',
  status: 'active'
}, {
  id: '3',
  name: 'Sita Gurung',
  email: 'sita@example.com',
  role: 'tenant',
  joinedDate: '2024-01-13',
  status: 'pending'
}, {
  id: '4',
  name: 'Krishna Adhikari',
  email: 'krishna@example.com',
  role: 'owner',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
  joinedDate: '2024-01-12',
  status: 'pending'
}, {
  id: '5',
  name: 'Maya Rai',
  email: 'maya@example.com',
  role: 'tenant',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
  joinedDate: '2024-01-11',
  status: 'active'
}];
const recentProperties = [{
  id: '1',
  title: 'Modern 2BHK Apartment',
  location: 'Thamel, Kathmandu',
  owner: 'Rajesh Sharma',
  status: 'verified',
  submittedDate: '2024-01-15'
}, {
  id: '2',
  title: 'Spacious 3BHK Flat',
  location: 'Bhaktapur',
  owner: 'Krishna Adhikari',
  status: 'pending',
  submittedDate: '2024-01-14'
}];
const notifications = [{
  id: '1',
  title: 'New Property Submission',
  message: 'A new property needs verification',
  time: '1 hour ago',
  type: 'warning'
}, {
  id: '2',
  title: 'User Report',
  message: 'A user has been reported for suspicious activity',
  time: '3 hours ago',
  type: 'error'
}, {
  id: '3',
  title: 'System Update',
  message: 'Platform maintenance scheduled for tonight',
  time: '5 hours ago',
  type: 'info'
}];
// Analytics Data
const userDistributionData = [{
  label: 'Tenants',
  value: 70,
  color: '#2F7D5F'
}, {
  label: 'Owners',
  value: 25,
  color: '#4A9B7F'
}, {
  label: 'Admins',
  value: 5,
  color: '#D7EDE4'
}];
const monthlySignupsData = [{
  label: 'Jan',
  value: 45,
  color: '#2F7D5F'
}, {
  label: 'Feb',
  value: 62,
  color: '#2F7D5F'
}, {
  label: 'Mar',
  value: 58,
  color: '#2F7D5F'
}, {
  label: 'Apr',
  value: 75,
  color: '#2F7D5F'
}, {
  label: 'May',
  value: 89,
  color: '#2F7D5F'
}, {
  label: 'Jun',
  value: 102,
  color: '#2F7D5F'
}];
const platformActivityData = [{
  label: 'Week 1',
  value: 1200
}, {
  label: 'Week 2',
  value: 1450
}, {
  label: 'Week 3',
  value: 1380
}, {
  label: 'Week 4',
  value: 1650
}];
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  // User Management State
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'tenant' | 'owner'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarItems = [{
    id: 'overview',
    label: 'Overview',
    icon: HomeIcon
  }, {
    id: 'users',
    label: 'Users',
    icon: UsersIcon
  }, {
    id: 'properties',
    label: 'Properties',
    icon: BuildingIcon
  }, {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3Icon
  }, {
    id: 'notifications',
    label: 'Notifications',
    icon: BellIcon
  }, {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon
  }];
  // Filter users based on filters and search
  const filteredUsers = users.filter(user => {
    const matchesStatus = statusFilter === 'all' || statusFilter === 'pending' && user.status === 'pending' || statusFilter === 'approved' && user.status === 'active';
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesSearch = !searchQuery || user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesRole && matchesSearch;
  });
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const handleAcceptUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      status: 'active' as const
    } : u));
    toast.success('User request accepted successfully!');
  };
  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('User deleted successfully');
  };
  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };
  const handleSettingsClick = () => {
    navigate('/profile');
  };
  // Skeleton Loader Component
  const UserSkeleton = () => <div className="p-4 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
    </div>;
  // Empty State Component
  const EmptyState = () => <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="py-16 text-center">
      <motion.div initial={{
      scale: 0
    }} animate={{
      scale: 1
    }} transition={{
      delay: 0.1,
      type: 'spring',
      stiffness: 200
    }} className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Inbox className="w-10 h-10 text-gray-400" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No users found
      </h3>
      <p className="text-gray-500 mb-6">
        Try adjusting your filters or search query
      </p>
      <Button variant="outline" onClick={() => {
      setStatusFilter('all');
      setRoleFilter('all');
      setSearchQuery('');
    }}>
        Clear Filters
      </Button>
    </motion.div>;
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">
              User Management
            </h2>

            {/* Filters */}
            <UserManagementFilters statusFilter={statusFilter} roleFilter={roleFilter} searchQuery={searchQuery} onStatusFilterChange={setStatusFilter} onRoleFilterChange={setRoleFilter} onSearchChange={setSearchQuery} />

            {/* User List */}
            <Card className="divide-y divide-gray-100 overflow-hidden">
              {isLoading ? <>
                  <UserSkeleton />
                  <UserSkeleton />
                  <UserSkeleton />
                </> : filteredUsers.length === 0 ? <EmptyState /> : <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user, index) => <motion.div key={user.id} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: 20
              }} transition={{
                delay: index * 0.05
              }} whileHover={{
                backgroundColor: 'rgba(215, 237, 228, 0.3)',
                scale: 1.01
              }} whileTap={{
                scale: 0.99
              }} onClick={() => handleUserClick(user)} className="p-4 flex items-center gap-4 cursor-pointer transition-all">
                      <motion.div whileHover={{
                  scale: 1.1
                }} transition={{
                  duration: 0.2
                }}>
                        <Avatar src={user.avatar} name={user.name} size="lg" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined: {user.joinedDate}
                        </p>
                      </div>
                      <Badge variant={user.role === 'owner' ? 'primary' : 'secondary'} className="capitalize">
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                        {user.status}
                      </Badge>
                      <motion.div whileHover={{
                  x: 5
                }} transition={{
                  duration: 0.2
                }}>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </motion.div>)}
                </AnimatePresence>}
            </Card>

            {/* User Action Modal */}
            <UserActionModal user={selectedUser} isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }} onAccept={handleAcceptUser} onDelete={handleDeleteUser} />
          </motion.div>;
      case 'properties':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h2 className="text-xl font-semibold text-primary mb-6">
              Property Management
            </h2>
            <Card className="divide-y divide-gray-100">
              {recentProperties.map(property => <motion.div key={property.id} whileHover={{
              backgroundColor: 'rgba(215, 237, 228, 0.3)'
            }} className="p-4 flex items-center gap-4 cursor-pointer transition-colors">
                  <div className="w-12 h-12 bg-background-accent rounded-lg flex items-center justify-center">
                    <BuildingIcon className="w-6 h-6 text-button-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500">{property.location}</p>
                    <p className="text-xs text-gray-400">
                      Owner: {property.owner}
                    </p>
                  </div>
                  <Badge variant={property.status === 'verified' ? 'success' : 'warning'}>
                    {property.status}
                  </Badge>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </motion.div>)}
            </Card>
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
              Platform Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <PieChart data={userDistributionData} title="User Distribution" size={180} />
              </Card>
              <Card className="p-6">
                <BarChart data={monthlySignupsData} title="Monthly Signups" />
              </Card>
            </div>
            <Card className="p-6">
              <LineChart data={platformActivityData} title="Platform Activity (Page Views)" height={250} />
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
              System Notifications
            </h2>
            <Card className="divide-y divide-gray-100">
              {notifications.map(notif => <motion.div key={notif.id} whileHover={{
              backgroundColor: 'rgba(215, 237, 228, 0.3)'
            }} className="p-4 flex items-start gap-4 cursor-pointer transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'error' ? 'bg-red-100' : notif.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    {notif.type === 'error' ? <AlertTriangleIcon className="w-5 h-5 text-red-600" /> : notif.type === 'warning' ? <AlertTriangleIcon className="w-5 h-5 text-yellow-600" /> : <BellIcon className="w-5 h-5 text-blue-600" />}
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
              icon: UsersIcon,
              value: '2,450',
              label: 'Total Users',
              delay: 0
            }, {
              icon: BuildingIcon,
              value: '856',
              label: 'Properties',
              delay: 0.1
            }, {
              icon: TrendingUpIcon,
              value: '12.5%',
              label: 'Growth Rate',
              delay: 0.2
            }, {
              icon: ShieldCheckIcon,
              value: '98.5%',
              label: 'Uptime',
              delay: 0.3
            }].map(stat => <motion.div key={stat.label} initial={{
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
                Platform Analytics
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <PieChart data={userDistributionData} title="User Distribution" size={180} />
                </Card>
                <Card className="p-6">
                  <BarChart data={monthlySignupsData} title="Monthly Signups" />
                </Card>
              </div>
              <div className="mt-6">
                <Card className="p-6">
                  <LineChart data={platformActivityData} title="Platform Activity" height={200} />
                </Card>
              </div>
            </motion.div>

            {/* Recent Users */}
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
                  Recent Users
                </h2>
                <button onClick={() => setActiveTab('users')} className="text-button-primary hover:underline text-sm">
                  View All
                </button>
              </div>
              <Card className="divide-y divide-gray-100">
                {users.slice(0, 3).map(user => <div key={user.id} className="p-4 flex items-center gap-4">
                    <Avatar src={user.avatar} name={user.name} size="md" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Badge variant={user.role === 'owner' ? 'primary' : 'secondary'} className="capitalize">
                      {user.role}
                    </Badge>
                  </div>)}
              </Card>
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
              <Avatar src={user?.avatar} name={user?.name || 'Admin'} size="lg" />
              <div>
                <h3 className="font-semibold text-primary">{user?.name}</h3>
                <p className="text-sm text-gray-500">Administrator</p>
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage platform and monitor activity
              </p>
            </div>
            <Button className="gap-2">
              <ShieldCheckIcon className="w-4 h-4" />
              System Status
            </Button>
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