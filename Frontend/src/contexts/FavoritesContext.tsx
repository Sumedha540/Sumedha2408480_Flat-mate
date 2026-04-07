import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface FavoriteProperty {
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
  savedAt: number   // Date.now() timestamp for "Recently Added" sort
}

interface FavoritesContextType {
  favorites: FavoriteProperty[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (property: Omit<FavoriteProperty, 'savedAt'>) => void
  removeFavorite: (id: string) => void
  clearAll: () => void
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

const STORAGE_KEY = 'flatmate_favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const isFavorite = (id: string) => favorites.some(f => f.id === id)

  const toggleFavorite = (property: Omit<FavoriteProperty, 'savedAt'>) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === property.id)
      if (exists) return prev.filter(f => f.id !== property.id)
      return [{ ...property, savedAt: Date.now() }, ...prev]
    })
  }

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id))
  }

  const clearAll = () => setFavorites([])

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite, clearAll }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
