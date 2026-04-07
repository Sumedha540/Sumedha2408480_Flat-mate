/**
 * COMPATIBILITY QUIZ PAGE
 * =======================
 * Multi-question quiz to find compatible roommates:
 * - Display quiz questions one at a time
 * - Multiple choice answer options
 * - Progress bar showing quiz completion
 * - Calculate compatibility score based on answers
 * - Redirect to match suggestions after completion
 * - Store user preferences for matching algorithm
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckIcon, HomeIcon, ChevronRightIcon as ChevRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
const questions = [{
  id: 1,
  question: "What's your typical sleep schedule?",
  options: ['Early bird (Asleep by 10pm)', 'Night owl (Up past midnight)', 'Somewhere in between', 'It varies a lot']
}, {
  id: 2,
  question: 'How do you feel about guests?',
  options: ['I love hosting friends often', 'Occasional guests are fine', 'Prefer a quiet home with few visitors', 'No guests allowed']
}, {
  id: 3,
  question: "What's your cleanliness level?",
  options: ['Neat freak - everything spotless', 'Generally tidy but relaxed', 'A bit messy sometimes', 'Organized chaos']
}, {
  id: 4,
  question: 'Do you smoke or drink?',
  options: ['Neither', 'Social drinker only', 'Smoker (outside only)', 'Both socially']
}, {
  id: 5,
  question: 'How do you handle shared expenses?',
  options: ['Split everything evenly', 'Pay for what you use', 'Take turns buying supplies', 'Keep everything separate']
}];
export function CompatibilityQuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const handleAnswer = (answer: string) => {
    const updated = { ...answers, [currentQuestion]: answer };
    setAnswers(updated);
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setIsComplete(true), 300);
    }
  };
  const handleViewMatches = () => {
    // Pass quiz answers as a serialized param so MatchSuggestionsPage can filter
    const encoded = encodeURIComponent(JSON.stringify(answers));
    navigate(`/match-suggestions?quiz=${encoded}`);
  };
  return <main className="min-h-screen bg-background-light py-12 flex items-center justify-center">
      <div className="w-full max-w-2xl px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevRight className="w-3.5 h-3.5" />
          <Link to="/find-roommate" className="hover:text-primary transition-colors">Find Roommate</Link>
          <ChevRight className="w-3.5 h-3.5" />
          <span className="text-primary font-semibold">Compatibility Quiz</span>
        </nav>
        {!isComplete ? <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary mb-2">
                Roommate Compatibility Quiz
              </h1>
              <p className="text-gray-600">
                Let's find out who you'd live best with
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <motion.div className="bg-primary h-2 rounded-full" initial={{
            width: 0
          }} animate={{
            width: `${currentQuestion / questions.length * 100}%`
          }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentQuestion} initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }}>
                <Card className="p-8">
                  <h2 className="text-xl font-semibold text-primary mb-6">
                    {questions[currentQuestion].question}
                  </h2>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => <button key={index} onClick={() => handleAnswer(option)} className={`w-full p-4 text-left rounded-xl border-2 transition-all hover:bg-background-light ${answers[currentQuestion] === option ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-gray-100 text-gray-700'}`}>
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {answers[currentQuestion] === option && <CheckIcon className="w-5 h-5 text-primary" />}
                        </div>
                      </button>)}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="text-center text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div> : <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Quiz Complete!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We've analyzed your preferences. You're now ready to see roommates
              who match your lifestyle.
            </p>
            <Button size="lg" onClick={handleViewMatches}>
              View My Matches
            </Button>
          </motion.div>}
      </div>
    </main>;
}