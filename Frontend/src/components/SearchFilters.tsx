import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { toast } from 'sonner';
interface SearchFiltersProps {
  onSearch?: (filters: FilterValues) => void;
}
interface FilterValues {
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  propertyType: string;
}
const locations = [{
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
}, {
  value: 'biratnagar',
  label: 'Biratnagar'
}];
const bedroomOptions = [{
  value: '',
  label: 'Any Bedrooms'
}, {
  value: '1',
  label: '1 Bedroom'
}, {
  value: '2',
  label: '2 Bedrooms'
}, {
  value: '3',
  label: '3 Bedrooms'
}, {
  value: '4+',
  label: '4+ Bedrooms'
}];
const propertyTypes = [{
  value: '',
  label: 'All Types'
}, {
  value: 'room',
  label: 'Room'
}, {
  value: 'flat',
  label: 'Flat'
}, {
  value: 'apartment',
  label: 'Apartment'
}, {
  value: 'house',
  label: 'House'
}];
export function SearchFilters({
  onSearch
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const handleChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
      onSearch?.(filters);
      const activeFilters = Object.values(filters).filter(v => v).length;
      toast.success(activeFilters > 0 ? `Found properties matching ${activeFilters} filter${activeFilters > 1 ? 's' : ''}` : 'Showing all properties', {
        duration: 2000
      });
    }, 800);
  };
  const handleClearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: ''
    });
    toast.success('Filters cleared', {
      duration: 1500
    });
  };
  const hasActiveFilters = Object.values(filters).some(v => v);
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.4
  }} className="bg-white rounded-card shadow-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.1
      }}>
          <Select label="Location" options={locations} value={filters.location} onChange={e => handleChange('location', e.target.value)} placeholder="Select location" />
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.15
      }}>
          <Select label="Property Type" options={propertyTypes} value={filters.propertyType} onChange={e => handleChange('propertyType', e.target.value)} placeholder="Select type" />
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }}>
          <Select label="Bedrooms" options={bedroomOptions} value={filters.bedrooms} onChange={e => handleChange('bedrooms', e.target.value)} placeholder="Select bedrooms" />
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.25
      }} className="flex items-end">
          <Button onClick={handleSearch} fullWidth className="gap-2" isLoading={isSearching}>
            <SearchIcon className="w-4 h-4" />
            Search
          </Button>
        </motion.div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <motion.button onClick={() => setShowAdvanced(!showAdvanced)} whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} className="flex items-center gap-2 text-sm text-button-primary hover:text-[#3d9970] transition-colors">
          <SlidersHorizontalIcon className="w-4 h-4" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </motion.button>

        <AnimatePresence>
          {hasActiveFilters && <motion.button initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.8
        }} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={handleClearFilters} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <XIcon className="w-4 h-4" />
              Clear Filters
            </motion.button>}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAdvanced && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.3
      }} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
              <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.1
          }}>
                <Input label="Min Price (रू)" type="number" placeholder="e.g., 5000" value={filters.minPrice} onChange={e => handleChange('minPrice', e.target.value)} />
              </motion.div>
              <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.15
          }}>
                <Input label="Max Price (रू)" type="number" placeholder="e.g., 25000" value={filters.maxPrice} onChange={e => handleChange('maxPrice', e.target.value)} />
              </motion.div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}