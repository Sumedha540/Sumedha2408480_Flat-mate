import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HomeIcon, UsersIcon, ShieldCheckIcon, TrendingUpIcon, HeartIcon, AwardIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
export function AboutPage() {
  const stats = [{
    label: 'Properties Listed',
    value: '500+'
  }, {
    label: 'Happy Tenants',
    value: '1,000+'
  }, {
    label: 'Verified Owners',
    value: '300+'
  }, {
    label: 'Cities Covered',
    value: '10+'
  }];
  const perks = [{
    icon: ShieldCheckIcon,
    title: 'Verified Properties',
    description: 'All properties are verified by our team to ensure quality and authenticity.'
  }, {
    icon: UsersIcon,
    title: 'Trusted Community',
    description: 'Join thousands of satisfied tenants and property owners in our platform.'
  }, {
    icon: TrendingUpIcon,
    title: 'Easy Process',
    description: 'Simple and streamlined process from browsing to booking your dream property.'
  }, {
    icon: HeartIcon,
    title: 'Customer Support',
    description: '24/7 customer support to help you with any questions or concerns.'
  }, {
    icon: AwardIcon,
    title: 'Best Deals',
    description: 'Get access to exclusive deals and the best rental prices in Nepal.'
  }, {
    icon: HomeIcon,
    title: 'Wide Selection',
    description: 'From budget rooms to luxury apartments, find properties that match your needs.'
  }];
  const team = [{
    name: 'Rajesh Kumar',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop'
  }, {
    name: 'Sita Sharma',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop'
  }, {
    name: 'Bikash Thapa',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop'
  }, {
    name: 'Anita Rai',
    role: 'Customer Success',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop'
  }];
  return <main className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              About Flat-Mate
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We're on a mission to make finding and renting properties in Nepal
              easier, safer, and more transparent. Whether you're a tenant
              looking for your dream home or an owner wanting to list your
              property, we've got you covered.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/properties">
                <Button size="lg">Browse Properties</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-button-primary to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-white/90">{stat.label}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl font-bold text-primary mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Flat-Mate, we believe everyone deserves a safe, comfortable,
                and affordable place to call home. Our platform connects tenants
                with verified property owners across Nepal, making the rental
                process transparent and hassle-free.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We leverage technology to eliminate the traditional pain points
                of property hunting - from fake listings to unreliable
                landlords. Every property on our platform is verified, and every
                owner is authenticated.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're a student looking for a room near your
                university, a family searching for a spacious apartment, or a
                property owner wanting to reach genuine tenants, Flat-Mate is
                here to help.
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
          }} className="relative">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop" alt="Modern apartment" className="rounded-2xl shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose Flat-Mate?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive platform that makes property rental
              simple, safe, and efficient for everyone involved.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {perks.map((perk, index) => {
            const Icon = perk.icon;
            return <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-background-light rounded-card p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-button-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-button-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {perk.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {perk.description}
                  </p>
                </motion.div>;
          })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to revolutionize the
              rental market in Nepal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="text-center">
                <div className="relative mb-4 mx-auto w-48 h-48">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
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
          }} className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Dream Home?
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
              Join thousands of happy tenants and property owners on Flat-Mate
              today. Start your journey to finding the perfect rental property.
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
              <Link to="/properties">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 shadow-xl">
                  Browse Properties
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm">
                  Sign Up Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>;
}