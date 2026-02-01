import React, { Component } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, CalendarIcon, BriefcaseIcon, DollarSignIcon, CheckCircleIcon, MessageCircleIcon, Share2Icon, FlagIcon, UserIcon, CoffeeIcon, MoonIcon, UsersIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
export function RoommateProfilePage() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  // Mock data - in real app fetch based on ID
  const profile = {
    name: 'Aarav Sharma',
    age: 24,
    gender: 'Male',
    occupation: 'Software Developer',
    budget: 'NPR 10,000 - 15,000',
    location: 'Koteshwor, Kathmandu',
    moveInDate: 'Immediate',
    bio: "Hi! I'm a software developer working for a tech company in Thamel. I'm clean, organized, and respect privacy. I usually work from home 2 days a week. I enjoy hiking on weekends and cooking dinner sometimes. Looking for a friendly roommate to share a flat with.",
    tags: ['Early Riser', 'Non-Smoker', 'Vegetarian', 'No Pets'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Very Clean',
      smoking: 'Non-smoker',
      drinking: 'Socially',
      guests: 'Occasional',
      pets: 'No pets',
      food: 'Vegetarian'
    },
    socials: {
      instagram: 'aarav_s',
      linkedin: 'aarav-sharma'
    }
  };
  const handleSendMessage = () => {
    // Navigate to messages page with the profile ID as a query parameter
    navigate(`/messages?userId=${id}&userName=${encodeURIComponent(profile.name)}`);
  };
  return <main className="min-h-screen bg-background-light py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/find-roommate" className="hover:text-primary">
                Find Roommate
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary font-medium">{profile.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <img src={profile.image} alt={profile.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto" />
                  {profile.verified && <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm" title="Verified User">
                      <CheckCircleIcon className="w-6 h-6 text-blue-500 fill-white" />
                    </div>}
                </div>
                <h1 className="text-2xl font-bold text-primary mb-1">
                  {profile.name}
                </h1>
                <p className="text-gray-600">
                  {profile.age} • {profile.gender}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>{profile.occupation}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Budget</span>
                  <span className="font-semibold text-primary">
                    {profile.budget}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Location</span>
                  <span className="font-semibold text-primary">
                    {profile.location}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Move In</span>
                  <span className="font-semibold text-primary">
                    {profile.moveInDate}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button fullWidth className="gap-2" onClick={handleSendMessage}>
                  <MessageCircleIcon className="w-4 h-4" />
                  Send Message
                </Button>
                <Button fullWidth variant="outline" className="gap-2">
                  <Share2Icon className="w-4 h-4" />
                  Share Profile
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <button className="text-xs text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 mx-auto transition-colors">
                  <FlagIcon className="w-3 h-3" />
                  Report this profile
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {profile.bio}
              </p>

              <h3 className="font-semibold text-primary mb-3">
                Lifestyle & Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag, index) => <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>)}
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary mb-6">
                Living Preferences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cleanliness</p>
                    <p className="font-medium text-primary">
                      {profile.preferences.cleanliness}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <CoffeeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Food Habit</p>
                    <p className="font-medium text-primary">
                      {profile.preferences.food}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <MoonIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sleep Schedule</p>
                    <p className="font-medium text-primary">Early Riser</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <UsersIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium text-primary">
                      {profile.preferences.guests}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Verification Status */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <CheckCircleIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Verified Profile</h3>
                  <p className="text-sm text-gray-600">
                    Identity, Phone Number, and Email have been verified by
                    Flat-Mate.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>;
}