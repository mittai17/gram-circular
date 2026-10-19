'use client';

import * as React from 'react';
import { useRoleStore } from '@/stores/role-store';
import { Bell, Calendar, ChevronDown, MapPin } from 'lucide-react';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { getUserProfile } = useRoleStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const profile = mounted
    ? getUserProfile()
    : { name: 'Panchayat Admin', roleTitle: 'Admin', district: 'Thiruvallur' };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        {actions}

        {/* District Filter Pill */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-700 font-medium transition-colors shadow-2xs"
        >
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span>All Districts</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Date Filter Pill */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-700 font-medium transition-colors shadow-2xs"
        >
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Oct 2026</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Notification Bell with red alert dot */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs"
        >
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Avatar with Name and Role Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a5c38] to-[#0f3d24] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {profile.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-gray-900 leading-tight">
              {profile.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                {profile.roleTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
