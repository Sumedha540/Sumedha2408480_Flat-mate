import React from 'react';
import { RoommateCard } from '../components/RoommateCard';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
export function SavedRoommatesPage() {
  // Mock saved data
  const savedRoommates = [{
    id: '1',
    name: 'Aarav Sharma',
    age: 24,
    gender: 'Male',
    occupation: 'Software Developer',
    budget: 'NPR 10,000 - 15,000',
    location: 'Koteshwor, Kathmandu',
    moveInDate: 'Immediate',
    bio: 'Clean, quiet professional looking for a shared flat.',
    tags: ['Early Riser', 'Non-Smoker', 'Vegetarian'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop'
  }];
  return <main className="min-h-screen bg-background-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-primary">Saved Profiles</h1>
          <Link to="/find-roommate">
            <Button variant="outline">Browse More</Button>
          </Link>
        </div>

        {savedRoommates.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRoommates.map(roommate => <RoommateCard key={roommate.id} {...roommate} />)}
          </div> : <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 mb-4">
              You haven't saved any profiles yet.
            </p>
            <Link to="/find-roommate">
              <Button>Find Roommates</Button>
            </Link>
          </div>}
      </div>
    </main>;
}