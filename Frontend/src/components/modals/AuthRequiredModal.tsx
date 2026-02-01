import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, LockIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}
export function AuthRequiredModal({
  isOpen,
  onClose,
  onLoginClick,
  onSignupClick
}: AuthRequiredModalProps) {
  return <AnimatePresence>
      {isOpen && <>
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
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
      }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 z-50 text-center">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <XIcon className="w-5 h-5 text-gray-500" />
            </button>

            <div className="w-16 h-16 bg-background-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <LockIcon className="w-8 h-8 text-button-primary" />
            </div>

            <h2 className="text-2xl font-bold text-primary mb-2">
              Login Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in or create an account to view all properties and
              access premium features.
            </p>

            <div className="space-y-3">
              <Button onClick={onLoginClick} fullWidth>
                Log In
              </Button>
              <Button onClick={onSignupClick} variant="outline" fullWidth>
                Sign Up
              </Button>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}