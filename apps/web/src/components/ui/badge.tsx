import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'info'
    | 'outline'
    | 'primary';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-emerald-50 text-[#1a5c38] border-emerald-200 font-semibold',
    success: 'bg-green-50 text-green-700 border-green-200 font-semibold',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
    destructive: 'bg-red-50 text-red-700 border-red-200 font-semibold',
    info: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    outline: 'text-gray-700 border-gray-300 bg-transparent',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
