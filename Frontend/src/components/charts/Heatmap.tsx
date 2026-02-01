import React from 'react';
import { motion } from 'framer-motion';
interface HeatmapData {
  location: string;
  vacancyRate: number;
  properties: number;
}
interface HeatmapProps {
  data: HeatmapData[];
  title?: string;
}
export function Heatmap({
  data,
  title
}: HeatmapProps) {
  const maxVacancy = Math.max(...data.map(d => d.vacancyRate));
  const getColor = (rate: number) => {
    const intensity = rate / maxVacancy;
    if (intensity > 0.7) return 'bg-red-500';
    if (intensity > 0.4) return 'bg-orange-500';
    if (intensity > 0.2) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  const getColorLabel = (rate: number) => {
    const intensity = rate / maxVacancy;
    if (intensity > 0.7) return 'High Risk';
    if (intensity > 0.4) return 'Medium Risk';
    if (intensity > 0.2) return 'Low Risk';
    return 'Healthy';
  };
  return <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="space-y-3">
          {data.map((item, index) => {
          const colorClass = getColor(item.vacancyRate);
          const label = getColorLabel(item.vacancyRate);
          return <motion.div key={item.location} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: index * 0.1
          }} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-700">
                        {item.location}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.properties} properties
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        {item.vacancyRate}%
                      </p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className={`h-full ${colorClass}`} initial={{
                  width: 0
                }} animate={{
                  width: `${item.vacancyRate}%`
                }} transition={{
                  delay: index * 0.1 + 0.2,
                  duration: 0.8,
                  ease: 'easeOut'
                }} />
                  </div>
                </div>
              </motion.div>;
        })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-xs text-gray-600">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-xs text-gray-600">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span className="text-xs text-gray-600">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-xs text-gray-600">High Risk</span>
          </div>
        </div>
      </div>
    </div>;
}