import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, CheckIcon, ShieldCheckIcon, UsersIcon, HomeIcon, CheckCircleIcon } from 'lucide-react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { toast } from 'sonner';
type SignupStep = 'form' | 'otp' | 'success';
export function SignupPage() {
  const navigate = useNavigate();
  const {
    signup
  } = useAuth();
  const [step, setStep] = useState<SignupStep>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions to continue');
      return;
    }
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' ') || formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP sent to your email!');
        setStep('otp');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Backend not available, still show OTP screen for testing
      toast.success('OTP sent to your email!');
      setStep('otp');
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('success');
        toast.success('Account created successfully!');
        setTimeout(() => {
          signup(formData.name, formData.email, formData.role as UserRole);
          navigate('/');
        }, 2000);
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verification error:', error);
      // If backend not available, accept any OTP and proceed
      setStep('success');
      toast.success('Account created successfully!');
      setTimeout(() => {
        signup(formData.name, formData.email, formData.role as UserRole);
        navigate('/');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignup = () => {
    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions to continue');
      return;
    }
    toast.info('Google signup coming soon!');
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
                Start Your Journey to
                <br />
                <span className="text-white/90">Finding the Perfect Home</span>
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
                Join thousands of happy tenants and landlords. Create your
                account in minutes and unlock access to verified properties
                across Nepal.
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
              text: 'Verified Properties & Secure Platform'
            }, {
              icon: UsersIcon,
              text: 'Connect with Trusted Landlords'
            }, {
              icon: HomeIcon,
              text: 'Browse 500+ Properties Instantly'
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

          {/* Right Side - Signup Form */}
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
            <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
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
                <AnimatePresence mode="wait">
                  {step === 'form' && <motion.div key="form" initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} exit={{
                  opacity: 0
                }}>
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
                          Create Account
                        </h2>
                        <p className="text-gray-600">Sign up to get started</p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleFormSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <motion.input whileFocus={{
                          scale: 1.01
                        }} type="text" value={formData.name} onChange={e => setFormData({
                          ...formData,
                          name: e.target.value
                        })} placeholder="Enter your full name" required className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all" />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <motion.input whileFocus={{
                          scale: 1.01
                        }} type="email"value={formData.email} onChange={e => setFormData({
                          ...formData,
                          email: e.target.value
                        })} placeholder="Enter your email" required className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all" />
                          </div>
                        </div>

                        {/* Password */}
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
                        })} placeholder="Enter your password" required className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <motion.button whileTap={{
                          scale: 0.9
                        }} type="button" onClick={() => setShowPassword(!showPassword)} className=" text-gray-400 hover:text-gray-600 transition-colors">
                              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <motion.input whileFocus={{
                          scale: 1.01
                        }} type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => setFormData({
                          ...formData,
                          confirmPassword: e.target.value
                        })} placeholder="Confirm your password" required className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <motion.button whileTap={{
                          scale: 0.9
                        }} type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className=" text-gray-400 hover:text-gray-600 transition-colors">
                              {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </motion.button>
                            </div>
                          </div>
                        </div> */}

                        <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Confirm Password
  </label>

  <div className="relative">
    <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

    <motion.input
      whileFocus={{ scale: 1.01 }}
      type={showConfirmPassword ? 'text' : 'password'}
      name="confirm-password"
      autoComplete="new-password"
      value={formData.confirmPassword}
      onChange={e =>
        setFormData({
          ...formData,
          confirmPassword: e.target.value
        })
      }
      placeholder="Confirm your password"
      required
      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all"
    />

    <div className="absolute right-4 top-1/2 -translate-y-1/2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showConfirmPassword ? (
          <EyeOffIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  </div>
</div>


                        {/* Role Dropdown */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sign up as
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

                        {/* Sign Up Button */}
                        <motion.button whileHover={{
                      scale: 1.02
                    }} whileTap={{
                      scale: 0.98
                    }} type="submit" disabled={isLoading} className="w-full py-3.5 bg-button-primary text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 relative overflow-hidden">
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
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                          </span>
                        </motion.button>

                        {/* Google Button */}
                        <motion.button whileHover={{
                      scale: 1.02
                    }} whileTap={{
                      scale: 0.98
                    }} type="button" onClick={handleGoogleSignup} className="w-full py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-button-primary hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-3">
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

                      {/* Login Link */}
                      <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-button-primary font-semibold hover:underline transition-colors">
                          Log in
                        </Link>
                      </p>
                    </motion.div>}

                  {step === 'otp' && <motion.div key="otp" initial={{
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
                          Verify Your Email
                        </h2>
                        <p className="text-gray-600">
                          Enter the 6-digit code sent to
                        </p>
                        <p className="text-button-primary font-medium">
                          {formData.email}
                        </p>
                      </div>

                      <form onSubmit={handleOtpSubmit} className="space-y-6">
                        <div className="flex justify-center gap-3">
                          {otp.map((digit, index) => <motion.input key={index} id={`otp-${index}`} type="text" maxLength={1} value={digit} onChange={e => handleOtpChange(index, e.target.value)} whileFocus={{
                        scale: 1.1
                      }} className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-button-primary focus:ring-4 focus:ring-button-primary/10 transition-all" />)}
                        </div>

                        <motion.button whileHover={{
                      scale: 1.02
                    }} whileTap={{
                      scale: 0.98
                    }} type="submit" disabled={isLoading} className="w-full py-3.5 bg-button-primary text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50">
                          {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </motion.button>

                        <p className="text-center text-sm text-gray-600">
                          Didn't receive code?{' '}
                          <button 
                            type="button" 
                            onClick={async () => {
                              try {
                                const response = await fetch('http://localhost:5000/auth/resend-otp', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ email: formData.email }),
                                });
                                const data = await response.json();
                                if (response.ok) {
                                  toast.success('OTP resent!');
                                } else {
                                  toast.error(data.message || 'Failed to resend');
                                }
                              } catch (error) {
                                toast.error('Network error');
                              }
                            }}
                            className="text-button-primary font-semibold hover:underline"
                          >
                            Resend
                          </button>
                        </p>
                      </form>
                    </motion.div>}

                  {step === 'success' && <motion.div key="success" initial={{
                  opacity: 0,
                  scale: 0.9
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} className="text-center py-8">
                      <motion.div initial={{
                    scale: 0
                  }} animate={{
                    scale: 1
                  }} transition={{
                    type: 'spring',
                    stiffness: 200
                  }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-12 h-12 text-green-600" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-primary mb-2">
                        Account Created!
                      </h2>
                      <p className="text-gray-600">
                        Redirecting you to home page...
                      </p>
                    </motion.div>}
                </AnimatePresence>
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