// src/utils/toast.tsx
// Unified toast utility — wraps sonner with custom styled toasts + progress bar
import React from 'react'
import { toast as sonner, ExternalToast } from 'sonner'
import { SonnerToast } from '../components/SonnerToast'

const DURATION = 4000

export const toast = {
  success: (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="success" />, {
      duration: DURATION,
      ...opts,
      // strip classNames/style so our component controls appearance
      className: undefined,
      style: undefined,
    })
  },

  error: (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="error" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  },

  warning: (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="warning" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  },

  info: (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="info" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  },

  removed: (message: string, opts?: ExternalToast) => {
    sonner(<SonnerToast message={message} type="removed" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  },

  deleted: (message: string, opts?: ExternalToast) => {
    // deleted = red, same as error
    sonner(<SonnerToast message={message} type="error" />, {
      duration: DURATION,
      ...opts,
      className: undefined,
      style: undefined,
    })
  },

  dismiss: sonner.dismiss,
}
