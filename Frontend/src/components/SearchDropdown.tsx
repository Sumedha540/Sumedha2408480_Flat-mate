import React, { useEffect, useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, ClockIcon, XIcon, TrendingUpIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
interface SearchHistory {
  query: string;
  timestamp: number;
}
const trendingSearches = ['2BHK in Kathmandu', 'Studio apartments', 'Rooms under 15k', 'Thamel properties', 'Furnished flats'];
export function SearchDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Load search history from localStorage
    const stored = localStorage.getItem('flatmate_search_history');
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);
  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [{
      query: query.trim(),
      timestamp: Date.now()
    }, ...searchHistory.filter(h => h.query !== query.trim())].slice(0, 5); // Keep only last 5 searches
    setSearchHistory(newHistory);
    localStorage.setItem('flatmate_search_history', JSON.stringify(newHistory));
  };
  const handleSearch = (query: string) => {
    if (query.trim()) {
      saveSearch(query);
      navigate(`/properties?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setSearchQuery('');
      toast.success(`Searching for "${query}"`, {
        duration: 2000
      });
    }
  };
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('flatmate_search_history');
    toast.success('Search history cleared', {
      duration: 1500
    });
  };
  const removeHistoryItem = (query: string) => {
    const newHistory = searchHistory.filter(h => h.query !== query);
    setSearchHistory(newHistory);
    localStorage.setItem('flatmate_search_history', JSON.stringify(newHistory));
  };
  return <div className="relative">
      {/* Search Icon Button */}
      <motion.button onClick={() => setIsOpen(!isOpen)} whileHover={{
      scale: 1.1
    }} whileTap={{
      scale: 0.9
    }} className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10" aria-label="Search properties">
        <SearchIcon className="w-5 h-5 stroke-[1.5]" />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && <>
            {/* Backdrop */}
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-40" />

            {/* Dropdown Panel */}
            <motion.div initial={{
          opacity: 0,
          y: -10,
          scale: 0.95
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} exit={{
          opacity: 0,
          y: -10,
          scale: 0.95
        }} transition={{
          duration: 0.2,
          type: 'spring',
          stiffness: 300
        }} className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <motion.input type="text" placeholder="Search properties..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch(searchQuery)} whileFocus={{
                scale: 1.02
              }} className="w-full pl-10 pr-4 py-2.5 bg-background-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-button-primary transition-all" autoFocus />
                  <AnimatePresence>
                    {searchQuery && <motion.button initial={{
                  opacity: 0,
                  scale: 0
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  scale: 0
                }} whileHover={{
                  scale: 1.2
                }} whileTap={{
                  scale: 0.8
                }} onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <XIcon className="w-4 h-4 text-gray-400" />
                      </motion.button>}
                  </AnimatePresence>
                </div>
              </div>

              {/* Search History */}
              <div className="max-h-80 overflow-y-auto">
                {searchHistory.length > 0 && <>
                    <div className="p-3 flex items-center justify-between border-b border-gray-100">
                      <span className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Recent Searches
                      </span>
                      <motion.button whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} onClick={clearHistory} className="text-xs text-button-primary hover:text-[#3d9970] hover:underline transition-colors">
                        Clear All
                      </motion.button>
                    </div>
                    <div>
                      {searchHistory.map((item, index) => <motion.button key={index} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} exit={{
                  opacity: 0,
                  x: 20,
                  height: 0
                }} transition={{
                  delay: index * 0.05
                }} whileHover={{
                  backgroundColor: 'rgba(215, 237, 228, 0.3)',
                  x: 4
                }} onClick={() => handleSearch(item.query)} className="w-full p-3 flex items-center gap-3 transition-all group">
                          <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="flex-1 text-left text-sm text-gray-700 group-hover:text-primary transition-colors">
                            {item.query}
                          </span>
                          <motion.button initial={{
                    opacity: 0
                  }} whileHover={{
                    opacity: 1,
                    scale: 1.2
                  }} onClick={e => {
                    e.stopPropagation();
                    removeHistoryItem(item.query);
                  }} className="p-1 hover:bg-red-100 rounded-full transition-all">
                            <XIcon className="w-3 h-3 text-gray-400 hover:text-red-500" />
                          </motion.button>
                        </motion.button>)}
                    </div>
                  </>}

                {/* Trending Searches */}
                <div className="border-t border-gray-100">
                  <div className="p-3 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                      <TrendingUpIcon className="w-3 h-3" />
                      Trending Searches
                    </span>
                  </div>
                  <div>
                    {trendingSearches.map((query, index) => <motion.button key={query} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: searchHistory.length * 0.05 + index * 0.05
                }} whileHover={{
                  backgroundColor: 'rgba(215, 237, 228, 0.3)',
                  x: 4
                }} onClick={() => handleSearch(query)} className="w-full p-3 flex items-center gap-3 transition-all group">
                        <TrendingUpIcon className="w-4 h-4 text-button-primary flex-shrink-0" />
                        <span className="flex-1 text-left text-sm text-gray-700 group-hover:text-primary transition-colors">
                          {query}
                        </span>
                        <ArrowRightIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </>}
      </AnimatePresence>
    </div>;
}