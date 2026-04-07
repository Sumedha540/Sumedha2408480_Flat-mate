// src/pages/SafetyPage.tsx
// Used by TWO routes:
//   /property-safety-tips  ← "View Tips" button on PropertiesPage
//   /roommate-safety        ← "Safety Tips" from FindRoommatePage

import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  UserCheckIcon,
  FileCheckIcon,
  CreditCardIcon,
  EyeIcon,
  MessageCircleIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
  FlagIcon,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function SafetyTips() {
  return (
    <main className="min-h-screen bg-background-light pt-24">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-16 border-b text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6 mx-auto"
          >
            <ShieldCheckIcon className="w-10 h-10 text-green-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-primary mb-6"
          >
            Stay Safe with<br />Flat-Mate
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Your safety is our top priority. Learn how we verify users, protect your
            data, and ensure a secure renting experience.
          </motion.p>
        </div>
      </section>

      {/* ── VERIFICATION PROCESS ─────────────────────────────────────────── */}
      <section className="py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-primary mb-4"
          >
            Our Verification Process
          </motion.h2>
          <p className="text-gray-600 mb-12">How we ensure every listing and user is genuine.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Document Submission',
                desc: 'Users submit Citizenship, License, or Passport along with a live selfie.',
                icon: FileCheckIcon,
              },
              {
                title: 'Team Review',
                desc: 'Our trust & safety team manually verifies documents against the profile.',
                icon: EyeIcon,
              },
              {
                title: 'Verified Badge',
                desc: 'Approved users receive a green verified badge, building trust in the community.',
                icon: ShieldCheckIcon,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
              >
                <Card className="p-8 rounded-3xl shadow-sm text-center h-full">
                  <div className="w-14 h-14 bg-button-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-7 h-7 text-button-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-primary">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY FEATURE CARDS ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-primary text-center mb-4"
          >
            Platform Safety Features
          </motion.h2>
          <p className="text-gray-600 text-center mb-12">Built-in protections designed to keep you safe.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Never Pay Without Viewing',
                desc: 'Never send money before physically visiting the property. Scammers often use fake listings with photos stolen from other sites.',
                icon: CreditCardIcon,
                bg: 'bg-red-50 border-red-100',
                iconColor: 'text-red-500',
                iconBg: 'bg-red-100',
              },
              {
                title: 'Reverse Image Search Photos',
                desc: 'Right-click property photos and search Google Images. If the same photo appears on multiple sites, it\'s likely a scam.',
                icon: EyeIcon,
                bg: 'bg-yellow-50 border-yellow-100',
                iconColor: 'text-yellow-600',
                iconBg: 'bg-yellow-100',
              },
              {
                title: 'Verify Phone Numbers',
                desc: 'Call the number and search it online. Legitimate landlords have a consistent presence. Be wary of numbers that only go to voicemail.',
                icon: PhoneIcon,
                bg: 'bg-green-50 border-green-100',
                iconColor: 'text-green-600',
                iconBg: 'bg-green-100',
              },
              {
                title: 'Ask for Owner ID',
                desc: 'A legitimate owner will not hesitate to show their citizenship card (Nagarikta). Verify the name matches property documents before paying.',
                icon: UserCheckIcon,
                bg: 'bg-blue-50 border-blue-100',
                iconColor: 'text-blue-600',
                iconBg: 'bg-blue-100',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className={`p-6 rounded-2xl border-2 h-full ${item.bg} transition-all`}>
                  <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY TIPS ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-primary text-center mb-4"
          >
            Safety Tips for Tenants
          </motion.h2>
          <p className="text-gray-600 text-center mb-12">
            Follow these golden rules when looking for a property or roommate.
          </p>

          <div className="space-y-4">
            {[
              {
                title: 'Meet in Public First',
                desc: 'Always arrange the first meeting with a landlord or roommate in a public place like a café. Bring a friend or family member if possible.',
                icon: MapPinIcon,
              },
              {
                title: 'Never Transfer Money Early',
                desc: 'Do not pay any deposit or rent until you have physically seen the place, met the owner, and signed a written agreement.',
                icon: AlertTriangleIcon,
              },
              {
                title: 'Verify Documents',
                desc: "Ask to see the landlord's property ownership documents (Lalpurja) and citizenship before signing the lease or handing over a large deposit.",
                icon: FileCheckIcon,
              },
              {
                title: 'Visit Property in Person',
                desc: 'Never rent a place based solely on photos. Visit to check the condition, neighbourhood, and water and electricity supply.',
                icon: EyeIcon,
              },
              {
                title: 'Use Platform Messaging',
                desc: "Keep your communications on Flat-Mate initially. This gives us a record in case you need to report suspicious behaviour.",
                icon: MessageCircleIcon,
              },
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="p-6 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-button-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-6 h-6 text-button-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{tip.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{tip.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RED FLAGS ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-red-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <AlertTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-red-900 mb-4">Red Flags to Watch For</h2>
            <p className="text-red-700 mb-12">Walk away immediately if you encounter any of these situations.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Prices far below the market average for that area.',
              'Owner claims to be "out of the country" and wants you to wire money.',
              'High pressure to pay a deposit immediately before someone else takes it.',
              'Refusal to show the property interior or making excuses about lost keys.',
            ].map((flag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="p-6 border-t-4 border-red-500 bg-white h-full">
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">{flag}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REPORT & SUPPORT ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-primary mb-4"
          >
            Report & Support
          </motion.h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            If you encounter a fake profile, harassment, or scam attempt, please
            report it immediately. Our trust and safety team investigates all
            reports within 24 hours.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <Card className="p-8 h-full border border-gray-200">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PhoneIcon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1">Emergency Hotline</h3>
                <p className="text-gray-500 text-sm mb-3">Available 24/7 for urgent safety issues.</p>
                <p className="text-xl font-bold text-button-primary">1660-01-12345</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <Card className="p-8 h-full border border-gray-200">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FlagIcon className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="font-bold text-lg mb-1">Report a User</h3>
                <p className="text-gray-500 text-sm mb-4">Use the report button on any profile or listing.</p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    Submit Report
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background-light border-t border-gray-200 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-primary mb-4">
            Ready to search safely?
          </h2>
          <p className="text-gray-600 mb-8">
            All Flat-Mate listings are personally verified by our team.
          </p>
          <Link to="/properties">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-button-primary text-white font-bold rounded-full shadow-lg hover:bg-button-primary/90 transition-all"
            >
              Browse Verified Properties <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

    </main>
  )
}
