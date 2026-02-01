import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, AlertCircleIcon } from 'lucide-react';
interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');
  return <div className="w-full">
        {label && <motion.label htmlFor={selectId} className="block text-sm font-medium text-primary mb-2" initial={{
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
          <motion.select ref={ref} id={selectId} className={`
              w-full px-4 py-3 pr-10
              bg-white border-2 border-gray-200
              rounded-button
              text-primary
              appearance-none
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-button-primary/30 focus:border-button-primary
              ${error ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}
              ${className}
            `} onFocus={() => {
        setIsFocused(true);
        setIsOpen(true);
      }} onBlur={() => {
        setIsFocused(false);
        setIsOpen(false);
      }} onChange={e => {
        setIsOpen(false);
        props.onChange?.(e);
      }} whileFocus={{
        scale: 1.01
      }} aria-invalid={error ? 'true' : 'false'} {...props}>
            {placeholder && <option value="" disabled>
                {placeholder}
              </option>}
            {options.map(option => <option key={option.value} value={option.value}>
                {option.label}
              </option>)}
          </motion.select>

          {/* Animated Chevron */}
          <motion.div animate={{
        rotate: isOpen ? 180 : 0
      }} transition={{
        duration: 0.2
      }} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </motion.div>

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
          {error && <motion.p initial={{
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
      </div>;
});
Select.displayName = 'Select';