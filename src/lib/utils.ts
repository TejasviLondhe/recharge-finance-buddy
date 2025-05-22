
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTheme(): 'light' | 'dark' {
  return (localStorage.getItem("theme") as 'light' | 'dark') || "dark";
}

export function toggleTheme(theme?: 'light' | 'dark'): void {
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
