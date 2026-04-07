// src/pages/SignupPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  ShieldCheckIcon, UsersIcon, HomeIcon,
  UserIcon, MailIcon, LockIcon,
  EyeIcon, EyeOffIcon, CheckIcon, CheckCircleIcon, BuildingIcon,
} from 'lucide-react';

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ?? '';
type SignupStep = 'role' | 'form' | 'otp' | 'success';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<SignupStep>('role');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (user.role === 'landlord' || user.role === 'owner') {
        navigate('/dashboard/owner', { replace: true });
      } else if (user.role === 'tenant') {
        navigate('/dashboard/tenant', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' as UserRole | '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const acceptedTermsRef = useRef(false);
  const roleRef = useRef<UserRole | ''>('');

  const handleTermsChange = (checked: boolean) => {
    setAcceptedTerms(checked);
    acceptedTermsRef.current = checked;
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(p => ({ ...p, role }));
    roleRef.current = role;
    setStep('form');
  };

  // ─── Google Button ───────────────────────────────────────────
  useEffect(() => {
    if (step !== 'form') return;

    const handleCredentialResponse = async (response: any) => {
      if (!acceptedTermsRef.current) { toast.error('Please accept Terms & Conditions first'); return; }
      setIsLoading(true);
      setIsGoogleSignup(true);
      try {
        const res = await fetch('http://localhost:5000/auth/google-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: response.credential, role: roleRef.current }),
        });
        const data = await res.json();
        if (res.ok) {
          setFormData(p => ({ ...p, name: data.user.name, email: data.user.email }));
          toast.success('OTP sent to your email!');
          setStep('otp');
        } else {
          toast.error(data.message || 'Google signup failed');
          setIsGoogleSignup(false);
        }
      } catch { toast.error('Failed to sign up with Google'); setIsGoogleSignup(false); }
      finally { setIsLoading(false); }
    };

    const renderBtn = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id || !googleButtonRef.current) return;
      googleButtonRef.current.innerHTML = '';
      g.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredentialResponse, auto_select: false });
      g.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large', width: 400, text: 'signup_with', shape: 'rectangular', logo_alignment: 'left' });
    };

    const tryRender = () => {
      if ((window as any).google?.accounts?.id) { renderBtn(); return; }
      if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true; s.defer = true;
        s.onload = renderBtn;
        document.body.appendChild(s);
      } else {
        let n = 0;
        const poll = setInterval(() => {
          n++;
          if ((window as any).google?.accounts?.id) { clearInterval(poll); renderBtn(); }
          else if (n > 50) clearInterval(poll);
        }, 100);
      }
    };

    const t = setTimeout(tryRender, 300);
    return () => clearTimeout(t);
  }, [step]);

  // ─── Form Submit ─────────────────────────────────────────────
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) { toast.error('Please accept Terms & Conditions'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const parts = formData.name.trim().split(' ');
      const res = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: parts[0], lastName: parts.slice(1).join(' ') || parts[0], email: formData.email.trim().toLowerCase(), password: formData.password, role: formData.role }),
      });
      const data = await res.json();
      if (res.ok) { toast.success('OTP sent to your email!'); setStep('otp'); }
      else toast.error(data.message || 'Signup failed');
    } catch { toast.error('Network error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  // ─── OTP ─────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const n = [...otp]; n[index] = value; setOtp(n);
    if (value && index < 5) document.getElementById(`sotp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) document.getElementById(`sotp-${index - 1}`)?.focus();
  };
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { toast.error('Please enter the complete OTP'); return; }
    setIsLoading(true);
    try {
      const endpoint = isGoogleSignup ? 'http://localhost:5000/auth/verify-google-otp' : 'http://localhost:5000/auth/verify-otp';
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, otp: otpValue }) });
      const data = await res.json();
      if (res.ok) {
        setStep('success');
        toast.success('Account created!');
        setTimeout(() => {
          signup(formData.name, formData.email, formData.role as UserRole);
          // Route based on role
          if ((formData.role as any) === 'admin') navigate('/dashboard/admin');
          else if (formData.role === 'landlord' || formData.role === 'owner') navigate('/dashboard/owner');
          else navigate('/');
        }, 1500);
      } else toast.error(data.message || 'Invalid OTP');
    } catch { toast.error('Verification failed.'); }
    finally { setIsLoading(false); }
  };
  const handleResendOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/resend-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email }) });
      const data = await res.json();
      if (res.ok) { toast.success('OTP resent!'); setOtp(['', '', '', '', '', '']); }
      else toast.error(data.message || 'Failed to resend');
    } catch { toast.error('Network error'); }
  };

  const isOwner = formData.role === 'landlord' || formData.role === 'owner';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-button-primary via-primary to-button-primary">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left branding */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-white space-y-8 hidden lg:block">
            <Link to="/"><motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3"><div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"><span className="text-white font-bold text-2xl">F</span></div><span className="text-3xl font-bold">Flat-Mate</span></motion.div></Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{(formData.role as any) === 'admin' ? <>Manage the Platform<br /><span className="text-white/90">With Full Control</span></> : isOwner ? <>List Your Properties,<br /><span className="text-white/90">Earn With Ease</span></> : <>Find Your Perfect<br /><span className="text-white/90">Home in Nepal</span></>}</h1>
              <p className="text-white/80 text-lg">{(formData.role as any) === 'admin' ? 'Access all admin tools to keep Flat-Mate running smoothly.' : isOwner ? 'Join thousands of landlords managing properties across Nepal.' : 'Join thousands of happy tenants across Nepal.'}</p>
            </div>
            <div className="space-y-4">
              {[{ icon: ShieldCheckIcon, text: 'Verified Properties & Secure Platform' }, { icon: UsersIcon, text: 'Connect with Trusted Partners' }, { icon: HomeIcon, text: 'Browse 500+ Properties Instantly' }].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0"><f.icon className="w-5 h-5" /></div>
                  <span className="text-white/90">{f.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-8 pt-4">{[{ value: '500+', label: 'Properties' }, { value: '10K+', label: 'Users' }, { value: '50+', label: 'Locations' }].map((s, i) => (<div key={i}><p className="text-3xl font-bold">{s.value}</p><p className="text-white/70 text-sm">{s.label}</p></div>))}</div>
          </motion.div>

          {/* Right card */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">

                {/* STEP 1 — Role */}
                {step === 'role' && (
                  <motion.div key="role" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-8">
                    <div className="lg:hidden text-center mb-6"><Link to="/"><h1 className="text-2xl font-bold text-primary">Flat-Mate</h1></Link></div>
                    <div className="text-center mb-8"><h2 className="text-2xl font-bold text-primary mb-2">Join Flat-Mate</h2><p className="text-gray-500 text-sm">First, tell us who you are</p></div>
                    <div className="space-y-4">
                      <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => handleRoleSelect('tenant')} className="group w-full p-5 border-2 border-gray-200 rounded-2xl text-left hover:border-button-primary hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"><HomeIcon className="w-7 h-7 text-blue-500" /></div>
                          <div className="flex-1"><h3 className="text-base font-bold text-primary">I'm a Tenant</h3><p className="text-sm text-gray-500 mt-0.5">Looking for a place to rent</p></div>
                          <div className="w-7 h-7 border-2 border-gray-300 group-hover:border-button-primary group-hover:bg-button-primary rounded-full flex items-center justify-center transition-all"><CheckIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5 pl-[4.5rem]">{['Browse listings', 'Save favourites', 'Message landlords'].map(t => (<span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>))}</div>
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => handleRoleSelect('landlord')} className="group w-full p-5 border-2 border-gray-200 rounded-2xl text-left hover:border-button-primary hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"><BuildingIcon className="w-7 h-7 text-green-600" /></div>
                          <div className="flex-1"><h3 className="text-base font-bold text-primary">I'm a Landlord / Owner</h3><p className="text-sm text-gray-500 mt-0.5">List properties and manage tenants</p></div>
                          <div className="w-7 h-7 border-2 border-gray-300 group-hover:border-button-primary group-hover:bg-button-primary rounded-full flex items-center justify-center transition-all"><CheckIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5 pl-[4.5rem]">{['List properties', 'Manage tenants', 'Track revenue'].map(t => (<span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>))}</div>
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => handleRoleSelect('admin' as any)} className="group w-full p-5 border-2 border-gray-200 rounded-2xl text-left hover:border-button-primary hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-purple-50 group-hover:bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"><ShieldCheckIcon className="w-7 h-7 text-purple-600" /></div>
                          <div className="flex-1"><h3 className="text-base font-bold text-primary">I'm an Admin</h3><p className="text-sm text-gray-500 mt-0.5">Manage the platform and users</p></div>
                          <div className="w-7 h-7 border-2 border-gray-300 group-hover:border-button-primary group-hover:bg-button-primary rounded-full flex items-center justify-center transition-all"><CheckIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5 pl-[4.5rem]">{['Manage users', 'Verify properties', 'Platform settings'].map(t => (<span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>))}</div>
                      </motion.button>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-6">Already have an account?{' '}<Link to="/login" className="text-button-primary font-semibold hover:underline">Log in</Link></p>
                  </motion.div>
                )}

                {/* STEP 2 — Form */}
                {step === 'form' && (
                  <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8">
                    <div className="flex items-center justify-between mb-5">
                      <button onClick={() => setStep('role')} className="text-sm text-gray-400 hover:text-primary transition-colors">← Change role</button>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${(formData.role as any) === 'admin' ? 'bg-purple-100 text-purple-700' : isOwner ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {(formData.role as any) === 'admin' ? <><ShieldCheckIcon className="w-3 h-3" />Admin</> : isOwner ? <><BuildingIcon className="w-3 h-3" />Landlord / Owner</> : <><HomeIcon className="w-3 h-3" />Tenant</>}
                      </span>
                    </div>
                    <div className="text-center mb-5"><h2 className="text-2xl font-bold text-primary mb-1">Create Account</h2><p className="text-gray-500 text-sm">Sign up to get started</p></div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" required className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm" /></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative"><MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" required className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm" /></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative"><LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Enter your password" required className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}</button></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative"><LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /><input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm your password" required autoComplete="new-password" className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors text-sm" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}</button></div>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative flex-shrink-0 w-5 h-5">
                          <input type="checkbox" checked={acceptedTerms} onChange={e => handleTermsChange(e.target.checked)} className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-button-primary checked:border-button-primary cursor-pointer appearance-none" style={{ accentColor: 'transparent' }} />
                          {acceptedTerms && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><CheckIcon className="w-3 h-3 text-white" strokeWidth={3} /></div>}
                        </div>
                        <span className="text-sm text-gray-600 leading-5">I accept the <Link to="/terms" className="text-button-primary hover:underline">Terms & Conditions</Link></span>
                      </label>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">{isLoading ? 'Creating account...' : 'Sign Up'}</motion.button>
                      <div className="relative flex items-center gap-3"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400 whitespace-nowrap">or sign up with</span><div className="flex-1 h-px bg-gray-200" /></div>
                      {/* Google button container — fixed width so GSI can render correctly */}
                      <div className="w-full flex justify-center">
                        <div ref={googleButtonRef} style={{ width: '400px', minHeight: '44px' }} />
                      </div>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-4">Already have an account?{' '}<Link to="/login" className="text-button-primary font-semibold hover:underline">Log in</Link></p>
                  </motion.div>
                )}

                {/* STEP 3 — OTP */}
                {step === 'otp' && (
                  <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                    <div className="text-center mb-8"><h2 className="text-2xl font-bold text-primary mb-2">Verify Your Email</h2><p className="text-gray-500 text-sm">Enter the 6-digit code sent to</p><p className="text-button-primary font-medium text-sm mt-1">{formData.email}</p></div>
                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                      <div className="flex justify-center gap-2">{otp.map((digit, i) => (<input key={i} id={`sotp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)} className="w-11 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary transition-colors" style={{ height: '52px' }} />))}</div>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 bg-button-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">{isLoading ? 'Verifying...' : 'Verify OTP'}</motion.button>
                      <p className="text-center text-sm text-gray-500">Didn't receive the code?{' '}<button type="button" onClick={handleResendOtp} className="text-button-primary font-semibold hover:underline">Resend</button></p>
                    </form>
                  </motion.div>
                )}

                {/* STEP 4 — Success */}
                {step === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center py-16">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircleIcon className="w-12 h-12 text-green-600" /></motion.div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Account Created!</h2>
                    <p className="text-gray-500 text-sm">{(formData.role as any) === 'admin' ? 'Taking you to the Admin Dashboard...' : isOwner ? 'Taking you to your Owner Dashboard...' : 'Taking you to home page...'}</p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
            <div className="text-center mt-6"><Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">← Back to Home</Link></div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
