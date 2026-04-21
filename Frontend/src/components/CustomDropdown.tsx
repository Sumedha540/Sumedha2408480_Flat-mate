// src/components/CustomDropdown.tsx
// Reusable custom dropdown with light green hover and dark green selected state
// Matches the design shown in the reference image

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon } from 'lucide-react'

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  label?: string
  placeholder?: string
  className?: string
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  label,
  placeholder = 'Select...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-button-primary dark:bg-gray-700 dark:text-white bg-white cursor-pointer flex items-center justify-between hover:border-button-primary/50 transition-colors"
      >
        <span className={selectedOption ? "text-gray-700 dark:text-white" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 text-button-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 ${
                option.value === value
                  ? 'bg-button-primary text-white font-semibold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-[#D7EDE4] dark:hover:bg-gray-600 hover:text-[#0D3A2F] dark:hover:text-white'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
