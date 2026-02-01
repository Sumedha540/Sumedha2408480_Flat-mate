import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, TrashIcon, FilterIcon } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
const initialFavorites = [{
  id: '1',
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
  title: 'Modern 2BHK Apartment',
  location: 'Thamel, Kathmandu',
  rent: 25000,
  bedrooms: 2,
  bathrooms: 1,
  isFavorite: true,
  views: 245
}, {
  id: '2',
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
  title: 'Cozy Studio Room',
  location: 'Patan, Lalitpur',
  rent: 12000,
  bedrooms: 1,
  bathrooms: 1,
  isFavorite: true,
  views: 189
}, {
  id: '3',
  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  title: 'Spacious 3BHK Flat',
  location: 'Bhaktapur',
  rent: 35000,
  bedrooms: 3,
  bathrooms: 2,
  isFavorite: true,
  views: 312
}];
export function FavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();
  const handleRemove = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    toast.success('Removed from favorites', {
      icon: '💔',
      duration: 2000
    });
  };
  const handleClearAll = () => {
    if (favorites.length === 0) return;
    setFavorites([]);
    toast.success('All favorites cleared', {
      icon: '🗑️',
      duration: 2000
    });
  };
  // Sort favorites
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.rent - b.rent;
      case 'price-high':
        return b.rent - a.rent;
      case 'recent':
      default:
        return 0;
    }
  });
  return <main className="min-h-screen bg-background-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              My Favorites
            </h1>
            <motion.p className="text-gray-600" key={favorites.length} initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }}>
              {favorites.length} saved{' '}
              {favorites.length === 1 ? 'property' : 'properties'}
            </motion.p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {favorites.length > 0 && <>
                <div className="flex-1 sm:w-48">
                  <Select value={sortBy} onChange={e => setSortBy(e.target.value)} options={[{
                value: 'recent',
                label: 'Recently Added'
              }, {
                value: 'price-low',
                label: 'Price: Low to High'
              }, {
                value: 'price-high',
                label: 'Price: High to Low'
              }]} />
                </div>
                <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  <Button variant="secondary" onClick={handleClearAll} className="gap-2">
                    <TrashIcon className="w-4 h-4" />
                    Clear All
                  </Button>
                </motion.div>
              </>}
          </div>
        </motion.div>

        {/* Favorites Grid */}
        <AnimatePresence mode="popLayout">
          {favorites.length > 0 ? <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFavorites.map((property, index) => <motion.div key={property.id} layout initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0,
            scale: 0.8,
            rotate: -5
          }} transition={{
            delay: index * 0.05,
            layout: {
              duration: 0.3
            }
          }}>
                  <PropertyCard {...property} onFavoriteToggle={handleRemove} />
                </motion.div>)}
            </motion.div> : <motion.div key="empty" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} className="text-center py-20">
              <motion.div animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, -10, 0]
          }} transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }} className="w-20 h-20 bg-background-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-10 h-10 text-button-primary" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-primary mb-2">
                No favorites yet
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start exploring properties and save your favorites to easily
                find them later.
              </p>
              <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                <Button onClick={() => navigate('/properties')}>
                  Browse Properties
                </Button>
              </motion.div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </main>;
}