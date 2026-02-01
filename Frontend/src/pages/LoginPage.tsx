import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, CheckIcon, ShieldCheckIcon, UsersIcon, HomeIcon } from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // confirmPassword: '',
    role: '' as UserRole | ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions to continue');
      return;
    }
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }
    // if (formData.password !== formData.confirmPassword) {
    //   toast.error('Passwords do not match');
    //   return;
    // }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user.firstName, data.user.role as UserRole);
        toast.success('Login successful!');
        navigate('/');
      } else {
        // UPDATED: Added redirect for unverified accounts
        if (response.status === 403 && data.notVerified) {
          toast.error(data.message);
          // Redirect to verify page passing the email in state
          navigate('/verify-email', { state: { email: formData.email } });
        } else {
          toast.error(data.message || 'Invalid email or password');
        }
      }
    } catch (error) {
      toast.error('Server connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions to continue');
      return;
    }
    toast.info('Google login coming soon!');
  };

  return <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-button-primary via-primary to-button-primary">
      {/* Animated Background Pattern */}
      <motion.div animate={{
      backgroundPosition: ['0% 0%', '100% 100%']
    }} transition={{
      duration: 20,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'linear'
    }} className="absolute inset-0 opacity-10" style={{
      backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
      backgroundSize: '60px 60px'
    }} />

      {/* Floating Orbs */}
      <motion.div animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3]
    }} transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }} className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <motion.div animate={{
      scale: [1.2, 1, 1.2],
      opacity: [0.5, 0.3, 0.5]
    }} transition={{
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 1
    }} className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }} className="text-white space-y-8 hidden lg:block">
            {/* Logo */}
            <Link to="/" className="inline-block">
              <motion.div whileHover={{
              scale: 1.05
            }} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">F</span>
                </div>
                <span className="text-3xl font-bold">Flat-Mate</span>
              </motion.div>
            </Link>

            {/* Heading */}
            <div>
              <motion.h1 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2
            }} className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Welcome Back to Your
                <br />
                <span className="text-white/90">Dream Home Journey</span>
              </motion.h1>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.3
            }} className="text-white/80 text-lg">
                Sign in to access thousands of verified properties and connect
                with trusted landlords across Nepal.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="space-y-4">
              {[{
              icon: ShieldCheckIcon,
              text: 'Verified Properties & Secure Transactions'
            }, {
              icon: UsersIcon,
              text: '10,000+ Happy Tenants & Landlords'
            }, {
              icon: HomeIcon,
              text: 'Find Your Perfect Home in Minutes'
            }].map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.5 + index * 0.1
            }} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-white/90">{feature.text}</span>
                </motion.div>)}
            </motion.div>

            {/* Stats */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.8
          }} className="flex gap-8 pt-4">
              {[{
              value: '500+',
              label: 'Properties'
            }, {
              value: '10K+',
              label: 'Users'
            }, {
              value: '50+',
              label: 'Locations'
            }].map((stat, index) => <div key={index}>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </div>)}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2
        }}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden" style={{
            boxShadow: '0 0 60px rgba(0, 0, 0, 0.3)'
          }}>
              {/* Glowing Border Effect */}
              <motion.div animate={{
              opacity: [0.5, 0.8, 0.5]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="absolute inset-0 rounded-3xl" style={{
              background: 'linear-gradient(45deg, transparent, rgba(47, 125, 95, 0.3), transparent)',
              filter: 'blur(8px)'
            }} />

              <div className="relative z-10">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-6">
                  <Link to="/" className="inline-block">
                    <h1 className="text-2xl font-bold text-primary">
                      Flat-Mate
                    </h1>
                  </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <motion.input whileFocus={{
                      scale: 1.01
                    }} type="email" value={formData.email} onChange={e => setFormData({
                      ...formData,
                      email: e.target.value
                    })} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="Enter your email" required className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all" />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <motion.input whileFocus={{
                      scale: 1.01
                    }} type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({
                      ...formData,
                      password: e.target.value
                    })} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder="Enter your password" required className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all" />
                      <motion.button whileHover={{
                      scale: 1.1
                    }} whileTap={{
                      scale: 0.9
                    }} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label> */}
                    {/* <div className="relative">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <motion.input whileFocus={{
                      scale: 1.01
                    }} type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)} placeholder="Confirm your password" required className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all" />
                      <motion.button whileHover={{
                      scale: 1.1
                    }} whileTap={{
                      scale: 0.9
                    }} type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </motion.button>
                    </div> */}
                  </div>

                  {/* Role Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Login as
                    </label>
                    <motion.select whileFocus={{
                    scale: 1.01
                  }} value={formData.role} onChange={e => setFormData({
                    ...formData,
                    role: e.target.value as UserRole
                  })} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all appearance-none bg-white cursor-pointer">
                      <option value="">Select role</option>
                      <option value="tenant">Tenant</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </motion.select>
                  </div>

                  {/* Terms Checkbox */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <motion.input whileTap={{
                        scale: 0.9
                      }} type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-button-primary checked:border-button-primary cursor-pointer appearance-none" />
                        {acceptedTerms && <motion.div initial={{
                        scale: 0
                      }} animate={{
                        scale: 1
                      }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />
                          </motion.div>}
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        I accept the{' '}
                        <Link to="/terms" className="text-button-primary hover:underline">
                          Terms & Conditions
                        </Link>
                      </span>
                    </label>
                  </div>

                  {/* Continue Button */}
                  <motion.button whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }} type="submit" disabled={isLoading} className="w-full py-3.5 bg-button-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 relative overflow-hidden">
                    <motion.div className="absolute inset-0 bg-white/20" initial={{
                    x: '-100%',
                    y: '-100%'
                  }} whileHover={{
                    x: '100%',
                    y: '100%'
                  }} transition={{
                    duration: 0.6
                  }} />
                    <span className="relative z-10">
                      {isLoading ? 'Signing in...' : 'Continue'}
                    </span>
                  </motion.button>

                  {/* Google Button */}
                  <motion.button whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }} type="button" onClick={handleGoogleLogin} className="w-full py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-button-primary hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </motion.button>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-sm text-button-primary hover:underline transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </form>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-button-primary font-semibold hover:underline transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}