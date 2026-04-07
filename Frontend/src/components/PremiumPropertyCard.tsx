import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CrownIcon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  DownloadIcon,
  CreditCardIcon,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────
interface PremiumPropertyCardProps {
  image: string
  propertyId?: string  // Add propertyId to track which property is unlocked
}

type Step = 1 | 2 | 3 | 4  // Remove step 5

// ─── Property Details (for the specific premium property) ─────────────────────
const PROPERTY_DETAILS = {
  id: 'premium-1',  // Unique ID for this premium property
  title: 'Luxury 3BHK Penthouse',
  location: 'Lazimpat, Kathmandu',
  rent: 65000,
  bedrooms: 3,
  bathrooms: 2,
  area: '2,500 sq ft',
  furnished: 'Fully Furnished',
  parking: 'Available',
  ownerName: 'Suresh Maharjan',
  ownerPhone: '+977 98XXXXXXXX',
  ownerEmail: 'owner@example.com',
  description: 'This stunning penthouse apartment features panoramic city views, modern amenities, and premium finishes throughout. Located in the heart of Lazimpat, it offers easy access to embassies, restaurants, and shopping centers.',
  amenities: ['24/7 Security', 'Elevator', 'Rooftop Terrace', 'Gym', 'Parking', 'Water Supply', 'Backup Power'],
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    amount: 1000,
    display: 'NPR 1,000',
    period: '/month',
    save: '',
    popular: false,
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    amount: 2500,
    display: 'NPR 2,500',
    period: '/3 months',
    save: 'Save 17%',
    popular: true,
  },
  {
    id: 'yearly',
    label: 'Yearly',
    amount: 9000,
    display: 'NPR 9,000',
    period: '/year',
    save: 'Save 25%',
    popular: false,
  },
]

// ─── PDF Receipt (opens print dialog — user saves as PDF) ─────────────────────
function printReceipt(data: {
  name: string
  email: string
  phone: string
  plan: string
  display: string
  receiptId: string
  orderTime: string
}) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Flat-Mate Receipt ${data.receiptId}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',sans-serif;background:#f5f5f5;display:flex;justify-content:center;padding:40px 20px}
    .card{background:#fff;border-radius:16px;max-width:480px;width:100%;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.1)}
    .logo-wrap{text-align:center;margin-bottom:12px}
    .logo-box{display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#1a4731,#2d6a4f);padding:12px 22px;border-radius:14px;box-shadow:0 4px 16px rgba(45,106,79,0.3)}
    .logo-icon{width:36px;height:36px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .logo-text{color:#fff;font-size:18px;font-weight:900;letter-spacing:-0.5px}
    .logo-tagline{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-top:5px;display:block}
    h1{text-align:center;font-size:22px;font-weight:800;color:#111;margin:20px 0 24px}
    .section-title{font-size:13px;font-weight:700;color:#333;margin-bottom:10px;padding-top:16px;border-top:1px dashed #e5e7eb}
    .row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px dashed #f0f0f0;font-size:13px}
    .row .label{color:#6b7280}
    .row .value{font-weight:600;color:#111;text-align:right}
    .badge{background:#22c55e;color:#fff;font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px}
    .total-row{display:flex;justify-content:space-between;padding:12px 0 0;font-size:15px;font-weight:800}
    .total-label{color:#111}
    .total-value{color:#2d6a4f}
    .footer{text-align:center;font-size:11px;color:#9ca3af;margin-top:24px;padding-top:16px;border-top:1px solid #f0f0f0}
    .divider{border:none;border-top:2px dashed #e5e7eb;margin:16px 0}
    @media print{body{background:#fff;padding:0}.card{box-shadow:none}}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-wrap">
      <div class="logo-box">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span class="logo-text">Flat-Mate</span>
      </div>
      <span class="logo-tagline">Nepal's #1 Rental Platform</span>
    </div>
    <h1>Payment Successful</h1>

    <p class="section-title">Payment Details</p>
    <div class="row"><span class="label">Invoice Number</span><span class="value">${data.receiptId}</span></div>
    <div class="row"><span class="label">Order Time</span><span class="value">${data.orderTime}</span></div>
    <div class="row"><span class="label">Payment Method</span><span class="value">Khalti</span></div>
    <div class="row"><span class="label">Payment Status</span><span class="value"><span class="badge">Successful</span></span></div>
    <div class="row" style="border-bottom:none"><span class="label">Amount</span><span class="value">${data.display}</span></div>

    <hr class="divider"/>

    <p class="section-title">Subscription Details</p>
    <div class="row"><span class="label">Plan</span><span class="value">Flat-Mate Premium — ${data.plan}</span></div>
    <div class="row"><span class="label">Subscriber</span><span class="value">${data.name}</span></div>
    <div class="row"><span class="label">Email</span><span class="value">${data.email}</span></div>
    <div class="row" style="border-bottom:none"><span class="label">Phone</span><span class="value">${data.phone}</span></div>

    <hr class="divider"/>

    <div class="total-row">
      <span class="total-label">Total Amount</span>
      <span class="total-value">${data.display}</span>
    </div>

    <div class="footer">
      Thank you for choosing Flat-Mate Premium<br/>
      support@flatmate.com.np · +977-1-234-5678<br/>
      flatmate.com.np
    </div>
  </div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=620,height=780')
  if (!win) {
    toast.error('Pop-up blocked — please allow pop-ups for this site.')
    return
  }
  win.document.write(html)
  win.document.close()
  win.focus()
  // Small delay so browser can render before print dialog opens
  setTimeout(() => win.print(), 500)
}

// ─── Step progress bar ────────────────────────────────────────────────────────
function StepBar({ step }: { step: Step }) {
  const steps = ['Personal Info', 'Choose Plan', 'Payment', 'Done']
  return (
    <div className="flex items-start justify-center mb-8">
      {steps.map((label, i) => {
        const sn   = i + 1
        const done = step > sn
        const cur  = step === sn
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ scale: cur ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 320 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                  done
                    ? 'bg-button-primary border-button-primary text-white'
                    : cur
                    ? 'border-button-primary text-button-primary bg-button-primary/10'
                    : 'border-gray-200 text-gray-400 bg-white'
                }`}
              >
                {done ? <CheckIcon className="w-5 h-5" /> : sn}
              </motion.div>
              <span
                className={`text-[10px] font-semibold mt-1.5 whitespace-nowrap ${
                  cur ? 'text-button-primary' : done ? 'text-button-primary/60' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < 3 && (
              <div
                className={`h-0.5 w-10 mt-5 mx-1 rounded-full transition-all duration-500 ${
                  step > sn ? 'bg-button-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Portal — renders children at document.body to avoid clip/z-index issues ──
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  if (!mounted) return null
  return createPortal(children, document.body)
}

// ─── Main component ───────────────────────────────────────────────────────────
export function PremiumPropertyCard({ image, propertyId = PROPERTY_DETAILS.id }: PremiumPropertyCardProps) {
  const [open,      setOpen]      = useState(false)
  const [step,      setStep]      = useState<Step>(1)
  const [plan,      setPlan]      = useState('quarterly')
  const [loading,   setLoading]   = useState(false)
  const [receiptId, setReceiptId] = useState('')
  const [orderTime, setOrderTime] = useState('')
  const [form,      setForm]      = useState({ name: '', email: '', phone: '' })
  const [isUnlocked, setIsUnlocked] = useState(false)  // Track if THIS property is unlocked

  // Check if THIS specific property is already unlocked (from localStorage)
  useEffect(() => {
    const unlockedProperties = JSON.parse(localStorage.getItem('unlocked_premium_properties') || '[]')
    if (unlockedProperties.includes(propertyId)) {
      setIsUnlocked(true)
    }
  }, [propertyId])

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const selectedPlan = PLANS.find(p => p.id === plan)!

  const handleCardClick = () => {
    // If already unlocked, navigate to property detail page
    if (isUnlocked) {
      window.location.href = `/property/${propertyId}`
      return
    }
    // Otherwise, open subscription modal
    openModal()
  }

  const openModal = () => {
    setStep(1)
    setForm({ name: '', email: '', phone: '' })
    setPlan('quarterly')
    setReceiptId('')
    setOrderTime('')
    setOpen(true)
  }

  const closeModal = () => setOpen(false)

  // Step 1: validate personal info
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    // Validate phone: must be exactly 10 digits
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      toast.error('Phone number must be exactly 10 digits')
      return
    }
    setStep(2)
  }

  // Step 3: POST to /api/payment/khalti/dummy-pay → saves to MongoDB
  // When you have a real Khalti secret key, swap this for the /initiate route.
  // See KHALTI_INTEGRATION.md for the real flow.
  const handleKhaltiPay = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/payment/khalti/dummy-pay', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          amount:        selectedPlan.amount,
          planName:      selectedPlan.label,
          customerName:  form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setReceiptId(data.receiptId)
        setOrderTime(data.orderTime)
        
        // Mark THIS specific property as unlocked in localStorage
        const unlockedProperties = JSON.parse(localStorage.getItem('unlocked_premium_properties') || '[]')
        if (!unlockedProperties.includes(propertyId)) {
          unlockedProperties.push(propertyId)
          localStorage.setItem('unlocked_premium_properties', JSON.stringify(unlockedProperties))
        }
        setIsUnlocked(true)
        
        setStep(4)
        toast('Payment confirmed! Property unlocked!', {
          style: {
            background: '#2F7D5F',
            color: 'white',
          },
        })
      } else {
        toast.error(data.error || 'Payment failed. Please try again.')
      }
    } catch (err) {
      toast.error('Network error — is your backend running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── CARD ─────────────────────────────────────────────────────────── */}
      <div 
        className="relative group rounded-2xl overflow-hidden shadow-lg h-80 cursor-pointer select-none"
        onClick={handleCardClick}
      >
        {/* Scale wrapper — avoids glitch from scaling img directly */}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <img
            src={image}
            alt="Premium Property"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors duration-300" />

        {/* Hover content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-xl">
            <CrownIcon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-white text-xl font-black mb-2">
            {isUnlocked ? 'Premium Property' : 'Exclusive Property'}
          </h3>
          <p className="text-white/80 text-sm mb-5 max-w-[200px] leading-relaxed">
            {isUnlocked 
              ? 'Click to view full property details.'
              : 'Unlock to view details and contact owner.'
            }
          </p>
          <div className="px-6 py-2.5 bg-yellow-400 text-gray-900 font-black rounded-full text-sm shadow-xl">
            {isUnlocked ? 'View Property' : 'Unlock Now'}
          </div>
        </div>

        {/* Premium badge */}
        <div className={`absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md ${
          isUnlocked 
            ? 'bg-green-500 text-white' 
            : 'bg-yellow-400 text-gray-900'
        }`}>
          <CrownIcon className="w-3 h-3" /> {isUnlocked ? 'UNLOCKED' : 'EXCLUSIVE'}
        </div>
      </div>

      {/* ── MODAL via Portal ──────────────────────────────────────────────── */}
      <Portal>
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop — 50% opacity blur */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeModal}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 99998,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              />

              {/* Modal panel — 576px wide */}
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.9, y: 32 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 32 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 99999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  pointerEvents: 'none',
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ pointerEvents: 'auto', width: '100%', maxWidth: '576px' }}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                  {/* ── Modal header ── */}
                  <div
                    className="relative px-8 pt-7 pb-6 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#1a4731 0%,#2d6a4f 100%)' }}
                  >
                    {/* Decorative rings */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="absolute -top-8 -right-8 w-28 h-28 border border-white/10 rounded-full pointer-events-none"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                      className="absolute -bottom-6 -left-6 w-24 h-24 border border-white/10 rounded-full pointer-events-none"
                    />

                    {/* Close button */}
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 w-9 h-9 bg-white/15 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
                    >
                      <XIcon className="w-4 h-4 text-white" />
                    </button>

                    {/* Title */}
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                        <CrownIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white">Flat-Mate Premium</h2>
                        <p className="text-white/70 text-sm">Unlock exclusive property access</p>
                      </div>
                    </div>
                  </div>

                  {/* ── Modal body ── */}
                  <div className="px-8 pt-7 pb-8 max-h-[75vh] overflow-y-auto">
                    <StepBar step={step} />

                    <AnimatePresence mode="wait">

                      {/* ════════════════════════════════════════
                          STEP 1 — Personal Info
                      ════════════════════════════════════════ */}
                      {step === 1 && (
                        <motion.form
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.22 }}
                          onSubmit={handleStep1}
                          className="space-y-5"
                        >
                          {[
                            { key: 'name',  label: 'Full Name',     Icon: UserIcon,  type: 'text',  ph: 'Your full name' },
                            { key: 'email', label: 'Email Address', Icon: MailIcon,  type: 'email', ph: 'you@example.com' },
                            { key: 'phone', label: 'Phone Number',  Icon: PhoneIcon, type: 'tel',   ph: '98XXXXXXXX (10 digits)' },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                {f.label}
                              </label>
                              <div className="relative">
                                <f.Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                  required
                                  type={f.type}
                                  value={(form as any)[f.key]}
                                  onChange={e => {
                                    // For phone field, allow only digits and limit to 10
                                    if (f.key === 'phone') {
                                      const digits = e.target.value.replace(/\D/g, '')
                                      if (digits.length <= 10) {
                                        setForm({ ...form, [f.key]: digits })
                                      }
                                    } else {
                                      setForm({ ...form, [f.key]: e.target.value })
                                    }
                                  }}
                                  placeholder={f.ph}
                                  maxLength={f.key === 'phone' ? 10 : undefined}
                                  inputMode={f.key === 'phone' ? 'numeric' : undefined}
                                  pattern={f.key === 'phone' ? '[0-9]{10}' : undefined}
                                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-button-primary transition-all"
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            type="submit"
                            className="w-full py-4 bg-button-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-button-primary/90 transition-all shadow-md text-base mt-2 active:scale-[0.98]"
                          >
                            Continue <ArrowRightIcon className="w-5 h-5" />
                          </button>
                        </motion.form>
                      )}

                      {/* ════════════════════════════════════════
                          STEP 2 — Choose Plan
                      ════════════════════════════════════════ */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.22 }}
                          className="space-y-3"
                        >
                          {PLANS.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setPlan(p.id)}
                              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all relative ${
                                plan === p.id
                                  ? 'border-button-primary bg-button-primary/5'
                                  : 'border-gray-200 hover:border-button-primary/40'
                              }`}
                            >
                              {p.popular && (
                                <span className="absolute -top-2.5 left-4 text-[10px] font-black text-white bg-button-primary px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                  Most Popular
                                </span>
                              )}
                              {/* Radio indicator */}
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                  plan === p.id ? 'border-button-primary bg-button-primary' : 'border-gray-300'
                                }`}
                              >
                                {plan === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-gray-900">{p.label}</span>
                                {p.save && (
                                  <span className="ml-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    {p.save}
                                  </span>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-black text-gray-900">{p.display}</p>
                                <p className="text-xs text-gray-400">{p.period}</p>
                              </div>
                            </button>
                          ))}

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setStep(1)}
                              className="flex items-center gap-2 px-5 py-3.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all"
                            >
                              <ArrowLeftIcon className="w-4 h-4" /> Back
                            </button>
                            <button
                              onClick={() => setStep(3)}
                              className="flex-1 py-3.5 bg-button-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-button-primary/90 transition-all shadow-md text-base active:scale-[0.98]"
                            >
                              Continue <ArrowRightIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* ════════════════════════════════════════
                          STEP 3 — Khalti Payment
                      ════════════════════════════════════════ */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.22 }}
                          className="space-y-5"
                        >
                          {/* Order summary */}
                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                              Order Summary
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Plan</span>
                                <span className="font-semibold text-gray-900">
                                  Flat-Mate Premium — {selectedPlan.label}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subscriber</span>
                                <span className="font-semibold text-gray-900">{form.name}</span>
                              </div>
                              <div className="flex justify-between text-base font-black pt-3 mt-1 border-t border-gray-200">
                                <span className="text-gray-900">Total</span>
                                <span className="text-button-primary">{selectedPlan.display}</span>
                              </div>
                            </div>
                          </div>

                          {/* Khalti card */}
                          <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                <span className="text-white font-black text-xl">K</span>
                              </div>
                              <div>
                                <p className="font-black text-gray-900">Pay with Khalti</p>
                                <p className="text-xs text-purple-600 font-semibold">
                                  Nepal's trusted digital wallet
                                </p>
                              </div>
                              <CheckCircleIcon className="w-5 h-5 text-purple-500 ml-auto flex-shrink-0" />
                            </div>
                          </div>

                          {/* Security note */}
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <ShieldCheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>Secure payment · Powered by Khalti Digital Wallet · 256-bit SSL</span>
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => setStep(2)}
                              className="flex items-center gap-2 px-5 py-3.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all"
                            >
                              <ArrowLeftIcon className="w-4 h-4" /> Back
                            </button>
                            <button
                              onClick={handleKhaltiPay}
                              disabled={loading}
                              className="flex-1 py-3.5 bg-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 disabled:opacity-60 transition-all shadow-md text-base active:scale-[0.98]"
                            >
                              {loading ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                  />
                                  Processing Khalti...
                                </>
                              ) : (
                                <>
                                  <CreditCardIcon className="w-5 h-5" />
                                  Pay {selectedPlan.display}
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* ════════════════════════════════════════
                          STEP 4 — Success + Receipt
                      ════════════════════════════════════════ */}
                      {step === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-center"
                        >
                          {/* Success animation */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                          >
                            <CheckCircleIcon className="w-10 h-10 text-green-600" />
                          </motion.div>

                          <h3 className="text-2xl font-black text-gray-900 mb-1">
                            Payment Successful!
                          </h3>
                          <p className="text-gray-500 text-sm mb-6">
                            You are now a Flat-Mate Premium member.
                          </p>

                          {/* ── Receipt card — matches provided screenshot ── */}
                          <div className="bg-gray-50 rounded-2xl border border-gray-200 text-left mb-6 overflow-hidden">

                            {/* Payment Details section */}
                            <div className="bg-white px-5 py-4 border-b border-dashed border-gray-200">
                              <p className="font-black text-gray-800 text-sm">Payment Details</p>
                            </div>
                            <div className="px-5 py-1">
                              {[
                                { label: 'Invoice Number', value: receiptId,              badge: false },
                                { label: 'Order Time',     value: orderTime,              badge: false },
                                { label: 'Payment Method', value: 'Khalti',              badge: false },
                                { label: 'Payment Status', value: 'Successful',          badge: true  },
                                { label: 'Amount',         value: selectedPlan.display,  badge: false },
                              ].map((row, idx, arr) => (
                                <div
                                  key={row.label}
                                  className={`flex items-center py-3 text-sm ${idx < arr.length - 1 ? 'border-b border-dashed border-gray-100' : ''}`}
                                >
                                  <span className="text-gray-500 font-medium w-36 flex-shrink-0">
                                    {row.label}
                                  </span>
                                  <span className="text-gray-400 mx-2 flex-shrink-0">:</span>
                                  {row.badge ? (
                                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                                      {row.value}
                                    </span>
                                  ) : (
                                    <span className="font-bold text-gray-900 truncate">
                                      {row.value}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Subscription Details section */}
                            <div className="bg-white px-5 py-4 border-t border-dashed border-gray-200">
                              <p className="font-black text-gray-800 text-sm mb-3">
                                Subscription Details
                              </p>
                              {[
                                { label: 'Plan',       value: `Premium — ${selectedPlan.label}` },
                                { label: 'Subscriber', value: form.name },
                              ].map((row, idx, arr) => (
                                <div
                                  key={row.label}
                                  className={`flex items-center py-2 text-sm ${idx < arr.length - 1 ? 'border-b border-dashed border-gray-100' : ''}`}
                                >
                                  <span className="text-gray-500 font-medium w-36 flex-shrink-0">
                                    {row.label}
                                  </span>
                                  <span className="text-gray-400 mx-2 flex-shrink-0">:</span>
                                  <span className="font-bold text-gray-900">{row.value}</span>
                                </div>
                              ))}

                              {/* Total */}
                              <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
                                <span className="font-black text-gray-900 text-sm">Total Amount</span>
                                <span className="font-black text-button-primary text-base">
                                  {selectedPlan.display}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() =>
                                printReceipt({
                                  name:      form.name,
                                  email:     form.email,
                                  phone:     form.phone,
                                  plan:      selectedPlan.label,
                                  display:   selectedPlan.display,
                                  receiptId,
                                  orderTime,
                                })
                              }
                              className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98]"
                            >
                              <DownloadIcon className="w-5 h-5" /> Download PDF Receipt
                            </button>
                            <button
                              onClick={() => {
                                closeModal()
                                // Navigate to property detail page after a short delay
                                setTimeout(() => {
                                  window.location.href = `/property/${propertyId}`
                                }, 300)
                              }}
                              className="w-full py-3.5 bg-button-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-button-primary/90 transition-all active:scale-[0.98]"
                            >
                              View Property Details <ArrowRightIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={closeModal}
                              className="w-full py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-300 transition-all active:scale-[0.98]"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </>
  )
}
