import React from 'react';
import { ShieldCheckIcon, AlertTriangleIcon, UserCheckIcon, LockIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
export function SafetyPage() {
  return <main className="min-h-screen bg-background-light py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <ShieldCheckIcon className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-2">
            Safety & Verification
          </h1>
          <p className="text-gray-600">
            How we keep the Flat-Mate community safe and trusted
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserCheckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Identity Verification
            </h3>
            <p className="text-gray-600">
              Every user must verify their phone number. We also offer optional
              ID verification (Citizenship/License) which adds a "Verified"
              badge to profiles, giving you extra peace of mind.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <LockIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Secure Messaging
            </h3>
            <p className="text-gray-600">
              Chat safely within our platform without sharing your personal
              phone number until you feel comfortable. We monitor for suspicious
              behavior and spam.
            </p>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Safety Tips for Roommate Seekers
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Meet in Public First
                </h4>
                <p className="text-gray-600 text-sm">
                  Always arrange the first meeting in a public place like a
                  cafe. Bring a friend along if possible.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Never Transfer Money Early
                </h4>
                <p className="text-gray-600 text-sm">
                  Do not pay any deposit or rent until you have seen the place,
                  met the roommate, and signed an agreement.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Discuss Lifestyle Upfront
                </h4>
                <p className="text-gray-600 text-sm">
                  Be honest about your habits (sleep schedule, guests,
                  cleanliness) to avoid conflicts later.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-start gap-4">
          <AlertTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-800 mb-1">
              Report Suspicious Activity
            </h3>
            <p className="text-sm text-red-700 mb-3">
              If you encounter a fake profile, harassment, or scam attempt,
              please report it immediately.
            </p>
            <button className="text-sm font-semibold text-red-800 hover:underline">
              Contact Support Team →
            </button>
          </div>
        </div>
      </div>
    </main>;
}