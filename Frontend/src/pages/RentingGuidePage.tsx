import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BookOpenIcon,
  WalletIcon,
  MapIcon,
  ScaleIcon,
  SearchIcon,
  EyeIcon,
  HandshakeIcon,
  FileTextIcon,
  KeyIcon,
  AlertTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  HomeIcon,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
const faqs = [
  {
    question: 'What documents do I need to rent a property in Nepal?',
    answer:
      'Typically, you will need a copy of your Citizenship Certificate or Passport, two passport-size photographs, and sometimes an employment letter or student ID. For expats, a valid passport and visa copy are required.',
  },
  {
    question: 'How much is the standard security deposit?',
    answer:
      'The standard security deposit in Nepal is usually equivalent to 1 to 3 months of rent. This should be clearly stated in your rental agreement and is refundable upon moving out, provided there is no damage to the property.',
  },
  {
    question: 'Are utilities included in the rent?',
    answer:
      'In most cases, electricity, water, and internet are NOT included in the base rent. You will either pay based on sub-meters or a fixed monthly rate agreed upon with the landlord. Always clarify this before signing.',
  },
  {
    question: 'Can the landlord increase the rent anytime?',
    answer:
      'No. According to standard rental agreements, rent can only be increased after the completion of the contract period (usually 1 or 2 years), and the increment percentage (often 5-10%) should be pre-agreed in the contract.',
  },
  {
    question: 'What is the standard notice period for moving out?',
    answer:
      'The standard notice period is usually 30 to 35 days. If you leave without notice, the landlord may deduct a portion of your security deposit.',
  },
]
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-primary group-hover:text-button-primary transition-colors">
          {question}
        </span>
        <div className="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-button-primary/10 transition-colors">
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-button-primary" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-button-primary" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed pr-12">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export function RentingGuidePage() {
  return (
    <main className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="bg-white pt-20 pb-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <BookOpenIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                Tenant Resources
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
              Your Complete
              <br />
              Renting Guide
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Everything you need to know about finding, securing, and living in
              your perfect rental home in Nepal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Before You Start */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Before You Start
            </h2>
            <p className="text-gray-600">
              Preparation is key to a smooth house-hunting experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.1,
              }}
            >
              <Card className="p-8 h-full border-t-4 border-t-button-primary hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-button-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <WalletIcon className="w-7 h-7 text-button-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Set Your Budget
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Calculate your monthly income. A good rule of thumb is to
                  spend no more than 30% of your gross income on rent. Don't
                  forget to factor in utilities, internet, and maintenance fees.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.2,
              }}
            >
              <Card className="p-8 h-full border-t-4 border-t-blue-500 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <MapIcon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Research Locations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Consider your daily commute, proximity to public transport,
                  grocery stores, hospitals, and overall neighborhood safety.
                  Visit the area during both day and night.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.3,
              }}
            >
              <Card className="p-8 h-full border-t-4 border-t-green-500 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                  <ScaleIcon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  Know Your Rights
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Familiarize yourself with basic tenant rights in Nepal. You
                  have the right to a habitable environment, privacy, and proper
                  notice before eviction or rent increases.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              The Renting Process
            </h2>
            <p className="text-gray-600">
              A step-by-step guide to securing your new home.
            </p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-8 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gray-100">
            {[
              {
                step: '01',
                title: 'Search & Shortlist',
                desc: 'Use our advanced filters to narrow down properties that match your criteria. Save your favorites to compare them later.',
                icon: SearchIcon,
                color: 'bg-blue-500',
              },
              {
                step: '02',
                title: 'Visit & Inspect',
                desc: 'Schedule a visit. Check water supply, natural light, mobile network reception, dampness, and overall security of the building.',
                icon: EyeIcon,
                color: 'bg-indigo-500',
              },
              {
                step: '03',
                title: 'Negotiate Terms',
                desc: 'Discuss the rent, security deposit, utility bills sharing, and any repairs needed before you move in. Get verbal agreements clear.',
                icon: HandshakeIcon,
                color: 'bg-purple-500',
              },
              {
                step: '04',
                title: 'Sign Agreement',
                desc: 'Read the rental contract carefully. Ensure all negotiated terms, notice periods, and deposit refund conditions are documented.',
                icon: FileTextIcon,
                color: 'bg-pink-500',
              },
              {
                step: '05',
                title: 'Move In',
                desc: 'Do a final walkthrough, take photos of the empty rooms (for deposit purposes later), collect your keys, and settle in!',
                icon: KeyIcon,
                color: 'bg-button-primary',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: '-100px',
                }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                  <div
                    className={`w-full h-full rounded-full ${item.color} flex items-center justify-center text-white`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-24 md:ml-0 md:w-5/12 bg-background-light p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                  <span
                    className={`text-sm font-bold ${item.color.replace('bg-', 'text-')} mb-2 block`}
                  >
                    STEP {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Common Mistakes to Avoid
            </h2>
            <p className="text-gray-600">
              Learn from others' experiences to protect yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Renting Without a Written Contract',
                desc: 'Verbal agreements hold little legal weight. Always insist on a written, signed document detailing all terms.',
              },
              {
                title: 'Ignoring Water & Electricity Supply',
                desc: 'In Nepal, water scarcity can be an issue. Always ask about the water source (boring, Melamchi, tanker) and power backup.',
              },
              {
                title: 'Not Documenting Existing Damages',
                desc: "Take photos of any existing damages (cracks, broken fixtures) before moving in so you aren't charged for them later.",
              },
              {
                title: 'Paying Cash Without Receipts',
                desc: 'Always pay rent via bank transfer or demand a signed receipt for cash payments to maintain a clear record.',
              },
            ].map((mistake, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                className="flex gap-4 bg-red-50/50 p-6 rounded-2xl border border-red-100"
              >
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangleIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {mistake.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {mistake.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common renting queries.
            </p>
          </div>

          <div className="bg-background-light rounded-3xl p-8 md:p-10 border border-gray-100">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}

          >
            
          </motion.div>
        </div>
      </section>
    </main>
  )
}
