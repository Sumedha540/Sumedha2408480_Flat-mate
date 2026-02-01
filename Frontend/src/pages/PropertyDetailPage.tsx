import React, { useState, createElement } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, BedDoubleIcon, BathIcon, UtensilsIcon, HomeIcon, PhoneIcon, MailIcon, EyeIcon, MessageCircleIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, SendIcon, StarIcon, CheckCircleIcon, CalendarIcon, CreditCardIcon, DownloadIcon, AlertCircleIcon } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PropertyCard } from '../components/PropertyCard';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';
// Mock property database - in real app this would come from API
const propertiesDatabase: Record<string, any> = {
  '1': {
    id: 'PROP-001',
    title: 'Modern 2BHK Apartment',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop'],
    description: 'Beautiful 2BHK apartment in Thamel with modern amenities and great location.',
    details: {
      propertyId: 'PROP-001',
      propertyType: '2 BHK Flat',
      area: '900 sq.ft',
      flatType: '2 BHK',
      roadType: 'Black Topped',
      parking: 'Available',
      furnishing: 'Fully Furnished'
    },
    location: {
      province: 'Bagmati',
      district: 'Kathmandu',
      city: 'Kathmandu Metropolitan City',
      chowk: 'Thamel',
      neighborhood: 'Thamel'
    },
    availability: 'Available',
    rent: 25000,
    owner: {
      name: 'Rajesh Kumar',
      avatar: null,
      email: 'rajesh@example.com',
      phone: '+977 9841234567'
    },
    reviews: []
  },
  '2': {
    id: 'PROP-002',
    title: 'Cozy Studio Room',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop'],
    description: 'Cozy studio room perfect for students in Patan, Lalitpur.',
    details: {
      propertyId: 'PROP-002',
      propertyType: 'Studio',
      area: '400 sq.ft',
      flatType: 'Studio',
      roadType: 'Black Topped',
      parking: 'Not Available',
      furnishing: 'Semi Furnished'
    },
    location: {
      province: 'Bagmati',
      district: 'Lalitpur',
      city: 'Lalitpur Metropolitan City',
      chowk: 'Patan Dhoka',
      neighborhood: 'Patan'
    },
    availability: 'Available',
    rent: 12000,
    owner: {
      name: 'Sita Maharjan',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
      email: 'sita@example.com',
      phone: '+977 9851234567'
    },
    reviews: []
  },
  '3': {
    id: 'PROP-003',
    title: 'Spacious 3BHK Flat',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop'],
    description: 'Spacious 3BHK flat in Bhaktapur with traditional charm.',
    details: {
      propertyId: 'PROP-003',
      propertyType: '3 BHK Flat',
      area: '1500 sq.ft',
      flatType: '3 BHK',
      roadType: 'Black Topped',
      parking: 'Available',
      furnishing: 'Unfurnished'
    },
    location: {
      province: 'Bagmati',
      district: 'Bhaktapur',
      city: 'Bhaktapur Municipality',
      chowk: 'Durbar Square',
      neighborhood: 'Bhaktapur'
    },
    availability: 'Available',
    rent: 35000,
    owner: {
      name: 'Bikash Shrestha',
      avatar: null,
      email: 'bikash@example.com',
      phone: '+977 9861234567'
    },
    reviews: []
  },
  '4': {
    id: 'PROP-004',
    title: 'Budget-Friendly Room',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop'],
    description: 'Affordable room for students in Baneshwor.',
    details: {
      propertyId: 'PROP-004',
      propertyType: 'Single Room',
      area: '250 sq.ft',
      flatType: '1 Room',
      roadType: 'Black Topped',
      parking: 'Not Available',
      furnishing: 'Furnished'
    },
    location: {
      province: 'Bagmati',
      district: 'Kathmandu',
      city: 'Kathmandu Metropolitan City',
      chowk: 'Baneshwor',
      neighborhood: 'Baneshwor'
    },
    availability: 'Available',
    rent: 8000,
    owner: {
      name: 'Anita Gurung',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
      email: 'anita@example.com',
      phone: '+977 9871234567'
    },
    reviews: []
  }
};
// Default property for fallback
const defaultProperty = {
  id: 'PROP-535934',
  title: 'Modern 3BHK Apartment',
  images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop'],
  description: 'This beautifully designed 3BHK apartment offers a perfect blend of comfort and modern living. Located in a prime area with easy access to amenities.',
  details: {
    propertyId: 'PROP-535934',
    propertyType: '3 BHK Flat',
    area: '1200 sq.ft',
    flatType: '3 BHK',
    roadType: 'Black Topped',
    parking: 'Available',
    furnishing: 'Semi Furnished'
  },
  amenities: [{
    icon: BedDoubleIcon,
    label: 'Bedrooms',
    value: '3'
  }, {
    icon: BathIcon,
    label: 'Bathrooms',
    value: '1'
  }, {
    icon: UtensilsIcon,
    label: 'Kitchen',
    value: '1'
  }, {
    icon: HomeIcon,
    label: 'Dining Room',
    value: '1'
  }, {
    icon: HomeIcon,
    label: 'Floors',
    value: 'Ground Floor'
  }],
  location: {
    province: 'Koshi',
    district: 'Morang',
    city: 'Biratnagar Metropolitan City',
    chowk: 'Nirmal jal',
    neighborhood: 'Shanti Chowk'
  },
  availability: 'Available',
  rent: 25000,
  owner: {
    name: 'Nirakar Shrestha',
    avatar: null,
    email: 'nirakar@example.com',
    phone: '+977 9841234567'
  },
  reviews: [{
    name: 'Anita Gurung',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Great apartment! The owner is very responsive and the location is perfect.'
  }, {
    name: 'Bikash Thapa',
    rating: 4,
    date: '1 month ago',
    comment: 'Good value for money. Clean and well-maintained.'
  }]
};
const recommendedProperties = [{
  id: '1',
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
  title: 'Modern 2BHK Apartment',
  location: 'Thamel, Kathmandu',
  rent: 25000,
  bedrooms: 2,
  bathrooms: 1,
  ownerName: 'Rajesh Kumar'
}, {
  id: '2',
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
  title: 'Cozy Studio Room',
  location: 'Patan, Lalitpur',
  rent: 12000,
  bedrooms: 1,
  bathrooms: 1,
  ownerName: 'Sita Maharjan'
}, {
  id: '3',
  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  title: 'Spacious 3BHK Flat',
  location: 'Bhaktapur',
  rent: 35000,
  bedrooms: 3,
  bathrooms: 2,
  ownerName: 'Bikash Shrestha'
}, {
  id: '4',
  image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
  title: 'Budget-Friendly Room',
  location: 'Baneshwor, Kathmandu',
  rent: 8000,
  bedrooms: 1,
  bathrooms: 1,
  ownerName: 'Anita Gurung'
}];
type BookingStep = 'form' | 'confirmation' | 'payment' | 'success';
export function PropertyDetailPage() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const propertyData = id && propertiesDatabase[id] ? {
    ...propertiesDatabase[id],
    amenities: defaultProperty.amenities
  } : defaultProperty;
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviews, setReviews] = useState(propertyData.reviews);
  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('form');
  const [bookingData, setBookingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    moveInDate: '',
    confirmedWithOwner: ''
  });
  const [receiptId, setReceiptId] = useState('');
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newReview = {
        name: 'You',
        rating: newRating,
        date: 'Just now',
        comment: newComment
      };
      setReviews([newReview, ...reviews]);
      toast.success('Review submitted successfully!');
      setNewComment('');
      setNewRating(5);
    }
  };
  const goToPreviousRecommended = () => {
    if (currentRecommendedIndex > 0) {
      setCurrentRecommendedIndex(currentRecommendedIndex - 1);
    }
  };
  const goToNextRecommended = () => {
    if (currentRecommendedIndex < Math.ceil(recommendedProperties.length / 3) - 1) {
      setCurrentRecommendedIndex(currentRecommendedIndex + 1);
    }
  };
  const displayedRecommended = recommendedProperties.slice(currentRecommendedIndex * 3, (currentRecommendedIndex + 1) * 3);
  const handleChatWithOwner = () => {
    navigate('/messages');
  };
  // Booking flow handlers
  const handleOpenBooking = () => {
    setIsBookingModalOpen(true);
    setBookingStep('form');
    setBookingData({
      fullName: '',
      phone: '',
      email: '',
      moveInDate: '',
      confirmedWithOwner: ''
    });
  };
  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setBookingStep('form');
    setBookingData({
      fullName: '',
      phone: '',
      email: '',
      moveInDate: '',
      confirmedWithOwner: ''
    });
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.fullName || !bookingData.phone || !bookingData.email || !bookingData.moveInDate) {
      toast.error('Please fill in all fields');
      return;
    }
    setBookingStep('confirmation');
  };
  const handleConfirmationSubmit = () => {
    if (bookingData.confirmedWithOwner === 'no') {
      toast.error('Please confirm with the owner before booking.');
      return;
    }
    if (bookingData.confirmedWithOwner === 'yes') {
      setBookingStep('payment');
    } else {
      toast.error('Please select an option');
    }
  };
  const handlePaymentSubmit = () => {
    // Simulate payment processing
    setTimeout(() => {
      const newReceiptId = `RCP-${Date.now()}`;
      setReceiptId(newReceiptId);
      setBookingStep('success');
      toast.success('Payment successful!');
    }, 1500);
  };
  const handleDownloadReceipt = () => {
    // Create receipt content
    const receiptContent = `
BOOKING RECEIPT
================

Receipt ID: ${receiptId}
Property: ${propertyData.title}
Property ID: ${propertyData.details.propertyId}

Tenant Details:
Name: ${bookingData.fullName}
Phone: ${bookingData.phone}
Email: ${bookingData.email}
Move-in Date: ${bookingData.moveInDate}

Owner: ${propertyData.owner.name}
Rent: रू ${propertyData.rent}/month

Booking Date: ${new Date().toLocaleDateString()}
Status: CONFIRMED

Thank you for booking with us!
    `;
    // Create and download file
    const blob = new Blob([receiptContent], {
      type: 'text/plain'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Receipt downloaded!');
  };
  return <main className="min-h-screen bg-background-light text-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Link to="/properties" className="hover:text-primary">
                Properties
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary font-medium truncate max-w-[200px]">
              {propertyData.title}
            </li>
          </ol>
        </nav>

        {/* Image Gallery */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <ImageGallery images={propertyData.images} alt={propertyData.title} />
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Property */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }}>
              <h2 className="text-2xl font-bold mb-4">About Property</h2>
              <p className="text-gray-600 leading-relaxed">
                {propertyData.description}
              </p>
            </motion.div>

            {/* Property Details */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="bg-white rounded-card p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Property ID</p>
                  <p className="font-medium">
                    {propertyData.details.propertyId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Property Type</p>
                  <p className="font-medium">
                    {propertyData.details.propertyType}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Area</p>
                  <p className="font-medium">{propertyData.details.area}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Flat Type</p>
                  <p className="font-medium">{propertyData.details.flatType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Road Type</p>
                  <p className="font-medium">{propertyData.details.roadType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Parking</p>
                  <p className="font-medium">{propertyData.details.parking}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Furnishing</p>
                  <p className="font-medium">
                    {propertyData.details.furnishing}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Amenities & Features */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }}>
              <h3 className="text-xl font-semibold mb-4">
                Amenities & Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {propertyData.amenities.map((amenity, index) => {
                const Icon = amenity.icon;
                return <div key={index} className="bg-white rounded-card p-4 text-center shadow-card">
                      <Icon className="w-8 h-8 mx-auto mb-2 text-button-primary" />
                      <p className="text-sm text-gray-600 mb-1">
                        {amenity.label}
                      </p>
                      <p className="font-semibold">{amenity.value}</p>
                    </div>;
              })}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Location */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.1
          }} className="bg-white rounded-card p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Province</p>
                  <p className="font-medium">
                    {propertyData.location.province}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">District</p>
                  <p className="font-medium">
                    {propertyData.location.district}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">City</p>
                  <p className="font-medium">{propertyData.location.city}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Chowk</p>
                  <p className="font-medium">{propertyData.location.chowk}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Neighborhood</p>
                  <p className="font-medium">
                    {propertyData.location.neighborhood}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.2
          }} className="bg-white rounded-card p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">
                  {propertyData.availability}
                </span>
              </div>
            </motion.div>

            {/* Owner Card */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.3
          }} className="bg-white rounded-card p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Owner</h3>
              <div className="flex items-center gap-3 mb-4">
                {propertyData.owner.avatar ? <img src={propertyData.owner.avatar} alt={propertyData.owner.name} className="w-12 h-12 rounded-full" /> : <div className="w-12 h-12 bg-button-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {propertyData.owner.name.charAt(0)}
                  </div>}
                <div>
                  <p className="font-semibold">{propertyData.owner.name}</p>
                  <p className="text-sm text-gray-500">Property Owner</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MailIcon className="w-4 h-4" />
                  <span className="text-sm">{propertyData.owner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="text-sm">{propertyData.owner.phone}</span>
                  <button className="ml-auto p-1 hover:bg-gray-100 rounded">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Button fullWidth className="mb-3" onClick={handleOpenBooking}>
                <CalendarIcon className="w-4 h-4" />
                Book Property
              </Button>
              <Button fullWidth variant="secondary" onClick={handleChatWithOwner}>
                <MessageCircleIcon className="w-4 h-4" />
                Chat with Owner
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Recommended Properties */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Properties</h2>
          <div className="relative">
            <button onClick={goToPreviousRecommended} disabled={currentRecommendedIndex === 0} className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${currentRecommendedIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-background-accent'}`}>
              <ChevronLeftIcon className="w-6 h-6 text-primary" />
            </button>

            <button onClick={goToNextRecommended} disabled={currentRecommendedIndex >= Math.ceil(recommendedProperties.length / 3) - 1} className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${currentRecommendedIndex >= Math.ceil(recommendedProperties.length / 3) - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-background-accent'}`}>
              <ChevronRightIcon className="w-6 h-6 text-primary" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedRecommended.map(property => <PropertyCard key={property.id} {...property} />)}
            </div>
          </div>
        </motion.div>

        {/* Comments & Reviews */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments & Reviews</h2>

          {/* Add Comment Form */}
          <div className="bg-white rounded-card p-6 shadow-card mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none">
                      <StarIcon className={`w-6 h-6 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>)}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Your Comment
                </label>
                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your experience..." rows={4} required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-button text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary resize-none" />
              </div>
              <Button type="submit">
                <SendIcon className="w-4 h-4" />
                Submit Review
              </Button>
            </form>
          </div>

          {/* Existing Reviews */}
          <div className="space-y-4">
            {reviews.map((review, index) => <div key={index} className="bg-white rounded-card p-6 shadow-card">
                <div className="flex items-start gap-4">
                  {review.avatar ? <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" /> : <div className="w-12 h-12 bg-button-primary rounded-full flex items-center justify-center text-white font-medium">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{review.name}</h4>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>)}
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.95
        }} transition={{
          duration: 0.2
        }} className="w-full max-w-md">
              <Card className="p-6 bg-white shadow-2xl relative">
                <button onClick={handleCloseBooking} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>

                <AnimatePresence mode="wait">
                  {bookingStep === 'form' && <motion.div key="form" initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -20
              }} transition={{
                duration: 0.3
              }}>
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                        Book Property
                      </h3>
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <Input label="Full Name" placeholder="Enter your full name" value={bookingData.fullName} onChange={e => setBookingData({
                    ...bookingData,
                    fullName: e.target.value
                  })} required />
                        <Input label="Phone Number" placeholder="Enter your phone number" value={bookingData.phone} onChange={e => setBookingData({
                    ...bookingData,
                    phone: e.target.value
                  })} required />
                        <Input label="Email" type="email" placeholder="Enter your email" value={bookingData.email} onChange={e => setBookingData({
                    ...bookingData,
                    email: e.target.value
                  })} required />
                        <Input label="Preferred Move-in Date" type="date" value={bookingData.moveInDate} onChange={e => setBookingData({
                    ...bookingData,
                    moveInDate: e.target.value
                  })} required />
                        <Button type="submit" fullWidth>
                          Continue
                        </Button>
                      </form>
                    </motion.div>}

                  {bookingStep === 'confirmation' && <motion.div key="confirmation" initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -20
              }} transition={{
                duration: 0.3
              }}>
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <AlertCircleIcon className="w-6 h-6 text-yellow-600" />
                        Owner Confirmation
                      </h3>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                        <p className="text-sm font-medium text-yellow-800 mb-4">
                          Did you confirm with the owner?{' '}
                          <span className="text-red-500">*</span>
                        </p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="confirmed" value="yes" checked={bookingData.confirmedWithOwner === 'yes'} onChange={e => setBookingData({
                        ...bookingData,
                        confirmedWithOwner: e.target.value
                      })} className="text-primary focus:ring-primary" />
                            <span className="text-sm text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="confirmed" value="no" checked={bookingData.confirmedWithOwner === 'no'} onChange={e => setBookingData({
                        ...bookingData,
                        confirmedWithOwner: e.target.value
                      })} className="text-primary focus:ring-primary" />
                            <span className="text-sm text-gray-700">No</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" fullWidth onClick={() => setBookingStep('form')}>
                          Back
                        </Button>
                        <Button fullWidth onClick={handleConfirmationSubmit}>
                          Continue
                        </Button>
                      </div>
                    </motion.div>}

                  {bookingStep === 'payment' && <motion.div key="payment" initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: -20
              }} transition={{
                duration: 0.3
              }}>
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CreditCardIcon className="w-6 h-6 text-primary" />
                        Payment
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Property</span>
                          <span className="font-medium">
                            {propertyData.title}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Monthly Rent</span>
                          <span className="font-medium">
                            रू {propertyData.rent.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-lg text-primary">
                            रू {propertyData.rent.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" fullWidth onClick={() => setBookingStep('confirmation')}>
                          Back
                        </Button>
                        <Button fullWidth onClick={handlePaymentSubmit}>
                          <CreditCardIcon className="w-4 h-4" />
                          Confirm Payment
                        </Button>
                      </div>
                    </motion.div>}

                  {bookingStep === 'success' && <motion.div key="success" initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0.9
              }} transition={{
                duration: 0.3
              }} className="text-center py-4">
                      <motion.div initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} transition={{
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 200
                }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-green-600" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Booking Successful!
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Your booking has been confirmed.
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Receipt ID: {receiptId}
                      </p>
                      <div className="space-y-3">
                        <Button fullWidth onClick={handleDownloadReceipt}>
                          <DownloadIcon className="w-4 h-4" />
                          Download Receipt
                        </Button>
                        <Button variant="outline" fullWidth onClick={handleCloseBooking}>
                          Close
                        </Button>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>}
      </AnimatePresence>
    </main>;
}