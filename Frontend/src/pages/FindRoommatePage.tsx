import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, FilterIcon, MapPinIcon, SparklesIcon, HeartIcon, ShieldIcon, TrophyIcon, UsersIcon, ArrowRightIcon, HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { RoommateCard } from '../components/RoommateCard';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
const allRoommates = [{
  id: '1',
  name: 'Aarav Sharma',
  age: 24,
  gender: 'Male',
  occupation: 'Software Developer',
  budget: 'NPR 10,000 - 15,000',
  location: 'Koteshwor, Kathmandu',
  moveInDate: 'Immediate',
  bio: 'Clean, quiet professional looking for a shared flat. I work from home 2 days a week. Non-smoker.',
  tags: ['Early Riser', 'Non-Smoker', 'Vegetarian'],
  verified: true,
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop'
}, {
  id: '2',
  name: 'Priya Adhikari',
  age: 22,
  gender: 'Female',
  occupation: 'Student',
  budget: 'NPR 8,000 - 12,000',
  location: 'Baneshwor, Kathmandu',
  moveInDate: 'Next Month',
  bio: 'Masters student at TU. Looking for a female roommate. I study a lot so I prefer a quiet environment.',
  tags: ['Student', 'Quiet', 'No Pets'],
  verified: true,
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop'
}, {
  id: '3',
  name: 'Suman Gurung',
  age: 28,
  gender: 'Male',
  occupation: 'Chef',
  budget: 'NPR 15,000 - 20,000',
  location: 'Pokhara Lakeside',
  moveInDate: 'In 2 weeks',
  bio: 'Working at a hotel in Lakeside. I love cooking and often make extra food for roommates!',
  tags: ['Foodie', 'Night Owl', 'Social'],
  verified: false,
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop'
}, {
  id: '4',
  name: 'Rina Tamang',
  age: 25,
  gender: 'Female',
  occupation: 'Nurse',
  budget: 'NPR 12,000 - 18,000',
  location: 'Lalitpur',
  moveInDate: 'Immediate',
  bio: 'Working shifts at Patan Hospital. Need a place that is quiet during the day.',
  tags: ['Clean', 'Shift Worker', 'Pet Friendly'],
  verified: true,
  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop'
}, {
  id: '5',
  name: 'Bibek Thapa',
  age: 26,
  gender: 'Male',
  occupation: 'Graphic Designer',
  budget: 'NPR 10,000 - 14,000',
  location: 'Bhaktapur',
  moveInDate: 'Flexible',
  bio: 'Creative person, love music and art. Looking for chill roommates who like to hang out.',
  tags: ['Artist', 'Music Lover', 'Chill'],
  verified: true,
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop'
}, {
  id: '6',
  name: 'Sarah Shrestha',
  age: 23,
  gender: 'Female',
  occupation: 'Marketing Intern',
  budget: 'NPR 9,000 - 13,000',
  location: 'Thamel',
  moveInDate: 'Next Month',
  bio: 'New in the city. Looking for a friendly place. I love exploring cafes and hiking.',
  tags: ['Social', 'Hiker', 'Coffee Lover'],
  verified: true,
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop'
}, {
  id: '7',
  name: 'Kiran KC',
  age: 27,
  gender: 'Male',
  occupation: 'Banker',
  budget: 'NPR 18,000',
  location: 'Lazimpat',
  moveInDate: 'Immediate',
  bio: 'Professional banker looking for a clean and quiet place. I work long hours.',
  tags: ['Professional', 'Quiet', 'Clean'],
  verified: true,
  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop'
}, {
  id: '8',
  name: 'Anjali Lama',
  age: 24,
  gender: 'Female',
  occupation: 'Teacher',
  budget: 'NPR 11,000',
  location: 'Kalanki',
  moveInDate: 'Next Week',
  bio: 'School teacher. Early riser. Looking for female roommates only.',
  tags: ['Teacher', 'Early Riser', 'Female Only'],
  verified: true,
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop'
}, {
  id: '9',
  name: 'Rohit Gupta',
  age: 29,
  gender: 'Male',
  occupation: 'Entrepreneur',
  budget: 'NPR 25,000',
  location: 'Jhamsikhel',
  moveInDate: 'Flexible',
  bio: 'Running my own startup. Need a premium place with good internet.',
  tags: ['Entrepreneur', 'Tech', 'Premium'],
  verified: true,
  image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop'
}];
const sidebarCards = [{
  id: 'match',
  title: 'Match Suggestions',
  description: 'Get AI-powered roommate recommendations based on your preferences',
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&fit=crop',
  icon: SparklesIcon,
  link: '/match-suggestions',
  color: 'from-purple-500 to-pink-500'
}, {
  id: 'saved',
  title: 'Saved Profiles',
  description: 'View all the roommate profiles you have saved for later',
  image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&fit=crop',
  icon: HeartIcon,
  link: '/saved-roommates',
  color: 'from-red-500 to-orange-500'
}, {
  id: 'safety',
  title: 'Safety Tips',
  description: 'Learn essential safety guidelines for sharing accommodation',
  image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&fit=crop',
  icon: ShieldIcon,
  link: '/roommate-safety',
  color: 'from-green-500 to-teal-500'
}, {
  id: 'stories',
  title: 'Success Stories',
  description: 'Read inspiring stories from people who found their perfect roommate',
  image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&fit=crop',
  icon: TrophyIcon,
  link: '/success-stories',
  color: 'from-yellow-500 to-orange-500'
}];
const featuredRooms = [{
  id: 1,
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&fit=crop',
  location: 'Lazimpat',
  price: 'NPR 15,000'
}, {
  id: 2,
  image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&fit=crop',
  location: 'Baneshwor',
  price: 'NPR 12,000'
}, {
  id: 3,
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&fit=crop',
  location: 'Lalitpur',
  price: 'NPR 18,000'
}, {
  id: 4,
  image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&fit=crop',
  location: 'Thamel',
  price: 'NPR 20,000'
}];
export function FindRoommatePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [displayedCount, setDisplayedCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 3, allRoommates.length));
      setIsLoadingMore(false);
      toast.success(`Loaded ${Math.min(3, allRoommates.length - displayedCount)} more roommates`, {
        duration: 2000
      });
    }, 800);
  };
  // Filter roommates
  const filteredRoommates = allRoommates.filter(roommate => {
    const matchesSearch = searchTerm ? roommate.name.toLowerCase().includes(searchTerm.toLowerCase()) || roommate.bio.toLowerCase().includes(searchTerm.toLowerCase()) || roommate.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) : true;
    const matchesLocation = locationFilter ? roommate.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesGender = genderFilter ? roommate.gender?.toLowerCase() === genderFilter.toLowerCase() : true;
    return matchesSearch && matchesLocation && matchesGender;
  });
  const displayedRoommates = filteredRoommates.slice(0, displayedCount);
  return <main className="min-h-screen bg-background-light pb-12">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-button-primary via-primary to-button-primary text-white py-16 md:py-20 overflow-hidden">
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }} className="max-w-3xl">
            {/* Icon */}
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
              <UsersIcon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Roommate
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="text-white/90 text-lg mb-8">
              Connect with verified people looking for shared accommodation in
              Nepal. Safe, simple, and secure.
            </motion.p>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} className="flex flex-wrap gap-4">
              <Link to="/post-roommate">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-xl">
                  Post Your Requirement
                </Button>
              </Link>
              <Link to="/roommate-quiz">
                <Button variant="outline" className="text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm" size="lg">
                  Take Compatibility Quiz
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar - Elevated */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="bg-white rounded-xl shadow-xl p-4 md:p-6 mb-8 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input placeholder="Search by name, bio, or interests..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} icon={<SearchIcon className="w-5 h-5" />} />
            </div>
            <Select placeholder="Location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} options={[{
            value: '',
            label: 'All Locations'
          }, {
            value: 'kathmandu',
            label: 'Kathmandu'
          }, {
            value: 'lalitpur',
            label: 'Lalitpur'
          }, {
            value: 'bhaktapur',
            label: 'Bhaktapur'
          }, {
            value: 'pokhara',
            label: 'Pokhara'
          }]} />
            <Select placeholder="Gender" value={genderFilter} onChange={e => setGenderFilter(e.target.value)} options={[{
            value: '',
            label: 'Any Gender'
          }, {
            value: 'male',
            label: 'Male'
          }, {
            value: 'female',
            label: 'Female'
          }]} />
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Rooms Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <HomeIcon className="w-5 h-5 text-[#0B6623]" />
                <h2 className="text-xl font-bold text-primary">
                  Featured Rooms
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredRooms.map(room => <div key={room.id} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-md h-40">
                    <img src={room.image} alt={room.location} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                      <p className="text-white font-bold text-sm">
                        {room.location}
                      </p>
                      <p className="text-white/90 text-xs">{room.price}</p>
                    </div>
                  </div>)}
              </div>
            </motion.div>

            {/* Results Count */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="mb-6">
              <p className="text-gray-600">
                Showing{' '}
                <span className="font-semibold text-primary">
                  {displayedRoommates.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-primary">
                  {filteredRoommates.length}
                </span>{' '}
                roommates
              </p>
            </motion.div>

            {/* Listings Grid */}
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {displayedRoommates.map((roommate, index) => <motion.div key={roommate.id} layout initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0.9
              }} transition={{
                delay: index * 0.05
              }}>
                    <RoommateCard {...roommate} />
                  </motion.div>)}
              </motion.div>
            </AnimatePresence>

            {/* Load More */}
            {displayedCount < filteredRoommates.length && <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="text-center">
                <Button variant="primary" size="lg" onClick={handleLoadMore} isLoading={isLoadingMore} className="bg-button-primary hover:bg-[#3d9970]">
                  Load More Roommates
                </Button>
              </motion.div>}

            {/* No Results */}
            {filteredRoommates.length === 0 && <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  No roommates found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search filters
                </p>
                <Button onClick={() => {
              setSearchTerm('');
              setLocationFilter('');
              setGenderFilter('');
              setBudgetFilter('');
            }}>
                  Clear Filters
                </Button>
              </motion.div>}
          </div>

          {/* Enhanced Sidebar - EXACT CARD MATCH */}
          <div className="lg:w-80 space-y-6">
            {sidebarCards.map((card, index) => {
            const Icon = card.icon;
            return <motion.div key={card.id} initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.3 + index * 0.1
            }}>
                  <Link to={card.link}>
                    <motion.div whileHover={{
                  y: -5,
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }} whileTap={{
                  scale: 0.98
                }} className="relative h-48 overflow-hidden rounded-xl shadow-md cursor-pointer group">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
                      </div>

                      {/* Content */}
                      <div className="relative p-6 h-full flex flex-col text-white">
                        <div className="flex justify-between items-start mb-auto">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-xl mb-2">
                            {card.title}
                          </h3>
                          <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
                            {card.description}
                          </p>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowRightIcon className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>;
          })}

            {/* Stats Card */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.7
          }}>
              <Card className="p-6 bg-gradient-to-br from-background-accent to-white">
                <h3 className="font-bold text-primary mb-4">Platform Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-bold text-primary">2,500+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Successful Matches
                    </span>
                    <span className="font-bold text-primary">1,200+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Verified Profiles
                    </span>
                    <span className="font-bold text-primary">85%</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </main>;
}