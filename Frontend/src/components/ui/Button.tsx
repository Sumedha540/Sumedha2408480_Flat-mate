import React from 'react';
import { motion } from 'framer-motion';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-button transition-all duration-200 inline-flex items-center justify-center relative overflow-hidden group';
  const variants = {
    primary: 'bg-button-primary text-white hover:bg-button-primary-hover shadow-sm hover:shadow-md',
    secondary: 'bg-button-secondary text-primary hover:bg-button-secondary-hover border-2 border-transparent hover:border-button-primary',
    outline: 'border-2 border-button-primary text-button-primary hover:bg-button-primary hover:text-white',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';
  return <motion.button whileHover={{
    scale: disabled || isLoading ? 1 : 1.02
  }} whileTap={{
    scale: disabled || isLoading ? 1 : 0.98
  }} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`} disabled={disabled || isLoading} {...props}>
      {/* Shimmer Effect */}
      <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{
      x: ['-100%', '100%']
    }} transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }} />

      {/* Ripple Effect on Hover */}
      <motion.span className="absolute inset-0" initial={{
      scale: 0,
      opacity: 0.5
    }} whileHover={{
      scale: 2,
      opacity: 0
    }} transition={{
      duration: 0.6
    }} />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? <motion.div animate={{
        rotate: 360
      }} transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }} className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : null}
        {children}
      </span>
    </motion.button>;
}