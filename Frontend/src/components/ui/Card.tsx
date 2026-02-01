import React from 'react';
import { motion } from 'framer-motion';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}
export function Card({
  children,
  className = '',
  onClick,
  hoverable = false
}: CardProps) {
  const baseStyles = 'bg-white rounded-card shadow-card transition-all duration-300';
  const hoverStyles = hoverable || onClick ? 'cursor-pointer' : '';
  if (hoverable || onClick) {
    return <motion.div whileHover={{
      y: -5,
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }} transition={{
      duration: 0.3
    }} className={`${baseStyles} ${hoverStyles} ${className}`} onClick={onClick}>
        {children}
      </motion.div>;
  }
  return <div className={`${baseStyles} ${className}`}>{children}</div>;
}