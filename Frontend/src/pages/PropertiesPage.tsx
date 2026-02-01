import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { GridIcon, ListIcon, TrendingUpIcon, ClockIcon, EyeIcon, DoorOpenIcon, HomeIcon, Building2Icon, BuildingIcon, UsersIcon, HeartIcon, MapIcon, InfoIcon, LightbulbIcon, ShieldCheckIcon, FilterIcon, SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { SearchFilters } from '../components/SearchFilters';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
const categories = [{
  id: 'rooms',
  name: 'Rooms',
  icon: DoorOpenIcon,
  count: '200+'
}, {
  id: '1bhk',
  name: '1BHK',
  icon: HomeIcon,
  count: '150+'
}, {
  id: '2bhk',
  name: '2BHK',
  icon: Building2Icon,
  count: '120+'
}, {
  id: '3bhk',
  name: '3BHK+',
  icon: BuildingIcon,
  count: '80+'
}, {
  id: 'studio',
  name: 'Studio',
  icon: HomeIcon,
  count: '60+'
}, {
  id: 'shared',
  name: 'Shared',
  icon: UsersIcon,
  count: '90+'
}];
// Generate 30 mock properties
const allProperties = Array.from({
  length: 30
}).map((_, i) => ({
  id: `prop-${i + 1}`,
  image: `https://images.unsplash.com/photo-${['1502672260266-1c1ef2d93688', '1522708323590-d24dbb6b0267', '1560448204-e02f11c3d0e2', '1493809842364-78817add7ffb', '1512917774080-9991f1c4c750', '1484154218962-a197022b5858'][i % 6]}?w=800&auto=format&fit=crop`,
  title: ['Modern Apartment in Thamel', 'Cozy Studio in Patan', 'Spacious Family Home', 'Luxury Penthouse', 'Budget Friendly Room', 'Shared Flat for Students'][i % 6],
  location: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Dharan'][i % 6],
  rent: 10000 + i * 1500 % 50000,
  bedrooms: i % 4 + 1,
  bathrooms: i % 2 + 1,
  ownerName: ['Ram Thapa', 'Sita Sharma', 'Hari Krishna', 'Gita Rai'][i % 4],
  views: 100 + i * 10,
  isPremium: i % 5 === 0
}));
type SortOption = 'latest' | 'oldest' | 'price-high' | 'price-low' | 'most-viewed' | 'most-liked';
export function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayCount, setDisplayCount] = useState(9);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const navigate = useNavigate();
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 9, allProperties.length));
  };
  const sortOptions = [{
    value: 'latest',
    label: 'Latest First'
  }, {
    value: 'oldest',
    label: 'Oldest First'
  }, {
    value: 'price-high',
    label: 'Price: High to Low'
  }, {
    value: 'price-low',
    label: 'Price: Low to High'
  }, {
    value: 'most-viewed',
    label: 'Most Viewed'
  }, {
    value: 'most-liked',
    label: 'Most Liked'
  }];
  return <main className="min-h-screen bg-background-light pb-12">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-background-light to-white border-b border-gray-100 overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }} className="absolute top-0 right-0 w-96 h-96 bg-button-primary/5 rounded-full blur-3xl" />
        <motion.div animate={{
        scale: [1.2, 1, 1.2],
        rotate: [90, 0, 90]
      }} transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'linear'
      }} className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}>
              {/* Badge */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2
            }} className="inline-flex items-center gap-2 px-4 py-2 bg-button-primary/10 rounded-full mb-6">
                <SparklesIcon className="w-4 h-4 text-button-primary" />
                <span className="text-sm font-semibold text-button-primary">
                  500+ Verified Properties
                </span>
              </motion.div>

              {/* Title with Gradient */}
              <motion.h1 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.3
            }} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-primary">Discover Your Next</span>
                <br />
                <span className="bg-gradient-to-r from-button-primary to-primary bg-clip-text text-transparent">
                  Dream Home
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4
            }} className="text-lg text-gray-600 mb-8 leading-relaxed">
                Explore the widest range of verified properties in Nepal. From
                cozy rooms to luxury apartments, we have something for everyone.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.5
            }} className="flex flex-wrap gap-4">
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                  Explore Now
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-2">
                  Learn More
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.6
            }} className="flex gap-8 mt-10">
                {[{
                value: '500+',
                label: 'Properties'
              }, {
                value: '1000+',
                label: 'Happy Tenants'
              }, {
                value: '50+',
                label: 'Locations'
              }].map((stat, index) => <motion.div key={stat.label} initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.7 + index * 0.1
              }}>
                    <p className="text-2xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </motion.div>)}
              </motion.div>
            </motion.div>

            {/* Right Image - NO ANIMATION ON HOVER */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2
          }} className="relative">
              {/* Main Image - Static on hover */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <motion.img initial={{
                scale: 1.2
              }} animate={{
                scale: 1
              }} transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }} src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop" alt="Modern Home" className="w-full h-[500px] object-cover" />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <motion.div initial={{
              opacity: 0,
              y: 30,
              scale: 0.8
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} transition={{
              delay: 0.8,
              type: 'spring',
              stiffness: 200
            }} className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <motion.div animate={{
                  scale: [1, 1.1, 1]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }} className="bg-green-100 p-3 rounded-xl">
                    <MapIcon className="w-6 h-6 text-green-600" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      500+ Locations
                    </p>
                    <p className="text-sm text-gray-500">Across Nepal</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }} transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="absolute -top-8 -right-8 w-32 h-32 bg-button-primary/20 rounded-full blur-2xl" />
              <motion.div animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }} transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }} className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary">
              Find Your Perfect Home
            </h2>
          </motion.div>
          <SearchFilters />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Most Liked Properties */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">
              Most Liked Properties
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProperties.slice(0, 4).map(property => <motion.div key={`liked-${property.id}`} whileHover={{
            y: -8
          }} transition={{
            duration: 0.3
          }}>
                <PropertyCard {...property} />
              </motion.div>)}
          </div>
        </section>

        {/* Info Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div whileHover={{
          y: -5
        }} transition={{
          duration: 0.3
        }}>
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <InfoIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Renting Guide
                  </h3>
                  <p className="text-gray-600 mb-4">
                    New to renting? Check out our comprehensive guide on rental
                    agreements, tenant rights, and moving tips in Nepal.
                  </p>
                  <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    Read Guide
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
          <motion.div whileHover={{
          y: -5
        }} transition={{
          duration: 0.3
        }}>
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white border-yellow-100">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <LightbulbIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Safety Tips
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Stay safe while house hunting. Learn how to spot scams,
                    verify owners, and ensure secure payments.
                  </p>
                  <Button variant="outline" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                    View Tips
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Featured Properties Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">
                Featured Properties
              </h2>
              <p className="text-gray-600">
                Showing {displayCount} of {allProperties.length} properties
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FilterIcon className="w-4 h-4" />
                Sort
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {allProperties.slice(0, displayCount).map((property, index) => <motion.div key={property.id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.05
          }} whileHover={{
            y: -8
          }}>
                <PropertyCard {...property} />
              </motion.div>)}
          </div>

          {displayCount < allProperties.length && <div className="text-center">
              <motion.div whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }}>
                <Button size="lg" variant="secondary" onClick={handleLoadMore} className="border-2 border-transparent hover:border-button-primary transition-all duration-300">
                  Load More Properties
                </Button>
              </motion.div>
            </div>}
        </section>
      </div>
    </main>;
}