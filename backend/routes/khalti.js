
import express  from 'express'
import axios    from 'axios'
import mongoose from 'mongoose'

const router = express.Router()

const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || 'https://dev.khalti.com/api/v2'
const KHALTI_SECRET   = process.env.KHALTI_SECRET_KEY

// ─── Subscription Model ───────────────────────────────────────────────────────
const subscriptionSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    email:         { type: String, required: true },
    phone:         { type: String, required: true },
    plan:          { type: String, required: true },
    amount:        { type: Number, required: true },
    paymentMethod: { type: String, default: 'Khalti' },
    transactionId: { type: String, default: '' },
    pidx:          { type: String, default: '' },
    receiptId:     { type: String, default: '' },
    status:        {
      type: String,
      enum: ['pending', 'active', 'expired', 'failed'],
      default: 'pending',
    },
    startDate:  { type: Date, default: Date.now },
    expiresAt:  { type: Date },
  },
  { timestamps: true }
)

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model('Subscription', subscriptionSchema)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getExpiryDate(plan) {
  const d = new Date()
  if (plan === 'Monthly')   d.setMonth(d.getMonth() + 1)
  else if (plan === 'Quarterly') d.setMonth(d.getMonth() + 3)
  else if (plan === 'Yearly')    d.setFullYear(d.getFullYear() + 1)
  else d.setMonth(d.getMonth() + 1)
  return d
}

function generateReceiptId() {
  return `KH-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36).substring(2, 6).toUpperCase()}`
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 1 — DUMMY PAY (no real Khalti key needed — saves to MongoDB NOW)
// Frontend calls: POST /api/payment/khalti/dummy-pay
// ─────────────────────────────────────────────────────────────────────────────
router.post('/dummy-pay', async (req, res) => {
  try {
    const { amount, planName, customerName, customerEmail, customerPhone } = req.body

    if (!amount || !planName || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ success: false, error: 'All fields are required' })
    }

    const receiptId = generateReceiptId()
    const now       = new Date()
    const orderTime = now.toLocaleString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true,
      day: '2-digit', month: 'long', year: 'numeric',
    })

    // ✅ Save to MongoDB
    const subscription = await Subscription.create({
      name:          customerName,
      email:         customerEmail,
      phone:         customerPhone,
      plan:          planName,
      amount:        Number(amount),
      paymentMethod: 'Khalti (Dummy)',
      receiptId,
      transactionId: receiptId,
      status:        'active',
      startDate:     now,
      expiresAt:     getExpiryDate(planName),
    })

    console.log(`✅ Subscription saved — Receipt: ${receiptId} | Plan: ${planName} | User: ${customerName}`)

    res.json({
      success:        true,
      receiptId,
      orderTime,
      subscriptionId: subscription._id,
      expiresAt:      subscription.expiresAt,
    })

  } catch (err) {
    console.error('dummy-pay error:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 2 — REAL KHALTI INITIATE (needs KHALTI_SECRET_KEY)
// Frontend calls: POST /api/payment/khalti/initiate
// ─────────────────────────────────────────────────────────────────────────────
router.post('/initiate', async (req, res) => {
  try {
    const { amount, planName, customerName, customerEmail, customerPhone } = req.body

    const subscription = await Subscription.create({
      name:   customerName,
      email:  customerEmail,
      phone:  customerPhone,
      plan:   planName,
      amount: Number(amount),
      status: 'pending',
    })

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      {
        return_url:          `${process.env.FRONTEND_URL}/payment/verify`,
        website_url:          process.env.FRONTEND_URL,
        amount:               String(Number(amount) * 100),
        purchase_order_id:    subscription._id.toString(),
        purchase_order_name: `Flat-Mate Premium ${planName}`,
        customer_info: { name: customerName, email: customerEmail, phone: customerPhone },
      },
      { headers: { Authorization: `key ${KHALTI_SECRET}`, 'Content-Type': 'application/json' } }
    )

    await Subscription.findByIdAndUpdate(subscription._id, { pidx: response.data.pidx })

    res.json({
      success:        true,
      payment_url:    response.data.payment_url,
      pidx:           response.data.pidx,
      subscriptionId: subscription._id,
    })

  } catch (err) {
    console.error('Khalti initiate error:', err.response?.data || err.message)
    res.status(500).json({ success: false, error: 'Payment initiation failed' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 3 — REAL KHALTI VERIFY
// Frontend calls: POST /api/payment/khalti/verify  with { pidx }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/verify', async (req, res) => {
  try {
    const { pidx } = req.body

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      { headers: { Authorization: `key ${KHALTI_SECRET}`, 'Content-Type': 'application/json' } }
    )

    const data = response.data

    if (data.status === 'Completed') {
      const existing = await Subscription.findOne({ pidx })
      const updated  = await Subscription.findOneAndUpdate(
        { pidx },
        {
          status:        'active',
          transactionId: data.transaction_id,
          receiptId:     generateReceiptId(),
          expiresAt:     getExpiryDate(existing?.plan || 'Monthly'),
        },
        { new: true }
      )
      res.json({ success: true, transactionId: data.transaction_id, amount: data.total_amount / 100, status: data.status, subscription: updated })
    } else {
      await Subscription.findOneAndUpdate({ pidx }, { status: 'failed' })
      res.json({ success: false, status: data.status, message: 'Payment not completed' })
    }

  } catch (err) {
    console.error('Khalti verify error:', err.response?.data || err.message)
    res.status(500).json({ success: false, error: 'Verification failed' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 4 — CHECK STATUS by email
// GET /api/payment/khalti/status/:email
// ─────────────────────────────────────────────────────────────────────────────
router.get('/status/:email', async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      email:     req.params.email,
      status:    'active',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 })

    res.json({ isPremium: !!sub, subscription: sub || null })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
