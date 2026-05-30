// // src/components/AddPropertyModalAdmin.tsx
// import React, { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { XIcon, CheckIcon, ImageIcon, UserIcon, ChevronDownIcon } from 'lucide-react'
// import { toast } from '../utils/toast'
// import { createProperty } from '../utils/propertyAPI'
// import { BACKEND_URL } from '../config/api'

// interface AddPropertyModalAdminProps {
//   onClose: () => void
//   onAdd: (property: any) => void
// }

// const InlineDropdown: React.FC<{
//   value: string
//   onChange: (value: string) => void
//   options: { value: string; label: string }[]
//   placeholder?: string
//   label?: string
//   error?: string
//   icon?: React.ReactNode
// }> = ({ value, onChange, options, placeholder = 'Select...', label, error, icon }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const selectedOption = options.find(o => o.value === value)

//   return (
//     <div ref={ref} className="relative">
//       {label && (
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//           {icon}
//           {label}
//         </label>
//       )}
//       <div
//         onClick={() => setIsOpen(prev => !prev)}
//         className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm bg-white dark:bg-gray-700 cursor-pointer flex items-center justify-between transition-colors
//           ${isOpen
//             ? 'border-button-primary'
//             : 'border-gray-200 dark:border-gray-600 hover:border-button-primary/50'
//           }`}
//       >
//         <span className={selectedOption ? 'text-gray-700 dark:text-white' : 'text-gray-400'}>
//           {selectedOption?.label || placeholder}
//         </span>
//         <ChevronDownIcon
//           className={`w-4 h-4 text-button-primary flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
//         />
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -4 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -4 }}
//             transition={{ duration: 0.12 }}
//             className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden"
//             style={{ zIndex: 9999 }}
//           >
//             <div className="max-h-56 overflow-y-auto">
//               {options.length === 0 ? (
//                 <div className="px-4 py-3 text-sm text-gray-400 text-center">
//                   No options available
//                 </div>
//               ) : (
//                 options.map(option => (
//                   <div
//                     key={option.value}
//                     onMouseDown={(e) => {
//                       e.preventDefault()
//                       onChange(option.value)
//                       setIsOpen(false)
//                     }}
//                     className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 ${
//                       option.value === value
//                         ? 'bg-button-primary text-white font-semibold'
//                         : 'text-gray-700 dark:text-gray-200 hover:bg-[#D7EDE4] dark:hover:bg-gray-600 hover:text-[#0D3A2F] dark:hover:text-white'
//                     }`}
//                   >
//                     {option.label}
//                   </div>
//                 ))
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   )
// }

// export const AddPropertyModalAdmin: React.FC<AddPropertyModalAdminProps> = ({ onClose, onAdd }) => {
//   const [form, setForm] = useState({
//     type: '',
//     location: '',
//     price: '',
//     rooms: '',
//     description: '',
//     amenities: [] as string[],
//     title: '',
//     ownerId: ''
//   })
//   const [images, setImages] = useState<File[]>([])
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [saving, setSaving] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [owners, setOwners] = useState<Array<{ value: string; label: string }>>([])
//   const [loadingOwners, setLoadingOwners] = useState(true)

//   const amenitiesList = ['WiFi', 'Parking', 'Elevator', 'Security', 'Water Supply', 'Backup Power', 'Garden', 'Gym']

//   const propertyTypeOptions = [
//     { value: 'Room', label: 'Room' },
//     { value: '1BHK', label: '1BHK' },
//     { value: '2BHK', label: '2BHK' },
//     { value: '3BHK', label: '3BHK+' },
//     { value: 'Studio', label: 'Studio' },
//     { value: 'Shared', label: 'Shared' },
//   ]

//   useEffect(() => {
//     const fetchOwners = async () => {
//       try {
//         const token = localStorage.getItem('flatmate_token')
//         if (!token) {
//           setLoadingOwners(false)
//           return
//         }

//         const response = await fetch(`${BACKEND_URL}/api/users`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })

//         if (response.ok) {
//           const data = await response.json()
//           console.log('Fetched users:', data.users) // debug

//           // Accept any role that could be an owner
//           const ownersList = data.users
//             .filter((u: any) => ['owner'].includes(u.role))
//             .map((u: any) => ({
//               value: u._id,
//               label: `${u.firstName} ${u.lastName} (${u.email})`
//             }))

//           console.log('Owners list:', ownersList) // debug
//           setOwners(ownersList)
//         }
//       } catch (error) {
//         console.error('Error fetching owners:', error)
//       } finally {
//         setLoadingOwners(false)
//       }
//     }
//     fetchOwners()
//   }, [])

//   const toggleAmenity = (amenity: string) => {
//     setForm(prev => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter(a => a !== amenity)
//         : [...prev.amenities, amenity]
//     }))
//   }

//   const validate = () => {
//     const errs: Record<string, string> = {}
//     if (!form.title.trim()) errs.title = 'Title is required'
//     if (!form.type) errs.type = 'Property type is required'
//     if (!form.location) errs.location = 'Location is required'
//     if (!form.price || parseInt(form.price) <= 0) errs.price = 'Valid price is required'
//     if (!form.rooms || parseInt(form.rooms) <= 0) errs.rooms = 'Number of rooms is required'
//     if (!form.description) errs.description = 'Description is required'
//     if (!form.ownerId) errs.ownerId = 'Please select an owner'
//     setErrors(errs)
//     return Object.keys(errs).length === 0
//   }

//   const convertToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.onloadend = () => resolve(reader.result as string)
//       reader.onerror = reject
//       reader.readAsDataURL(file)
//     })
//   }

//   const handleSubmit = async () => {
//     if (!validate()) return
//     setSaving(true)
//     setUploadProgress(0)

//     try {
//       setUploadProgress(10)

//       let imageUrls: string[] = []
//       if (images.length > 0) {
//         setUploadProgress(20)
//         imageUrls = await Promise.all(images.map(img => convertToBase64(img)))
//         setUploadProgress(60)
//       }

//       const selectedOwner = owners.find(o => o.value === form.ownerId)
//       const ownerName = selectedOwner?.label.split(' (')[0] || 'Unknown Owner'
//       const ownerEmail = selectedOwner?.label.match(/\(([^)]+)\)/)?.[1] || ''

//       const propertyData = {
//         title: form.title,
//         location: form.location,
//         rent: parseInt(form.price),
//         beds: parseInt(form.rooms),
//         baths: 1,
//         type: form.type,
//         area: '850 sqft',
//         status: 'approved' as const,
//         furnishing: 'Unfurnished',
//         parking: 'Available',
//         wifi: form.amenities.includes('WiFi'),
//         description: form.description,
//         amenities: form.amenities,
//         image: imageUrls[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
//         images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop'],
//         ownerName,
//         ownerId: form.ownerId,
//         ownerEmail,
//       }

//       setUploadProgress(80)
//       const created = await createProperty(propertyData)

//       if (created) {
//         setUploadProgress(100)
//         toast.success('Property added and published successfully!')
//         onAdd(created)
//         setTimeout(() => onClose(), 500)
//       } else {
//         throw new Error('Failed to create property')
//       }
//     } catch (error: any) {
//       console.error('Error adding property:', error)
//       toast.error(error.message || 'Failed to add property')
//       setUploadProgress(0)
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Property</h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the property details below</p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//             <XIcon className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Progress Bar */}
//         {saving && (
//           <div className="px-6 pt-4 shrink-0">
//             <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${uploadProgress}%` }}
//                 transition={{ duration: 0.3 }}
//                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-button-primary to-green-400"
//               />
//             </div>
//             <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
//               Uploading... {uploadProgress}%
//             </p>
//           </div>
//         )}

//         {/* Scrollable content */}
//         <div className="px-6 py-6 overflow-y-auto flex-1">
//           <div className="space-y-6">

//             {/* Owner Selection */}
//             <div>
//               {loadingOwners ? (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                     <UserIcon className="w-4 h-4" />
//                     Select Owner *
//                   </label>
//                   <div className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-400 dark:bg-gray-700">
//                     Loading owners...
//                   </div>
//                 </div>
//               ) : (
//                 <InlineDropdown
//                   label="Select Owner *"
//                   icon={<UserIcon className="w-4 h-4" />}
//                   value={form.ownerId}
//                   onChange={(value) => setForm({ ...form, ownerId: value })}
//                   options={owners}
//                   placeholder="Select an owner"
//                   error={errors.ownerId}
//                 />
//               )}
//             </div>

//             {/* Title */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Property Title *
//               </label>
//               <input
//                 type="text"
//                 value={form.title}
//                 onChange={(e) => setForm({ ...form, title: e.target.value })}
//                 placeholder="e.g., Modern 2BHK in Thamel"
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white"
//               />
//               {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
//             </div>

//             {/* Property Type and Location */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <InlineDropdown
//                 label="Property Type *"
//                 value={form.type}
//                 onChange={(value) => setForm({ ...form, type: value })}
//                 options={propertyTypeOptions}
//                 placeholder="Select type"
//                 error={errors.type}
//               />
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Location *
//                 </label>
//                 <input
//                   type="text"
//                   value={form.location}
//                   onChange={(e) => setForm({ ...form, location: e.target.value })}
//                   placeholder="e.g., Thamel, Kathmandu"
//                   className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white"
//                 />
//                 {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
//               </div>
//             </div>

//             {/* Price and Rooms */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Monthly Rent (NPR) *
//                 </label>
//                 <input
//                   type="number"
//                   value={form.price}
//                   onChange={(e) => setForm({ ...form, price: e.target.value })}
//                   placeholder="25000"
//                   className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white"
//                 />
//                 {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Number of Rooms *
//                 </label>
//                 <input
//                   type="number"
//                   value={form.rooms}
//                   onChange={(e) => setForm({ ...form, rooms: e.target.value })}
//                   placeholder="2"
//                   className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white"
//                 />
//                 {errors.rooms && <p className="text-xs text-red-500 mt-1">{errors.rooms}</p>}
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 rows={4}
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 placeholder="Describe the property..."
//                 className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white resize-none"
//               />
//               {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
//             </div>

//             {/* Amenities */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//                 Amenities
//               </label>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {amenitiesList.map(amenity => (
//                   <button
//                     key={amenity}
//                     type="button"
//                     onClick={() => toggleAmenity(amenity)}
//                     className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
//                       form.amenities.includes(amenity)
//                         ? 'border-button-primary bg-[#D7EDE4] text-button-primary'
//                         : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
//                     }`}
//                   >
//                     {amenity}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Images */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Property Images
//               </label>
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-button-primary transition-colors">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={(e) => setImages(Array.from(e.target.files || []))}
//                   className="hidden"
//                   id="property-images-admin"
//                 />
//                 <label htmlFor="property-images-admin" className="cursor-pointer">
//                   <ImageIcon className="w-10 h-10 mx-auto mb-2 text-gray-400" />
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Click to upload property images</p>
//                   <p className="text-xs text-gray-400">Upload multiple images (JPG, PNG)</p>
//                 </label>
//               </div>
//               {images.length > 0 && (
//                 <p className="text-sm text-green-600 mt-2">{images.length} image(s) selected</p>
//               )}
//             </div>

//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl shrink-0">
//           <button
//             onClick={onClose}
//             disabled={saving}
//             className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="px-6 py-2.5 bg-button-primary text-white font-semibold rounded-xl hover:bg-button-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
//           >
//             {saving ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 {uploadProgress < 100 ? 'Uploading...' : 'Finalizing...'}
//               </>
//             ) : (
//               <>
//                 <CheckIcon className="w-4 h-4" />
//                 Add Property
//               </>
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// src/components/AddPropertyModalAdmin.tsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon, CheckIcon, ImageIcon, UserIcon, ChevronDownIcon } from 'lucide-react'
import { toast } from '../utils/toast'
import { createProperty } from '../utils/propertyAPI'
import { BACKEND_URL } from '../config/api'

interface AddPropertyModalAdminProps {
  onClose: () => void
  onAdd: (property: any) => void
}

const InlineDropdown: React.FC<{
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  label?: string
  error?: string
  icon?: React.ReactNode
}> = ({ value, onChange, options, placeholder = 'Select...', label, error, icon }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpward(spaceBelow < 250)
    }
    setIsOpen(prev => !prev)
  }

  const selectedOption = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          {icon}
          {label}
        </label>
      )}
      <div
        ref={triggerRef}
        onClick={handleOpen}
        className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm bg-white dark:bg-gray-700 cursor-pointer flex items-center justify-between transition-colors
          ${isOpen ? 'border-button-primary' : 'border-gray-200 dark:border-gray-600 hover:border-button-primary/50'}`}
      >
        <span className={selectedOption ? 'text-gray-700 dark:text-white' : 'text-gray-400'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-button-primary flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpward ? 4 : -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute left-0 right-0 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden ${
              openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
            style={{ zIndex: 9999 }}
          >
            <div className="max-h-56 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No options available
                </div>
              ) : (
                options.map(option => (
                  <div
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 ${
                      option.value === value
                        ? 'bg-button-primary text-white font-semibold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-[#D7EDE4] dark:hover:bg-gray-600 hover:text-[#0D3A2F] dark:hover:text-white'
                    }`}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export const AddPropertyModalAdmin: React.FC<AddPropertyModalAdminProps> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    type: '',
    location: '',
    price: '',
    rooms: '',
    description: '',
    amenities: [] as string[],
    title: '',
    ownerId: ''
  })
  const [images, setImages] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [owners, setOwners] = useState<Array<{ value: string; label: string }>>([])
  const [loadingOwners, setLoadingOwners] = useState(true)

  const amenitiesList = ['WiFi', 'Parking', 'Elevator', 'Security', 'Water Supply', 'Backup Power', 'Garden', 'Gym']

  const propertyTypeOptions = [
    { value: 'Room', label: 'Room' },
    { value: '1BHK', label: '1BHK' },
    { value: '2BHK', label: '2BHK' },
    { value: '3BHK', label: '3BHK+' },
    { value: 'Studio', label: 'Studio' },
    { value: 'Shared', label: 'Shared' },
  ]

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem('flatmate_token')
        console.log('Token:', token ? 'exists' : 'missing')
        
        if (!token) {
          setLoadingOwners(false)
          return
        }

        const response = await fetch(`${BACKEND_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        console.log('Response status:', response.status)

        if (!response.ok) {
          console.error('Failed to fetch users:', response.status)
          setLoadingOwners(false)
          return
        }

        const data = await response.json()
        console.log('Fetched data:', data)
        console.log('Users array:', data.users)

        if (!data.success || !Array.isArray(data.users)) {
          console.error('Unexpected response:', data)
          setLoadingOwners(false)
          return
        }

        console.log('All users:', data.users.map((u: any) => ({ name: `${u.firstName} ${u.lastName}`, role: u.role })))

        // API returns role as 'landlord' for property owners, 'tenant' for tenants
        // Show only users with role 'landlord' as property owners
        const ownersList = data.users
          .filter((u: any) => u.role === 'landlord')
          .map((u: any) => ({
            value: u._id,
            label: `${u.firstName} ${u.lastName} (${u.email})`
          }))

        console.log('Filtered owners list:', ownersList)
        setOwners(ownersList)
      } catch (error) {
        console.error('Error fetching owners:', error)
      } finally {
        setLoadingOwners(false)
      }
    }
    fetchOwners()
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
    if (!form.ownerId) errs.ownerId = 'Please select an owner'
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

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setUploadProgress(0)

    try {
      setUploadProgress(10)

      let imageUrls: string[] = []
      if (images.length > 0) {
        setUploadProgress(20)
        imageUrls = await Promise.all(images.map(img => convertToBase64(img)))
        setUploadProgress(60)
      }

      const selectedOwner = owners.find(o => o.value === form.ownerId)
      const ownerName = selectedOwner?.label.split(' (')[0] || 'Unknown Owner'
      const ownerEmail = selectedOwner?.label.match(/\(([^)]+)\)/)?.[1] || ''

      const propertyData = {
        title: form.title,
        location: form.location,
        rent: parseInt(form.price),
        beds: parseInt(form.rooms),
        baths: 1,
        type: form.type,
        area: '850 sqft',
        status: 'approved' as const,
        furnishing: 'Unfurnished',
        parking: 'Available',
        wifi: form.amenities.includes('WiFi'),
        description: form.description,
        amenities: form.amenities,
        image: imageUrls[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
        images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop'],
        ownerName,
        ownerId: form.ownerId,
        ownerEmail,
      }

      setUploadProgress(80)
      const created = await createProperty(propertyData)

      if (created) {
        setUploadProgress(100)
        toast.success('Property added and published successfully!')
        onAdd(created)
        setTimeout(() => onClose(), 500)
      } else {
        throw new Error('Failed to create property')
      }
    } catch (error: any) {
      console.error('Error adding property:', error)
      toast.error(error.message || 'Failed to add property')
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
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Property</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the property details below</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        {saving && (
          <div className="px-6 pt-4 shrink-0">
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

        {/* Scrollable content */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          <div className="space-y-6">

            {/* Owner Selection */}
            {loadingOwners ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Select Owner *
                </label>
                <div className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-400 dark:bg-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-button-primary rounded-full animate-spin" />
                  Loading owners...
                </div>
              </div>
            ) : (
              <InlineDropdown
                label="Select Owner *"
                icon={<UserIcon className="w-4 h-4" />}
                value={form.ownerId}
                onChange={(value) => setForm({ ...form, ownerId: value })}
                options={owners}
                placeholder="Select an owner"
                error={errors.ownerId}
              />
            )}

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
              <InlineDropdown
                label="Property Type *"
                value={form.type}
                onChange={(value) => setForm({ ...form, type: value })}
                options={propertyTypeOptions}
                placeholder="Select type"
                error={errors.type}
              />
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
                placeholder="Describe the property..."
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
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-button-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                  className="hidden"
                  id="property-images-admin"
                />
                <label htmlFor="property-images-admin" className="cursor-pointer">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Click to upload property images</p>
                  <p className="text-xs text-gray-400">Upload multiple images (JPG, PNG)</p>
                </label>
              </div>
              {images.length > 0 && (
                <p className="text-sm text-green-600 mt-2">{images.length} image(s) selected</p>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl shrink-0">
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
                Add Property
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}