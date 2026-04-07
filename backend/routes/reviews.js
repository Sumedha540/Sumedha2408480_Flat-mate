// ─── ADD THIS TO YOUR backend/routes/reviews.js (new file) ───────────────────
import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

// ── Mongoose Schema ──────────────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  comment:   { type: String, required: true, trim: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  approved:  { type: Boolean, default: true },   // set false if you want manual moderation
  createdAt: { type: Date, default: Date.now },
})

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)

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
  const { name, email, comment, rating } = req.body

  if (!name || !email || !comment || !rating) {
    return res.status(400).json({ message: 'All fields are required.' })
  }

  // Server-side hate-speech check (client check can be bypassed)
  if (hasBannedWords(comment) || hasBannedWords(name)) {
    return res.status(422).json({ message: 'Review contains inappropriate language.' })
  }

  try {
    const review = await Review.create({ name, email, comment, rating })
    res.status(201).json({ message: 'Review submitted successfully!', review })
  } catch (err) {
    res.status(500).json({ message: 'Failed to save review.', error: err.message })
  }
})

// ── GET /reviews (optional — to display saved reviews) ───────────────────────
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(50)
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews.' })
  }
})

export default router

