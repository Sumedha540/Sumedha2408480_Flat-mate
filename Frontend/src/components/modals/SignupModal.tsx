import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeOffIcon, XIcon, MailIcon, LockIcon, UserIcon, Users, Home } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { toast } from 'sonner';
interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}
export function SignupModal({
  isOpen,
  onClose,
  onLoginClick
}: SignupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    signup
  } = useAuth();
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!role) newErrors.role = 'Please select your role';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form', {
        duration: 2000
      });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      signup(name, email, role as UserRole);
      setIsLoading(false);
      toast.success('Account created successfully!', {
        icon: '🎉',
        duration: 2000
      });
      onClose();
      // Reset form
      setName('');
      setEmail('');
      setRole('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    }, 1500);
  };
  const handleGoogleSignup = () => {
    if (!role) {
      setErrors({
        role: 'Please select your role first'
      });
      toast.error('Please select your role first', {
        duration: 2000
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      signup('Google User', 'google_user@example.com', role as UserRole);
      setIsLoading(false);
      toast.success('Account created successfully!', {
        icon: '🎉',
        duration: 2000
      });
      onClose();
    }, 1500);
  };
  const handleClose = () => {
    setName('');
    setEmail('');
    setRole('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };
  return <AnimatePresence>
      {isOpen && <>
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={handleClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-50 max-h-[90vh] overflow-y-auto">
            <motion.button onClick={handleClose} whileHover={{
          scale: 1.1,
          backgroundColor: 'rgba(0,0,0,0.05)'
        }} whileTap={{
          scale: 0.9
        }} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <XIcon className="w-5 h-5 text-gray-500" />
            </motion.button>

            <motion.div initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Join our community today</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.15
          }}>
                <Input label="Full Name" type="text" placeholder="John Doe" value={name} onChange={e => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({
                ...prev,
                name: ''
              }));
            }} error={errors.name} icon={<UserIcon className="w-5 h-5" />} />
              </motion.div>

              {/* Role Selection */}
              <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.2
          }}>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'tenant', label: 'Tenant', icon: Users },
                    { value: 'owner', label: 'Owner', icon: Home }
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRole(option.value as UserRole);
                        if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
                        role === option.value
                          ? 'bg-button-primary text-white border-button-primary'
                          : 'bg-white text-button-primary border-button-primary hover:bg-button-primary/5'
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                      <span>{option.label}</span>
                    </motion.button>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-2">{errors.role}</p>
                )}
              </motion.div>

              <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.25
          }}>
                <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => {
              setEmail(e.target.value);
              if (errors.email) setErrors(prev => ({
                ...prev,
                email: ''
              }));
            }} error={errors.email} icon={<MailIcon className="w-5 h-5" />} />
              </motion.div>

              <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.3
          }}>
                <div className="relative">
                  <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({
                  ...prev,
                  password: ''
                }));
              }} error={errors.password} icon={<LockIcon className="w-5 h-5" />} />
                  <motion.button type="button" onClick={() => setShowPassword(!showPassword)} whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.35
          }}>
                <div className="relative">
                  <Input label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={e => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors(prev => ({
                  ...prev,
                  confirmPassword: ''
                }));
              }} error={errors.confirmPassword} icon={<LockIcon className="w-5 h-5" />} />
                  <motion.button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }}>
                <Button type="submit" fullWidth isLoading={isLoading}>
                  Sign Up
                </Button>
              </motion.div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <motion.button type="button" onClick={handleGoogleSignup} whileHover={{
            scale: 1.02,
            borderColor: '#2F7D5F'
          }} whileTap={{
            scale: 0.98
          }} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.45
          }} className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 font-medium text-gray-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </motion.button>
            </form>

            <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }} className="text-center mt-6 text-gray-600 text-sm">
              Already have an account?{' '}
              <motion.button onClick={onLoginClick} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="text-button-primary font-semibold hover:text-[#3d9970] hover:underline transition-colors">
                Sign in
              </motion.button>
            </motion.p>
          </motion.div>
        </>}
    </AnimatePresence>;
}