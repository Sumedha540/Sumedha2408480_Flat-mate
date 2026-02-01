import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareIcon, XIcon } from 'lucide-react';
interface ChatbotIconProps {
  isOpen?: boolean;
  onClick?: () => void;
}
export function ChatbotIcon({
  isOpen,
  onClick
}: ChatbotIconProps) {
  return <motion.button initial={{
    scale: 0
  }} animate={{
    scale: 1
  }} whileHover={{
    scale: 1.05
  }} whileTap={{
    scale: 0.95
  }} onClick={onClick} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-hover transition-colors" aria-label="Toggle Chatbot">
      {isOpen ? <XIcon className="w-6 h-6" /> : <MessageSquareIcon className="w-6 h-6" />}
    </motion.button>;
}