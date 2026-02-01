import React, { useState, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, CalendarIcon, CheckCircleIcon, HeartIcon, MessageCircleIcon } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { toast } from 'sonner';
interface RoommateCardProps {
  id: string;
  name: string;
  image?: string;
  budget: string;
  location: string;
  moveInDate: string;
  bio: string;
  tags: string[];
  verified?: boolean;
  age?: number;
  gender?: string;
  occupation?: string;
}
export function RoommateCard({
  id,
  name,
  image,
  budget,
  location,
  moveInDate,
  bio,
  tags,
  verified,
  age,
  gender,
  occupation
}: RoommateCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved profiles' : 'Added to saved profiles', {
      icon: isSaved ? '💔' : '❤️',
      duration: 2000
    });
  };
  const handleSendMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to messages with userId and userName params
    navigate(`/messages?userId=${id}&userName=${encodeURIComponent(name)}`);
    toast.success(`Opening chat with ${name}`, {
      duration: 2000
    });
  };
  return <Link to={`/roommate/${id}`}>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} whileHover={{
      y: -8,
      boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
    }} className="bg-white rounded-card shadow-card h-full flex flex-col overflow-hidden group cursor-pointer">
        <div className="p-6 flex-1 flex flex-col">
          {/* Header with Avatar and Save Button */}
          <div className="flex items-start gap-4 mb-4 relative">
            <div className="relative">
              {image ? <motion.img whileHover={{
              scale: 1.05
            }} src={image} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" /> : <div className="w-16 h-16 rounded-full bg-background-accent flex items-center justify-center text-primary font-bold text-xl border-2 border-white shadow-md">
                  {name.charAt(0)}
                </div>}
              {verified && <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: 0.3,
              type: 'spring'
            }} className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircleIcon className="w-5 h-5 text-blue-500 fill-white" />
                </motion.div>}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-primary truncate">
                {name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                {age && <span>{age} yrs</span>}
                {gender && <>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="capitalize">{gender}</span>
                  </>}
              </div>
              {occupation && <p className="text-xs text-gray-500 truncate">{occupation}</p>}
            </div>

            {/* Save Button */}
            <motion.button onClick={handleSaveToggle} whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-md">
              <AnimatePresence mode="wait">
                <motion.div key={isSaved ? 'saved' : 'unsaved'} initial={{
                scale: 0,
                rotate: -180
              }} animate={{
                scale: 1,
                rotate: 0
              }} exit={{
                scale: 0,
                rotate: 180
              }} transition={{
                duration: 0.3
              }}>
                  <HeartIcon className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span>Move in: {moveInDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span className="text-gray-400">Budget:</span>
              {budget}
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
            {bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 3).map((tag, index) => <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.1 + index * 0.05
          }}>
                <Badge variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              </motion.div>)}
            {tags.length > 3 && <Badge variant="outline" className="text-xs text-gray-500">
                +{tags.length - 3}
              </Badge>}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <motion.div whileHover={{
            scale: 1.03
          }} whileTap={{
            scale: 0.97
          }}>
              <Button fullWidth variant="secondary" onClick={handleSendMessage} className="gap-2 border-2 border-button-primary text-button-primary hover:bg-background-accent">
                <MessageCircleIcon className="w-4 h-4" />
                Message
              </Button>
            </motion.div>
            <motion.div whileHover={{
            scale: 1.03
          }} whileTap={{
            scale: 0.97
          }}>
              <Button fullWidth variant="primary" className="bg-button-primary hover:bg-[#3d9970] text-white border-0">
                View Profile
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Hover Shine Effect */}
        <motion.div className="absolute inset-0 pointer-events-none" initial={{
        x: '-100%',
        opacity: 0
      }} whileHover={{
        x: '100%',
        opacity: [0, 0.3, 0],
        transition: {
          duration: 0.6,
          ease: 'easeInOut'
        }
      }} style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
      }} />
      </motion.div>
    </Link>;
}