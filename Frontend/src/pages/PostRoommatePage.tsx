import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadIcon, CheckIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { toast } from 'sonner';
export function PostRoommatePage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success('Your listing has been posted successfully!');
    // Redirect logic would go here
  };
  return <main className="min-h-screen bg-background-light py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Find Your Ideal Roommate
          </h1>
          <p className="text-gray-600">
            Create a listing to connect with compatible people
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {[1, 2, 3].map(s => <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s ? <CheckIcon className="w-6 h-6" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 bg-gray-200 mx-2 ${step > s ? 'bg-primary' : ''}`} />}
            </div>)}
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            {step === 1 && <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-6">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Personal Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" placeholder="Enter your name" />
                  <Input label="Age" type="number" placeholder="e.g. 25" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select label="Gender" options={[{
                value: 'male',
                label: 'Male'
              }, {
                value: 'female',
                label: 'Female'
              }, {
                value: 'other',
                label: 'Other'
              }]} />
                  <Input label="Occupation" placeholder="e.g. Student, Software Engineer" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Bio
                  </label>
                  <textarea className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" rows={4} placeholder="Tell potential roommates about yourself..." />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(2)}>
                    Next Step
                  </Button>
                </div>
              </motion.div>}

            {step === 2 && <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-6">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Preferences & Requirements
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Budget Range (NPR)" placeholder="e.g. 10,000 - 15,000" />
                  <Input label="Preferred Location" placeholder="e.g. Koteshwor, Baneshwor" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select label="Room Type" options={[{
                value: 'single',
                label: 'Single Room'
              }, {
                value: 'shared',
                label: 'Shared Room'
              }, {
                value: 'flat',
                label: 'Entire Flat'
              }]} />
                  <Input label="Move-in Date" type="date" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lifestyle Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Non-Smoker', 'Vegetarian', 'Early Riser', 'Pet Friendly', 'Student', 'Professional', 'Quiet', 'Social'].map(tag => <button key={tag} type="button" className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors">
                        {tag}
                      </button>)}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setStep(3)}>
                    Next Step
                  </Button>
                </div>
              </motion.div>}

            {step === 3 && <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-6">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Photos & Verification
                </h2>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    Upload Profile Photo
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Safety First
                  </h4>
                  <p className="text-sm text-blue-600">
                    To keep our community safe, we require phone verification
                    before your listing goes live. Your number will not be
                    displayed publicly.
                  </p>
                </div>

                <Input label="Phone Number for Verification" placeholder="+977 98XXXXXXXX" />

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                    Post Listing
                  </Button>
                </div>
              </motion.div>}
          </Card>
        </form>
      </div>
    </main>;
}