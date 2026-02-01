import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Trash2, Mail, Calendar, Shield } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
interface User {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'owner';
  avatar?: string;
  joinedDate: string;
  status: 'active' | 'pending';
}
interface UserActionModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (userId: string) => void;
  onDelete: (userId: string) => void;
}
export function UserActionModal({
  user,
  isOpen,
  onClose,
  onAccept,
  onDelete
}: UserActionModalProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  if (!user) return null;
  const handleAccept = async () => {
    setIsAccepting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAccept(user.id);
    setIsAccepting(false);
    onClose();
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    onDelete(user.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    onClose();
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1]
        }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="relative p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-primary pr-8">
                  User Details
                </h2>
                <motion.button whileHover={{
              scale: 1.1,
              rotate: 90
            }} whileTap={{
              scale: 0.9
            }} transition={{
              duration: 0.2
            }} onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* User Profile Summary */}
              <div className="p-6 space-y-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-4">
                  <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} transition={{
                delay: 0.1,
                type: 'spring',
                stiffness: 200
              }}>
                    <Avatar src={user.avatar} name={user.name} size="xl" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 initial={{
                  opacity: 0,
                  x: -10
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: 0.15
                }} className="text-lg font-bold text-primary mb-1">
                      {user.name}
                    </motion.h3>
                    <motion.div initial={{
                  opacity: 0,
                  x: -10
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: 0.2
                }} className="flex items-center gap-2 mb-3">
                      <Badge variant={user.role === 'owner' ? 'primary' : 'secondary'} className="capitalize">
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                        {user.status}
                      </Badge>
                    </motion.div>
                  </div>
                </div>

                {/* Details */}
                <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.25
            }} className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Joined Date</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(user.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Status</p>
                      <p className="text-gray-900 font-medium capitalize">
                        {user.status === 'pending' ? 'Pending Approval' : 'Active & Verified'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Delete Confirmation */}
                <AnimatePresence>
                  {showDeleteConfirm && <motion.div initial={{
                opacity: 0,
                height: 0
              }} animate={{
                opacity: 1,
                height: 'auto'
              }} exit={{
                opacity: 0,
                height: 0
              }} className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-800 font-medium mb-3">
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleDelete} isLoading={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700">
                          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </div>

              {/* Actions */}
              {!showDeleteConfirm && <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                  {user.status === 'pending' && <motion.div whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className="flex-1">
                      <Button fullWidth onClick={handleAccept} isLoading={isAccepting} className="bg-green-600 hover:bg-green-700 gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {isAccepting ? 'Accepting...' : 'Accept Request'}
                      </Button>
                    </motion.div>}
                  <motion.div whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className={user.status === 'pending' ? 'flex-1' : 'w-full'}>
                    <Button fullWidth variant="outline" onClick={() => setShowDeleteConfirm(true)} className="border-red-200 text-red-600 hover:bg-red-50 gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </Button>
                  </motion.div>
                </motion.div>}
            </motion.div>
          </div>
        </>}
    </AnimatePresence>;
}