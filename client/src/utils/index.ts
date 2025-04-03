import { JSX } from 'react'
import { ToastOptions, toast } from 'react-toastify'

export const notifySuccess = (
  message: string | JSX.Element,
  options?: ToastOptions<unknown>
) =>
  toast.success(message, {
    ...options,
    containerId: options?.containerId ?? 'default',
    autoClose: 3000
  })

export const notifyInfo = (
  message: string | JSX.Element,
  options?: ToastOptions<unknown>
) =>
  toast.info(message, {
    ...options,
    containerId: options?.containerId ?? 'default',
    autoClose: 3000
  })

export const notifyWarning = (
  message: string | JSX.Element,
  options?: ToastOptions<unknown>
) =>
  toast.warning(message, {
    ...options,
    containerId: options?.containerId ?? 'default',
    autoClose: 3000
  })

export const notifyError = (
  message: string | JSX.Element,
  options?: ToastOptions<unknown>
) =>
  toast.error(message, {
    ...options,
    containerId: options?.containerId ?? 'default',
    autoClose: 3000
  })
