// src/components/SonnerToast.tsx
// Wrapper component for sonner toasts — adds a progress bar
import React, { useEffect, useRef, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, TrashIcon, MinusCircleIcon } from 'lucide-react'

const DURATION = 4000

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'removed'

interface SonnerToastProps {
  message: string
  type: ToastType
}

export const SonnerToast: React.FC<SonnerToastProps> = ({ message, type }) => {
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
        remainingRef.current = Math.max(0, remainingRef.current - (now - lastTickRef.current))
        lastTickRef.current = now
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
      case 'removed': return <MinusCircleIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
      case 'info':    return <InfoIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
    }
  }

  const getBarColor = () => {
    switch (type) {
      case 'success': return '#10B981'
      case 'error':   return '#EF4444'
      case 'warning': return '#EF4444'
      case 'removed': return '#9CA3AF'
      case 'info':    return '#3B82F6'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success': return '#10B981'
      case 'error':   return '#EF4444'
      case 'warning': return '#EF4444'
      case 'removed': return '#9CA3AF'
      case 'info':    return '#3B82F6'
    }
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        borderLeft: `4px solid ${getBorderColor()}`,
        overflow: 'hidden',
        minWidth: '280px',
        maxWidth: '380px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false; lastTickRef.current = Date.now() }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
        {getIcon()}
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
          {message}
        </span>
      </div>
      {/* Progress bar */}
      <div style={{ height: '3px', background: '#F3F4F6' }}>
        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: getBarColor() }} />
      </div>
    </div>
  )
}
