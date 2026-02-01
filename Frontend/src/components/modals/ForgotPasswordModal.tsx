import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, MailIcon, ArrowLeftIcon, LockIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from 'sonner';
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}
export function ForgotPasswordModal({
  isOpen,
  onClose,
  onBackToLogin
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      toast.success('OTP sent to your email');
    }, 1500);
  };
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
      toast.success('OTP verified');
    }, 1500);
  };
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password reset successful. Please log in again.');
      onBackToLogin();
    }, 1500);
  };
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  return <AnimatePresence>
      {isOpen && <>
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-50">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <XIcon className="w-5 h-5 text-gray-500" />
            </button>

            {step === 1 && <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }}>
                <button onClick={onBackToLogin} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors">
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span className="text-sm">Back to login</span>
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Forgot Password
                  </h2>
                  <p className="text-gray-600">
                    Enter your email to receive reset code
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-6">
                  <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} icon={<MailIcon className="w-5 h-5" />} />
                  <Button type="submit" fullWidth isLoading={isLoading}>
                    Send OTP
                  </Button>
                </form>
              </motion.div>}

            {step === 2 && <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }}>
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors">
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Verify OTP
                  </h2>
                  <p className="text-gray-600">
                    Enter the 6-digit code sent to {email}
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => <input key={index} id={`otp-${index}`} type="text" maxLength={1} value={digit} onChange={e => handleOtpChange(index, e.target.value)} className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-button-primary focus:outline-none transition-colors" />)}
                  </div>
                  <Button type="submit" fullWidth isLoading={isLoading}>
                    Verify OTP
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Didn't receive code?{' '}
                    <button type="button" onClick={handleSendOTP} className="text-button-primary font-semibold hover:underline">
                      Resend
                    </button>
                  </p>
                </form>
              </motion.div>}

            {step === 3 && <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Reset Password
                  </h2>
                  <p className="text-gray-600">Create a new strong password</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative">
                    <Input label="New Password" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} icon={<LockIcon className="w-5 h-5" />} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>

                  <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} icon={<LockIcon className="w-5 h-5" />} />

                  <Button type="submit" fullWidth isLoading={isLoading}>
                    Reset Password
                  </Button>
                </form>
              </motion.div>}
          </motion.div>
        </>}
    </AnimatePresence>;
}