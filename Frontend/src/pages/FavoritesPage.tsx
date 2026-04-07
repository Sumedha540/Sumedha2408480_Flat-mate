

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartIcon, TrashIcon, HomeIcon } from 'lucide-react'
import { PropertyCard } from '../components/PropertyCard'
import { Button } from '../components/ui/Button'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'

type SortKey = 'recent' | 'price-low' | 'price-high'

export function FavoritesPage() {
  const { favorites, removeFavorite, clearAll } = useFavorites()
  const [sortBy, setSortBy] = useState<SortKey>('recent')
  const navigate = useNavigate()

  const sorted = [...favorites].sort((a, b) => {
    if (sortBy === 'price-low')  return a.rent - b.rent
    if (sortBy === 'price-high') return b.rent - a.rent
    return b.savedAt - a.savedAt  // recent first (default)
  })

  const handleClearAll = () => {
    clearAll()
    toast.success('All favorites cleared', { icon: '🗑️' })
  }

  return (
    <main className="min-h-screen bg-background-light py-8 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">My Favorites</h1>
            <motion.p key={favorites.length} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="text-gray-600">
              {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
            </motion.p>
          </div>

          {favorites.length > 0 && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Sort select */}
              <div className="flex-1 sm:w-52">
                <div className="relative">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
                    className="w-full appearance-none pl-4 pr-9 py-2.5 border-2 border-button-primary/25 bg-button-primary/5 rounded-xl text-sm font-medium focus:outline-none focus:border-button-primary focus:bg-button-primary/10 hover:border-button-primary/50 transition-all cursor-pointer"
                    style={{ color: '#1a4731' }}>
                    <option value="recent" style={{ color:'#1a4731' }}>Recently Added</option>
                    <option value="price-low" style={{ color:'#1a4731' }}>Price: Low to High</option>
                    <option value="price-high" style={{ color:'#1a4731' }}>Price: High to Low</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              {/* Clear all */}
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-50 transition-all">
                <TrashIcon className="w-4 h-4" /> Clear All
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* ── GRID or EMPTY STATE ── */}
        <AnimatePresence mode="popLayout">
          {sorted.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((property, index) => (
                <motion.div key={property.id} layout
                  initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:0.8, rotate:-3 }}
                  transition={{ delay: index * 0.05, layout: { duration:0.3 } }}>
                  <PropertyCard {...property} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0 }} className="text-center py-24">
              <motion.div animate={{ scale:[1,1.08,1], rotate:[0,-8,8,-8,0] }}
                transition={{ duration:2, repeat:Infinity, repeatDelay:2 }}
                className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-10 h-10 text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-primary mb-2">No favorites yet</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Click the ❤️ heart on any property to save it here. 
              </p>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                onClick={() => navigate('/properties')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-button-primary text-white font-bold rounded-full shadow-lg hover:bg-button-primary/90 transition-all">
                <HomeIcon className="w-5 h-5" /> Browse Properties
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
