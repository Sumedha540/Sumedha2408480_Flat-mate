import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  success,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  return <div className="w-full">
        {label && <motion.label htmlFor={inputId} className="block text-sm font-medium text-primary mb-2" initial={{
      opacity: 0,
      y: -5
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.2
    }}>
            {label}
          </motion.label>}

        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>}

          <motion.input ref={ref} id={inputId} className={`
              w-full px-4 py-3
              ${icon ? 'pl-10' : ''}
              bg-white border-2 border-gray-200
              rounded-button
              text-primary placeholder-gray-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-button-primary/30 focus:border-button-primary
              ${error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}
              ${success ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500' : ''}
              ${className}
            `} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} aria-invalid={error ? 'true' : 'false'} aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined} whileFocus={{
        scale: 1.01
      }} transition={{
        duration: 0.15
      }} {...props} />

          {/* Success/Error Icons */}
          <AnimatePresence>
            {(error || success) && <motion.div initial={{
          opacity: 0,
          scale: 0.5,
          rotate: -180
        }} animate={{
          opacity: 1,
          scale: 1,
          rotate: 0
        }} exit={{
          opacity: 0,
          scale: 0.5,
          rotate: 180
        }} transition={{
          duration: 0.2
        }} className="absolute right-3 top-1/2 -translate-y-1/2">
                {error ? <AlertCircleIcon className="w-5 h-5 text-red-500" /> : <CheckCircleIcon className="w-5 h-5 text-green-500" />}
              </motion.div>}
          </AnimatePresence>

          {/* Focus Glow Effect */}
          <AnimatePresence>
            {isFocused && !error && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="absolute inset-0 rounded-button pointer-events-none" style={{
          boxShadow: '0 0 0 3px rgba(47, 125, 95, 0.1)'
        }} />}
          </AnimatePresence>
        </div>

        {/* Error Message with Shake Animation */}
        <AnimatePresence>
          {error && <motion.p id={`${inputId}-error`} initial={{
        opacity: 0,
        x: 0
      }} animate={{
        opacity: 1,
        x: [0, -10, 10, -10, 10, 0]
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        x: {
          duration: 0.4
        },
        opacity: {
          duration: 0.2
        }
      }} className="mt-2 text-sm text-red-500 flex items-center gap-1" role="alert">
              <AlertCircleIcon className="w-4 h-4" />
              {error}
            </motion.p>}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !error && <motion.p id={`${inputId}-helper`} initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} className="mt-2 text-sm text-gray-500">
            {helperText}
          </motion.p>}

        {/* Success Message */}
        <AnimatePresence>
          {success && !error && <motion.p initial={{
        opacity: 0,
        y: -5
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0
      }} className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              Looks good!
            </motion.p>}
        </AnimatePresence>
      </div>;
});
Input.displayName = 'Input';