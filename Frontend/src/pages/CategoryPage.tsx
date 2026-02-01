import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, ArrowRightIcon, StarIcon, ZapIcon } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
// Mock data generator based on category
const getCategoryData = (id: string) => {
  const titles: Record<string, string> = {
    rooms: 'Rooms for Rent',
    '1bhk': '1BHK Flats',
    '2bhk': '2BHK Flats',
    '3bhk': '3BHK+ Apartments',
    studio: 'Studio Apartments',
    shared: 'Shared Accommodation'
  };
  const descriptions: Record<string, string> = {
    rooms: 'Find affordable single and double rooms for rent. Ideal for students and working professionals.',
    '1bhk': 'Perfect for couples or singles. 1 Bedroom, Hall, and Kitchen flats available in prime locations.',
    '2bhk': 'Spacious 2BHK flats suitable for small families. Browse verified listings with great amenities.',
    '3bhk': 'Luxury 3BHK+ apartments with premium facilities like parking, lift, and security.',
    studio: 'Compact and modern studio apartments. Fully furnished options available for easy moving.',
    shared: 'Find roommates and shared flats. Save money and make new friends in the city.'
  };
  return {
    title: titles[id] || 'Properties',
    description: descriptions[id] || 'Browse our verified property listings.',
    count: '120+'
  };
};
export function CategoryPage() {
  const {
    categoryId = 'rooms'
  } = useParams();
  const data = getCategoryData(categoryId);
  const [currentPage, setCurrentPage] = useState(1);
  // Mock properties
  const properties = Array.from({
    length: 6
  }).map((_, i) => ({
    id: `${categoryId}-${i}`,
    image: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=800&auto=format&fit=crop`,
    title: `${data.title} in ${['Kathmandu', 'Lalitpur', 'Pokhara'][i % 3]}`,
    location: ['Baneshwor', 'Jhamsikhel', 'Lakeside'][i % 3],
    rent: 15000 + i * 2000,
    bedrooms: categoryId.includes('bhk') ? parseInt(categoryId[0]) : 1,
    bathrooms: 1,
    views: 100 + i * 10
  }));
  return <main className="min-h-screen bg-background-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{' '}
          &gt;
          <Link to="/properties" className="hover:text-primary mx-1">
            Properties
          </Link>{' '}
          &gt;
          <span className="text-primary font-medium mx-1">{data.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {data.title} in Nepal
          </h1>
          <p className="text-gray-600">
            {data.count} verified properties available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Filter Bar */}
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Select placeholder="Location" options={[{
                value: 'ktm',
                label: 'Kathmandu'
              }, {
                value: 'lalit',
                label: 'Lalitpur'
              }]} />
                <Select placeholder="Price Range" options={[{
                value: 'low',
                label: 'Under 15k'
              }, {
                value: 'mid',
                label: '15k-30k'
              }]} />
                <Select placeholder="Furnishing" options={[{
                value: 'full',
                label: 'Furnished'
              }, {
                value: 'semi',
                label: 'Semi'
              }]} />
                <Select placeholder="Sort By" options={[{
                value: 'new',
                label: 'Newest'
              }, {
                value: 'price_low',
                label: 'Price: Low to High'
              }]} />
              </div>
            </Card>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {properties.map((property, index) => <motion.div key={property.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.05
            }}>
                  <PropertyCard {...property} />
                </motion.div>)}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mb-12">
              {[1, 2, 3].map(page => <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${currentPage === page ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                  {page}
                </button>)}
              <button className="px-4 h-10 bg-white rounded-lg text-gray-600 hover:bg-gray-100 flex items-center gap-1">
                Next <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* SEO Content Block */}
            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-primary mb-4">
                About {data.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {data.description} {data.title} are a popular choice for many
                residents in Nepal. Whether you are looking for a place in the
                bustling streets of Kathmandu or the peaceful areas of Pokhara,
                we have listings that suit every budget and requirement. Rent
                typically ranges depending on the location, facilities, and
                furnishing status.
              </p>
            </div>
          </div>

          {/* Sidebar - NO ICONS */}
          <div className="lg:w-80 space-y-6">
            {/* Map View Widget */}
            <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gray-300" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <Button variant="secondary" className="relative z-10 gap-2">
                <MapPinIcon className="w-4 h-4" />
                View on Map
              </Button>
            </div>

            {/* Match Suggestions - NO ICON */}
            <Link to="/match-suggestions">
              <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-button-primary">
                <h3 className="font-bold text-primary text-lg mb-2">
                  Match Suggestions
                </h3>
                <p className="text-sm text-gray-600">
                  Find properties that match your preferences
                </p>
              </Card>
            </Link>

            {/* Saved Profiles - NO ICON */}
            <Link to="/saved-roommates">
              <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-button-primary">
                <h3 className="font-bold text-primary text-lg mb-2">
                  Saved Profiles
                </h3>
                <p className="text-sm text-gray-600">
                  View your saved properties and roommates
                </p>
              </Card>
            </Link>

            {/* Safety Tips - NO ICON */}
            <Link to="/roommate-safety">
              <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-button-primary">
                <h3 className="font-bold text-primary text-lg mb-2">
                  Safety Tips
                </h3>
                <p className="text-sm text-gray-600">
                  Learn how to stay safe while renting
                </p>
              </Card>
            </Link>

            {/* Success Stories - NO ICON */}
            <Link to="/success-stories">
              <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-button-primary">
                <h3 className="font-bold text-primary text-lg mb-2">
                  Success Stories
                </h3>
                <p className="text-sm text-gray-600">
                  Read inspiring stories from our community
                </p>
              </Card>
            </Link>

            {/* Urgent Listings */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ZapIcon className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-primary">Urgent Listings</h3>
              </div>
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="flex gap-3 group cursor-pointer">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=200&h=200&fit=crop`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-primary line-clamp-2 group-hover:text-blue-600 transition-colors">
                        Urgent: {data.title} in Koteshwor
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        NPR 12,000/mo
                      </p>
                    </div>
                  </div>)}
              </div>
            </Card>

            {/* Top Rated */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <StarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">Top Rated</h3>
              </div>
              <div className="space-y-3">
                {['Sunrise Apartments', 'City View Flats', 'Green Valley Homes'].map((name, i) => <div key={i} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-gray-700">{name}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span className="font-bold text-xs">4.{8 - i}</span>
                      <StarIcon className="w-3 h-3 fill-current" />
                    </div>
                  </div>)}
              </div>
            </Card>

            {/* Nearby Localities */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-primary mb-3">Popular Areas</h3>
              <div className="flex flex-wrap gap-2">
                {['Baneshwor', 'Koteshwor', 'Thamel', 'Patan', 'Lazimpat'].map(area => <span key={area} className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 border border-blue-100 hover:border-blue-300 cursor-pointer transition-colors">
                      {area}
                    </span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>;
}