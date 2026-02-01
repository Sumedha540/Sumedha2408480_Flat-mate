import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, SendIcon, UserIcon, MailIcon, MessageSquareIcon, SparklesIcon, CheckCircle2Icon } from 'lucide-react';
import { Button } from './ui/Button';
import { toast } from 'sonner';
export function ReviewSubmissionForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: ''
  });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Thank you for your review!');
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        name: '',
        email: '',
        review: ''
      });
      setRating(0);
    }, 3000);
  };
  const ratingLabels = [{
    emoji: '😞',
    text: 'Poor',
    color: 'text-red-500'
  }, {
    emoji: '😐',
    text: 'Fair',
    color: 'text-orange-500'
  }, {
    emoji: '😊',
    text: 'Good',
    color: 'text-yellow-500'
  }, {
    emoji: '😄',
    text: 'Great',
    color: 'text-lime-500'
  }, {
    emoji: '🌟',
    text: 'Excellent',
    color: 'text-green-500'
  }];
  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1]
  }} className="relative">
      {/* Floating Orbs Background */}
      <motion.div animate={{
      y: [0, -20, 0],
      rotate: [0, 5, 0]
    }} transition={{
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }} className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-button-primary/20 to-primary/20 rounded-full blur-3xl" />
      <motion.div animate={{
      y: [0, 20, 0],
      rotate: [0, -5, 0]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 1
    }} className="absolute -bottom-24 -left-24 w-56 h-56 bg-gradient-to-br from-primary/20 to-button-primary/20 rounded-full blur-3xl" />

      <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
        {/* Animated Header Gradient */}
        <div className="relative bg-gradient-to-br from-button-primary via-primary to-button-primary p-10 text-white overflow-hidden">
          {/* Animated Background Pattern */}
          <motion.div animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }} transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }} className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

          <motion.div animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }} transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }} className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <motion.div initial={{
            scale: 0,
            rotate: -180
          }} animate={{
            scale: 1,
            rotate: 0
          }} transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15
          }} className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 shadow-lg">
              <SparklesIcon className="w-10 h-10" />
            </motion.div>
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="text-4xl font-bold mb-3">
              Share Your Experience
            </motion.h2>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="text-white/90 text-lg">
              Your feedback helps us improve and helps others make better
              decisions
            </motion.p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? <motion.div key="success" initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.8
        }} transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1]
        }} className="p-16 text-center">
              <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15
          }} className="relative inline-block mb-8">
                <motion.div animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }} transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="absolute inset-0 bg-green-400/30 rounded-full blur-xl" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                  <motion.div initial={{
                pathLength: 0,
                opacity: 0
              }} animate={{
                pathLength: 1,
                opacity: 1
              }} transition={{
                duration: 0.6,
                delay: 0.4
              }}>
                    <CheckCircle2Icon className="w-12 h-12 text-white" strokeWidth={3} />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h3 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} className="text-3xl font-bold text-primary mb-3">
                Thank You! 🎉
              </motion.h3>
              <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }} className="text-gray-600 text-lg">
                Your review has been submitted successfully
              </motion.p>

              <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.8
          }} className="flex items-center justify-center gap-2 mt-6">
                {[...Array(3)].map((_, i) => <motion.div key={i} animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }} transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }} className="w-2 h-2 bg-button-primary rounded-full" />)}
              </motion.div>
            </motion.div> : <motion.form key="form" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onSubmit={handleSubmit} className="p-10 space-y-8">
              {/* Rating Section */}
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }} className="text-center">
                <label className="block text-lg font-semibold text-gray-800 mb-6">
                  How would you rate your experience?
                </label>

                <div className="flex justify-center gap-3 mb-4">
                  {[1, 2, 3, 4, 5].map(star => <motion.button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} whileHover={{
                scale: 1.3,
                rotate: [0, -10, 10, 0],
                transition: {
                  duration: 0.3
                }
              }} whileTap={{
                scale: 0.9
              }} className="relative focus:outline-none group">
                      <motion.div animate={{
                  scale: star <= (hoverRating || rating) ? [1, 1.2, 1] : 1
                }} transition={{
                  duration: 0.5,
                  repeat: star <= (hoverRating || rating) ? Infinity : 0,
                  repeatDelay: 0.5
                }} className={`absolute inset-0 rounded-full blur-lg ${star <= (hoverRating || rating) ? 'bg-yellow-400/50' : 'bg-transparent'}`} />
                      <StarIcon className={`relative w-12 h-12 transition-all duration-300 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400 drop-shadow-2xl' : 'text-gray-300 hover:text-gray-400'}`} />
                    </motion.button>)}
                </div>

                <AnimatePresence mode="wait">
                  {(rating > 0 || hoverRating > 0) && <motion.div key={hoverRating || rating} initial={{
                opacity: 0,
                y: -10,
                scale: 0.8
              }} animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }} exit={{
                opacity: 0,
                y: -10,
                scale: 0.8
              }} transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full border border-yellow-200">
                      <span className="text-2xl">
                        {ratingLabels[(hoverRating || rating) - 1].emoji}
                      </span>
                      <span className={`font-semibold ${ratingLabels[(hoverRating || rating) - 1].color}`}>
                        {ratingLabels[(hoverRating || rating) - 1].text}
                      </span>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[{
              name: 'name',
              label: 'Your Name',
              icon: UserIcon,
              placeholder: 'John Doe',
              type: 'text',
              delay: 0.2
            }, {
              name: 'email',
              label: 'Email Address',
              icon: MailIcon,
              placeholder: 'john@example.com',
              type: 'email',
              delay: 0.3
            }].map(field => <motion.div key={field.name} initial={{
              opacity: 0,
              x: field.delay === 0.2 ? -30 : 30
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: field.delay,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {field.label}
                    </label>
                    <div className="relative group">
                      <motion.div animate={{
                  scale: focusedField === field.name ? 1.1 : 1,
                  color: focusedField === field.name ? '#2F7D5F' : '#9CA3AF'
                }} transition={{
                  duration: 0.2
                }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <field.icon className="w-5 h-5" />
                      </motion.div>

                      <motion.div className="absolute inset-0 bg-gradient-to-r from-button-primary/5 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" animate={{
                  scale: focusedField === field.name ? 1 : 0.95
                }} />

                      <motion.input whileFocus={{
                  scale: 1.01
                }} type={field.type} value={formData[field.name as keyof typeof formData]} onChange={e => setFormData({
                  ...formData,
                  [field.name]: e.target.value
                })} onFocus={() => setFocusedField(field.name)} onBlur={() => setFocusedField(null)} placeholder={field.placeholder} required className="relative w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-button-primary/50 focus:border-button-primary transition-all duration-300 bg-white/50 backdrop-blur-sm" />
                    </div>
                  </motion.div>)}
              </div>

              {/* Review Textarea */}
              <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Review
                </label>
                <div className="relative group">
                  <motion.div animate={{
                scale: focusedField === 'review' ? 1.1 : 1,
                color: focusedField === 'review' ? '#2F7D5F' : '#9CA3AF'
              }} transition={{
                duration: 0.2
              }} className="absolute left-4 top-4 z-10">
                    <MessageSquareIcon className="w-5 h-5" />
                  </motion.div>

                  <motion.div className="absolute inset-0 bg-gradient-to-br from-button-primary/5 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" animate={{
                scale: focusedField === 'review' ? 1 : 0.95
              }} />

                  <motion.textarea whileFocus={{
                scale: 1.01
              }} rows={5} value={formData.review} onChange={e => setFormData({
                ...formData,
                review: e.target.value
              })} onFocus={() => setFocusedField('review')} onBlur={() => setFocusedField(null)} placeholder="Tell us about your experience with Flat-Mate... What did you love? What could be better?" required className="relative w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-button-primary/50 focus:border-button-primary transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm" />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}>
                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} disabled={isSubmitting} className="py-5 text-lg font-semibold rounded-2xl">
                  {isSubmitting ? 'Submitting...' : <span className="flex items-center justify-center gap-3">
                      Submit Review
                      <SendIcon className="w-5 h-5" />
                    </span>}
                </Button>
              </motion.div>
            </motion.form>}
        </AnimatePresence>
      </div>
    </motion.div>;
}