'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { Header, HeaderProps } from './header';
import { DemoRoleBanner } from './demo-role-banner';

interface AppLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
}

export function AppLayout({ children, headerProps }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      <DemoRoleBanner />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
          {headerProps && <Header {...headerProps} />}
          <div className="p-6 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
