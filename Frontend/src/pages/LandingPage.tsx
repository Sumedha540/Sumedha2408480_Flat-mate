import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, XIcon, ClockIcon, AwardIcon, CrownIcon, TrendingUpIcon, BedDoubleIcon, BathIcon, MapPinIcon, StarIcon, HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PropertyCard } from '../components/PropertyCard';
import { PremiumPropertyCard } from '../components/PremiumPropertyCard';
import { Link, useNavigate } from 'react-router-dom';
import { SearchFilters } from '../components/SearchFilters';
import { useAuth } from '../contexts/AuthContext';
import { AuthRequiredModal } from '../components/modals/AuthRequiredModal';
import { LoginModal } from '../components/modals/LoginModal';
import { SignupModal } from '../components/modals/SignupModal';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { toast } from 'sonner';
import { ReviewSubmissionForm } from '../components/ReviewSubmissionForm';
// Popular cities with actual Nepali location photos (NO people)
const popularCities = [{
  name: 'Kathmandu',
  count: '150+ Properties',
  image: 'https://images.unsplash.com/photo-1558799401-1dcba79834c2?w=600&fit=crop'
}, {
  name: 'Pokhara',
  count: '90+ Properties',
  image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&fit=crop'
}, {
  name: 'Lalitpur',
  count: '80+ Properties',
  image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&fit=crop'
}, {
  name: 'Bhaktapur',
  count: '45+ Properties',
  image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&fit=crop'
}, {
  name: 'Dharan',
  count: '30+ Properties',
  image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&fit=crop'
}, {
  name: 'Butwal',
  count: '25+ Properties',
  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&fit=crop'
}];
// Premium property images
const premiumImages = ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&fit=crop'];
// High demand property of the week
const highDemandProperty = {
  id: 'high-demand-1',
  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
  title: 'Premium 3BHK Penthouse',
  location: 'Lazimpat, Kathmandu',
  rent: 65000,
  bedrooms: 3,
  bathrooms: 2,
  ownerName: 'Suresh Maharjan',
  description: 'This stunning penthouse apartment features panoramic city views, modern amenities, and premium finishes throughout. Located in the heart of Lazimpat, it offers easy access to embassies, restaurants, and shopping centers. The property includes a private rooftop terrace, 24/7 security, and dedicated parking.'
};
const popularProperties = [{
  id: '1',
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
  title: 'Modern 2BHK Apartment',
  location: 'Thamel, Kathmandu',
  rent: 25000,
  bedrooms: 2,
  bathrooms: 1,
  ownerName: 'Ram Bahadur Thapa',
  views: 245
}, {
  id: '2',
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
  title: 'Cozy Studio Room',
  location: 'Patan, Lalitpur',
  rent: 12000,
  bedrooms: 1,
  bathrooms: 1,
  ownerName: 'Sita Devi Shrestha',
  views: 189
}, {
  id: '3',
  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  title: 'Spacious 3BHK Flat',
  location: 'Bhaktapur',
  rent: 35000,
  bedrooms: 3,
  bathrooms: 2,
  ownerName: 'Krishna Prasad Adhikari',
  views: 312
}, {
  id: '4',
  image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
  title: 'Budget-Friendly Room',
  location: 'Baneshwor, Kathmandu',
  rent: 8000,
  bedrooms: 1,
  bathrooms: 1,
  ownerName: 'Binod Kumar Rai',
  views: 156
}, {
  id: '5',
  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
  title: 'Family Apartment',
  location: 'Kupondole, Lalitpur',
  rent: 28000,
  bedrooms: 3,
  bathrooms: 2,
  ownerName: 'Anita Gurung',
  views: 278
}, {
  id: '6',
  image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
  title: 'Modern Studio',
  location: 'Jhamsikhel, Lalitpur',
  rent: 15000,
  bedrooms: 1,
  bathrooms: 1,
  ownerName: 'Prakash Tamang',
  views: 198
}];
const features = [{
  icon: ShieldCheckIcon,
  title: 'Verified Properties',
  description: 'Every listing is personally verified by our team for authenticity and quality'
}, {
  icon: ClockIcon,
  title: 'Quick & Easy',
  description: 'Find and book your perfect home in minutes with our streamlined process'
}, {
  icon: HeartIcon,
  title: 'Trusted Platform',
  description: 'Join thousands of satisfied renters and verified property owners'
}, {
  icon: AwardIcon,
  title: 'Best Support',
  description: 'Our dedicated team is available 24/7 to assist you every step of the way'
}];
const faqs = [{
  question: 'How do I know the listings are genuine?',
  answer: 'All rooms and flats are verified before going live on our platform, ensuring that you only see genuine and trustworthy listings.'
}, {
  question: 'Can I reserve or pre-book a room online?',
  answer: 'Yes! You can schedule visits and reserve properties directly through our platform. A small booking fee secures your chosen property while paperwork is completed.'
}, {
  question: 'What if I face issues after renting?',
  answer: 'Our 24/7 support team is here to help. We mediate between tenants and owners to resolve any disputes quickly and fairly.'
}, {
  question: 'How does the verification process work?',
  answer: 'Our team visits each property, verifies ownership documents, checks property condition, and ensures all photos are recent and accurate before listing.'
}];
const testimonials = [{
  name: 'Anita Gurung',
  role: 'Software Engineer',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
  rating: 5,
  comment: 'Found my perfect apartment in just 3 days! The verification process gave me confidence, and the owner was very responsive. Highly recommend Flat-Mate.'
}, {
  name: 'Rajesh Thapa',
  role: 'Business Owner',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  rating: 5,
  comment: 'As a property owner, this platform has been a game-changer. Quality tenants, easy management, and great support from the Flat-Mate team.'
}, {
  name: 'Sita Maharjan',
  role: 'Student',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
  rating: 5,
  comment: 'The search filters made it so easy to find a room near my college within my budget. The whole process was smooth and transparent.'
}, {
  name: 'Bikash Shrestha',
  role: 'Marketing Manager',
  rating: 4,
  comment: 'Great platform with verified listings. Found a nice flat in Lalitpur. The only improvement would be more properties in certain areas.'
}, {
  name: 'Priya Tamang',
  role: 'Graphic Designer',
  avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&auto=format&fit=crop',
  rating: 5,
  comment: 'Love the user interface and how easy it is to browse properties. The chatbot was super helpful in answering my questions instantly.'
}, {
  name: 'Kiran Rai',
  role: 'Entrepreneur',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
  rating: 5,
  comment: 'Listed my property and found a great tenant within a week. The verification process ensures quality on both sides. Excellent service!'
}];
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return <motion.div initial={false} className="bg-background-accent rounded-xl overflow-hidden mb-3">
      <motion.button onClick={onToggle} whileHover={{
      backgroundColor: 'rgba(215, 237, 228, 0.5)'
    }} whileTap={{
      scale: 0.99
    }} className="w-full p-5 flex items-center justify-between text-left group transition-colors">
        <span className="font-semibold text-primary pr-4 text-sm">
          {question}
        </span>
        <motion.div animate={{
        rotate: isOpen ? 45 : 0
      }} transition={{
        duration: 0.2
      }} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          {isOpen ? <XIcon className="w-5 h-5 text-white" /> : <PlusIcon className="w-5 h-5 text-white" />}
        </motion.div>
      </motion.button>
      <motion.div initial={false} animate={{
      height: isOpen ? 'auto' : 0,
      opacity: isOpen ? 1 : 0
    }} transition={{
      duration: 0.3,
      ease: 'easeInOut'
    }} className="overflow-hidden">
        <p className="px-5 pb-5 text-gray-700 text-sm leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>;
}
export function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const {
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const reviewsPerPage = 4;
  const totalReviewPages = Math.ceil(testimonials.length / reviewsPerPage);
  const displayedReviews = testimonials.slice(currentReviewIndex * reviewsPerPage, (currentReviewIndex + 1) * reviewsPerPage);
  const goToPreviousReviews = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1);
    }
  };
  const goToNextReviews = () => {
    if (currentReviewIndex < totalReviewPages - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    }
  };
  const handleViewAllProperties = () => {
    if (isAuthenticated) {
      navigate('/properties');
    } else {
      setShowAuthModal(true);
    }
  };
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your review!');
    // Reset form logic would go here
  };
  return <main>
      {/* Hero Section */}
      <section className="bg-background-light py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-4">
                Discover Affordable Rooms, Flats, and Apartments Near You
              </h1>
              <p className="text-base text-gray-600 mb-6 max-w-lg">
                Find your perfect home in Nepal's urban cities. All listings are
                verified, trusted, and ready for you to move in. Start your
                search today!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="md" onClick={handleViewAllProperties}>
                  Browse Properties
                </Button>
                <Link to="/login">
                  <Button variant="secondary" size="md">
                    List Your Property
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="relative">
              <div className="relative rounded-card overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop" alt="Modern apartment interior" className="w-full h-[400px] object-cover" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-button p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-primary text-sm">
                        Featured Property
                      </p>
                      <p className="text-xs text-gray-500">Thamel, Kathmandu</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">रू 25,000</p>
                      <p className="text-xs text-gray-500">/month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-background-accent rounded-full opacity-60" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-background-accent rounded-full opacity-40" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHIFTED UP: Find Your Perfect Home + Search Filters */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
              Find Your Perfect Home
            </h2>
            <SearchFilters />
          </motion.div>
        </div>
      </section>

      {/* Popular Properties Section - ALWAYS SHOWN */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  Popular Properties
                </h2>
                <p className="text-gray-600 text-sm max-w-2xl">
                  Explore our most sought-after listings in Nepal's major cities
                </p>
              </div>
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={handleViewAllProperties}>
                View All
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {popularProperties.slice(0, 6).map((property, index) => <motion.div key={property.id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.05
          }}>
                <PropertyCard {...property} />
              </motion.div>)}
          </div>

          <div className="text-center md:hidden">
            <Button variant="secondary" size="md" onClick={handleViewAllProperties}>
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* REMOVED BROWSE CATEGORIES SECTION */}

      {/* Why Choose Us Section - ALWAYS SHOWN */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Why Choose Flat-Mate?
            </h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              We make finding your perfect home simple, safe, and stress-free
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <motion.div key={feature.title} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} whileHover={{
              y: -5
            }} className="text-center">
                  <motion.div whileHover={{
                rotate: 360,
                scale: 1.1
              }} transition={{
                duration: 0.6
              }} className="w-16 h-16 bg-background-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-button-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>;
          })}
          </div>
        </div>
      </section>

      {/* AUTHENTICATED USER SECTIONS - Only show when logged in */}
      {isAuthenticated && <>
          {/* Premium Properties Section */}
          <section className="py-12 bg-background-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary">
                    Premium Properties
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAB308] text-white text-sm font-medium rounded-full">
                    <CrownIcon className="w-4 h-4" />
                    Exclusive
                  </span>
                </div>
                <p className="text-gray-600">
                  Luxury homes and high-end apartments for discerning renters
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {premiumImages.map((image, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }}>
                    <PremiumPropertyCard image={image} />
                  </motion.div>)}
              </div>
            </div>
          </section>

          {/* High Demand Property of the Week */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary">
                    High Demand Property of the Week
                  </h2>
                  <TrendingUpIcon className="w-6 h-6 text-button-primary" />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left side - Description */}
                <motion.div initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-button-primary text-white text-sm font-medium rounded-full mb-4">
                    <TrendingUpIcon className="w-4 h-4" />
                    High Demand
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {highDemandProperty.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {highDemandProperty.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPinIcon className="w-5 h-5 text-button-primary" />
                      <span>{highDemandProperty.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <BedDoubleIcon className="w-5 h-5 text-button-primary" />
                      <span>{highDemandProperty.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <BathIcon className="w-5 h-5 text-button-primary" />
                      <span>{highDemandProperty.bathrooms} Bathrooms</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Rent</p>
                      <p className="text-2xl font-bold text-primary">
                        रू {highDemandProperty.rent.toLocaleString()}
                      </p>
                    </div>
                    <Link to={`/property/${highDemandProperty.id}`}>
                      <Button size="lg">View Details</Button>
                    </Link>
                  </div>
                </motion.div>

                {/* Right side - Property Card */}
                <motion.div initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} className="relative">
                  <div className="absolute -top-3 -left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-button-primary text-white text-sm font-medium rounded-full shadow-lg">
                      <TrendingUpIcon className="w-4 h-4" />
                      High Demand
                    </span>
                  </div>
                  <PropertyCard id={highDemandProperty.id} image={highDemandProperty.image} title={highDemandProperty.title} location={highDemandProperty.location} rent={highDemandProperty.rent} bedrooms={highDemandProperty.bedrooms} bathrooms={highDemandProperty.bathrooms} ownerName={highDemandProperty.ownerName} />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Popular Cities Section */}
          <section className="py-12 bg-background-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  Popular Cities
                </h2>
                <p className="text-gray-600">
                  Explore properties in top locations across Nepal
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCities.map((city, index) => <motion.div key={city.name} initial={{
              opacity: 0,
              scale: 0.95
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} whileHover={{
              scale: 1.03,
              y: -5
            }} transition={{
              duration: 0.3,
              delay: index * 0.1
            }} viewport={{
              once: true
            }} className="relative h-48 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl group" onClick={() => navigate('/properties')}>
                    <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-bold mb-1">
                        {city.name}
                      </h3>
                      <p className="text-white/80 text-sm">{city.count}</p>
                    </div>
                  </motion.div>)}
              </div>
            </div>
          </section>
        </>}

      {/* FAQs Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                If your question isn't listed above, our support team is always
                ready to assist you. Feel free to reach out anytime for quick
                guidance and reliable answers.
              </p>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }} className="lg:col-span-3">
              {faqs.map((faq, index) => <FAQItem key={index} question={`${index + 1}. ${faq.question}`} answer={faq.answer} isOpen={openFaqIndex === index} onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} />)}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              What Our Users Say
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Join thousands of satisfied renters and property owners who trust
              Flat-Mate
            </p>
          </motion.div>

          <div className="relative">
            <motion.button onClick={goToPreviousReviews} disabled={currentReviewIndex === 0} whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${currentReviewIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-background-accent hover:shadow-xl'}`} aria-label="Previous reviews">
              <ChevronLeftIcon className="w-6 h-6 text-primary" />
            </motion.button>

            <motion.button onClick={goToNextReviews} disabled={currentReviewIndex === totalReviewPages - 1} whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${currentReviewIndex === totalReviewPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-background-accent hover:shadow-xl'}`} aria-label="Next reviews">
              <ChevronRightIcon className="w-6 h-6 text-primary" />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.div key={currentReviewIndex} initial={{
              opacity: 0,
              x: 50
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -50
            }} transition={{
              duration: 0.3
            }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedReviews.map((testimonial, index) => <motion.div key={`${currentReviewIndex}-${index}`} whileHover={{
                y: -5,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }} className="bg-white rounded-card p-5 shadow-card min-h-[280px] flex flex-col">
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className={`w-4 h-4 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
                      "{testimonial.comment}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      {testimonial.avatar ? <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-background-accent rounded-full flex items-center justify-center text-button-primary font-medium text-sm">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>}
                      <div>
                        <p className="font-semibold text-primary text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>)}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({
              length: totalReviewPages
            }).map((_, index) => <motion.button key={index} onClick={() => setCurrentReviewIndex(index)} whileHover={{
              scale: 1.2
            }} whileTap={{
              scale: 0.9
            }} className={`h-2 rounded-full transition-all ${index === currentReviewIndex ? 'w-8 bg-button-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} aria-label={`Go to review page ${index + 1}`} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Write a Review Section - NEW MODERN UI */}
      <section className="py-16 bg-gradient-to-br from-background-light via-white to-background-accent relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-button-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '1s'
        }} />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <motion.div initial={{
            scale: 0
          }} whileInView={{
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 200
          }} className="inline-flex items-center gap-2 px-4 py-2 bg-button-primary/10 rounded-full mb-4">
              <StarIcon className="w-5 h-5 text-button-primary fill-button-primary" />
              <span className="text-sm font-medium text-button-primary">
                Join 1000+ Happy Users
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              We'd Love to Hear From You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your feedback matters! Share your experience and help us create a
              better platform for everyone.
            </p>
          </motion.div>

          <ReviewSubmissionForm />
        </div>
      </section>

      {/* Enhanced CTA Section with Animation */}
      <section className="relative py-20 bg-gradient-to-br from-button-primary via-primary to-button-primary overflow-hidden">
        {/* Animated Background Pattern */}
        <motion.div animate={{
        backgroundPosition: ['0% 0%', '100% 100%']
      }} transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear'
      }} className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
        backgroundSize: '60px 60px'
      }} />

        {/* Floating Orbs */}
        <motion.div animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      }} transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }} className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <motion.div animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.5, 0.3, 0.5]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1
      }} className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div initial={{
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
        }}>
            {/* Icon */}
            <motion.div initial={{
            scale: 0,
            rotate: -180
          }} whileInView={{
            scale: 1,
            rotate: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15
          }} className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-lg">
              <HomeIcon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.3
          }} className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect Home?
            </motion.h2>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.4
          }} className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of happy renters who found their ideal space
              through Flat-Mate. Start your search today!
            </motion.p>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.5
          }} className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-xl" onClick={handleViewAllProperties}>
                  Start Searching
                </Button>
              </motion.div>
              <Link to="/login">
                <motion.div whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                  <Button variant="outline" size="lg" className="text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm">
                    List Your Property
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Auth Required Modal */}
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginClick={() => {
      setShowAuthModal(false);
      setShowLoginModal(true);
    }} onSignupClick={() => {
      setShowAuthModal(false);
      setShowSignupModal(true);
    }} />

      {/* Auth Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSignupClick={() => {
      setShowLoginModal(false);
      setShowSignupModal(true);
    }} onForgotPasswordClick={() => {
      // Add logic later
    }} />

      <SignupModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} onLoginClick={() => {
      setShowSignupModal(false);
      setShowLoginModal(true);
    }} />
    </main>;
}