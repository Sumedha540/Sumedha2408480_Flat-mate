// src/components/modals/LoginModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeOffIcon, XIcon, MailIcon, LockIcon, CheckCircleIcon, CheckIcon } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const GOOGLE_CLIENT_ID = ((import.meta as any).env || {}).VITE_GOOGLE_CLIENT_ID || '';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
  onForgotPasswordClick: () => void;
}

type LoginStep = 'form' | 'otp' | 'success';

export function LoginModal({ isOpen, onClose, onSignupClick, onForgotPasswordClick }: LoginModalProps) {
  const { login } = useAuth();
  const [step, setStep] = useState<LoginStep>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [userData, setUserData] = useState({ name: '', role: 'tenant' as UserRole });
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleInitialized = useRef(false);

  const handleGoogleResponse = async (response: any, termsAccepted: boolean) => {
    if (!termsAccepted) { toast.error('Please accept Terms & Conditions first'); return; }
    setIsLoading(true); setIsGoogleLogin(true);
    try {
      const res = await fetch('http://localhost:5000/auth/google-login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserData({ name: data.user.name, role: data.user.role });
        setEmail(data.user.email);
        toast.success('OTP sent to your email!'); setStep('otp');
      } else { toast.error(data.message || 'Google login failed'); setIsGoogleLogin(false); }
    } catch { toast.error('Failed to login with Google'); setIsGoogleLogin(false); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (!isOpen || step !== 'form') return;
    const initGoogle = () => {
      if (!(window as any).google) return;
      if (!googleInitialized.current) {
        googleInitialized.current = true;
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => handleGoogleResponse(response, acceptedTerms),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
      setTimeout(() => {
        if (googleButtonRef.current && (window as any).google) {
          googleButtonRef.current.innerHTML = '';
          (window as any).google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline', size: 'large',
            width: googleButtonRef.current.offsetWidth || 380,
            text: 'signin_with', shape: 'rectangular', logo_alignment: 'left',
          });
        }
      }, 150);
    };
    if ((window as any).google) { initGoogle(); }
    else {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!existing) {
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true; s.defer = true; s.onload = initGoogle;
        document.body.appendChild(s);
      } else { (existing as HTMLScriptElement).addEventListener('load', initGoogle); }
    }
  }, [isOpen, step, acceptedTerms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) { toast.error('Please accept Terms & Conditions'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserData({ name: data.user.name, role: data.user.role });
        toast.success('OTP sent to your email!'); setStep('otp');
      } else toast.error(data.message || 'Invalid email or password');
    } catch { toast.error('Server connection failed.'); }
    finally { setIsLoading(false); }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const n = [...otp]; n[index] = value; setOtp(n);
    if (value && index < 5) document.getElementById(`lm-otp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`lm-otp-${index - 1}`)?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { toast.error('Please enter the complete OTP'); return; }
    setIsLoading(true);
    try {
      const endpoint = isGoogleLogin
        ? 'http://localhost:5000/auth/verify-google-login-otp'
        : 'http://localhost:5000/auth/verify-login-otp';
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('success'); toast.success('Login successful!');
        setTimeout(() => { login(userData.name, userData.role); handleClose(); }, 1500);
      } else toast.error(data.message || 'Invalid OTP');
    } catch { toast.error('Verification failed.'); }
    finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/resend-login-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('OTP resent!'); setOtp(['', '', '', '', '', '']); }
      else toast.error(data.message || 'Failed to resend');
    } catch { toast.error('Network error'); }
  };

  const handleClose = () => {
    setStep('form'); setEmail(''); setPassword('');
    setOtp(['', '', '', '', '', '']); setAcceptedTerms(false);
    setIsGoogleLogin(false); googleInitialized.current = false;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-50 max-h-[90vh] overflow-y-auto">
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <XIcon className="w-5 h-5 text-gray-500" />
            </button>

            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-2">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">Sign in to your account</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password" className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative flex-shrink-0">
                        <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-button-primary checked:border-button-primary cursor-pointer appearance-none" />
                        {acceptedTerms && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><CheckIcon className="w-3 h-3 text-white" strokeWidth={3} /></div>}
                      </div>
                      <span className="text-sm text-gray-600">I accept the <a href="/terms" className="text-button-primary hover:underline">Terms & Conditions</a></span>
                    </label>
                    <div className="flex justify-end">
                      <button type="button" onClick={onForgotPasswordClick} className="text-sm text-button-primary hover:underline font-medium">Forgot Password?</button>
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </motion.button>
                    <div className="h-px bg-gray-200" />
                    <div ref={googleButtonRef} className="w-full flex justify-center" style={{ minHeight: '44px' }} />
                  </form>
                  <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <button onClick={onSignupClick} className="text-button-primary font-semibold hover:underline">Sign up</button>
                  </p>
                </motion.div>
              )}

              {step === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-2">Verify Your Login</h2>
                    <p className="text-gray-500 text-sm">Enter the 6-digit code sent to</p>
                    <p className="text-button-primary font-medium text-sm mt-1">{email}</p>
                  </div>
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, i) => (
                        <input key={i} id={`lm-otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)} className="w-11 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors" style={{ height: '52px' }} />
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                      {isLoading ? 'Verifying...' : 'Verify & Login'}
                    </motion.button>
                    <p className="text-center text-sm text-gray-600">
                      Didn't receive code?{' '}
                      <button type="button" onClick={handleResendOtp} className="text-button-primary font-semibold hover:underline">Resend</button>
                    </p>
                  </form>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-primary mb-2">Login Successful!</h2>
                  <p className="text-gray-500 text-sm">Redirecting you...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
