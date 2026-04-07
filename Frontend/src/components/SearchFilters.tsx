// src/components/SearchFilters.tsx
// Uses the same CustomSelect as PropertiesPage — green theme, animated dropdown,
// no native <select> grey. Navigates to /properties with query params on Search.

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  SearchIcon, SlidersHorizontalIcon, XIcon,
  MapPinIcon, HomeIcon, BedDoubleIcon,
  ChevronDownIcon, CheckIcon,
} from 'lucide-react'

// ─── Options ──────────────────────────────────────────────────────────────────
const LOCATIONS    = ['All Locations', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Dharan']
const TYPES        = ['All Types', 'Apartment', 'Studio', 'House', 'Flat', 'Room']
const BEDROOMS     = ['Any Bedrooms', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms']
const PRICE_RANGES = ['Any Price', 'Under रू 10,000', 'रू 10,000 – 25,000', 'रू 25,000 – 50,000', 'Above रू 50,000']
const FURNISHINGS  = ['Any Furnishing', 'Furnished', 'Semi-furnished', 'Unfurnished']

// ─── Custom dropdown — same component as PropertiesPage ───────────────────────
function CustomSelect({
  label, value, options, icon, onChange,
}: {
  label: string; value: string; options: string[]
  icon?: React.ReactNode; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const isDefault = value === options[0]

  return (
    <div className="relative flex-1 min-w-[150px]" ref={ref}>
      {/* Label — same weight/size as subtitle text */}
      <label className="block text-sm text-gray-500 font-normal mb-2">
        {label}
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-2.5 pl-4 pr-3.5 py-3.5 rounded-xl border-2 text-base font-medium text-left transition-all ${
          open
            ? 'border-button-primary ring-2 ring-button-primary/20'
            : 'border-button-primary/25 hover:border-button-primary/50 hover:bg-button-primary/10'
        } ${isDefault ? 'text-gray-500' : 'text-gray-900'}`}
        style={{ backgroundColor: open ? 'rgba(45,106,79,0.08)' : 'rgba(45,106,79,0.04)' }}
      >
        {icon && <span className="text-button-primary flex-shrink-0">{icon}</span>}
        <span className="flex-1 truncate">{value}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon className="w-4 h-4 text-button-primary flex-shrink-0" />
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden py-1.5"
            style={{ minWidth: '100%', width: 'max-content' }}
          >
            {options.map(opt => {
              const selected = opt === value
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-button-primary text-white'
                      : 'text-gray-700 hover:bg-button-primary/10 hover:text-button-primary'
                  }`}
                >
                  {selected
                    ? <CheckIcon className="w-4 h-4 flex-shrink-0 text-white" />
                    : <span className="w-4 h-4 flex-shrink-0" />
                  }
                  {opt}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── SearchFilters — used on LandingPage ─────────────────────────────────────
export function SearchFilters() {
  const navigate = useNavigate()
  const [location,    setLocation]    = useState('All Locations')
  const [propType,    setPropType]    = useState('All Types')
  const [bedrooms,    setBedrooms]    = useState('Any Bedrooms')
  const [priceRange,  setPriceRange]  = useState('Any Price')
  const [furnishing,  setFurnishing]  = useState('Any Furnishing')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasFilters =
    location !== 'All Locations' || propType !== 'All Types' ||
    bedrooms !== 'Any Bedrooms' || priceRange !== 'Any Price' || furnishing !== 'Any Furnishing'

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location   !== 'All Locations')  params.set('location', location)
    if (propType   !== 'All Types')      params.set('type', propType)
    if (bedrooms   !== 'Any Bedrooms')   params.set('bedrooms', bedrooms)
    if (priceRange !== 'Any Price')      params.set('price', priceRange)
    if (furnishing !== 'Any Furnishing') params.set('furnishing', furnishing)
    navigate(params.toString() ? `/properties?${params}` : '/properties')
  }

  const handleClear = () => {
    setLocation('All Locations'); setPropType('All Types')
    setBedrooms('Any Bedrooms');  setPriceRange('Any Price')
    setFurnishing('Any Furnishing'); setShowAdvanced(false)
  }

  return (
    <div className="space-y-5">

      {/* Main row */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <CustomSelect
          label="Location"
          value={location}
          options={LOCATIONS}
          icon={<MapPinIcon className="w-4 h-4" />}
          onChange={setLocation}
        />
        <CustomSelect
          label="Property Type"
          value={propType}
          options={TYPES}
          icon={<HomeIcon className="w-4 h-4" />}
          onChange={setPropType}
        />
        <CustomSelect
          label="Bedrooms"
          value={bedrooms}
          options={BEDROOMS}
          icon={<BedDoubleIcon className="w-4 h-4" />}
          onChange={setBedrooms}
        />

        {/* Search button */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(45,106,79,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSearch}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-button-primary text-white
                     font-semibold text-base rounded-xl hover:bg-button-primary/90
                     transition-all shadow-md whitespace-nowrap flex-shrink-0 min-h-[52px]"
        >
          <SearchIcon className="w-5 h-5" />
          Search
        </motion.button>
      </div>

      {/* Bottom row: advanced toggle + clear */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="flex items-center gap-2 text-button-primary text-sm font-semibold hover:underline"
        >
          <SlidersHorizontalIcon className="w-4 h-4" />
          {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </button>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <XIcon className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-visible"
          >
            <div className="pt-2 flex flex-col md:flex-row gap-4">
              <CustomSelect
                label="Price Range"
                value={priceRange}
                options={PRICE_RANGES}
                onChange={setPriceRange}
              />
              <CustomSelect
                label="Furnishing"
                value={furnishing}
                options={FURNISHINGS}
                onChange={setFurnishing}
              />
              {/* Spacer to align with search button column */}
              <div className="hidden md:block flex-1" />
              <div className="hidden md:block" style={{ minWidth: '130px' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
