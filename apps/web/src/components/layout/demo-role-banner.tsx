'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRoleStore, ROLE_LANDING_PAGES } from '@/stores/role-store';
import { DemoRole } from '@/types';
import { Shield, Sparkles, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DemoRoleBanner() {
  const router = useRouter();
  const { currentRole, setRole } = useRoleStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#0f3d24] text-white px-4 py-2 text-xs flex items-center justify-between border-b border-emerald-900/40">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-300" />
          <span className="font-semibold">SIH 2026 EVALUATION DEMO</span>
        </div>
      </div>
    );
  }

  const roles: { id: DemoRole; emoji: string; label: string }[] = [
    { id: 'admin', emoji: '🏛️', label: 'Admin' },
    { id: 'worker', emoji: '🚛', label: 'Worker' },
    { id: 'mrf', emoji: '🏭', label: 'MRF' },
    { id: 'buyer', emoji: '♻️', label: 'Buyer' },
    { id: 'citizen', emoji: '🌿', label: 'Citizen' },
  ];

  const handleRoleChange = (roleId: DemoRole) => {
    setRole(roleId);
    router.push(ROLE_LANDING_PAGES[roleId]);
  };

  return (
    <div className="bg-gradient-to-r from-[#0a2e1b] via-[#0f3d24] to-[#1a5c38] text-white px-3 sm:px-5 py-2 border-b border-emerald-900/50 text-xs flex flex-wrap items-center justify-between gap-2.5 shadow-md z-40 sticky top-0">
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors"
          title="Return to Demo Role Selector"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px] hidden sm:inline">Demo Home</span>
        </Link>
        <span className="text-emerald-700 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5 font-bold tracking-wide text-emerald-100">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] tracking-wider uppercase">SIH 2026 Evaluation</span>
        </div>
        <span className="text-emerald-300/60 hidden md:inline">•</span>
        <span className="text-emerald-200/90 hidden md:inline text-[11px]">
          Quick Stakeholder Switch:
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {roles.map((r) => {
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-2xs',
                isActive
                  ? 'bg-white text-[#0f3d24] font-bold shadow ring-2 ring-emerald-400 scale-[1.02]'
                  : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-900 hover:text-white border border-emerald-800/40'
              )}
            >
              <span>{r.emoji}</span>
              <span>{r.label}</span>
              {isActive && <Sparkles className="w-3 h-3 text-emerald-600 inline ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
