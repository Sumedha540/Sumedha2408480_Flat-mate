/**
 * OWNER HISTORY SECTION - Displays activity history for property owners
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react'

interface HistoryItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description: string
  timestamp: string
}

interface OwnerHistorySectionProps {
  history?: HistoryItem[]
}

export function OwnerHistorySection({ history = [] }: OwnerHistorySectionProps) {
  const defaultHistory: HistoryItem[] = [
    {
      id: '1',
      type: 'success',
      title: 'Property Listed',
      description: 'Modern 2BHK Apartment was successfully listed',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'info',
      title: 'New Inquiry',
      description: 'Someone inquired about Spacious 3BHK Flat',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Pending Review',
      description: 'Studio Room listing is pending admin approval',
      timestamp: '1 day ago'
    }
  ]

  const items = history.length > 0 ? history : defaultHistory

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircleIcon className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertCircleIcon className="w-4 h-4 text-amber-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-blue-500" />
    }
  }

  const getColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-100'
      case 'error':
        return 'bg-red-50 border-red-100'
      case 'warning':
        return 'bg-amber-50 border-amber-100'
      default:
        return 'bg-blue-50 border-blue-100'
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Activity</h3>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-3 rounded-xl border ${getColorClass(item.type)} flex items-start gap-3`}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(item.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
              <ClockIcon className="w-2.5 h-2.5" />
              {item.timestamp}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
