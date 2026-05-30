
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPinIcon, BriefcaseIcon, CalendarIcon, ShieldCheckIcon, MessageCircleIcon, XIcon, MailIcon, PhoneIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from '../utils/toast'

interface RoommateCardProps {
  id: string
  name: string
  age: number
  gender?: string
  occupation?: string
  budget?: string
  location: string
  moveInDate?: string
  bio: string
  tags?: string[]
  verified?: boolean
  image?: string
  lookingForRoom?: boolean
  onMessage?: () => void
}

export function RoommateCard({
  id, name, age, gender, occupation, budget, location,
  moveInDate, bio, tags = [], verified = false, image, lookingForRoom = false, onMessage,
}: RoommateCardProps) {

  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (onMessage) { onMessage(); return }
    toast.info('Please log in to message roommates')
  }

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowProfileModal(true)
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all"
      >
        <div className="block">
          {/* Top: avatar + basic info */}
          <div className="flex items-start gap-4 p-5 pb-4">
            <div className="relative flex-shrink-0">
              {image ? (
                <img src={image} alt={name} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 bg-button-primary/10 rounded-xl flex items-center justify-center text-button-primary font-black text-xl">
                  {name.charAt(0)}
                </div>
              )}
              {/* Green dot for looking for room */}
              {lookingForRoom && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" title="Looking for room">
                  <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
                </div>
              )}
              {/* Verified badge */}
              {verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <ShieldCheckIcon className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{name}, {age}</h3>
                  <p className="text-xs text-gray-500">{gender} · {occupation}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {budget && (
                  <span className="text-xs font-semibold text-button-primary bg-button-primary/10 px-2 py-0.5 rounded-full">
                    {budget}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-5 pb-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <MapPinIcon className="w-3.5 h-3.5 text-button-primary flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            {moveInDate && (
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <CalendarIcon className="w-3.5 h-3.5 text-button-primary flex-shrink-0" />
                <span>Move-in: {moveInDate}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="px-5 pb-3">
            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{bio}</p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="px-5 pb-4 flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons — outside Link to prevent navigation */}
        <div className="px-5 pb-5 flex gap-2 border-t border-gray-50 pt-3">
          <button 
            onClick={handleViewProfile}
            className="flex-1 py-2 text-xs font-bold border-2 border-button-primary/30 text-button-primary rounded-xl hover:bg-button-primary/5 hover:border-button-primary transition-all">
            View Profile
          </button>
          {/* Message button — green if available, gray if not */}
          {lookingForRoom ? (
            <motion.button
              data-message-btn="true"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleMessage}
              className="flex-1 py-2 text-xs font-bold bg-button-primary text-white rounded-xl hover:bg-button-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageCircleIcon className="w-3.5 h-3.5" /> Message
            </motion.button>
          ) : (
            <button
              disabled
              className="flex-1 py-2 text-xs font-bold bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <MessageCircleIcon className="w-3.5 h-3.5" /> Unavailable
            </button>
          )}
        </div>
      </motion.div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Avatar and Name */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {image ? (
                      <img src={image} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-100" />
                    ) : (
                      <div className="w-24 h-24 bg-button-primary/10 rounded-full flex items-center justify-center text-button-primary font-black text-3xl border-4 border-gray-100">
                        {name.charAt(0)}
                      </div>
                    )}
                    {/* Green dot for looking for room */}
                    {lookingForRoom && (
                      <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse" title="Looking for room">
                        <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
                      </div>
                    )}
                    {/* Verified badge */}
                    {verified && (
                      <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                        <ShieldCheckIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}, {age}</h3>
                  <p className="text-sm text-gray-500 mb-2">{gender} · {occupation}</p>
                  {lookingForRoom && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Looking for Room
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Location */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPinIcon className="w-5 h-5 text-button-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Location</p>
                      <p className="text-sm font-medium text-gray-900">{location}</p>
                    </div>
                  </div>

                  {/* Occupation */}
                  {occupation && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <BriefcaseIcon className="w-5 h-5 text-button-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Occupation</p>
                        <p className="text-sm font-medium text-gray-900">{occupation}</p>
                      </div>
                    </div>
                  )}

                  {/* Move-in Date */}
                  {moveInDate && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <CalendarIcon className="w-5 h-5 text-button-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Move-in Date</p>
                        <p className="text-sm font-medium text-gray-900">{moveInDate}</p>
                      </div>
                    </div>
                  )}

                  {/* Budget */}
                  {budget && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-5 h-5 text-button-primary flex-shrink-0 mt-0.5 font-bold">₨</div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Budget</p>
                        <p className="text-sm font-medium text-gray-900">{budget}</p>
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">About</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{bio}</p>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <span key={tag} className="text-xs font-semibold px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  {lookingForRoom ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        setShowProfileModal(false)
                        handleMessage(e)
                      }}
                      className="w-full py-3 bg-button-primary text-white font-bold rounded-xl hover:bg-button-primary/90 transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <MessageCircleIcon className="w-5 h-5" />
                      Send Message
                    </motion.button>
                  ) : (
                    <div className="text-center">
                      <button
                        disabled
                        className="w-full py-3 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <MessageCircleIcon className="w-5 h-5" />
                        Unavailable
                      </button>
                      <p className="text-xs text-gray-500 mt-2">This user is not currently looking for a room</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
