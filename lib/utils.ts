import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Create a simple hash from a string
export function createHash(str: string): string {
  let hash = 0
  if (str.length === 0) return hash.toString()

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return hash.toString(16) // Convert to hex string
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
