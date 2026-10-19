import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  subtext?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendPositive = true,
  subtext,
  icon,
  iconBgColor = 'bg-emerald-50 text-[#1a5c38]',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200/80 bg-white p-3.5 shadow-xs hover:shadow transition-shadow flex items-start justify-between gap-2.5',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-gray-500 truncate" title={title}>
          {title}
        </p>
        <p className="mt-1 text-lg sm:text-[20px] font-bold tracking-tight text-gray-900 whitespace-nowrap">
          {value}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center font-semibold text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap',
                trendPositive
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-red-700 bg-red-50'
              )}
            >
              {trendPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5 inline shrink-0" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5 inline shrink-0" />
              )}
              {trend}
            </span>
          )}
          {subtext && <span className="text-gray-400 text-[11px] truncate">{subtext}</span>}
        </div>
      </div>
      {icon && (
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            iconBgColor
          )}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
