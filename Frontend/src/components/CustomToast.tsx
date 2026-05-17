// src/components/CustomToast.tsx
import React, { useEffect, useRef, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, TrashIcon, MinusCircleIcon } from 'lucide-react'

const DURATION = 4000

interface CustomToastProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info' | 'deleted' | 'removed'
  closeToast?: () => void
  toastProps?: { pauseOnHover?: boolean }
}

export const CustomToast: React.FC<CustomToastProps> = ({ message, type, closeToast }) => {
  const [progress, setProgress] = useState(100)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const remainingRef = useRef(DURATION)
  const lastTickRef = useRef<number>(Date.now())

  useEffect(() => {
    lastTickRef.current = Date.now()

    const tick = () => {
      if (!pausedRef.current) {
        const now = Date.now()
        const delta = now - lastTickRef.current
        lastTickRef.current = now
        remainingRef.current = Math.max(0, remainingRef.current - delta)
        setProgress((remainingRef.current / DURATION) * 100)
      } else {
        lastTickRef.current = Date.now()
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
      case 'error':   return <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
      case 'warning': return <AlertTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
      case 'deleted': return <TrashIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
      case 'removed': return <MinusCircleIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
      case 'info':    return <InfoIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
    }
  }

  const getBarColor = () => {
    switch (type) {
      case 'success': return '#10B981'
      case 'error':   return '#EF4444'
      case 'warning': return '#EF4444'
      case 'deleted': return '#EF4444'
      case 'removed': return '#9CA3AF'
      case 'info':    return '#3B82F6'
    }
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false; lastTickRef.current = Date.now() }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        {getIcon()}
        <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">
          {message}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-gray-100">
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: getBarColor(),
            height: '100%',
          }}
        />
      </div>
    </div>
  )
}
