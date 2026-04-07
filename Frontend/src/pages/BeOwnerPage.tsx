/**
 * BE OWNER PAGE
 * =============
 * Owner registration/conversion page:
 * - Collect owner information (name, email, phone, company)
 * - Password creation and confirmation
 * - Form validation
 * - API call to register as property owner
 * - Redirect to owner dashboard after successful signup
 * - Toast notifications for user feedback
 * - Toggle password visibility
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, XIcon, MailIcon, LockIcon, UserIcon, PhoneIcon, BuildingIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
export function BeOwnerPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    signup
  } = useAuth();
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+()-]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
    if (!validateForm()) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      signup(name, email, 'owner');
      setIsLoading(false);
      toast.success('Owner account created successfully!');
      navigate('/dashboard/owner');
    }, 1500);
  };
  const handleClose = () => {
    navigate('/');
  };
  return <div className="min-h-screen flex items-center justify-center p-4">
      {/* Darkened Background Overlay */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} onClick={handleClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Modal Card */}
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
    }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-50 max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <XIcon className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-background-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <BuildingIcon className="w-8 h-8 text-button-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            Become a Property Owner
          </h2>
          <p className="text-gray-600">
            List your properties and start earning today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} error={errors.name} icon={<UserIcon className="w-5 h-5" />} />

          <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} icon={<MailIcon className="w-5 h-5" />} />

          <Input label="Phone Number" type="tel" placeholder="+977 98XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} error={errors.phone} icon={<PhoneIcon className="w-5 h-5" />} />

          <div className="relative">
            <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} icon={<LockIcon className="w-5 h-5" />} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} error={errors.confirmPassword} icon={<LockIcon className="w-5 h-5" />} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
              {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Create Owner Account
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-background-light rounded-xl">
          <h3 className="font-semibold text-primary text-sm mb-2">
            Benefits of being an owner:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• List unlimited properties</li>
            <li>• Access to verified tenants</li>
            <li>• Easy rent collection</li>
            <li>• 24/7 support</li>
          </ul>
        </div>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-button-primary font-semibold hover:underline">
            Sign in
          </button>
        </p>
      </motion.div>
    </div>;
}