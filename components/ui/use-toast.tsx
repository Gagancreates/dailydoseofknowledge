"use client"

// Adapted from shadcn/ui toast to work with sonner
import { toast as sonnerToast, type ToastT } from "sonner"

// Define types similar to shadcn/ui toast
type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Export the useToast hook
export const useToast = () => {
  const toast = (props: string | ToastProps) => {
    if (typeof props === "string") {
      return sonnerToast(props)
    }
    
    const { title, description, variant, duration, action } = props

    return sonnerToast(description || title, {
      ...(title && description ? { title } : {}),
      duration,
      className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    })
  }

  return { toast }
}

// Also export direct toast function for convenience
export { sonnerToast as toast } 