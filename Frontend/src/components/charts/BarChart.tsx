import React from 'react';
import { motion } from 'framer-motion';
interface BarChartData {
  label: string;
  value: number;
  color?: string;
}
interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  horizontal?: boolean;
}
export function BarChart({
  data,
  title,
  height = 300,
  horizontal = false
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const defaultColors = ['#2F7D5F', '#1F5A47', '#0D3A2F', '#4A9B7F', '#6BB89F'];
  return <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}

      <div className="bg-white rounded-xl p-6 shadow-sm">
        {horizontal ? <div className="space-y-4">
            {data.map((item, index) => {
          const percentage = item.value / maxValue * 100;
          const color = item.color || defaultColors[index % defaultColors.length];
          return <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-gray-500">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full flex items-center justify-end px-3" style={{
                backgroundColor: color
              }} initial={{
                width: 0
              }} animate={{
                width: `${percentage}%`
              }} transition={{
                delay: index * 0.1,
                duration: 0.8,
                ease: 'easeOut'
              }}>
                      <span className="text-xs font-medium text-white">
                        {percentage.toFixed(0)}%
                      </span>
                    </motion.div>
                  </div>
                </div>;
        })}
          </div> : <div className="flex items-end justify-around gap-4" style={{
        height
      }}>
            {data.map((item, index) => {
          const barHeight = item.value / maxValue * (height - 60);
          const color = item.color || defaultColors[index % defaultColors.length];
          return <div key={item.label} className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {item.value.toLocaleString()}
                  </div>
                  <motion.div className="w-full rounded-t-lg relative group cursor-pointer" style={{
              backgroundColor: color,
              maxWidth: '80px'
            }} initial={{
              height: 0
            }} animate={{
              height: barHeight
            }} transition={{
              delay: index * 0.1,
              duration: 0.8,
              ease: 'easeOut'
            }} whileHover={{
              opacity: 0.8
            }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.label}: {item.value}
                    </div>
                  </motion.div>
                  <div className="text-xs text-gray-500 text-center mt-2">
                    {item.label}
                  </div>
                </div>;
        })}
          </div>}
      </div>
    </div>;
}