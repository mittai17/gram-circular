import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  return `${kg.toFixed(1)} kg`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getBatchStatusColor(status: string): string {
  const colors: Record<string, string> = {
    CREATED: 'bg-blue-100 text-blue-700',
    WEIGHED: 'bg-cyan-100 text-cyan-700',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-700',
    RECEIVED_AT_MRF: 'bg-orange-100 text-orange-700',
    INSPECTION_PENDING: 'bg-amber-100 text-amber-700',
    INSPECTED: 'bg-purple-100 text-purple-700',
    IN_STORAGE: 'bg-green-100 text-green-700',
    RESERVED: 'bg-indigo-100 text-indigo-700',
    DISPATCHED: 'bg-teal-100 text-teal-700',
    RECEIVED_BY_PROCESSOR: 'bg-emerald-100 text-emerald-700',
    PROCESSING_CONFIRMED: 'bg-green-200 text-green-800',
    REJECTED: 'bg-red-100 text-red-700',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-700';
}

export function getFillLevelColor(percent: number): string {
  if (percent >= 90) return 'text-red-600';
  if (percent >= 70) return 'text-orange-500';
  if (percent >= 40) return 'text-yellow-500';
  return 'text-green-600';
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    A: 'bg-green-100 text-green-700',
    B: 'bg-yellow-100 text-yellow-700',
    C: 'bg-orange-100 text-orange-700',
    REJECTED: 'bg-red-100 text-red-700',
  };
  return colors[grade] ?? 'bg-gray-100 text-gray-700';
}
