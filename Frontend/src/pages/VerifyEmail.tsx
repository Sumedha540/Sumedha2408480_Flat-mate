import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheckIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  
  // Timer state (60 seconds)
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Handle Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    try {
      const response = await fetch("http://localhost:5000/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('New OTP sent!');
        setTimer(60); // Reset timer
        setCanResend(false);
      } else {
        toast.error('Failed to resend. Try again later.');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return toast.error('Please enter full OTP');

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account verified!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-button-primary via-primary to-button-primary flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-button-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Verify Email</h2>
          <p className="text-gray-600 mt-2">Sent to: <span className="font-semibold">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input key={index} type="text" maxLength={1} value={data}
                onChange={e => handleOtpChange(e.target, index)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-button-primary outline-none"
              />
            ))}
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-button-primary text-white font-semibold rounded-xl shadow-lg disabled:opacity-50">
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {canResend ? (
            <button onClick={handleResendOtp} className="flex items-center gap-2 mx-auto text-button-primary font-medium hover:underline">
              <RefreshCcw className="w-4 h-4" /> Resend Code
            </button>
          ) : (
            <p className="text-gray-500 text-sm">Resend code in <span className="font-bold">{timer}s</span></p>
          )}
        </div>
      </motion.div>
    </div>
  );
}