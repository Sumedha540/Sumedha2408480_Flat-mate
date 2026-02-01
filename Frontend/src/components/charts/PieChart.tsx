import React from 'react';
import { motion } from 'framer-motion';
interface PieChartData {
  label: string;
  value: number;
  color: string;
}
interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
}
export function PieChart({
  data,
  title,
  size = 200
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const slices = data.map(item => {
    const percentage = item.value / total * 100;
    const angle = item.value / total * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return {
      ...item,
      percentage,
      startAngle,
      angle
    };
  });
  const createArc = (startAngle: number, angle: number, radius: number) => {
    const start = polarToCartesian(size / 2, size / 2, radius, startAngle);
    const end = polarToCartesian(size / 2, size / 2, radius, startAngle + angle);
    const largeArcFlag = angle > 180 ? 1 : 0;
    return ['M', size / 2, size / 2, 'L', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y, 'Z'].join(' ');
  };
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  return <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Chart */}
        <div className="relative" style={{
        width: size,
        height: size
      }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices.map((slice, index) => <motion.path key={slice.label} d={createArc(slice.startAngle, slice.angle, size / 2 - 10)} fill={slice.color} initial={{
            opacity: 0,
            scale: 0
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: index * 0.1,
            duration: 0.5
          }} className="hover:opacity-80 cursor-pointer transition-opacity" />)}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {slices.map((slice, index) => <motion.div key={slice.label} initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: index * 0.1
        }} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{
            backgroundColor: slice.color
          }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {slice.label}
                </p>
                <p className="text-xs text-gray-500">
                  {slice.value.toLocaleString()} ({slice.percentage.toFixed(1)}
                  %)
                </p>
              </div>
            </motion.div>)}
        </div>
      </div>
    </div>;
}