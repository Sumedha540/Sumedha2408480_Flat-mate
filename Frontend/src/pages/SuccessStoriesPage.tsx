import React from 'react'
import { motion } from 'framer-motion'
import { QuoteIcon, StarIcon, HeartIcon } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'

const stories = [
  {
    name: 'Priya & Sarah', location: 'Lalitpur',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop',
    quote: "We matched instantly on the quiz! Now we're best friends living in a beautiful flat in Patan.",
    story: "I was new to Kathmandu and worried about finding a safe place. Flat-Mate's verification gave me confidence. Sarah and I have similar study schedules and it's been perfect. The platform made it so easy to find someone who matched my lifestyle and budget.",
    tags: ['Student Life', 'Perfect Match'], rating: 5,
  },
  {
    name: 'Rajesh & Team', location: 'Thamel',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
    quote: "Found 2 awesome roommates to share a 3BHK. It's so much cheaper than living alone.",
    story: "Splitting the rent for a luxury apartment made it affordable for all of us. The 'Lifestyle Tags' feature really helped us find like-minded people who enjoy hiking on weekends. We even started a small weekend trekking group together!",
    tags: ['Professionals', 'Shared Apartment'], rating: 5,
  },
  {
    name: 'Anita Gurung', location: 'Pokhara',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop',
    quote: 'Renting out my spare room was seamless and secure.',
    story: 'As a homeowner, I was hesitant about renting to strangers. The verification process and detailed profiles on Flat-Mate gave me peace of mind. Found a great tenant in just 3 days who treats the house like her own.',
    tags: ['Homeowner', 'Verified Tenant'], rating: 5,
  },
  {
    name: 'Bikash & Rohan', location: 'Baneshwor',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop',
    quote: 'From strangers to startup co-founders.',
    story: 'We met through Flat-Mate looking for a budget room. Turns out we both had similar business ideas. Now we share an apartment and run a startup together from our living room! The platform really connects you with the right people.',
    tags: ['Entrepreneurs', 'Budget Living'], rating: 4,
  },
]

export function SuccessStoriesPage() {
  return (
    <main className="min-h-screen bg-background-light pt-24">

      {/* ── HERO — pt-24 clears the fixed header ── */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-button-primary/10 px-4 py-2 rounded-full mb-6">
            <HeartIcon className="w-4 h-4 text-button-primary fill-button-primary" />
            <span className="text-sm font-medium text-button-primary uppercase tracking-wider">Community Stories</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 tracking-tight uppercase">
            Real Stories,<br />Real Homes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover how thousands of people in Nepal are finding their perfect living arrangements and building lifelong connections through Flat-Mate.
          </p>
        </motion.div>
      </section>

      {/* ── FEATURED STORY ── */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
          <div className="w-full h-[500px] md:h-[600px] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
            <img src={stories[0].image} alt={stories[0].name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="absolute -bottom-10 md:bottom-10 left-4 right-4 md:left-10 md:right-auto md:w-[500px] bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              {[...Array(stories[0].rating)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <QuoteIcon className="w-10 h-10 text-button-primary/20 mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-2">{stories[0].quote}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{stories[0].story}</p>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="font-bold text-primary">{stories[0].name}</p>
                <p className="text-sm text-gray-500">{stories[0].location}</p>
              </div>
              <div className="flex gap-2">
                {stories[0].tags.map(tag => (
                  <span key={tag} className="text-xs font-medium bg-background-accent text-button-primary px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── MORE STORIES ── */}
      <section className="py-20 bg-white mt-20 md:mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">More Success Stories</h2>
            <p className="text-gray-600">Hear from our diverse community of renters and owners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.slice(1).map((story, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
                  <div className="h-64 overflow-hidden relative">
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {story.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full shadow-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(story.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-4 leading-tight">"{story.quote}"</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{story.story}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-background-accent flex items-center justify-center text-button-primary font-bold">
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm">{story.name}</p>
                        <p className="text-xs text-gray-500">{story.location}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-background-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-primary rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-button-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Write Your Own Story?</h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">Join our community today and find the perfect place to call home, or the ideal roommate to share it with.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup"><Button size="lg" className="bg-button-primary hover:bg-button-primary/90 text-white rounded-full px-8">Get Started Now</Button></Link>
                <Link to="/properties"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">Browse Properties</Button></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
