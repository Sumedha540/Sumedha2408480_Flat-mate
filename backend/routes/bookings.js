import express  from 'express'
import mongoose from 'mongoose'

const router = express.Router()

// ─── Booking Model ────────────────────────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  propertyId:    { type: String, required: true },
  propertyTitle: { type: String, required: true },
  ownerName:     { type: String, default: '' },
  rent:          { type: Number, default: 0 },
  paymentType:   { type: String, enum: ['advance', 'full', 'cash'], required: true },
  amount:        { type: Number, default: 0 },
  customerName:  { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  moveInDate:    { type: String, default: '' },
  receiptId:     { type: String, default: '' },
  status:        { type: String, default: 'pending' },
}, { timestamps: true })

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)

// // ─── Review Model (matches reviews.js schema) ─────────────────────────────────
// const reviewSchema = new mongoose.Schema({
//   name:          { type: String, required: true, trim: true },
//   email:         { type: String, required: true, trim: true, lowercase: true },
//   comment:       { type: String, required: true, trim: true },
//   rating:        { type: Number, required: true, min: 1, max: 5 },
//   approved:      { type: Boolean, default: true },
//   // Extra fields for property-scoped reviews
//   propertyId:    { type: String, default: '' },
//   propertyTitle: { type: String, default: '' },
// }, { timestamps: true })

// const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)

// ─── Server-side banned words (mirrors frontend list) ─────────────────────────
// const BANNED_WORDS = [
//   'stupid','idiot','scam','fraud','cheat','fake','liar','liers',
//   'worst','terrible','awful','horrible','disgusting','hate','kill',
//   'abuse','abusive','racist','loser','dumb','useless','garbage',
//   'trash','pathetic','moron','imbecile','crap','shit','damn',
//   'hell','ass','bastard','bitch','fuck','bloody',
// ]
// function hasBannedWords(text) {
//   return BANNED_WORDS.some(w => new RegExp(`\\b${w}\\b`, 'i').test(text))
// }


// ════════════════════════════════════════════════
//  BOOKING ROUTES  (prefix: /api/bookings)
// ════════════════════════════════════════════════

// POST /api/bookings/save
router.post('/save', async (req, res) => {
  try {
    const booking = await Booking.create(req.body)
    console.log(`✅ Booking saved: ${booking.receiptId} | ${booking.customerName} | ${booking.paymentType}`)
    res.json({ success: true, bookingId: booking._id })
  } catch (err) {
    console.error('Booking save error:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/bookings/:propertyId
router.get('/:propertyId', async (req, res) => {
  try {
    const bookings = await Booking.find({ propertyId: req.params.propertyId }).sort({ createdAt: -1 })
    res.json({ success: true, bookings })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})


// ════════════════════════════════════════════════
//  REVIEW ROUTES  (prefix: /api/reviews)
//  These work alongside reviews.js — they handle
//  property-scoped GET, and the edit/delete routes.
// ════════════════════════════════════════════════

// GET /api/reviews  OR  GET /api/reviews?propertyId=prop-42
// Returns approved reviews; filters by propertyId if provided
// router.get('/', async (req, res) => {
//   try {
//     const filter = { approved: true }
//     if (req.query.propertyId) filter.propertyId = req.query.propertyId
//     const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(100)
//     res.json(reviews)   // plain array — matches reviews.js GET response shape
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch reviews.', error: err.message })
//   }
// })

// POST /api/reviews  — mirrors reviews.js exactly
// router.post('/', async (req, res) => {
//   const { name, email, comment, rating, propertyId, propertyTitle } = req.body

//   if (!name || !email || !comment || !rating) {
//     return res.status(400).json({ message: 'All fields are required.' })
//   }
//   if (hasBannedWords(comment) || hasBannedWords(name)) {
//     return res.status(422).json({ message: 'Review contains inappropriate language.' })
//   }

//   try {
//     const review = await Review.create({ name, email, comment, rating, propertyId: propertyId || '', propertyTitle: propertyTitle || '' })
//     console.log(`✅ Review saved: ${review.propertyId} | ${review.name} | ${review.rating}★`)
//     res.status(201).json({ message: 'Review submitted successfully!', review })
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to save review.', error: err.message })
//   }
// })

// PUT /api/reviews/:id  — edit a review
// router.put('/:id', async (req, res) => {
//   try {
//     const { comment, rating } = req.body
//     if (hasBannedWords(comment)) {
//       return res.status(422).json({ message: 'Review contains inappropriate language.' })
//     }
//     const updated = await Review.findByIdAndUpdate(
//       req.params.id,
//       { comment, rating, date: 'Edited' },
//       { new: true }
//     )
//     if (!updated) return res.status(404).json({ success: false, message: 'Review not found.' })
//     console.log(`✏️  Review updated: ${req.params.id}`)
//     res.json({ success: true, review: updated })
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// })

// DELETE /api/reviews/:id
// router.delete('/:id', async (req, res) => {
//   try {
//     await Review.findByIdAndDelete(req.params.id)
//     console.log(`🗑️  Review deleted: ${req.params.id}`)
//     res.json({ success: true })
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// })

export default router
