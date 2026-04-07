// src/components/PropertyCard.tsx
// Heart icon reads/writes from global FavoritesContext
// so favorites persist across all pages (LandingPage, PropertiesPage, PropertyDetailPage)

import React from 'react'
import { motion } from 'framer-motion'
import { MapPinIcon, BedDoubleIcon, BathIcon, HeartIcon, EyeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useFavorites } from '../contexts/FavoritesContext'

export interface PropertyCardProps {
  id: string
  image: string
  title: string
  location: string
  rent: number
  bedrooms: number
  bathrooms: number
  ownerName?: string
  views?: number
  isPremium?: boolean
}

export function PropertyCard({
  id, image, title, location, rent,
  bedrooms, bathrooms, ownerName, views = 0, isPremium = false
}: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(id)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({ id, image, title, location, rent, bedrooms, bathrooms, ownerName, views, isPremium })
    if (saved) {
      toast.success('Removed from favorites', {
        style: {
          background: '#6B7280',
          color: 'white',
        },
      })
    } else {
      toast.success('Saved to favorites!', {
        style: {
          background: '#2F7D5F',
          color: 'white',
        },
      })
    }
  }

  return (
    <Link to={`/property/${id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col group border border-gray-100"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={image} alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-primary shadow-sm">For Rent</span>
            {isPremium && <span className="bg-yellow-400 px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm">Premium</span>}
          </div>
          {/* Heart button — connected to global context */}
          <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
          >
            <HeartIcon className={`w-4 h-4 transition-all duration-200 ${saved ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'}`} />
          </motion.button>
          {/* Price */}
          <div className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg shadow-sm">
            <span className="font-bold">रू {rent.toLocaleString()}</span>
            <span className="text-xs opacity-90">/month</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors mb-2">{title}</h3>
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5"><BedDoubleIcon className="w-4 h-4 text-primary" /><span>{bedrooms} Beds</span></div>
            <div className="flex items-center gap-1.5"><BathIcon className="w-4 h-4 text-primary" /><span>{bathrooms} Baths</span></div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                {ownerName ? ownerName.charAt(0).toUpperCase() : 'O'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-900">{ownerName || 'Owner'}</span>
                {views > 0 && <span className="text-[10px] text-gray-500 flex items-center gap-1"><EyeIcon className="w-3 h-3" /> {views} views</span>}
              </div>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">View Details</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
