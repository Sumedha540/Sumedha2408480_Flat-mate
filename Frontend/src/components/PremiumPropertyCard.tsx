import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrownIcon, CheckIcon, DownloadIcon, LoaderIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card } from './ui/Card';
import { toast } from 'sonner';
interface PremiumPropertyCardProps {
  image: string;
}
type ModalStep = 'confirm' | 'form' | 'payment' | 'success';
export function PremiumPropertyCard({
  image
}: PremiumPropertyCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>('confirm');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'monthly'
  });
  const handleUpgradeClick = () => {
    setStep('confirm');
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setStep('confirm');
    setFormData({
      name: '',
      email: '',
      phone: '',
      plan: 'monthly'
    });
  };
  const handleConfirmYes = () => {
    setStep('form');
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }
    setStep('payment');
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      toast.success('Payment Successful!');
    }, 2000);
  };
  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded successfully');
  };
  return <>
      <div className="relative group rounded-xl overflow-hidden shadow-lg h-80">
        <img src={image} alt="Premium Property" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CrownIcon className="w-12 h-12 text-[#EAB308] mb-4" />
          <h3 className="text-white text-xl font-bold mb-2">Premium Listing</h3>
          <p className="text-white/80 mb-6 text-sm">
            Unlock exclusive access to this premium property and contact the
            owner directly.
          </p>
          <Button onClick={handleUpgradeClick} className="bg-[#EAB308] hover:bg-[#CA8A04] text-white border-none">
            Upgrade Now
          </Button>
        </div>
        <div className="absolute top-4 right-4 bg-[#EAB308] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <CrownIcon className="w-3 h-3" />
          PREMIUM
        </div>
      </div>

      {/* Subscription Modal */}
      <AnimatePresence>
        {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.95
        }} className="w-full max-w-md">
              <Card className="p-6 bg-white shadow-2xl relative">
                {/* Close Button */}
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <XIcon className="w-5 h-5" />
                </button>

                {/* Step 1: Confirmation */}
                {step === 'confirm' && <div className="text-center py-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CrownIcon className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Upgrade to Premium
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Do you want to buy subscription?
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline" onClick={handleClose} className="w-32">
                        No
                      </Button>
                      <Button onClick={handleConfirmYes} className="w-32 bg-green-600 hover:bg-green-700">
                        Yes
                      </Button>
                    </div>
                  </div>}

                {/* Step 2: Subscription Form */}
                {step === 'form' && <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Subscription Details
                    </h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <Input label="Full Name" placeholder="Enter your name" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} required />
                      <Input label="Email" type="email" placeholder="Enter your email" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required />
                      <Input label="Phone Number" placeholder="Enter your phone" value={formData.phone} onChange={e => setFormData({
                  ...formData,
                  phone: e.target.value
                })} required />
                      <Select label="Subscription Plan" value={formData.plan} onChange={e => setFormData({
                  ...formData,
                  plan: e.target.value
                })} options={[{
                  value: 'monthly',
                  label: 'Monthly Plan - NPR 1,000'
                }, {
                  value: 'quarterly',
                  label: 'Quarterly Plan - NPR 2,500'
                }, {
                  value: 'yearly',
                  label: 'Yearly Plan - NPR 9,000'
                }]} />
                      <Button type="submit" fullWidth className="mt-4 bg-green-600 hover:bg-green-700">
                        Proceed to Payment
                      </Button>
                    </form>
                  </div>}

                {/* Step 3: Payment Loading */}
                {step === 'payment' && <div className="text-center py-12">
                    <LoaderIcon className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Processing eSewa Payment...
                    </h3>
                    <p className="text-gray-500 text-sm mt-2">
                      Please wait while we confirm your transaction.
                    </p>
                  </div>}

                {/* Step 4: Success */}
                {step === 'success' && <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Payment Successful!
                    </h3>
                    <p className="text-gray-600 mb-8">
                      You are now a premium member.
                    </p>
                    <Button onClick={handleDownloadReceipt} variant="outline" fullWidth className="mb-3 flex items-center justify-center gap-2">
                      <DownloadIcon className="w-4 h-4" />
                      Download Receipt
                    </Button>
                    <Button onClick={handleClose} fullWidth className="bg-green-600 hover:bg-green-700">
                      Done
                    </Button>
                  </div>}
              </Card>
            </motion.div>
          </div>}
      </AnimatePresence>
    </>;
}
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>;
}