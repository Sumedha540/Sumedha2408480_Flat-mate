// src/utils/toast.tsx
// Unified toast utility — wraps sonner with custom styled toasts + progress bar
import React from 'react'
import { toast as sonner, ExternalToast } from 'sonner'
import { SonnerToast } from '../components/SonnerToast'

const DURATION = 4000

// Create a callable toast function that also has methods
const createToast = () => {
  // Default call - acts like sonner's default toast
  const toastFn = (message: string | React.ReactNode, opts?: ExternalToast) => {
    return sonner(message, {
      duration: DURATION,
      ...opts,
    })
  }

  // Add methods
  toastFn.success = (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="success" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  }

  toastFn.error = (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="error" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  }

  toastFn.warning = (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="warning" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  }

  toastFn.info = (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="info" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  }

  toastFn.removed = (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="removed" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  }

  toastFn.deleted = (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="error" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  }

  toastFn.loading = (message: string, opts?: ExternalToast) => {
    return sonner.loading(message, {
      duration: DURATION,
      ...opts,
    })
  }

  toastFn.dismiss = sonner.dismiss

  return toastFn
}

export const toast = createToast()
