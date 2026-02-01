import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { PlusIcon, MinusIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const faqs = [{
  question: 'How do I contact a potential roommate?',
  answer: "Once you find a profile you like, simply click the 'Send Message' button. You'll need to create a free account first. We recommend chatting within our platform before exchanging personal phone numbers."
}, {
  question: 'Is it free to post a roommate requirement?',
  answer: 'Yes! Posting a basic listing is completely free. We also offer premium features to boost your listing visibility.'
}, {
  question: 'How does the matching algorithm work?',
  answer: 'Our system looks at your budget, location preferences, and lifestyle answers (from the quiz) to suggest people with high compatibility scores.'
}, {
  question: 'What should I include in my listing?',
  answer: 'Be honest and detailed! Include your budget, preferred location, move-in date, and a bit about your lifestyle (habits, hobbies). A clear photo increases responses by 3x.'
}];
export function RoommateFAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return <main className="min-h-screen bg-background-light py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary text-center mb-10">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => <Card key={index} className="overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-primary">
                  {faq.question}
                </span>
                {openIndex === index ? <MinusIcon className="w-5 h-5 text-primary" /> : <PlusIcon className="w-5 h-5 text-gray-400" />}
              </button>
              <AnimatePresence>
                {openIndex === index && <motion.div initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} className="overflow-hidden">
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>}
              </AnimatePresence>
            </Card>)}
        </div>
      </div>
    </main>;
}