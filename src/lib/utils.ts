
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to toggle theme between light and dark
export function toggleTheme(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  localStorage.setItem('theme', theme)
}

// Function to get theme from localStorage or system preference
export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  
  const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
  
  if (storedTheme) {
    return storedTheme
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
