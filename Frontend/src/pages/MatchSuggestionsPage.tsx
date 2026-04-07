import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import {
  HeartIcon,
  XIcon,
  StarIcon,
  SparklesIcon,
  UsersIcon,
  ClipboardCheckIcon,
  MessageCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  DollarSignIcon,
  ArrowRightIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  SmileIcon,
  BookOpenIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { allRoommates } from '../utils/roommateData'

interface MatchProfile {
  id: string
  name: string
  age: number
  matchScore: number
  occupation: string
  budget: string
  location: string
  bio: string
  tags: string[]
  image: string
}

// Convert allRoommates to match profiles with scores
const matchProfiles: MatchProfile[] = allRoommates.slice(0, 6).map((roommate, index) => ({
  id: roommate.id,
  name: roommate.name,
  age: roommate.age,
  matchScore: 92 - index * 3, // Decreasing match scores
  occupation: roommate.occupation,
  budget: roommate.budget,
  location: roommate.location,
  bio: roommate.bio,
  tags: roommate.tags,
  image: roommate.image,
}))
const tips = [
  {
    icon: ShieldCheckIcon,
    title: 'Verify Before Meeting',
    description:
      'Always check verified badges and reviews before scheduling an in-person meeting with a potential roommate.',
  },
  {
    icon: MessageCircleIcon,
    title: 'Communicate Expectations',
    description:
      'Discuss habits, schedules, and house rules upfront to avoid misunderstandings later.',
  },
  {
    icon: SmileIcon,
    title: 'Trust Your Instincts',
    description:
      "If something feels off during your initial conversations, it's okay to keep looking for a better match.",
  },
  {
    icon: BookOpenIcon,
    title: 'Set Clear Agreements',
    description:
      'Put rent splits, utility sharing, and guest policies in writing before moving in together.',
  },
]
function MatchScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 20
  const offset = circumference - (score / 100) * circumference
  const color = score >= 85 ? '#16a34a' : score >= 70 ? '#2F7D5F' : '#d97706'
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="transparent"
        />
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-primary">{score}%</span>
    </div>
  )
}
export function MatchSuggestionsPage() {
  const [searchParams] = useSearchParams()
  
  // Load saved and dismissed IDs from localStorage
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('fm_saved_matches')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    try {
      const dismissed = localStorage.getItem('fm_dismissed_matches')
      return dismissed ? new Set(JSON.parse(dismissed)) : new Set()
    } catch {
      return new Set()
    }
  })
  
  // Save to localStorage whenever savedIds changes
  React.useEffect(() => {
    try {
      localStorage.setItem('fm_saved_matches', JSON.stringify(Array.from(savedIds)))
    } catch {}
  }, [savedIds])
  
  // Save to localStorage whenever dismissedIds changes
  React.useEffect(() => {
    try {
      localStorage.setItem('fm_dismissed_matches', JSON.stringify(Array.from(dismissedIds)))
    } catch {}
  }, [dismissedIds])
  
  const handleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  
  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id))
  }
  
  const visibleProfiles = matchProfiles.filter((p) => !dismissedIds.has(p.id))
  return (
    <main className="min-h-screen bg-background-light pt-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <Link to="/find-roommate" className="hover:text-primary transition-colors">Find Roommate</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <span className="text-primary font-semibold">Match Suggestions</span>
          </nav>
        </div>
      </div>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <div className="inline-flex items-center gap-2 bg-background-accent px-4 py-2 rounded-full mb-6">
                <SparklesIcon className="w-5 h-5 text-button-primary" />
                <span className="text-sm font-medium text-button-primary">
                  AI-Powered Matching
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
                Find Your Perfect
                <br />
                Roommate Match
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Our smart matching algorithm analyzes your lifestyle,
                preferences, and budget to connect you with compatible roommates
                in your area.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-gray-500">Matches Made</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">92%</p>
                  <p className="text-sm text-gray-500">Satisfaction</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">48hr</p>
                  <p className="text-sm text-gray-500">Avg. Connect Time</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop"
                  alt="People connecting"
                  className="w-full h-[380px] object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-background-accent rounded-full opacity-60 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Three simple steps to finding your ideal roommate
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0,
              }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-background-accent rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ClipboardCheckIcon className="w-8 h-8 text-button-primary" />
              </div>
              <div className="text-sm font-bold text-button-primary mb-2">
                Step 01
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Take the Quiz
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Answer questions about your lifestyle, habits, and preferences
                to build your profile.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.1,
              }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-background-accent rounded-2xl flex items-center justify-center mx-auto mb-5">
                <SparklesIcon className="w-8 h-8 text-button-primary" />
              </div>
              <div className="text-sm font-bold text-button-primary mb-2">
                Step 02
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Get Matched
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our algorithm finds people with compatible lifestyles, budgets,
                and location preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.2,
              }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-background-accent rounded-2xl flex items-center justify-center mx-auto mb-5">
                <MessageCircleIcon className="w-8 h-8 text-button-primary" />
              </div>
              <div className="text-sm font-bold text-button-primary mb-2">
                Step 03
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Connect & Move In
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Chat with your matches, schedule meetups, and find your new home
                together.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Match Suggestions Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                Your Top Matches
              </h2>
              <p className="text-gray-600">
                Based on your preferences and compatibility score
              </p>
            </div>
            <Link to="/roommate-quiz">
              <Button variant="outline" className="hidden md:flex">
                Retake Quiz <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {visibleProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  layout
                >
                    <Card className="overflow-hidden border border-gray-100 shadow-sm group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <MatchScoreRing score={profile.matchScore} />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                        <h3 className="text-xl font-bold text-white">
                          {profile.name}, {profile.age}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <BriefcaseIcon className="w-3.5 h-3.5 text-gray-400" />
                          {profile.occupation}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
                          {profile.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        <DollarSignIcon className="w-3.5 h-3.5 text-button-primary" />
                        <span className="text-sm font-medium text-primary">
                          {profile.budget}/mo
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {profile.bio}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {profile.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-background-accent text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDismiss(profile.id)}
                        >
                          <XIcon className="w-4 h-4 mr-1" /> Skip
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`flex-1 ${savedIds.has(profile.id) ? 'bg-pink-50 text-pink-600 border-pink-200' : ''}`}
                          onClick={() => handleSave(profile.id)}
                        >
                          <HeartIcon
                            className={`w-4 h-4 mr-1 ${savedIds.has(profile.id) ? 'fill-pink-500' : ''}`}
                          />
                          {savedIds.has(profile.id) ? 'Saved' : 'Save'}
                        </Button>
                        <Link to={`/roommate/${profile.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            Connect
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-primary mb-3">
              Tips for Finding the Right Roommate
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Make the most of your roommate search with these expert tips
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="bg-background-light rounded-2xl p-6 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-button-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-button-primary" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="bg-gradient-to-br from-button-primary to-primary rounded-3xl p-10 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <LightbulbIcon className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Want Better Matches?
            </h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Take our compatibility quiz to refine your preferences and get
              more accurate roommate suggestions.
            </p>
            <Link to="/roommate-quiz">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 shadow-xl"
              >
                Take Compatibility Quiz{' '}
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
