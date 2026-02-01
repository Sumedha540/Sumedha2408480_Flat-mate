import React from 'react';
import { motion } from 'framer-motion';
import { QuoteIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
const stories = [{
  name: 'Priya & Sarah',
  location: 'Lalitpur',
  image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop',
  quote: "We matched instantly on the quiz! Now we're best friends living in a beautiful flat in Patan.",
  story: "I was new to Kathmandu and worried about finding a safe place. Flat-Mate's verification gave me confidence. Sarah and I have similar study schedules and it's been perfect."
}, {
  name: 'Rajesh & Team',
  location: 'Thamel',
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop',
  quote: "Found 2 awesome roommates to share a 3BHK. It's so much cheaper than living alone.",
  story: "Splitting the rent for a luxury apartment made it affordable for all of us. The 'Lifestyle Tags' feature really helped us find like-minded people who enjoy hiking on weekends."
}];
export function SuccessStoriesPage() {
  return <main className="min-h-screen bg-background-light py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Roommate Success Stories
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how thousands of people in Nepal are finding their perfect
            living arrangements through Flat-Mate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
              <Card className="overflow-hidden h-full">
                <div className="h-64 overflow-hidden">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <QuoteIcon className="w-8 h-8 text-primary/20 mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {story.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{story.location}</p>
                  <p className="text-lg font-medium text-gray-800 mb-4">
                    "{story.quote}"
                  </p>
                  <p className="text-gray-600 leading-relaxed">{story.story}</p>
                </div>
              </Card>
            </motion.div>)}
        </div>
      </div>
    </main>;
}