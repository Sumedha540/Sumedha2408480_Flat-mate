import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, XIcon, CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
  link?: string;
}
const mockNotifications: Notification[] = [{
  id: '1',
  title: 'New Property Match',
  message: 'A new 2BHK apartment in Thamel matches your preferences',
  time: '5 min ago',
  read: false,
  type: 'info',
  link: '/properties'
}, {
  id: '2',
  title: 'Booking Confirmed',
  message: 'Your property viewing is scheduled for tomorrow at 2 PM',
  time: '1 hour ago',
  read: false,
  type: 'success'
}, {
  id: '3',
  title: 'Price Drop Alert',
  message: 'Property in Lalitpur reduced by रू 5,000',
  time: '3 hours ago',
  read: true,
  type: 'warning',
  link: '/properties'
}];
export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? {
      ...n,
      read: true
    } : n));
  };
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({
      ...n,
      read: true
    })));
  };
  const clearNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  return <div className="relative">
      <motion.button whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Notifications">
        <BellIcon className="w-5 h-5 text-gray-900 stroke-[1.5]" />
        {unreadCount > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div initial={{
          opacity: 0,
          y: 10,
          scale: 0.95
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} exit={{
          opacity: 0,
          y: 10,
          scale: 0.95
        }} className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-40 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-button-primary hover:underline">
                    Mark all as read
                  </button>}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? <div className="p-8 text-center text-gray-500">
                    <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No notifications</p>
                  </div> : notifications.map(notification => <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-sm text-gray-900">
                              {notification.title}
                            </h4>
                            <button onClick={() => clearNotification(notification.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                            <div className="flex items-center gap-2">
                              {!notification.read && <button onClick={() => markAsRead(notification.id)} className="text-xs text-button-primary hover:underline">
                                  Mark as read
                                </button>}
                              {notification.link && <Link to={notification.link} onClick={() => setIsOpen(false)} className="text-xs text-button-primary hover:underline">
                                  View
                                </Link>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>)}
              </div>

              {/* Footer */}
              {notifications.length > 0 && <div className="p-3 border-t border-gray-100 text-center">
                  <Link to="/notifications" onClick={() => setIsOpen(false)} className="text-sm text-button-primary hover:underline">
                    View all notifications
                  </Link>
                </div>}
            </motion.div>
          </>}
      </AnimatePresence>
    </div>;
}