
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTheme(): 'light' | 'dark' {
  const storedTheme = localStorage.getItem("theme") as 'light' | 'dark';
  return storedTheme || "dark";
}

export function toggleTheme(theme?: 'light' | 'dark' | (() => 'light' | 'dark')): void {
  // Handle theme as a function
  if (typeof theme === 'function') {
    const resolvedTheme = theme();
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove(resolvedTheme);
    document.documentElement.classList.add(newTheme);
    return;
  }
  
  // Handle theme as a string or undefined
  const currentTheme = theme || getTheme();
  const newTheme = currentTheme === "light" ? "dark" : "light";
  
  localStorage.setItem("theme", newTheme);
  document.documentElement.classList.remove(currentTheme);
  document.documentElement.classList.add(newTheme);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
