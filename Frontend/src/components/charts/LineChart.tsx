import React from 'react';
import { motion } from 'framer-motion';
interface LineChartData {
  label: string;
  value: number;
}
interface LineChartProps {
  data: LineChartData[];
  title?: string;
  height?: number;
  color?: string;
  showPrediction?: boolean;
  predictionData?: LineChartData[];
}
export function LineChart({
  data,
  title,
  height = 300,
  color = '#2F7D5F',
  showPrediction = false,
  predictionData = []
}: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), ...(predictionData?.map(d => d.value) || []));
  const minValue = Math.min(...data.map(d => d.value), ...(predictionData?.map(d => d.value) || []));
  const range = maxValue - minValue;
  const padding = 40;
  const width = 600;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;
  const getX = (index: number, total: number) => {
    return padding + index / (total - 1) * chartWidth;
  };
  const getY = (value: number) => {
    return height - padding - (value - minValue) / range * chartHeight;
  };
  const createPath = (points: LineChartData[]) => {
    return points.map((point, index) => {
      const x = getX(index, points.length);
      const y = getY(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  return <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = height - padding - ratio * chartHeight;
          return <line key={ratio} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#E5E7EB" strokeWidth="1" />;
        })}

          {/* Actual data line */}
          <motion.path d={createPath(data)} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{
          pathLength: 0
        }} animate={{
          pathLength: 1
        }} transition={{
          duration: 1.5,
          ease: 'easeInOut'
        }} />

          {/* Prediction line */}
          {showPrediction && predictionData.length > 0 && <motion.path d={createPath(predictionData)} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5" opacity="0.5" initial={{
          pathLength: 0
        }} animate={{
          pathLength: 1
        }} transition={{
          duration: 1.5,
          ease: 'easeInOut',
          delay: 0.5
        }} />}

          {/* Data points */}
          {data.map((point, index) => {
          const x = getX(index, data.length);
          const y = getY(point.value);
          return <motion.g key={index}>
                <motion.circle cx={x} cy={y} r="6" fill="white" stroke={color} strokeWidth="3" initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: index * 0.1,
              duration: 0.3
            }} className="cursor-pointer hover:r-8 transition-all" />
                <title>{`${point.label}: ${point.value.toLocaleString()}`}</title>
              </motion.g>;
        })}

          {/* X-axis labels */}
          {data.map((point, index) => {
          const x = getX(index, data.length);
          return <text key={index} x={x} y={height - 10} textAnchor="middle" fontSize="12" fill="#6B7280">
                {point.label}
              </text>;
        })}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = height - padding - ratio * chartHeight;
          const value = minValue + ratio * range;
          return <text key={ratio} x={padding - 10} y={y + 5} textAnchor="end" fontSize="12" fill="#6B7280">
                {value.toFixed(0)}
              </text>;
        })}
        </svg>

        {showPrediction && <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{
            backgroundColor: color
          }} />
              <span className="text-gray-600">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 border-t-2 border-dashed" style={{
            borderColor: color,
            opacity: 0.5
          }} />
              <span className="text-gray-600">Predicted</span>
            </div>
          </div>}
      </div>
    </div>;
}