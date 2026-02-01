import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, XIcon, StarIcon, SparklesIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
export function MatchSuggestionsPage() {
  // Mock match data
  const currentMatch = {
    id: '1',
    name: 'Sushil Karki',
    age: 25,
    matchScore: 92,
    occupation: 'Architect',
    budget: 'NPR 15,000',
    location: 'Lalitpur',
    bio: "I'm an architect who loves design and quiet spaces. Looking for a roommate who respects privacy but is up for occasional weekend hikes.",
    tags: ['Creative', 'Quiet', 'Hiker'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop'
  };
  return <main className="min-h-screen bg-gradient-to-br from-background-light to-blue-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <SparklesIcon className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-primary">Daily Matches</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">
            Find Your Perfect Match
          </h1>
          <p className="text-gray-600">
            Based on your preferences and lifestyle
          </p>
        </div>

        <div className="relative h-[600px] w-full">
          <motion.div className="absolute inset-0" initial={{
          scale: 0.95,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.3
        }}>
            <Card className="h-full overflow-hidden flex flex-col shadow-2xl border-0">
              <div className="relative h-3/5">
                <img src={currentMatch.image} alt={currentMatch.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                  <span className="font-bold text-green-600">
                    {currentMatch.matchScore}% Match
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {currentMatch.name}, {currentMatch.age}
                  </h2>
                  <p className="text-white/90">{currentMatch.occupation}</p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Budget
                    </p>
                    <p className="font-semibold text-primary">
                      {currentMatch.budget}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="font-semibold text-primary">
                      {currentMatch.location}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {currentMatch.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-auto">
                  {currentMatch.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-gray-100">
                      {tag}
                    </Badge>)}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <button className="w-14 h-14 rounded-full bg-white border-2 border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all mx-auto shadow-sm">
                    <XIcon className="w-8 h-8" />
                  </button>
                  <button className="w-14 h-14 rounded-full bg-white border-2 border-blue-200 text-blue-500 flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all mx-auto shadow-sm">
                    <StarIcon className="w-8 h-8" />
                  </button>
                  <button className="w-14 h-14 rounded-full bg-white border-2 border-green-200 text-green-500 flex items-center justify-center hover:bg-green-50 hover:scale-110 transition-all mx-auto shadow-sm">
                    <HeartIcon className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>;
}