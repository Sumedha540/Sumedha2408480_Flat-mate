// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  MailIcon, LockIcon, EyeIcon, EyeOffIcon,
  CheckCircleIcon, ArrowLeftIcon, ShieldCheckIcon,
} from 'lucide-react';

type FPStep = 'email' | 'otp' | 'reset' | 'success';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<FPStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('OTP sent to your email!');
        setStep('otp');
      } else {
        toast.error(data.message || 'Failed to send reset OTP');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const n = [...otp]; n[index] = value; setOtp(n);
    if (value && index < 5) document.getElementById(`fp-otp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`fp-otp-${index - 1}`)?.focus();
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { toast.error('Please enter all 6 digits'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/verify-forgot-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otpValue }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('OTP verified!');
        setStep('reset');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch {
      toast.error('Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('OTP resent!'); setOtp(['', '', '', '', '', '']); }
      else toast.error(data.message || 'Failed to resend');
    } catch { toast.error('Network error'); }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successfully!');
        setStep('success');
        setTimeout(() => navigate('/login'), 2500);
      } else {
        toast.error(data.message || 'Password reset failed');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-button-primary via-primary to-button-primary flex items-center justify-center p-4">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/">
              <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-2xl font-bold text-white">Flat-Mate</span>
              </motion.div>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">

              {/* Step 1: Email */}
              {step === 'email' && (
                <motion.div key="email" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-button-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MailIcon className="w-7 h-7 text-button-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-1">Forgot Password?</h1>
                    <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset code.</p>
                  </div>
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      type="submit" disabled={isLoading}
                      className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                    >
                      {isLoading ? 'Sending...' : 'Send Reset OTP'}
                    </motion.button>
                    <div className="text-center">
                      <Link to="/login" className="text-sm text-button-primary hover:underline flex items-center justify-center gap-1">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to Login
                      </Link>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-2">Check Your Email</h2>
                    <p className="text-gray-500 text-sm">Enter the 6-digit code sent to</p>
                    <p className="text-button-primary font-medium text-sm mt-1">{email}</p>
                  </div>
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i} id={`fp-otp-${i}`} type="text" inputMode="numeric"
                          maxLength={1} value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="w-11 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors"
                          style={{ height: '52px' }}
                        />
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      type="submit" disabled={isLoading}
                      className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </motion.button>
                    <div className="flex items-center justify-between text-sm">
                      <button type="button" onClick={() => setStep('email')} className="text-gray-500 hover:text-primary flex items-center gap-1">
                        <ArrowLeftIcon className="w-3.5 h-3.5" /> Back
                      </button>
                      <button type="button" onClick={handleResendOtp} className="text-button-primary font-semibold hover:underline">
                        Resend Code
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Reset Password */}
              {step === 'reset' && (
                <motion.div key="reset" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-button-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <LockIcon className="w-7 h-7 text-button-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-1">Create New Password</h2>
                    <p className="text-gray-500 text-sm">Choose a strong password for your account.</p>
                  </div>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          required
                          className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                          autoComplete="new-password"
                          className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      type="submit" disabled={isLoading}
                      className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                    >
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center py-16">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircleIcon className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-primary mb-2">Password Reset!</h2>
                  <p className="text-gray-500 text-sm">Your password has been updated successfully.</p>
                  <p className="text-gray-400 text-xs mt-2">Redirecting to login...</p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">← Back to Home</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
