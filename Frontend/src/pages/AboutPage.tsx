import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HomeIcon, UsersIcon, ShieldCheckIcon, TrendingUpIcon, HeartIcon,
  AwardIcon, CheckIcon, ArrowRightIcon, SparklesIcon, GlobeIcon,
  LinkedinIcon, BuildingIcon, MapPinIcon, StarIcon, PhoneIcon,
  CheckCircleIcon, ZapIcon, CrownIcon, BadgeCheckIcon,
  BarChart2Icon, SmartphoneIcon, FileTextIcon, ShieldIcon,
  TrophyIcon, RocketIcon,
} from 'lucide-react'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const stats = [
  { label: 'Properties Listed', value: '500+',   icon: BuildingIcon,    color: 'bg-emerald-500', light: 'bg-emerald-50',  iconColor: 'text-emerald-600', desc: 'Verified & ready to rent' },
  { label: 'Happy Tenants',     value: '1,000+', icon: UsersIcon,       color: 'bg-blue-500',    light: 'bg-blue-50',     iconColor: 'text-blue-600',    desc: 'Found their perfect home' },
  { label: 'Verified Owners',   value: '300+',   icon: ShieldCheckIcon, color: 'bg-violet-500',  light: 'bg-violet-50',   iconColor: 'text-violet-600',  desc: 'Trusted & background-checked' },
  { label: 'Cities Covered',    value: '10+',    icon: MapPinIcon,      color: 'bg-orange-500',  light: 'bg-orange-50',   iconColor: 'text-orange-600',  desc: 'Across Nepal' },
]

// Core features — 4 cards around a center image (ref img 3)
const coreFeatures = [
  { icon: BarChart2Icon,  title: 'Verified Listings',     desc: 'Every property personally visited and authenticated by our team before going live.' },
  { icon: SmartphoneIcon, title: 'Mobile Accessibility',  desc: 'Manage your rental journey on the go with our mobile-friendly platform.' },
  { icon: FileTextIcon,   title: 'Seamless Booking',      desc: 'Streamlined rental agreements and booking processes with automated workflows.' },
  { icon: ShieldIcon,       title: 'Enhanced Security',     desc: 'Protect your rental data with state-of-the-art security and owner verification.' },
]

// Milestones — horizontal cards (ref img 4 bottom)
const milestones = [
  { year: '2022', icon: RocketIcon,   title: 'Platform Launched',         desc: 'Started in Kathmandu, connecting renters and owners with verified listings.', highlight: true },
  { year: '2023', icon: MapPinIcon,   title: 'Expanded to 6 Cities',      desc: 'Grew our reach to Lalitpur, Pokhara, Bhaktapur, Dharan & Butwal.' },
  { year: '2024', icon: UsersIcon,   title: '1,000+ Tenants Matched',    desc: 'Crossed a milestone of 1,000 verified successful tenant placements.' },
  { year: '2025', icon: TrophyIcon,   title: 'Premium Features Launched', desc: 'Mobile app, premium subscriptions, and Khalti payment integration.' },
]

const plans = [
  {
    id: 'basic', name: 'Basic', icon: HomeIcon,
    monthlyPrice: 0, yearlyPrice: 0,
    desc: 'Perfect for casual renters', highlight: false, badge: '',
    features: ['Browse all verified listings', 'Save up to 5 properties', 'Basic search filters', 'Email support'],
    cta: 'Get Started Free',
  },
  {
    id: 'pro', name: 'Pro', icon: ZapIcon,
    monthlyPrice: 999, yearlyPrice: 799,
    desc: 'For serious home hunters', highlight: true, badge: 'Most Popular',
    features: ['Everything in Basic', 'Unlimited property saves', 'Direct owner contact', 'Advanced filters & alerts', 'Priority support', 'Early access to new listings'],
    cta: 'Start Pro Plan',
  },
  {
    id: 'owner', name: 'Owner', icon: CrownIcon,
    monthlyPrice: 1999, yearlyPrice: 1599,
    desc: 'For property owners', highlight: false, badge: '',
    features: ['List up to 10 properties', 'Verified owner badge', 'Analytics dashboard', 'Featured listing placement', 'Tenant screening tools', '24/7 dedicated support'],
    cta: 'List Your Property',
  },
]

const team = [
  { name: 'Rajesh Kumar', role: 'CEO & Founder',      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop', bio: 'Passionate about making housing accessible for everyone in Nepal.' },
  { name: 'Sita Sharma',  role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop', bio: 'Ensures every property meets our quality standards.' },
  { name: 'Bikash Thapa', role: 'Lead Developer',     image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop', bio: 'Building the technology that powers seamless rentals.' },
  { name: 'Anita Rai',    role: 'Customer Success',   image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop', bio: 'Dedicated to making every user experience exceptional.' },
]

const OFFICE = { lat: 27.7172, lng: 85.3240, name: 'Flat-Mate HQ', address: 'New Baneshwor, Kathmandu 44600, Nepal' }

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    if (!inView) return
    const match = value.match(/\d[\d,]*/)
    if (!match) { setDisplay(value); return }
    const target = parseInt(match[0].replace(',', ''))
    const suffix = value.replace(match[0], '')
    let start = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        start = Math.min(start + target / 87, target)
        const n = Math.floor(start)
        setDisplay(n >= 1000 ? `${Math.floor(n/1000)},000${suffix}` : `${n}${suffix}`)
        if (start >= target) clearInterval(interval)
      }, 16)
    }, delay)
    return () => clearTimeout(timer)
  }, [inView, value, delay])
  return <span ref={ref}>{display || value}</span>
}

// ─── SECTION HEADING — same stagger animation as stats section ────────────────
function SectionHeading({ badge, title, desc, light = false, center = true }: { badge: string; title: string; desc?: string; light?: boolean; center?: boolean }) {
  return (
    <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
      className={`mb-16 ${center ? 'text-center' : ''}`}>
      <motion.div initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:0.1 }}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 border ${light ? 'bg-white/10 border-white/15' : 'bg-button-primary/10 border-button-primary/20'}`}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${light ? 'bg-emerald-400' : 'bg-button-primary'}`} />
        <span className={`text-sm font-semibold tracking-widest uppercase ${light ? 'text-white/80' : 'text-button-primary'}`}>{badge}</span>
      </motion.div>
      <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
        className={`text-4xl md:text-5xl font-black leading-tight mb-4 ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </motion.h2>
      {desc && (
        <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.3 }}
          className={`text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-white/60' : 'text-gray-500'}`}>
          {desc}
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── MAP ─────────────────────────────────────────────────────────────────────
function OfficeMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    const load = () => {
      if ((window as any).L) { init(); return }
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      document.head.appendChild(link)
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
      s.onload = () => setTimeout(init, 100)
      document.body.appendChild(s)
    }
    const init = () => {
      const L = (window as any).L
      if (!mapRef.current || mapRef.current.querySelector('.leaflet-pane')) return
      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([OFFICE.lat, OFFICE.lng], 15)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).addTo(map)
      const icon = L.divIcon({
        html: `<div style="width:40px;height:40px;background:linear-gradient(135deg,#1a4731,#2d6a4f);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.3)"><div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;height:100%;font-size:16px">🏠</div></div>`,
        className: '', iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -44],
      })
      L.marker([OFFICE.lat, OFFICE.lng], { icon })
        .bindPopup(`<div style="font-family:sans-serif;padding:4px 2px"><strong style="color:#1a4731;font-size:13px">Flat-Mate HQ</strong><br/><span style="color:#6b7280;font-size:11px">${OFFICE.address}</span><br/><a href="https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat},${OFFICE.lng}" target="_blank" style="color:#2d6a4f;font-size:11px;font-weight:700;text-decoration:none">Get Directions →</a></div>`, { maxWidth: 220 })
        .addTo(map).openPopup()
    }
    load()
  }, [])
  return <div ref={mapRef} className="w-full h-full" style={{ background: '#e8ede9', minHeight: '100%' }} />
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export function AboutPage() {
  const [billing, setBilling] = useState<'monthly'|'yearly'>('monthly')

  return (
    <main className="min-h-screen bg-white overflow-hidden">

      {/* ══════════════════════════════════════════════
          1. HERO — white background, clean split
             (removed: background color, user rating,
              happy users, verified badges)
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-white">
        {/* Subtle light green ambient — not dark */}
        <motion.div animate={{ scale:[1,1.2,1], opacity:[0.03,0.08,0.03] }} transition={{ duration:12, repeat:Infinity }}
          className="absolute top-0 right-0 w-[700px] h-[700px] bg-button-primary rounded-full blur-[160px] pointer-events-none" />
        <motion.div animate={{ scale:[1.2,1,1.2], opacity:[0.02,0.06,0.02] }} transition={{ duration:16, repeat:Infinity, delay:3 }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}>
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-button-primary/10 border border-button-primary/20 rounded-full mb-6">
                <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:2, repeat:Infinity }} className="w-2 h-2 bg-button-primary rounded-full" />
                <span className="text-button-primary text-sm font-bold uppercase tracking-widest">Nepal's #1 Rental Platform</span>
              </motion.div>

              <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.04] mb-6">
                Making<br />
                <span className="bg-gradient-to-r from-button-primary to-emerald-500 bg-clip-text text-transparent">Home Finding</span><br />
                Effortless
              </motion.h1>

              <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
                className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
                We're on a mission to make finding and renting properties in Nepal easier, safer, and more transparent for everyone — from students to families.
              </motion.p>

              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }} className="flex flex-wrap gap-4 mb-12">
                <Link to="/properties">
                  <motion.button whileHover={{ scale:1.04, boxShadow:'0 12px 36px rgba(45,106,79,0.3)' }} whileTap={{ scale:0.96 }}
                    className="flex items-center gap-2 px-8 py-4 bg-button-primary text-white font-bold rounded-full shadow-xl text-base">
                    Browse Properties <ArrowRightIcon className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/contact">
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-800 font-bold rounded-full hover:bg-gray-200 transition-colors text-base">
                    Contact Us
                  </motion.button>
                </Link>
              </motion.div>

              {/* Simple stats — no floating badges */}
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.75 }}
                className="flex gap-8 pt-8 border-t border-gray-100">
                {[{ v:'500+', l:'Properties' }, { v:'1K+', l:'Tenants' }, { v:'10+', l:'Cities' }].map(s => (
                  <div key={s.l}>
                    <p className="text-3xl font-black text-gray-900">{s.v}</p>
                    <p className="text-gray-400 text-sm">{s.l}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — clean property image, NO floating badges */}
            <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.9, delay:0.2 }}
              className="relative hidden lg:block">
              <div className="relative w-full h-[560px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&fit=crop" alt="Modern home"
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              {/* Single subtle badge — just the brand pill */}
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2 }}
                className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-button-primary rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">100% Verified</p>
                  <p className="text-gray-400 text-xs">Every listing checked</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. STATS — kept exactly as-is ✅
      ══════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,#1a4731 0%,#2d6a4f 45%,#1e5c3f 100%)' }} />
        <motion.div animate={{ backgroundPosition:['0% 0%','100% 100%'] }} transition={{ duration:25, repeat:Infinity, repeatType:'reverse', ease:'linear' }}
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage:'radial-gradient(circle,white 1.5px,transparent 1.5px)', backgroundSize:'32px 32px' }} />
        <motion.div animate={{ scale:[1,1.2,1], opacity:[0.15,0.3,0.15] }} transition={{ duration:8, repeat:Infinity }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale:[1.2,1,1.2], opacity:[0.1,0.25,0.1] }} transition={{ duration:10, repeat:Infinity, delay:2 }}
          className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/15 rounded-full mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-semibold tracking-wide uppercase">Our Impact</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Trusted by Thousands Across Nepal</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Numbers that reflect our commitment to connecting renters and owners seamlessly.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat,i) => {
              const Icon = stat.icon
              return (
                <motion.div key={stat.label} initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay:i*0.1, duration:0.5, ease:[0.16,1,0.3,1] }} whileHover={{ y:-6, scale:1.02 }}
                  className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-300"
                  style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.12)' }}>
                  <div className={`absolute top-0 left-0 right-0 h-1 ${stat.color} rounded-t-2xl`} />
                  <div className={`w-12 h-12 ${stat.light} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <p className="text-4xl md:text-5xl font-black text-white leading-none mb-2">
                    <AnimatedNumber value={stat.value} delay={i*120} />
                  </p>
                  <p className="text-base font-bold text-white/90 mb-1">{stat.label}</p>
                  <p className="text-sm text-white/50">{stat.desc}</p>
                </motion.div>
              )
            })}
          </div>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-6">
            {[{ icon:ShieldCheckIcon, text:'Every property personally verified' }, { icon:StarIcon, text:'4.8/5 average user rating' }, { icon:HeartIcon, text:'98% tenant satisfaction' }].map((item,i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full" style={{ background:'rgba(255,255,255,0.06)' }}>
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/70 text-sm font-medium">{item.text}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. CORE FEATURES — 4 cards around center image
             (inspired by reference image 3)
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="What We Offer"
            title="Core features that set us apart from the competition"
            desc="Explore our standout features designed to deliver exceptional performance and value, making your rental journey effortless."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left — 2 feature cards */}
            <div className="flex flex-col gap-6">
              {coreFeatures.slice(0,2).map((f,i) => {
                const Icon = f.icon
                return (
                  <motion.div key={f.title} initial={{ opacity:0, x:-32 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                    transition={{ delay:i*0.15, ease:[0.16,1,0.3,1] }} whileHover={{ y:-4, boxShadow:'0 12px 32px rgba(0,0,0,0.07)' }}
                    className="bg-gray-50 rounded-2xl p-7 border border-gray-100 cursor-default transition-all duration-300">
                    <div className="w-11 h-11 bg-button-primary rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900 text-base mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* Center — person/property image */}
            <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
              transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
              className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl mx-4">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop"
                alt="Flat-Mate platform"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Center floating pill */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full px-5 py-2 shadow-xl whitespace-nowrap">
                <p className="text-button-primary font-black text-sm">Nepal's Trusted Platform</p>
              </div>
            </motion.div>

            {/* Right — 2 feature cards */}
            <div className="flex flex-col gap-6">
              {coreFeatures.slice(2,4).map((f,i) => {
                const Icon = f.icon
                return (
                  <motion.div key={f.title} initial={{ opacity:0, x:32 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                    transition={{ delay:i*0.15, ease:[0.16,1,0.3,1] }} whileHover={{ y:-4, boxShadow:'0 12px 32px rgba(0,0,0,0.07)' }}
                    className="bg-gray-50 rounded-2xl p-7 border border-gray-100 cursor-default transition-all duration-300">
                    <div className="w-11 h-11 bg-button-primary rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900 text-base mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. MILESTONES — horizontal scrolling cards
             (inspired by reference image 4 bottom)
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <motion.div initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-button-primary/10 border border-button-primary/20 rounded-full mb-4">
                <span className="w-2 h-2 bg-button-primary rounded-full animate-pulse" />
                <span className="text-button-primary text-sm font-semibold tracking-widest uppercase">Milestones</span>
              </motion.div>
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
                className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Our journey: key milestones<br/>and achievements
              </motion.h2>
            </div>
            <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
              className="text-gray-500 max-w-xs leading-relaxed text-sm md:text-base">
              Discover the significant milestones that have shaped our platform. Each achievement reflects our commitment to excellence.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((m, i) => {
              const Icon = m.icon
              return (
                <motion.div key={m.year} initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay:i*0.1, ease:[0.16,1,0.3,1] }} whileHover={{ y:-6 }}
                  className={`relative rounded-2xl p-7 transition-all duration-300 ${m.highlight ? 'bg-button-primary text-white shadow-2xl shadow-button-primary/25' : 'bg-gray-50 border border-gray-100 hover:border-button-primary/30 hover:shadow-lg'}`}>
                  {/* Year top */}
                  <div className={`text-xs font-black uppercase tracking-widest mb-4 ${m.highlight ? 'text-white/60' : 'text-gray-400'}`}>{m.year}</div>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${m.highlight ? 'bg-white/20' : 'bg-button-primary'}`}>
                    <Icon className={`w-6 h-6 ${m.highlight ? 'text-white' : 'text-white'}`} />
                  </div>
                  <h3 className={`font-black text-base mb-2 ${m.highlight ? 'text-white' : 'text-gray-900'}`}>{m.title}</h3>
                  <p className={`text-sm leading-relaxed ${m.highlight ? 'text-white/70' : 'text-gray-500'}`}>{m.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. SUBSCRIPTION PLANS
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Pricing Plans"
            title="Choose Your Plan"
            desc="Unlock the full power of Flat-Mate. No hidden fees, cancel anytime."
          />
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
              <button onClick={() => setBilling('monthly')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${billing==='monthly'?'bg-button-primary text-white shadow-md':'text-gray-500 hover:text-gray-700'}`}>Monthly</button>
              <button onClick={() => setBilling('yearly')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${billing==='yearly'?'bg-button-primary text-white shadow-md':'text-gray-500 hover:text-gray-700'}`}>
                Yearly <span className="text-[10px] font-black bg-orange-400 text-white px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan,i) => {
              const Icon = plan.icon
              const price = billing==='monthly' ? plan.monthlyPrice : plan.yearlyPrice
              return (
                <motion.div key={plan.id} initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay:i*0.1 }} whileHover={{ y:-8 }}
                  className={`relative rounded-3xl p-8 transition-all duration-300 ${plan.highlight?'bg-button-primary shadow-2xl shadow-button-primary/25':'bg-white border-2 border-gray-100 shadow-lg hover:border-button-primary/30'}`}>
                  {plan.badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black px-5 py-1.5 rounded-full shadow-lg uppercase tracking-wide whitespace-nowrap">{plan.badge}</div>}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${plan.highlight?'bg-white/20':'bg-button-primary/10'}`}>
                    <Icon className={`w-7 h-7 ${plan.highlight?'text-white':'text-button-primary'}`} />
                  </div>
                  <p className={`font-black text-xl mb-1 ${plan.highlight?'text-white':'text-gray-900'}`}>{plan.name}</p>
                  <p className={`text-sm mb-5 ${plan.highlight?'text-white/70':'text-gray-500'}`}>{plan.desc}</p>
                  <AnimatePresence mode="wait">
                    <motion.div key={billing} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }}>
                      {price===0
                        ? <p className={`text-5xl font-black mb-1 ${plan.highlight?'text-white':'text-gray-900'}`}>Free</p>
                        : <div className="flex items-end gap-1 mb-1">
                            <span className={`text-xl font-bold ${plan.highlight?'text-white/70':'text-gray-400'}`}>NPR</span>
                            <span className={`text-5xl font-black leading-none ${plan.highlight?'text-white':'text-gray-900'}`}>{price.toLocaleString()}</span>
                            <span className={`text-sm mb-1 ${plan.highlight?'text-white/60':'text-gray-400'}`}>/{billing==='monthly'?'mo':'yr'}</span>
                          </div>}
                    </motion.div>
                  </AnimatePresence>
                  <div className={`my-5 h-px ${plan.highlight?'bg-white/20':'bg-gray-100'}`} />
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className={`flex items-center gap-3 text-sm font-medium ${plan.highlight?'text-white/90':'text-gray-700'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight?'bg-white/25':'bg-button-primary/15'}`}>
                          <CheckIcon className={`w-3 h-3 ${plan.highlight?'text-white':'text-button-primary'}`} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                    className={`w-full py-3.5 rounded-2xl font-bold transition-all ${plan.highlight?'bg-white text-button-primary hover:bg-gray-100 shadow-lg':'bg-button-primary text-white hover:bg-button-primary/90 shadow-md'}`}>
                    {plan.cta}
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. TEAM
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="The Team" title="Meet Our Team" desc="Passionate individuals revolutionizing the rental market in Nepal, one listing at a time." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member,i) => (
              <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:i*0.1 }} whileHover={{ y:-8 }}
                className="group relative bg-gray-50 rounded-3xl p-7 text-center border-2 border-transparent hover:border-button-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-button-primary rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <LinkedinIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{member.name}</h3>
                <p className="text-button-primary text-sm font-bold mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. MAP — office geolocation
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 relative z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Find Us" title="Visit Our Office" desc="Come meet the team behind Flat-Mate in person. We'd love to hear from you." />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              transition={{ duration:0.8 }} className="lg:col-span-3 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 h-[420px] relative z-0">
              <OfficeMap />
            </motion.div>
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              transition={{ duration:0.8, delay:0.2 }} className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-button-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-button-primary" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 mb-1">Flat-Mate HQ</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{OFFICE.address}</p>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat},${OFFICE.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-button-primary text-sm font-bold hover:underline">
                      Get Directions <ArrowRightIcon className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 mb-1">Contact Us</p>
                    <a href="tel:+97712345678" className="text-gray-600 text-sm block">+977-1-234-5678</a>
                    <a href="mailto:hello@flatmate.com.np" className="text-button-primary text-sm font-semibold hover:underline">hello@flatmate.com.np</a>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <p className="font-black text-gray-900 mb-3">Office Hours</p>
                <div className="space-y-2">
                  {[{ d:'Sun – Fri', t:'9:00 AM – 6:00 PM' }, { d:'Saturday', t:'10:00 AM – 4:00 PM' }, { d:'Public Holidays', t:'Closed' }].map(h => (
                    <div key={h.d} className="flex justify-between text-sm">
                      <span className="text-gray-500">{h.d}</span>
                      <span className="font-semibold text-gray-900">{h.t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href={`https://www.google.com/maps/@${OFFICE.lat},${OFFICE.lng},17z`} target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  className="bg-button-primary text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer shadow-md">
                  <div>
                    <p className="font-black">Open in Google Maps</p>
                    <p className="text-white/70 text-xs">View full directions</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <ArrowRightIcon className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. CTA — same animation as stats section
      ══════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden"
        style={{ background:'linear-gradient(135deg,#1a4731 0%,#2d6a4f 60%,#16a34a 100%)' }}>
        <motion.div animate={{ backgroundPosition:['0% 0%','100% 100%'] }} transition={{ duration:25, repeat:Infinity, repeatType:'reverse', ease:'linear' }}
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage:'radial-gradient(circle,white 1.5px,transparent 1.5px)', backgroundSize:'32px 32px' }} />
        <motion.div animate={{ scale:[1,1.2,1], opacity:[0.15,0.3,0.15] }} transition={{ duration:8, repeat:Infinity }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale:[1.2,1,1.2], opacity:[0.1,0.25,0.1] }} transition={{ duration:10, repeat:Infinity, delay:2 }}
          className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }} className="text-center mb-12">
            <motion.div initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/15 rounded-full mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">Get Started Today</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
              className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Ready to Find Your<br />Dream Home in Nepal?
            </motion.h2>
            <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.3 }}
              className="text-white/60 text-lg max-w-xl mx-auto">
              Join thousands of happy tenants and property owners. Your perfect home is just one search away.
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/properties">
              <motion.button whileHover={{ scale:1.05, boxShadow:'0 16px 40px rgba(0,0,0,0.25)' }} whileTap={{ scale:0.95 }}
                className="flex items-center gap-2 px-9 py-4 bg-white text-button-primary font-black rounded-full shadow-2xl text-base">
                Browse Properties <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                className="flex items-center gap-2 px-9 py-4 bg-transparent border-2 border-white/30 text-white font-black rounded-full hover:bg-white/10 transition-colors text-base">
                <PhoneIcon className="w-5 h-5" /> Contact Us
              </motion.button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-6">
            {[{ icon:ShieldCheckIcon, text:'Trusted by 2,500+ users' }, { icon:BadgeCheckIcon, text:'All properties verified' }, { icon:HeartIcon, text:'Free to get started' }].map((item,i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full" style={{ background:'rgba(255,255,255,0.06)' }}>
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/70 text-sm font-medium">{item.text}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

    </main>
  )
}
