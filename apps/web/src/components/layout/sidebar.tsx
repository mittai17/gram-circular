'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRoleStore } from '@/stores/role-store';
import { cn } from '@/lib/utils';
import {
  Leaf,
  LayoutDashboard,
  MapPin,
  Home,
  Trash2,
  Route,
  Layers,
  BarChart3,
  Activity,
  AlertTriangle,
  Scale,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Package,
  Truck,
  Search,
  FileCheck,
  FileText,
  History,
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  ArrowLeft,
  Building2,
  Scan,
  Hammer,
  ShoppingBag,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, getUserProfile } = useRoleStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const profile = mounted
    ? getUserProfile()
    : { name: 'Panchayat Admin', roleTitle: 'Admin', online: true };

  const roleTitles: Record<string, { portal: string; subtitle: string }> = {
    admin: { portal: 'GRAM-CIRCULAR', subtitle: 'Admin Panel' },
    worker: { portal: 'GRAM-CIRCULAR', subtitle: 'Worker Portal' },
    mrf: { portal: 'GRAM-CIRCULAR', subtitle: 'MRF Operator' },
    buyer: { portal: 'BUYER / PROCESSOR', subtitle: 'Buyer Portal' },
    citizen: { portal: 'GRAM-CIRCULAR', subtitle: 'Citizen Portal' },
  };

  const navConfig: Record<string, NavItem[]> = {
    admin: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Dynamic Routing', href: '/admin/dynamic-routing', icon: Route },
      { label: 'O&M Ledger', href: '/admin/sustainability', icon: Scale },
      { label: 'Villages', href: '/admin/villages', icon: Home },
      { label: 'Collection Points', href: '/admin/collection-points', icon: MapPin },
      { label: 'Live Bins', href: '/admin/bins', icon: Trash2 },
      { label: 'Routes Optimization', href: '/admin/routes', icon: Route },
      { label: 'Waste Pooling', href: '/admin/pooling', icon: Layers },
      { label: 'Processors & Buyers', href: '/admin/processors', icon: Building2 },
      { label: 'Mass-Balance Ledger', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Reports & Compliance', href: '/admin/reports', icon: FileText },
      { label: 'What-If Simulations', href: '/admin/simulations', icon: Activity },
      { label: 'Anomalies Review', href: '/admin/anomalies', icon: AlertTriangle, badge: '3' },
    ],
    worker: [
      { label: 'Dashboard', href: '/worker/dashboard', icon: LayoutDashboard },
      { label: 'Edge Sync', href: '/worker/sync', icon: RefreshCw, badge: '2G' },
      { label: 'My Route', href: '/worker/routes', icon: Route },
      { label: 'Weighing Station', href: '/worker/weighing', icon: Scale },
      { label: 'QR Batch Passport', href: '/worker/batches', icon: QrCode },
      { label: 'My Collections', href: '/worker/collections', icon: Layers },
    ],
    mrf: [
      { label: 'Dashboard', href: '/mrf/dashboard', icon: LayoutDashboard },
      { label: 'MLP Upcycling', href: '/mrf/manufacturing', icon: Hammer },
      { label: 'O&M Ledger', href: '/admin/sustainability', icon: Scale },
      { label: 'Incoming Batches', href: '/mrf/batches', icon: Layers, badge: '12' },
      { label: 'Quality Inspection', href: '/mrf/inspection', icon: ShieldCheck, badge: '8' },
      { label: 'Storage & Inventory', href: '/mrf/storage', icon: Package },
      { label: 'Inventory Ledger', href: '/mrf/inventory', icon: Scan },
      { label: 'Dispatch to Buyer', href: '/mrf/dispatch', icon: Truck, badge: '3' },
      { label: 'Traceability Audit', href: '/mrf/traceability', icon: Search },
    ],
    buyer: [
      { label: 'Dashboard', href: '/buyer/dashboard', icon: LayoutDashboard },
      { label: 'PWD Marketplace', href: '/buyer/marketplace', icon: ShoppingBag },
      { label: 'Available Batches', href: '/buyer/batches', icon: Package, badge: '12' },
      { label: 'Pickup Requests', href: '/buyer/requests', icon: Truck },
      { label: 'Handover Receipts', href: '/buyer/receipts', icon: FileCheck },
      { label: 'Purchase History', href: '/buyer/history', icon: History },
    ],
    citizen: [
      { label: 'Community Home', href: '/citizen/home', icon: Home },
      { label: 'Report Full Bin', href: '/citizen/report', icon: AlertCircle },
      { label: 'Collection Schedule', href: '/citizen/schedule', icon: Calendar },
      { label: 'Segregation Guide', href: '/citizen/learn', icon: BookOpen },
      { label: 'Village Progress', href: '/citizen/progress', icon: Award },
    ],
  };

  const navItems = navConfig[currentRole] || navConfig.admin;
  const currentTitle = roleTitles[currentRole] || roleTitles.admin;

  return (
    <aside className="w-64 bg-[#0d3822] text-white flex flex-col shrink-0 min-h-screen border-r border-[#154d2f] select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-emerald-950/60 bg-[#0a2e1b]/40">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4caf50] to-[#1a5c38] flex items-center justify-center shadow-lg text-white group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase group-hover:text-emerald-200 transition-colors">
              {currentTitle.portal}
            </h1>
            <p className="text-[11px] font-medium text-emerald-300">
              {currentTitle.subtitle}
            </p>
          </div>
        </Link>
        <Link
          href="/"
          title="Back to Role Selector"
          className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' &&
              item.href !== '/worker/dashboard' &&
              item.href !== '/mrf/dashboard' &&
              item.href !== '/buyer/dashboard' &&
              item.href !== '/citizen/home' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group',
                isActive
                  ? 'bg-white text-[#0f3d24] font-bold shadow-md'
                  : 'text-emerald-100 hover:bg-[#1a5c38]/60 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-[#1a5c38]' : 'text-emerald-300/80 group-hover:text-emerald-200'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    isActive
                      ? 'bg-[#0f3d24] text-white'
                      : 'bg-emerald-800 text-emerald-200'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-3 border-t border-emerald-950/60 bg-[#092617]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0f3d24]/90 border border-emerald-900/60 shadow-inner">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white uppercase ring-1 ring-emerald-500/50">
              {profile.name.charAt(0)}
            </div>
            {profile.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f3d24]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {profile.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-[10px] text-emerald-300/90 truncate font-medium">
                {profile.roleTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
