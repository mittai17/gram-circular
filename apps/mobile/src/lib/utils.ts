import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind classes don't apply in RN; this is a small cn helper for
// conditional className-like style objects and string concatenation.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function roleTheme(role: string) {
  const themes: Record<string, { primary: string; light: string }> = {
    admin: { primary: '#1a5c38', light: '#e8f5e9' },
    worker: { primary: '#2563eb', light: '#eff6ff' },
    mrf: { primary: '#ea580c', light: '#fff7ed' },
    buyer: { primary: '#7c3aed', light: '#f5f3ff' },
    citizen: { primary: '#d97706', light: '#fef3c7' },
  };
  return themes[role] || themes.admin;
}
