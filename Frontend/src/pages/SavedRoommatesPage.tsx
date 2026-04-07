import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HeartIcon,
  MessageCircleIcon,
  TrashIcon,
  MapPinIcon,
  BriefcaseIcon,
  DollarSignIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
  SearchIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ClockIcon,
  Inbox,
  HomeIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { RoommateCard } from '../components/RoommateCard'
import { toast } from 'sonner'
interface SavedRoommate {
  id: string
  name: string
  age: number
  gender: string
  occupation: string
  budget: string
  location: string
  moveInDate: string
  bio: string
  tags: string[]
  verified: boolean
  image: string
  matchScore: number
  contacted: boolean
}
const initialSavedRoommates: SavedRoommate[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    age: 24,
    gender: 'Male',
    occupation: 'Software Developer',
    budget: 'NPR 10,000 - 15,000',
    location: 'Koteshwor, Kathmandu',
    moveInDate: 'Immediate',
    bio: 'Clean, quiet professional looking for a shared flat. I work from home most days and enjoy cooking on weekends.',
    tags: ['Early Riser', 'Non-Smoker', 'Vegetarian'],
    verified: true,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop',
    matchScore: 88,
    contacted: true,
  },
  {
    id: '2',
    name: 'Priya Tamang',
    age: 23,
    gender: 'Female',
    occupation: 'Graphic Designer',
    budget: 'NPR 8,000 - 12,000',
    location: 'Jhamsikhel, Lalitpur',
    moveInDate: 'Next Month',
    bio: 'Creative soul who enjoys art, music, and keeping the space tidy. Looking for a like-minded flatmate.',
    tags: ['Creative', 'Music Lover', 'Clean'],
    verified: true,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop',
    matchScore: 85,
    contacted: false,
  },
  {
    id: '3',
    name: 'Bikash Shrestha',
    age: 27,
    gender: 'Male',
    occupation: 'Marketing Manager',
    budget: 'NPR 15,000 - 20,000',
    location: 'Thamel, Kathmandu',
    moveInDate: 'Flexible',
    bio: 'Working professional who values a clean, organized living space. Gym enthusiast and weekend explorer.',
    tags: ['Organized', 'Fitness', 'Social'],
    verified: false,
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
    matchScore: 82,
    contacted: false,
  },
  {
    id: '4',
    name: 'Anita Gurung',
    age: 24,
    gender: 'Female',
    occupation: 'Software Engineer',
    budget: 'NPR 12,000 - 16,000',
    location: 'Kupondole, Lalitpur',
    moveInDate: 'Immediate',
    bio: 'Tech enthusiast who works from home. Love board games, cooking, and keeping the apartment spotless.',
    tags: ['Tech', 'WFH', 'Clean', 'Foodie'],
    verified: true,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop',
    matchScore: 90,
    contacted: true,
  },
]
const suggestedRoommates = [
  {
    id: 's1',
    name: 'Kiran Rai',
    age: 26,
    gender: 'Male',
    occupation: 'Entrepreneur',
    budget: 'NPR 15,000 - 20,000',
    location: 'Baneshwor, Kathmandu',
    moveInDate: 'Next Month',
    bio: 'Running a small startup. Looking for a motivated roommate.',
    tags: ['Ambitious', 'Social'],
    verified: true,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop',
  },
  {
    id: 's2',
    name: 'Maya Maharjan',
    age: 22,
    gender: 'Female',
    occupation: 'Student',
    budget: 'NPR 8,000 - 10,000',
    location: 'Patan, Lalitpur',
    moveInDate: 'Immediate',
    bio: 'Final year student looking for a budget-friendly shared room.',
    tags: ['Student', 'Budget', 'Friendly'],
    verified: true,
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop',
  },
  {
    id: 's3',
    name: 'Rohan Adhikari',
    age: 25,
    gender: 'Male',
    occupation: 'Photographer',
    budget: 'NPR 10,000 - 14,000',
    location: 'Thamel, Kathmandu',
    moveInDate: 'Flexible',
    bio: 'Freelance photographer who travels often. Need a chill roommate.',
    tags: ['Creative', 'Traveler', 'Chill'],
    verified: false,
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop',
  },
]
function MatchScoreBar({ score }: { score: number }) {
  const color =
    score >= 85
      ? 'bg-green-500'
      : score >= 70
        ? 'bg-button-primary'
        : 'bg-yellow-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${score}%`,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-bold text-primary">{score}%</span>
    </div>
  )
}
const STORAGE_KEY = 'fm_saved_roommates'

function loadSaved(): SavedRoommate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : initialSavedRoommates
  } catch { return initialSavedRoommates }
}

export function SavedRoommatesPage() {
  const [savedRoommates, setSavedRoommates] = useState<SavedRoommate[]>(loadSaved)
  const [filter, setFilter] = useState<'all' | 'contacted' | 'pending'>('all')

  const persist = (data: SavedRoommate[]) => {
    setSavedRoommates(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const handleRemove = (id: string) => {
    persist(savedRoommates.filter((r) => r.id !== id))
    toast.success('Profile removed from saved list')
  }
  const handleNavigateToMessages = (id: string, name: string) => {
    // Navigate to messages page - status will be updated only after actual message is sent
    window.location.href = `/messages?roommate=${encodeURIComponent(name)}&id=${id}`;
  }
  const filteredRoommates = savedRoommates.filter((r) => {
    if (filter === 'contacted') return r.contacted
    if (filter === 'pending') return !r.contacted
    return true
  })
  const savedCount = savedRoommates.length
  const contactedCount = savedRoommates.filter((r) => r.contacted).length
  const pendingCount = savedRoommates.filter((r) => !r.contacted).length
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
            <span className="text-primary font-semibold">Saved Profiles</span>
          </nav>
        </div>
      </div>
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
            >
              <div className="inline-flex items-center gap-2 bg-background-accent px-4 py-2 rounded-full mb-5">
                <BookmarkIcon className="w-4 h-4 text-button-primary" />
                <span className="text-sm font-medium text-button-primary">
                  Your Collection
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight mb-4">
                Saved Profiles
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                People you've connected with and want to remember. Manage your
                saved roommate profiles and reach out when you're ready.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="flex gap-4 justify-start lg:justify-end"
            >
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center min-w-[100px]">
                <p className="text-3xl font-bold text-primary">{savedCount}</p>
                <p className="text-xs text-gray-500 mt-1">Saved</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center min-w-[100px]">
                <p className="text-3xl font-bold text-green-600">
                  {contactedCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">Contacted</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center min-w-[100px]">
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { key: 'all' as const,       label: 'All Saved' },
              { key: 'contacted' as const,  label: 'Contacted' },
              { key: 'pending' as const,    label: 'Not Contacted' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-button-primary text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-button-primary hover:text-button-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Link to="/find-roommate">
            <Button variant="outline" size="sm">
              <SearchIcon className="w-4 h-4 mr-2" /> Browse More
            </Button>
          </Link>
        </div>
      </div>

      {/* Saved Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredRoommates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredRoommates.map((roommate, index) => (
                <motion.div
                  key={roommate.id}
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
                    scale: 0.95,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  layout
                >
                  <Card className="overflow-hidden border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 relative">
                        <img
                          src={roommate.image}
                          alt={roommate.name}
                          className="w-full h-full object-cover"
                        />
                        {roommate.contacted && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircleIcon className="w-3 h-3" /> Contacted
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-primary">
                                {roommate.name}, {roommate.age}
                              </h3>
                              {roommate.verified ? (
                                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircleIcon className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <BriefcaseIcon className="w-3.5 h-3.5" />{' '}
                                {roommate.occupation}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="w-3.5 h-3.5" />{' '}
                                {roommate.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Match Score
                          </p>
                          <MatchScoreBar score={roommate.matchScore} />
                        </div>

                        <div className="flex items-center gap-3 text-sm mb-3">
                          <span className="flex items-center gap-1 text-gray-600">
                            <DollarSignIcon className="w-3.5 h-3.5 text-button-primary" />{' '}
                            {roommate.budget}
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <ClockIcon className="w-3.5 h-3.5 text-gray-400" />{' '}
                            {roommate.moveInDate}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {roommate.bio}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {roommate.tags.map((tag) => (
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
                          <Link
                            to={`/roommate/${roommate.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              View Profile
                            </Button>
                          </Link>
                          {!roommate.contacted && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleNavigateToMessages(roommate.id, roommate.name)}
                            >
                              <MessageCircleIcon className="w-4 h-4 mr-1" />{' '}
                              Message
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleRemove(roommate.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.1,
                type: 'spring',
                stiffness: 200,
              }}
              className="w-20 h-20 bg-background-accent rounded-full flex items-center justify-center mx-auto mb-5"
            >
              <Inbox className="w-10 h-10 text-gray-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              No Saved Profiles
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {filter !== 'all'
                ? 'No profiles match this filter. Try a different one.'
                : "You haven't saved any roommate profiles yet. Start browsing to find your perfect match!"}
            </p>
            <div className="flex gap-3 justify-center">
              {filter !== 'all' && (
                <Button variant="outline" onClick={() => setFilter('all')}>
                  Show All
                </Button>
              )}
              <Link to="/find-roommate">
                <Button>Find Roommates</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </section>

      {/* You Might Also Like */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">
                You Might Also Like
              </h2>
              <p className="text-gray-600 text-sm">
                Discover more compatible roommates
              </p>
            </div>
            <Link to="/match-suggestions">
              <Button variant="ghost" size="sm">
                View All <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedRoommates.map((roommate, index) => (
              <motion.div
                key={roommate.id}
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
                  delay: index * 0.1,
                }}
              >
                <RoommateCard {...roommate} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="bg-gradient-to-br from-button-primary to-primary rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <SparklesIcon className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-3">Ready to Connect?</h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Don't wait too long — great roommates get snapped up quickly. Send
              a message today and start your journey to a better living
              situation.
            </p>
            <Link to="/find-roommate">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 shadow-xl"
              >
                Browse Roommates <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
