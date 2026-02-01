import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon, MapIcon, ClockIcon, MessageCircleIcon, HeadphonesIcon, Navigation, Loader } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceToOffice, setDistanceToOffice] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);

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
      const centerLat = (userLocation.lat + OFFICE_LAT) / 2;
      const centerLng = (userLocation.lng + OFFICE_LNG) / 2;

      const map = L.map('contact-map').setView([centerLat, centerLng], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add user location marker (blue)
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .bindPopup('<div class="font-semibold text-sm">📍 Your Location</div><div class="text-xs text-gray-600">Lat: ' + userLocation.lat.toFixed(4) + '<br/>Lng: ' + userLocation.lng.toFixed(4) + '</div>')
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
          [[userLocation.lat, userLocation.lng], [OFFICE_LAT, OFFICE_LNG]],
          { color: '#3b82f6', weight: 2, opacity: 0.6, dashArray: '5, 5' }
        ).addTo(map);
      }

      // Fit bounds to show both markers
      const group = L.featureGroup([
        L.marker([userLocation.lat, userLocation.lng]),
        L.marker([OFFICE_LAT, OFFICE_LNG])
      ]);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    initMapLibrary();
  }, [userLocation]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };
  return <main className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-button-primary via-primary to-button-primary text-white py-20 overflow-hidden">
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
                  <Input label="First Name" placeholder="John" value={formData.firstName} onChange={e => setFormData({
                  ...formData,
                  firstName: e.target.value
                })} required />
                  <Input label="Last Name" placeholder="Doe" value={formData.lastName} onChange={e => setFormData({
                  ...formData,
                  lastName: e.target.value
                })} required />
                </div>

                <Input label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} required />

                <Input label="Phone Number" placeholder="+977 98XXXXXXXX" value={formData.phone} onChange={e => setFormData({
                ...formData,
                phone: e.target.value
              })} />

                <Input label="Subject" placeholder="How can we help you?" value={formData.subject} onChange={e => setFormData({
                ...formData,
                subject: e.target.value
              })} required />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea rows={5} value={formData.message} onChange={e => setFormData({
                  ...formData,
                  message: e.target.value
                })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-button-primary/10 focus:border-button-primary transition-all resize-none" placeholder="Tell us more about your inquiry..." required />
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
        }} className="space-y-6">
            {/* Map Card with Geolocation */}
            <Card className="p-0 overflow-hidden shadow-xl border-0">
              <div className="relative w-full h-80 bg-gradient-to-br from-button-primary/20 to-primary/20" style={{ overflow: 'hidden' }}>
                {/* Dynamic Map using Leaflet */}
                <div 
                  id="contact-map" 
                  className="w-full h-full"
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
              <Button variant="outline" className="border-button-primary text-button-primary hover:bg-button-primary hover:text-white">
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