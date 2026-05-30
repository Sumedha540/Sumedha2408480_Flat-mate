// ─── Reviews Route ───────────────────────────────────────────────────────────
import express from 'express'
import Review from '../models/Review.js'

const router = express.Router()

// ── Server-side hate-speech guard (second layer of protection) ───────────────
const BANNED_WORDS = [
  'stupid','idiot','scam','fraud','cheat','fake','liar','liers',
  'worst','terrible','awful','horrible','disgusting','hate','kill',
  'abuse','abusive','racist','loser','dumb','useless','garbage',
  'trash','pathetic','moron','imbecile','crap','shit','damn',
  'hell','ass','bastard','bitch','fuck','bloody',
]

function hasBannedWords(text) {
  return BANNED_WORDS.some(w => new RegExp(`\\b${w}\\b`, 'i').test(text))
}

// ── POST /reviews ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  console.log('📝 POST /api/reviews - Received review submission:', req.body)
  const { propertyId, userId, name, email, comment, rating } = req.body

  if (!propertyId || !userId || !name || !email || !comment || !rating) {
    console.log('❌ Missing required fields')
    return res.status(400).json({ message: 'All fields are required.' })
  }

  // Server-side hate-speech check (client check can be bypassed)
  if (hasBannedWords(comment) || hasBannedWords(name)) {
    console.log('❌ Inappropriate language detected')
    return res.status(422).json({ message: 'Review contains inappropriate language.' })
  }

  try {
    // Check if user already reviewed this property
    const existingReview = await Review.findOne({ propertyId, userId })
    if (existingReview) {
      console.log('❌ User already reviewed this property')
      return res.status(409).json({ message: 'You have already reviewed this property.' })
    }

    const review = await Review.create({ propertyId, userId, name, email, comment, rating })
    console.log('✅ Review saved to database:', review._id)
    res.status(201).json({ message: 'Review submitted successfully!', review })
  } catch (err) {
    console.error('❌ Error saving review:', err)
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ message: 'You have already reviewed this property.' })
    }
    res.status(500).json({ message: 'Failed to save review.', error: err.message })
  }
})

// ── GET /reviews/:propertyId ─────────────────────────────────────────────────
router.get('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params
    console.log('📖 GET /api/reviews/:propertyId - Fetching reviews for property:', propertyId)
    const reviews = await Review.find({ propertyId, approved: true })
      .sort({ createdAt: -1 })
      .limit(100)
    console.log(`✅ Found ${reviews.length} reviews for property ${propertyId}`)
    res.json({ success: true, reviews })
  } catch (err) {
    console.error('❌ Error fetching reviews:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' })
  }
})

// ── GET /reviews (all reviews - optional) ────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, reviews })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' })
  }
})

export default router

