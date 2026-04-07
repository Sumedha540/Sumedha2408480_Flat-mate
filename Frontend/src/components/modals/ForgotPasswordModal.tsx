// src/components/modals/ForgotPasswordModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, MailIcon, ArrowLeftIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('OTP sent to your email'); setStep(2); }
      else toast.error(data.message || 'Failed to send OTP');
    } catch { toast.error('Network error.'); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { toast.error('Please enter the complete OTP'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/verify-forgot-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otpValue }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('OTP verified'); setStep(3); }
      else toast.error(data.message || 'Invalid OTP');
    } catch { toast.error('Verification failed.'); }
    finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), newPassword }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('Password reset successful!'); handleClose(); onBackToLogin(); }
      else toast.error(data.message || 'Reset failed');
    } catch { toast.error('Network error.'); }
    finally { setIsLoading(false); }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const n = [...otp]; n[index] = value; setOtp(n);
    if (value && index < 5) document.getElementById(`fp-otp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`fp-otp-${index - 1}`)?.focus();
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('OTP resent!'); setOtp(['', '', '', '', '', '']); }
      else toast.error(data.message || 'Failed to resend');
    } catch { toast.error('Network error'); }
  };

  const handleClose = () => {
    setStep(1); setEmail(''); setNewPassword(''); setConfirmPassword('');
    setOtp(['', '', '', '', '', '']); onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-50 max-h-[90vh] overflow-y-auto">
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <XIcon className="w-5 h-5 text-gray-500" />
            </button>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={onBackToLogin} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 text-sm transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to login
                  </button>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-2">Forgot Password</h2>
                    <p className="text-gray-500 text-sm">Enter your email to receive a reset code</p>
                  </div>
                  <form onSubmit={handleSendOTP} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" />
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 text-sm transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" /> Back
                  </button>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-2">Verify OTP</h2>
                    <p className="text-gray-500 text-sm">Enter the 6-digit code sent to</p>
                    <p className="text-button-primary font-medium text-sm mt-1">{email}</p>
                  </div>
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, i) => (
                        <input key={i} id={`fp-otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)} className="w-11 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors" style={{ height: '52px' }} />
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </motion.button>
                    <p className="text-center text-sm text-gray-600">
                      Didn't receive code?{' '}
                      <button type="button" onClick={handleResendOtp} className="text-button-primary font-semibold hover:underline">Resend</button>
                    </p>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-2">Reset Password</h2>
                    <p className="text-gray-500 text-sm">Create a new strong password</p>
                  </div>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" required className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
