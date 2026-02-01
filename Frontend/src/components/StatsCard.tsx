import React from 'react';
import { motion } from 'framer-motion';
import { BoxIcon } from 'lucide-react';
interface StatsCardProps {
  icon: BoxIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}
export function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  delay = 0
}: StatsCardProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay,
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1]
  }} whileHover={{
    y: -5
  }} className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-button-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-button-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
        {trend && <div className={`text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </div>}
      </div>
    </motion.div>;
}