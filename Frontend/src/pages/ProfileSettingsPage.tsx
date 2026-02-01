import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, LockIcon, CameraIcon, CheckCircleIcon, ShieldCheckIcon, ArrowLeftIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { toast } from 'sonner';
export function ProfileSettingsPage() {
  const {
    user,
    updateProfile,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.phone && !/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
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
      updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        avatar: avatarPreview || user?.avatar
      });
      setIsLoading(false);
      toast.success('Profile updated successfully!');
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }, 1000);
  };
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'owner':
        return 'bg-blue-100 text-blue-700';
      case 'tenant':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const getRoleLabel = (role: UserRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };
  return <main className="min-h-screen bg-background-light py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-primary">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture & Role Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }}>
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div onClick={handleAvatarClick} className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border-4 border-background-accent shadow-md">
                    {avatarPreview ? <img src={avatarPreview} alt={formData.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-background-accent flex items-center justify-center">
                        <UserIcon className="w-10 h-10 text-button-primary" />
                      </div>}
                  </div>
                  <button type="button" onClick={handleAvatarClick} className="absolute bottom-0 right-0 w-8 h-8 bg-button-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-button-primary-hover transition-colors">
                    <CameraIcon className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-primary">
                    {user?.name}
                  </h2>
                  <p className="text-gray-500 text-sm mb-3">{user?.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user?.role || 'tenant')}`}>
                      <ShieldCheckIcon className="w-4 h-4" />
                      {getRoleLabel(user?.role || 'tenant')}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                      <CheckCircleIcon className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Personal Information */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} error={errors.name} icon={<UserIcon className="w-5 h-5" />} />
                <Input label="Email Address" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} error={errors.email} icon={<MailIcon className="w-5 h-5" />} />
                <Input label="Phone Number" name="phone" type="tel" placeholder="+977 98XXXXXXXX" value={formData.phone} onChange={handleInputChange} error={errors.phone} icon={<PhoneIcon className="w-5 h-5" />} />
                <Input label="Address" name="address" type="text" placeholder="Your address" value={formData.address} onChange={handleInputChange} error={errors.address} icon={<MapPinIcon className="w-5 h-5" />} />
              </div>
            </Card>
          </motion.div>

          {/* Change Password */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Change Password
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Leave blank if you don't want to change your password
              </p>
              <div className="space-y-4">
                <Input label="Current Password" name="currentPassword" type="password" placeholder="Enter current password" value={formData.currentPassword} onChange={handleInputChange} error={errors.currentPassword} icon={<LockIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="New Password" name="newPassword" type="password" placeholder="Enter new password" value={formData.newPassword} onChange={handleInputChange} error={errors.newPassword} icon={<LockIcon className="w-5 h-5" />} />
                  <Input label="Confirm New Password" name="confirmPassword" type="password" placeholder="Confirm new password" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword} icon={<LockIcon className="w-5 h-5" />} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }} className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </motion.div>
        </form>
      </div>
    </main>;
}