import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  ShieldCheckIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon,
  PlusIcon, ClockIcon, AwardIcon, CrownIcon, TrendingUpIcon,
  BedDoubleIcon, BathIcon, MapPinIcon, StarIcon, SparklesIcon,
  ArrowRightIcon, UsersIcon, BuildingIcon,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PropertyCard } from '../components/PropertyCard'
import { PremiumPropertyCard } from '../components/PremiumPropertyCard'
import { Link, useNavigate } from 'react-router-dom'
import { SearchFilters } from '../components/SearchFilters'
import { useAuth } from '../contexts/AuthContext'
import { AuthRequiredModal } from '../components/modals/AuthRequiredModal'
import { LoginModal } from '../components/modals/LoginModal'
import { SignupModal } from '../components/modals/SignupModal'
import { ReviewSubmissionForm } from '../components/ReviewSubmissionForm'

// ── Data ──────────────────────────────────────────────────────────────────────
const popularCities = [
  { name: 'Kathmandu', count: '150+ Properties', image: 'https://images.unsplash.com/photo-1558799401-1dcba79834c2?w=600&fit=crop' },
  { name: 'Pokhara',   count: '90+ Properties',  image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&fit=crop' },
  { name: 'Lalitpur',  count: '80+ Properties',  image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&fit=crop' },
  { name: 'Bhaktapur', count: '45+ Properties',  image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&fit=crop' },
  { name: 'Dharan',    count: '30+ Properties',  image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&fit=crop' },
  { name: 'Butwal',    count: '25+ Properties',  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&fit=crop' },
]

const premiumImages = [
  { id: 'premium-1', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&fit=crop' },
  { id: 'premium-2', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&fit=crop' },
  { id: 'premium-3', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop' },
  { id: 'premium-4', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&fit=crop' },
]

const highDemandProperty = {
  id: 'high-demand-1',
  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
  title: 'Premium 3BHK Penthouse',
  location: 'Lazimpat, Kathmandu',
  rent: 65000, bedrooms: 3, bathrooms: 2,
  ownerName: 'Suresh Maharjan',
  description: 'This stunning penthouse apartment features panoramic city views, modern amenities, and premium finishes throughout. Located in the heart of Lazimpat, it offers easy access to embassies, restaurants, and shopping centers. The property includes a private rooftop terrace, 24/7 security, and dedicated parking.',
}

const popularProperties = [
  { id: 'prop-1',  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop', title: 'Modern Apartment in Kathmandu',  location: 'Kathmandu',  rent: 25000, bedrooms: 2, bathrooms: 1, ownerName: 'Ram Thapa',       views: 245 },
  { id: 'prop-2',  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop', title: 'Cozy Studio in Kathmandu',       location: 'Kathmandu',  rent: 12000, bedrooms: 1, bathrooms: 1, ownerName: 'Sita Sharma',     views: 189 },
  { id: 'prop-3',  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop', title: 'Family House in Kathmandu',      location: 'Kathmandu',  rent: 35000, bedrooms: 3, bathrooms: 2, ownerName: 'Hari Krishna',    views: 312 },
  { id: 'prop-4',  image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop', title: '2BHK Flat in Kathmandu',         location: 'Kathmandu',  rent: 8000,  bedrooms: 1, bathrooms: 1, ownerName: 'Gita Rai',        views: 156 },
  { id: 'prop-5',  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop', title: 'Budget Room in Kathmandu',       location: 'Kathmandu',  rent: 28000, bedrooms: 3, bathrooms: 2, ownerName: 'Bikash Shrestha', views: 278 },
  { id: 'prop-21', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop', title: 'Modern Apartment in Lalitpur',   location: 'Lalitpur',   rent: 15000, bedrooms: 1, bathrooms: 1, ownerName: 'Anita Gurung',    views: 198 },
]

const features = [
  { icon: ShieldCheckIcon, title: 'Verified Properties',  description: 'Every listing is personally verified by our team for authenticity and quality' },
  { icon: ClockIcon,        title: 'Quick & Easy',         description: 'Find and book your perfect home in minutes with our streamlined process' },
  { icon: HeartIcon,        title: 'Trusted Platform',     description: 'Join thousands of satisfied renters and verified property owners' },
  { icon: AwardIcon,        title: 'Best Support',         description: 'Our dedicated team is available 24/7 to assist you every step of the way' },
]

const faqs = [
  { question: 'How do I know the listings are genuine?',         answer: 'All rooms and flats are verified before going live on our platform, ensuring that you only see genuine and trustworthy listings.' },
  { question: 'Can I reserve or pre-book a room online?',        answer: 'Yes! You can schedule visits and reserve properties directly through our platform. A small booking fee secures your chosen property while paperwork is completed.' },
  { question: 'What if I face issues after renting?',            answer: 'Our 24/7 support team is here to help. We mediate between tenants and owners to resolve any disputes quickly and fairly.' },
  { question: 'How does the verification process work?',         answer: 'Our team visits each property, verifies ownership documents, checks property condition, and ensures all photos are recent and accurate before listing.' },
]

const testimonials = [
  { name: 'Anita Gurung',    role: 'Software Engineer',  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop', rating: 5, comment: 'Found my perfect apartment in just 3 days! The verification process gave me confidence, and the owner was very responsive. Highly recommend Flat-Mate.' },
  { name: 'Rajesh Thapa',    role: 'Business Owner',     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop', rating: 5, comment: 'As a property owner, this platform has been a game-changer. Quality tenants, easy management, and great support from the Flat-Mate team.' },
  { name: 'Sita Maharjan',   role: 'Student',            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop', rating: 5, comment: 'The search filters made it so easy to find a room near my college within my budget. The whole process was smooth and transparent.' },
  { name: 'Bikash Shrestha', role: 'Marketing Manager',  rating: 4, comment: 'Great platform with verified listings. Found a nice flat in Lalitpur. The only improvement would be more properties in certain areas.' },
  { name: 'Priya Tamang',    role: 'Graphic Designer',   avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&auto=format&fit=crop', rating: 5, comment: 'Love the user interface and how easy it is to browse properties. The chatbot was super helpful in answering my questions instantly.' },
  { name: 'Kiran Rai',       role: 'Entrepreneur',       avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop', rating: 5, comment: 'Listed my property and found a great tenant within a week. The verification process ensures quality on both sides. Excellent service!' },
]

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FAQItem({ question, answer, isOpen, onToggle, index }: { question: string; answer: string; isOpen: boolean; onToggle: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
      className={`rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? 'bg-gradient-to-br from-button-primary to-primary' : 'bg-white border border-gray-200'}`}
    >
      <motion.button onClick={onToggle} whileTap={{ scale: 0.98 }} className={`w-full p-6 flex items-center justify-between text-left ${isOpen ? 'text-white' : 'text-gray-900'}`}>
        <span className="font-semibold pr-4">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOpen ? 'bg-white/20' : 'bg-button-primary/10'}`}>
          <PlusIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-45 text-white' : 'text-button-primary'}`} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <p className="px-6 pb-6 text-white/90 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex]     = useState<number | null>(0)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [showAuthModal, setShowAuthModal]   = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale   = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const reviewsPerPage  = 4
  const totalReviewPages = Math.ceil(testimonials.length / reviewsPerPage)
  const displayedReviews = testimonials.slice(currentReviewIndex * reviewsPerPage, (currentReviewIndex + 1) * reviewsPerPage)

  const handleViewAllProperties = () => {
    if (isAuthenticated) navigate('/properties')
    else setShowAuthModal(true)
  }

  return (
    <main className="overflow-hidden bg-white">

      {/* ══════════════════════════════════════════════════════════
          HERO — white background, real photo, no floating badges
      ══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-white overflow-hidden pt-20"
      >
        {/* Subtle light-gray dot texture — very faint */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* ── Left: Text ── */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-button-primary/10 rounded-full mb-6"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                  <SparklesIcon className="w-4 h-4 text-button-primary" />
                </motion.div>
                <span className="text-sm font-semibold text-button-primary">#1 Property Platform in Nepal</span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900"
              >
                Discover Affordable{' '}
                <span className="text-button-primary">Rooms, Flats</span>{' '}
                and Apartments Near You
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed"
              >
                Find your perfect home in Nepal's urban cities. All listings are verified, trusted, and ready for you to move in. Start your search today!
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleViewAllProperties}
                  className="px-8 py-4 bg-button-primary text-white font-bold rounded-full flex items-center gap-2 shadow-lg"
                >
                  Browse Properties
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.div>
                </motion.button>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-8 py-4 bg-white text-gray-800 font-bold rounded-full border-2 border-gray-200 hover:border-button-primary transition-colors"
                  >
                    List Your Property
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-8"
              >
                {[
                  { value: '500+', label: 'Properties',  icon: BuildingIcon },
                  { value: '10K+', label: 'Happy Users', icon: UsersIcon },
                  { value: '50+',  label: 'Locations',   icon: MapPinIcon },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.1 }} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-button-primary/10 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-button-primary" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-gray-900 block">{stat.value}</span>
                      <span className="text-sm text-gray-400">{stat.label}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: clean property photo, no overlays or floating badges ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="hidden lg:block"
            >
              <div className="relative w-full h-[540px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop"
                  alt="Premium property"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SEARCH
      ══════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Find Your Perfect Home</h2>
              <p className="text-gray-500">Search from hundreds of verified properties across Nepal</p>
            </div>
            <SearchFilters />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          POPULAR PROPERTIES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} className="h-1 bg-button-primary rounded-full mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Popular Properties</h2>
              <p className="text-gray-500 text-lg max-w-lg">Explore our most sought-after listings in Nepal's major cities</p>
            </div>
            <motion.div whileHover={{ x: 5 }} className="mt-6 md:mt-0">
              <Button variant="outline" onClick={handleViewAllProperties} className="group border-2">
                View All Properties <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularProperties.slice(0, 6).map((property, index) => (
              <motion.div key={property.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }}>
                <PropertyCard {...property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-button-primary via-primary to-button-primary relative overflow-hidden">
        <motion.div animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }} transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }} className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Flat-Mate?</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">We make finding your perfect home simple, safe, and stress-free</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          AUTHENTICATED ONLY
      ══════════════════════════════════════════════════════════ */}
      {isAuthenticated && (
        <>
          {/* Premium Properties */}
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-bold text-gray-900">Premium Properties</h2>
                  <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                    <CrownIcon className="w-4 h-4" /> Exclusive
                  </motion.span>
                </div>
                <p className="text-gray-500 text-lg">Luxury homes and high-end apartments for discerning renters</p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {premiumImages.map((property, index) => (
                  <motion.div key={property.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                    <PremiumPropertyCard image={property.image} propertyId={property.id} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* High Demand */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold text-gray-900">High Demand Property of the Week</h2>
                  <TrendingUpIcon className="w-8 h-8 text-button-primary" />
                </div>
              </motion.div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <motion.div whileHover={{ scale: 1.02 }} className="inline-flex items-center gap-2 px-4 py-2 bg-button-primary text-white text-sm font-medium rounded-full mb-6">
                    <TrendingUpIcon className="w-4 h-4" /> High Demand
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{highDemandProperty.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-6">{highDemandProperty.description}</p>
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-gray-600"><MapPinIcon className="w-5 h-5 text-button-primary" /><span>{highDemandProperty.location}</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><BedDoubleIcon className="w-5 h-5 text-button-primary" /><span>{highDemandProperty.bedrooms} Bedrooms</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><BathIcon className="w-5 h-5 text-button-primary" /><span>{highDemandProperty.bathrooms} Bathrooms</span></div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div><p className="text-sm text-gray-400">Monthly Rent</p><p className="text-4xl font-bold text-button-primary">रू {highDemandProperty.rent.toLocaleString()}</p></div>
                    <Link to={`/property/${highDemandProperty.id}`}><Button size="lg">View Details</Button></Link>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <PropertyCard id={highDemandProperty.id} image={highDemandProperty.image} title={highDemandProperty.title} location={highDemandProperty.location} rent={highDemandProperty.rent} bedrooms={highDemandProperty.bedrooms} bathrooms={highDemandProperty.bathrooms} ownerName={highDemandProperty.ownerName} />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Popular Cities */}
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Popular Cities</h2>
                <p className="text-gray-500 text-lg">Explore properties in top locations across Nepal</p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCities.map((city, index) => (
                  <motion.div key={city.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.03, y: -5 }} className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group" onClick={() => navigate(`/city/${city.name.toLowerCase()}`)}>
                    <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-2xl font-bold mb-1">{city.name}</h3>
                      <p className="text-white/80">{city.count}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          FAQs
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-32 lg:self-start">
              <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} className="h-1 bg-button-primary rounded-full mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">If your question isn't listed above, our support team is always ready to assist you. Feel free to reach out anytime.</p>
              <Button variant="outline" className="border-2">Contact Support</Button>
            </motion.div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={`${index + 1}. ${faq.question}`} answer={faq.answer} isOpen={openFaqIndex === index} onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">What Our Users Say</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Join thousands of satisfied renters and property owners who trust Flat-Mate</p>
          </motion.div>
          <div className="relative">
            <motion.button onClick={() => currentReviewIndex > 0 && setCurrentReviewIndex(currentReviewIndex - 1)} disabled={currentReviewIndex === 0} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-all ${currentReviewIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:border-button-primary hover:shadow-lg'}`}>
              <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
            </motion.button>
            <motion.button onClick={() => currentReviewIndex < totalReviewPages - 1 && setCurrentReviewIndex(currentReviewIndex + 1)} disabled={currentReviewIndex === totalReviewPages - 1} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-all ${currentReviewIndex === totalReviewPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:border-button-primary hover:shadow-lg'}`}>
              <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.div key={currentReviewIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedReviews.map((testimonial, index) => (
                  <motion.div key={`${currentReviewIndex}-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }} className="bg-white rounded-3xl p-6 border border-gray-200 min-h-[320px] flex flex-col">
                    <div className="flex items-center gap-1 mb-4">{[1,2,3,4,5].map(star => (<StarIcon key={star} className={`w-5 h-5 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />))}</div>
                    <p className="text-gray-600 leading-relaxed flex-1 mb-6">"{testimonial.comment}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {(testimonial as any).avatar ? (<img src={(testimonial as any).avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />) : (<div className="w-12 h-12 bg-gradient-to-br from-button-primary to-primary rounded-full flex items-center justify-center text-white font-bold">{testimonial.name.split(' ').map(n => n[0]).join('')}</div>)}
                      <div><p className="font-semibold text-gray-900">{testimonial.name}</p><p className="text-sm text-gray-400">{testimonial.role}</p></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: totalReviewPages }).map((_, index) => (
                <motion.button key={index} onClick={() => setCurrentReviewIndex(index)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className={`h-3 rounded-full transition-all ${index === currentReviewIndex ? 'w-10 bg-button-primary' : 'w-3 bg-gray-300 hover:bg-gray-400'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          REVIEW SUBMISSION — enhanced with animations
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-gradient-to-br from-button-primary via-primary to-button-primary relative overflow-hidden">
        {/* ✅ Animated dot pattern restored */}
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)', backgroundSize: '50px 50px' }}
        />
        {/* Floating orbs */}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1.3, 1, 1.3], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, type: 'spring', stiffness: 220 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-5 border border-white/20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                <StarIcon className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </motion.div>
              <span className="text-sm font-semibold text-white tracking-wide">Join 1,000+ Happy Users</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              We'd Love to Hear<br />From You
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-white/75 text-lg max-w-md mx-auto">
              Your honest feedback helps thousands of people find their perfect home.
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <ReviewSubmissionForm />
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginClick={() => { setShowAuthModal(false); setShowLoginModal(true) }} onSignupClick={() => { setShowAuthModal(false); setShowSignupModal(true) }} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSignupClick={() => { setShowLoginModal(false); setShowSignupModal(true) }} onForgotPasswordClick={() => {}} />
      <SignupModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} onLoginClick={() => { setShowSignupModal(false); setShowLoginModal(true) }} />
    </main>
  )
}
