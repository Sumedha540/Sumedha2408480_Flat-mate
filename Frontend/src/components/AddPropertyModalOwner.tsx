// src/components/AddPropertyModalOwner.tsx
// Owner Dashboard - Add Property Modal with Video Upload (Subscription Required) and Progress Bar

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XIcon, CheckIcon, ImageIcon, VideoIcon, CrownIcon, AlertCircleIcon } from 'lucide-react'
import { CustomDropdown } from './CustomDropdown'
import { toast } from '../utils/toast'
import { createProperty, updateProperty } from '../utils/propertyAPI'

interface AddPropertyModalOwnerProps {
  onClose: () => void
  onAdd: (property: any) => void
  editingProperty?: any
}

export const AddPropertyModalOwner: React.FC<AddPropertyModalOwnerProps> = ({ onClose, onAdd, editingProperty }) => {
  const [form, setForm] = useState({
    type: editingProperty?.type || '',
    location: editingProperty?.location || '',
    price: editingProperty?.rent?.toString() || '',
    rooms: editingProperty?.beds?.toString() || '',
    description: editingProperty?.description || '',
    amenities: editingProperty?.amenities || [] as string[],
    title: editingProperty?.title || ''
  })
  const [images, setImages] = useState<File[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loadingSubscription, setLoadingSubscription] = useState(true)

  const amenitiesList = ['WiFi', 'Parking', 'Elevator', 'Security', 'Water Supply', 'Backup Power', 'Garden', 'Gym']

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem('flatmate_token')
        if (!token) {
          setLoadingSubscription(false)
          return
        }

        const response = await fetch('http://localhost:5000/api/subscription/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setIsSubscribed(data.isSubscribed)
        }
      } catch (error) {
        console.error('Error checking subscription:', error)
      } finally {
        setLoadingSubscription(false)
      }
    }

    checkSubscription()
  }, [])

  const toggleAmenity = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.type) errs.type = 'Property type is required'
    if (!form.location) errs.location = 'Location is required'
    if (!form.price || parseInt(form.price) <= 0) errs.price = 'Valid price is required'
    if (!form.rooms || parseInt(form.rooms) <= 0) errs.rooms = 'Number of rooms is required'
    if (!form.description) errs.description = 'Description is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubscribe = async (plan: 'monthly' | 'quarterly' | 'yearly') => {
    try {
      const token = localStorage.getItem('flatmate_token')
      if (!token) {
        toast.error('Please login to subscribe')
        return
      }

      const response = await fetch('http://localhost:5000/api/subscription/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      })

      if (response.ok) {
        setIsSubscribed(true)
        toast.success('Subscription activated! You can now upload videos', {
          style: {
            background: '#2F7D5F',
            color: 'white',
          },
        })
      } else {
        toast.error('Failed to activate subscription')
      }
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('An error occurred')
    }
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setUploadProgress(0)

    try {
      // Simulate progress for images
      setUploadProgress(10)
      
      let imageUrls: string[] = []
      if (images.length > 0) {
        setUploadProgress(20)
        imageUrls = await Promise.all(images.map(img => convertToBase64(img)))
        setUploadProgress(50)
      }

      // Handle video upload (only if subscribed)
      let videoUrl: string | null = null
      if (video && isSubscribed) {
        setUploadProgress(60)
        videoUrl = await convertToBase64(video)
        setUploadProgress(80)
      }

      const user = JSON.parse(localStorage.getItem('flatmate_user') || '{}')
      const ownerName = user.name || 'Owner'

      const propertyData = {
        title: form.title,
        location: form.location,
        rent: parseInt(form.price),
        beds: parseInt(form.rooms),
        baths: 1,
        type: form.type,
        area: '850 sqft',
        status: 'pending',
        furnishing: 'Unfurnished',
        parking: 'Available',
        wifi: form.amenities.includes('WiFi'),
        description: form.description,
        amenities: form.amenities,
        image: imageUrls[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
        images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop'],
        video: videoUrl,
        ownerName: ownerName,
        ownerId: user.id || `owner${Date.now()}`,
        isPremium: false
      }

      setUploadProgress(90)

      if (editingProperty) {
        const updated = await updateProperty(editingProperty.id || editingProperty._id, propertyData)
        if (updated) {
          onAdd(updated)
          toast.success('Property updated successfully!', {
            style: {
              background: '#2F7D5F',
              color: 'white',
            },
          })
        }
      } else {
        const created = await createProperty(propertyData)
        if (created) {
          onAdd(created)
          
          // Notify admin
          const adminNotifs = JSON.parse(localStorage.getItem('fm_admin_notifs') || '[]')
          adminNotifs.unshift({
            id: Date.now().toString(),
            type: 'new_property',
            title: 'New Property Submitted',
            msg: `${ownerName} submitted: "${propertyData.title}"`,
            time: 'Just now',
            read: false,
            propId: created.id
          })
          localStorage.setItem('fm_admin_notifs', JSON.stringify(adminNotifs))
          
          toast.success('Property submitted for admin review!', {
            style: {
              background: '#2F7D5F',
              color: 'white',
            },
          })
        }
      }

      setUploadProgress(100)
      setTimeout(() => onClose(), 500)
    } catch (error: any) {
      console.error('Error submitting property:', error)
      toast.error(error.message || 'Failed to submit property')
      setUploadProgress(0)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the property details below</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        {saving && (
          <div className="px-6 pt-4">
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-button-primary to-green-400"
              />
            </div>
            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Modern 2BHK in Thamel"
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Property Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CustomDropdown
                  value={form.type}
                  onChange={(value) => setForm({ ...form, type: value })}
                  options={[
                    { value: '', label: 'Select type' },
                    { value: 'Room', label: 'Room' },
                    { value: '1BHK', label: '1BHK' },
                    { value: '2BHK', label: '2BHK' },
                    { value: '3BHK', label: '3BHK+' },
                    { value: 'Studio', label: 'Studio' },
                    { value: 'Shared', label: 'Shared' }
                  ]}
                  label="Property Type *"
                />
                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g., Thamel, Kathmandu"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white"
                />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Price and Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Rent (NPR) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="25000"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white"
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Number of Rooms *
                </label>
                <input
                  type="number"
                  value={form.rooms}
                  onChange={(e) => setForm({ ...form, rooms: e.target.value })}
                  placeholder="2"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white"
                />
                {errors.rooms && <p className="text-xs text-red-500 mt-1">{errors.rooms}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your property..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white resize-none"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      form.amenities.includes(amenity)
                        ? 'border-button-primary bg-[#D7EDE4] text-button-primary'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Property Images
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-button-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                  className="hidden"
                  id="property-images-owner"
                />
                <label htmlFor="property-images-owner" className="cursor-pointer">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Click to upload property images
                  </p>
                  <p className="text-xs text-gray-400">Upload multiple images (JPG, PNG)</p>
                </label>
              </div>
              {images.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  {images.length} image(s) selected
                </p>
              )}
            </div>

            {/* Video Upload (Subscription Required) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Property Video {!isSubscribed && '🔒'}
              </label>
              
              {loadingSubscription ? (
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-500">Checking subscription status...</p>
                </div>
              ) : isSubscribed ? (
                <>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-button-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files?.[0] || null)}
                      className="hidden"
                      id="property-video-owner"
                    />
                    <label htmlFor="property-video-owner" className="cursor-pointer">
                      <VideoIcon className="w-10 h-10 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Click to upload property video
                      </p>
                      <p className="text-xs text-gray-400">MP4, MOV, AVI (max 50MB)</p>
                    </label>
                  </div>
                  {video && (
                    <p className="text-sm text-green-600 mt-2">
                      Video selected: {video.name}
                    </p>
                  )}
                </>
              ) : (
                <div className="border-2 border-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <CrownIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <AlertCircleIcon className="w-5 h-5 text-amber-600" />
                        Subscribe to Upload Videos
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Upgrade to premium to showcase your property with video tours and get more visibility!
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubscribe('monthly')}
                          className="px-4 py-2 bg-button-primary text-white text-sm font-semibold rounded-lg hover:bg-button-primary/90 transition-all"
                        >
                          Subscribe Now
                        </button>
                        <button
                          onClick={onClose}
                          className="px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all"
                        >
                          Maybe Later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-button-primary text-white font-semibold rounded-xl hover:bg-button-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {uploadProgress < 100 ? 'Uploading...' : 'Finalizing...'}
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                {editingProperty ? 'Update Property' : 'Add Property'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
