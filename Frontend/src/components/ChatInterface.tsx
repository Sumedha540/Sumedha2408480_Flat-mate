import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, BotIcon, XIcon, MinimizeIcon } from 'lucide-react';
import { ChatbotIcon } from './ChatbotIcon';
import { generateOwnerResponse, simulateTypingDelay } from '../utils/chatbot';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
const suggestedMessages = ['Where can I find properties?', 'How do I find a roommate?', 'Show me popular rentals.', 'What is the average rent in Kathmandu?', 'Help me post my property.'];
export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Hi! I'm your Flat-Mate assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsTyping(true);
    // Simulate AI response
    const delay = simulateTypingDelay(text.length);
    setTimeout(() => {
      const response = generateOwnerResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  };
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };
  return <>
      <ChatbotIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        height: isMinimized ? '60px' : '600px'
      }} exit={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} transition={{
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }} className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            {/* Header */}
            <motion.div className="bg-gradient-to-r from-primary to-[#3d9970] p-4 flex items-center justify-between text-white cursor-pointer" onClick={() => setIsMinimized(!isMinimized)} whileHover={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
              <div className="flex items-center gap-3">
                <motion.div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center" animate={{
              rotate: isTyping ? 360 : 0
            }} transition={{
              duration: 2,
              repeat: isTyping ? Infinity : 0,
              ease: 'linear'
            }}>
                  <BotIcon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-bold">Flat-Mate Assistant</h3>
                  <motion.p className="text-xs text-white/80" animate={{
                opacity: [0.6, 1, 0.6]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }}>
                    {isTyping ? 'Typing...' : 'Online • Replies instantly'}
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{
              scale: 1.1,
              backgroundColor: 'rgba(255,255,255,0.2)'
            }} whileTap={{
              scale: 0.9
            }} onClick={e => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }} className="p-2 rounded-full transition-colors">
                  <MinimizeIcon className="w-5 h-5" />
                </motion.button>
                <motion.button whileHover={{
              scale: 1.1,
              backgroundColor: 'rgba(255,255,255,0.2)'
            }} whileTap={{
              scale: 0.9
            }} onClick={e => {
              e.stopPropagation();
              setIsOpen(false);
            }} className="p-2 rounded-full transition-colors">
                  <XIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {!isMinimized && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} transition={{
            duration: 0.3
          }} className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    <AnimatePresence initial={false}>
                      {messages.map((msg, index) => <motion.div key={msg.id} initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.8
                }} animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  scale: 0.8
                }} transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 200
                }} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <motion.div whileHover={{
                    scale: 1.02
                  }} className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm rounded-bl-none'}`}>
                            <p className="text-sm leading-relaxed">
                              {msg.text}
                            </p>
                            <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                              {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                            </p>
                          </motion.div>
                        </motion.div>)}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} className="flex justify-start">
                          <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                            {[0, 1, 2].map(i => <motion.span key={i} className="w-2 h-2 bg-gray-400 rounded-full" animate={{
                      y: [0, -8, 0]
                    }} transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15
                    }} />)}
                          </div>
                        </motion.div>}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && messages.length <= 1 && <motion.div initial={{
                opacity: 0,
                height: 0
              }} animate={{
                opacity: 1,
                height: 'auto'
              }} exit={{
                opacity: 0,
                height: 0
              }} className="px-4 pt-4 bg-white border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">
                          Quick suggestions:
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {suggestedMessages.map((msg, idx) => <motion.button key={idx} initial={{
                    opacity: 0,
                    scale: 0.8
                  }} animate={{
                    opacity: 1,
                    scale: 1
                  }} transition={{
                    delay: idx * 0.1
                  }} whileHover={{
                    scale: 1.05,
                    backgroundColor: '#2F7D5F',
                    color: '#ffffff'
                  }} whileTap={{
                    scale: 0.95
                  }} onClick={() => handleSuggestionClick(msg)} className="px-3 py-1.5 bg-gray-100 text-xs text-gray-700 rounded-full transition-all">
                              {msg}
                            </motion.button>)}
                        </div>
                      </motion.div>}
                  </AnimatePresence>

                  {/* Input */}
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                      <motion.input ref={inputRef} type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage(inputValue)} placeholder="Type your message..." className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" whileFocus={{
                  scale: 1.02
                }} />
                      <motion.button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim()} whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }} className="p-2.5 bg-primary text-white rounded-full hover:bg-[#3d9970] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <SendIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>}
            </AnimatePresence>
          </motion.div>}
      </AnimatePresence>
    </>;
}