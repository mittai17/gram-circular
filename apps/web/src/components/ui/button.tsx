import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variantStyles = {
      primary:
        'bg-[#1a5c38] text-white hover:bg-[#0f3d24] shadow-sm active:scale-[0.98]',
      secondary:
        'bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-[0.98]',
      outline:
        'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98]',
      ghost: 'text-gray-700 hover:bg-gray-100 active:scale-[0.98]',
      danger:
        'bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.98]',
      accent:
        'bg-[#4caf50] text-white hover:bg-[#3d9140] shadow-sm active:scale-[0.98]',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs font-medium rounded-md gap-1.5',
      md: 'h-10 px-4 text-sm font-medium rounded-lg gap-2',
      lg: 'h-11 px-5 text-base font-medium rounded-lg gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-lg justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5c38] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none font-medium',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
