// src/components/ReviewSubmissionForm.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  StarIcon, UserIcon, MailIcon, MessageSquareIcon,
  SendIcon, AlertTriangleIcon, CheckCircleIcon, XIcon,
  QuoteIcon, ThumbsUpIcon, SparklesIcon,
} from 'lucide-react'
import { toast } from 'sonner'

const BANNED_WORDS = [
  'stupid','idiot',
  'worst','terrible','awful','horrible','disgusting','hate','kill',
  'abuse','abusive','racist','loser','dumb','useless','garbage',
  'trash','pathetic','moron','imbecile','crap','shit','damn',
  'hell','ass','bastard','bitch','fuck','bloody',
]

function containsHateSpeech(text: string): string[] {
  return BANNED_WORDS.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(text))
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
const RATING_COLORS = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-lime-500', 'text-green-500']

function HateSpeechAlert({ words, onClose }: { words: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full z-10 overflow-hidden"
      >
        {/* decorative red top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-orange-400 rounded-t-3xl" />
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <XIcon className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex flex-col items-center text-center pt-2">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
            className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-5"
          >
            <AlertTriangleIcon className="w-9 h-9 text-red-500" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Review Blocked</h3>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            Your review contains language that violates our community guidelines. Please keep feedback respectful.
          </p>
          <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-3 mb-6 w-full text-left">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1.5">Flagged words</p>
            <div className="flex flex-wrap gap-1.5">
              {words.map(w => (
                <span key={w} className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{w}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors">
            Edit My Review
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function ReviewSubmissionForm() {
  const [form, setForm] = useState({ name: '', email: '', comment: '', rating: 0 })
  const [hover, setHover] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hateSpeechWords, setHateSpeechWords] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const activeRating = hover || form.rating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.rating === 0) { toast.error('Please select a star rating'); return }
    if (!form.name.trim()) { toast.error('Please enter your name'); return }
    if (!form.email.trim()) { toast.error('Please enter your email'); return }
    if (!form.comment.trim()) { toast.error('Please write your review'); return }

    const flagged = containsHateSpeech(form.comment + ' ' + form.name)
    if (flagged.length > 0) { setHateSpeechWords(flagged); return }

    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim().toLowerCase(), comment: form.comment.trim(), rating: form.rating }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
        setForm({ name: '', email: '', comment: '', rating: 0 })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        toast.error(data.message || 'Failed to submit review')
      }
    } catch { toast.error('Server error. Please try again.') }
    finally { setIsLoading(false) }
  }

  return (
    <>
      <AnimatePresence>{hateSpeechWords.length > 0 && <HateSpeechAlert words={hateSpeechWords} onClose={() => setHateSpeechWords([])} />}</AnimatePresence>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-14 text-center"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 240, delay: 0.1 }} className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="text-3xl font-bold text-white mb-3">Thank You! 🎉</h3>
              <p className="text-white/80 text-lg">Your review has been submitted and will help others find their perfect home.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center gap-1 mt-6">
              {[1,2,3,4,5].map(s => (
                <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + s * 0.07 }}>
                  <StarIcon className="w-7 h-7 fill-yellow-300 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="relative"
          >
            {/* Decorative quote icon */}
            <div className="absolute -top-5 -left-3 w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 z-10 hidden md:flex">
              <QuoteIcon className="w-5 h-5 text-white/70" />
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-yellow-300 via-white/60 to-yellow-300" />

              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-3 border border-white/20">
                      <SparklesIcon className="w-3.5 h-3.5 text-yellow-300" />
                      <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Share Your Story</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">How was your experience?</h3>
                    <p className="text-white/60 text-sm mt-1">Your honest review helps thousands find their home</p>
                  </div>
                  <div className="hidden md:flex flex-col items-center bg-white/10 rounded-2xl px-4 py-3 border border-white/15">
                    <ThumbsUpIcon className="w-5 h-5 text-white/80 mb-1" />
                    <span className="text-white font-bold text-lg leading-none">1K+</span>
                    <span className="text-white/50 text-xs">Reviews</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Star Rating — prominent */}
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                    <p className="text-white/80 text-sm font-medium mb-3">Rate your overall experience</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                          <motion.button
                            key={star} type="button"
                            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setForm({ ...form, rating: star })}
                          >
                            <StarIcon className={`w-9 h-9 transition-all duration-150 drop-shadow-sm ${star <= activeRating ? 'fill-yellow-300 text-yellow-300 scale-110' : 'text-white/30'}`} />
                          </motion.button>
                        ))}
                      </div>
                      <AnimatePresence mode="wait">
                        {activeRating > 0 && (
                          <motion.span
                            key={activeRating}
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                            className={`text-sm font-bold ${RATING_COLORS[activeRating]}`}
                          >
                            {RATING_LABELS[activeRating]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">Full Name <span className="text-yellow-300">*</span></label>
                      <div className={`relative transition-all duration-200 ${focused === 'name' ? 'ring-2 ring-white/40 rounded-xl' : ''}`}>
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        <input
                          type="text" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                          placeholder="Your full name" required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/15 transition-all"
                        />
                      </div>
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">Email <span className="text-yellow-300">*</span></label>
                      <div className={`relative transition-all duration-200 ${focused === 'email' ? 'ring-2 ring-white/40 rounded-xl' : ''}`}>
                        <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        <input
                          type="email" value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                          placeholder="your@email.com" required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/15 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">Your Review <span className="text-yellow-300">*</span></label>
                    <div className={`relative transition-all duration-200 ${focused === 'comment' ? 'ring-2 ring-white/40 rounded-xl' : ''}`}>
                      <MessageSquareIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40 pointer-events-none" />
                      <textarea
                        value={form.comment}
                        onChange={e => setForm({ ...form, comment: e.target.value })}
                        onFocus={() => setFocused('comment')} onBlur={() => setFocused(null)}
                        placeholder="Tell us about your experience finding a home on Flat-Mate..."
                        required rows={4}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/15 transition-all resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-white/40 text-xs">Keep it respectful and constructive</p>
                      <p className="text-white/40 text-xs">{form.comment.length} chars</p>
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}
                    whileTap={{ scale: 0.97 }}
                    type="submit" disabled={isLoading}
                    className="w-full py-4 bg-white text-primary font-bold rounded-xl flex items-center justify-center gap-2.5 hover:bg-white/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <SendIcon className="w-5 h-5" />
                        Submit Review
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
