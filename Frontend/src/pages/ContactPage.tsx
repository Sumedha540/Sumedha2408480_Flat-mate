/**
 * CONTACT PAGE - Customer support and inquiry form
 * 
 * PURPOSE:
 * - Provides a contact form for users to reach out to Flat-Mate support
 * - Displays company contact information and location map
 * - Validates form inputs and stores submissions in database
 * 
 * KEY FEATURES:
 * 1. Contact Form with validation:
 *    - First Name (no numbers allowed)
 *    - Last Name (no numbers allowed)
 *    - Email (valid format required)
 *    - Phone (exactly 10 digits, auto-limited)
 *    - Subject (minimum 5 characters)
 *    - Message (minimum 10 characters)
 * 
 * 2. Real-time Validation:
 *    - Red error messages and borders for invalid inputs
 *    - Live character/digit counters
 *    - Prevents form submission until all fields are valid
 * 
 * 3. Success Handling:
 *    - Green toast notification on successful submission
 *    - Form automatically clears after submission
 *    - Message stored in database for admin review
 * 
 * DATA FLOW:
 * - Form submission → POST /api/contact/submit
 * - Backend stores in ContactMessage model
 * - Admin can view in AdminDashboard → Contact Messages tab
 * - Admin receives notification of new message
 * 
 * BACKEND CONNECTION:
 * - POST /api/contact/submit
 *   Request body: { firstName, lastName, email, phone, subject, message }
 *   Response: { success: true, message: "Message sent successfully" }
 *   Database: Stores in contact_messages collection
 * 
 * VALIDATION RULES:
 * - Names: No numbers, only letters and spaces
 * - Email: Must match email regex pattern
 * - Phone: Exactly 10 digits, numeric only
 * - Subject: Minimum 5 characters
 * - Message: Minimum 10 characters
 * 
 * UI COMPONENTS:
 * - Contact form with icon-prefixed inputs
 * - Interactive map showing office location
 * - Contact info cards (phone, email, address)
 * - Breadcrumb navigation
 * 
 * ERROR HANDLING:
 * - Network errors: Red toast with error message
 * - Validation errors: Inline red text below fields
 * - Empty fields: Prevents submission with validation
 */

/**
 * CONTACT PAGE
 * =============
 * Customer support and contact information:
 * - Contact form for inquiries
 * - Display office location and map
 * - Contact information (email, phone)
 * - Business hours
 * - FAQ section
 * - Chat support option
 * - Form submission to backend
 * - Auto-populate user email if logged in
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon, MapIcon, ClockIcon, MessageCircleIcon, HeadphonesIcon, Navigation, Loader } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
// Office coordinates (Kathmandu, Nepal)
const OFFICE_LAT = 27.7172;
const OFFICE_LNG = 85.3240;

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export function ContactPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceToOffice, setDistanceToOffice] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);

  // Validation functions
  const validateName = (name: string, field: string): string => {
    if (!name.trim()) return `${field} is required`;
    if (name.trim().length < 2) return `${field} must be at least 2 characters`;
    if (/\d/.test(name)) return `${field} cannot contain numbers`;
    if (!/^[a-zA-Z\s]+$/.test(name)) return `${field} can only contain letters`;
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Phone number is required';
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) return 'Phone number must be exactly 10 digits';
    if (!/^\d+$/.test(digitsOnly)) return 'Phone number can only contain digits';
    return '';
  };

  const validateSubject = (subject: string): string => {
    if (!subject.trim()) return 'Subject is required';
    if (subject.trim().length < 5) return 'Subject must be at least 5 characters';
    return '';
  };

  const validateMessage = (message: string): string => {
    if (!message.trim()) return 'Message is required';
    if (message.trim().length < 10) return 'Message must be at least 10 characters';
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    // Special handling for phone - only allow digits and limit to 10
    if (field === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [field]: digitsOnly });
      setErrors({ ...errors, [field]: '' });
      return;
    }

    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  // Get user's geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingGeo(true);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setGeoError(null);
        
        // Calculate distance to office
        const distance = calculateDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
        setDistanceToOffice(distance);
        setIsLoadingGeo(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied. Please enable location access.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out.';
        }
        setGeoError(errorMessage);
        setIsLoadingGeo(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Cleanup watch on unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Initialize map when user location is available
  useEffect(() => {
    if (!userLocation) return;

    const initMapLibrary = () => {
      if (!(window as any).L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.async = true;
        script.onload = () => setTimeout(initializeMap, 100);
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    function initializeMap() {
      const L = (window as any).L;
      const mapContainer = document.getElementById('contact-map');
      
      if (!mapContainer) return;
      if (mapContainer.querySelector('.leaflet-pane')) return;

      // Create map centered between user and office
      const centerLat = (userLocation?.lat ?? 0) + (OFFICE_LAT ?? 0) / 2;
      const centerLng = (userLocation?.lng ?? 0) + (OFFICE_LNG ?? 0) / 2;

      const map = L.map('contact-map').setView([centerLat, centerLng], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add user location marker (blue)
      L.marker([userLocation?.lat ?? 0, userLocation?.lng ?? 0], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .bindPopup('<div class="font-semibold text-sm">📍 Your Location</div><div class="text-xs text-gray-600">Lat: ' + (userLocation?.lat?.toFixed(4) ?? '0.0000') + '<br/>Lng: ' + (userLocation?.lng?.toFixed(4) ?? '0.0000') + '</div>')
        .addTo(map)
        .openPopup();

      // Add office location marker (red)
      L.marker([OFFICE_LAT, OFFICE_LNG], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .bindPopup('<div class="font-semibold text-sm">🏢 Flat-Mate HQ</div><div class="text-xs text-gray-600">New Baneshwor<br/>Kathmandu</div>')
        .addTo(map);

      // Draw a line between user and office
      if (userLocation) {
        L.polyline(
          [[userLocation?.lat ?? 0, userLocation?.lng ?? 0], [OFFICE_LAT, OFFICE_LNG]],
          { color: '#3b82f6', weight: 2, opacity: 0.6, dashArray: '5, 5' }
        ).addTo(map);
      }

      // Fit bounds to show both markers
      const group = L.featureGroup([
        L.marker([userLocation?.lat ?? 0, userLocation?.lng ?? 0]),
        L.marker([OFFICE_LAT, OFFICE_LNG])
      ]);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    initMapLibrary();
  }, [userLocation]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    newErrors.firstName = validateName(formData.firstName, 'First name');
    newErrors.lastName = validateName(formData.lastName, 'Last name');
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.subject = validateSubject(formData.subject);
    newErrors.message = validateMessage(formData.message);

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      toast.error('Please fix the errors in the form', {
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting contact form:', formData);
      
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast.success(data.message || "Message sent successfully! We'll get back to you soon.", {
          style: {
            background: '#2F7D5F',
            color: 'white',
          },
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setErrors({});
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.', {
          style: {
            background: '#ef4444',
            color: 'white',
          },
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to send message. Please check your connection and try again.', {
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <main className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-button-primary via-primary to-button-primary text-white pt-36 pb-20 overflow-hidden">
        {/* Animated Background Pattern */}
        <motion.div animate={{
        backgroundPosition: ['0% 0%', '100% 100%']
      }} transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear'
      }} className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
        backgroundSize: '60px 60px'
      }} />

        {/* Floating Orbs */}
        <motion.div animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      }} transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }} className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <motion.div animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.5, 0.3, 0.5]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1
      }} className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}>
            <motion.div initial={{
            scale: 0,
            rotate: -180
          }} animate={{
            scale: 1,
            rotate: 0
          }} transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15
          }} className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
              <HeadphonesIcon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="text-4xl md:text-5xl font-bold mb-4">
              We're Here to Help
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="text-white/90 text-lg max-w-2xl mx-auto">
              Have questions about finding a room or listing your property? Our
              dedicated team is ready to assist you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-20 relative z-10">
          {[{
          icon: PhoneIcon,
          title: 'Call Us',
          subtitle: 'Mon-Fri 9am-6pm',
          value: '+977 984-1234567',
          href: 'tel:+9779841234567',
          color: 'from-blue-500 to-blue-600',
          delay: 0.5
        }, {
          icon: MailIcon,
          title: 'Email Us',
          subtitle: 'We reply within 24 hours',
          value: 'support@flatmate.com.np',
          href: 'mailto:support@flatmate.com.np',
          color: 'from-green-500 to-green-600',
          delay: 0.6
        }, {
          icon: MapPinIcon,
          title: 'Visit Us',
          subtitle: 'New Baneshwor',
          value: 'Kathmandu, Nepal',
          color: 'from-purple-500 to-purple-600',
          delay: 0.7
        }].map((item, index) => <motion.div key={item.title} initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: item.delay,
          duration: 0.6
        }} whileHover={{
          y: -5,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
              <Card className="p-6 text-center bg-white shadow-xl border-0 h-full">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{item.subtitle}</p>
                {item.href ? <a href={item.href} className="text-button-primary font-semibold hover:underline">
                    {item.value}
                  </a> : <p className="text-button-primary font-semibold">
                    {item.value}
                  </p>}
              </Card>
            </motion.div>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.8,
          duration: 0.6
        }}>
            <Card className="p-8 shadow-xl border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-button-primary/10 rounded-xl flex items-center justify-center">
                  <MessageCircleIcon className="w-6 h-6 text-button-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 text-sm">
                    We'll respond as soon as possible
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Input 
                      label="First Name" 
                      placeholder="John" 
                      value={formData.firstName} 
                      onChange={e => handleInputChange('firstName', e.target.value)}
                      required 
                      className={errors.firstName ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">⚠ {errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Input 
                      label="Last Name" 
                      placeholder="Doe" 
                      value={formData.lastName} 
                      onChange={e => handleInputChange('lastName', e.target.value)}
                      required 
                      className={errors.lastName ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">⚠ {errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Input 
                    label="Email Address" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email} 
                    onChange={e => handleInputChange('email', e.target.value)}
                    required 
                    className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">⚠ {errors.email}</p>
                  )}
                </div>

                <div>
                  <Input 
                    label="Phone Number" 
                    placeholder="98XXXXXXXX (10 digits)" 
                    value={formData.phone} 
                    onChange={e => handleInputChange('phone', e.target.value)}
                    maxLength={10}
                    required
                    className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  <p className="text-gray-500 text-xs mt-1">{formData.phone.length}/10 digits</p>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">⚠ {errors.phone}</p>
                  )}
                </div>

                <div>
                  <Input 
                    label="Subject" 
                    placeholder="How can we help you?" 
                    value={formData.subject} 
                    onChange={e => handleInputChange('subject', e.target.value)}
                    required 
                    className={errors.subject ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">⚠ {errors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea 
                    rows={5} 
                    value={formData.message} 
                    onChange={e => handleInputChange('message', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-button-primary/10 transition-all resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-button-primary'
                    }`}
                    placeholder="Tell us more about your inquiry..." 
                    required 
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">⚠ {errors.message}</p>
                  )}
                </div>

                <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} className="gap-2">
                  <SendIcon className="w-5 h-5" />
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Map & Info */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.8,
          duration: 0.6
        }} className="space-y-6 relative z-0">
            {/* Map Card with Geolocation */}
            <Card className="p-0 overflow-hidden shadow-xl border-0 relative z-0">
              <div className="relative w-full h-80 bg-gradient-to-br from-button-primary/20 to-primary/20 z-0" style={{ overflow: 'hidden' }}>
                {/* Dynamic Map using Leaflet */}
                <div 
                  id="contact-map" 
                  className="w-full h-full relative z-0"
                  style={{ background: '#e5e3df', position: 'relative', overflow: 'hidden' }}
                >
                  {!userLocation && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 backdrop-blur-sm">
                      <div className="text-center">
                        <Loader className="w-8 h-8 text-button-primary animate-spin mx-auto mb-2" />
                        <p className="text-gray-600">Loading map with your location...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Our Office
                </h3>
                <p className="text-gray-600 mb-4">
                  Visit us at our main office in the heart of Kathmandu for
                  in-person consultations.
                </p>

                {/* Geolocation Info */}
                <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    {isLoadingGeo ? (
                      <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <Navigation className="w-5 h-5 text-blue-600" />
                    )}
                    <span className="font-semibold text-blue-900">
                      {isLoadingGeo ? 'Getting your location...' : 'Your Current Location'}
                    </span>
                  </div>

                  {geoError ? (
                    <p className="text-sm text-red-600 flex items-start gap-2">
                      <span className="mt-0.5">⚠️</span> {geoError}
                    </p>
                  ) : userLocation ? (
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-800">
                        <span className="font-semibold">Latitude:</span> {userLocation.lat.toFixed(4)}°
                      </p>
                      <p className="text-blue-800">
                        <span className="font-semibold">Longitude:</span> {userLocation.lng.toFixed(4)}°
                      </p>
                      {distanceToOffice !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-white rounded-lg border-l-4 border-blue-600"
                        >
                          <p className="text-blue-900 font-semibold">
                            Distance to our office: <span className="text-lg text-blue-600">{distanceToOffice.toFixed(2)} km</span>
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Estimated travel time by car: ~{Math.ceil(distanceToOffice / 30)} minutes
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Office Address */}
                <div className="flex items-start gap-3">
                  <MapIcon className="w-5 h-5 text-button-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Flat-Mate HQ</p>
                    <p className="text-gray-600">New Baneshwor, Kathmandu</p>
                    <p className="text-gray-600">Bagmati Province, Nepal</p>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${OFFICE_LAT},${OFFICE_LNG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-button-primary hover:underline font-semibold mt-2 inline-block"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Office Hours */}
            <Card className="p-6 shadow-xl border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Office Hours
                </h3>
              </div>
              <div className="space-y-3">
                {[{
                day: 'Monday - Friday',
                time: '9:00 AM - 6:00 PM'
              }, {
                day: 'Saturday',
                time: '10:00 AM - 4:00 PM'
              }, {
                day: 'Sunday',
                time: 'Closed'
              }].map((schedule, index) => <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700 font-medium">
                      {schedule.day}
                    </span>
                    <span className="text-gray-600">{schedule.time}</span>
                  </div>)}
              </div>
            </Card>

            {/* FAQ Link */}
            <Card className="p-6 bg-gradient-to-br from-button-primary/5 to-primary/5 border-button-primary/20 shadow-xl">
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Looking for Quick Answers?
              </h3>
              <p className="text-gray-600 mb-4">
                Check out our FAQ section for instant answers to common
                questions.
              </p>
              <Button 
                variant="outline" 
                className="border-button-primary text-button-primary hover:bg-button-primary hover:text-white"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/home-faq');
                  } else {
                    navigate('/#faq');
                  }
                }}
              >
                Visit FAQ
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8
      }} className="max-w-2xl mx-auto">
          <Card className="p-8 text-center bg-gradient-to-br from-white to-background-accent shadow-2xl border-0 relative overflow-hidden">
            <motion.div animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }} className="absolute top-0 right-0 w-64 h-64 bg-button-primary/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-button-primary to-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MailIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Stay Updated
              </h2>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter for the latest property listings,
                tips, and exclusive offers.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <Input placeholder="Enter your email address" type="email" className="flex-1" />
                <Button className="sm:w-auto">Subscribe</Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>;
}