import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { UserRole } from '../types';

interface RoleContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  switchToRole: (role: UserRole) => void;
  isSwitcherOpen: boolean;
  openSwitcher: () => void;
  closeSwitcher: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const router = useRouter();

  const switchToRole = (newRole: UserRole) => {
    setRole(newRole);
    setIsSwitcherOpen(false);
    switch (newRole) {
      case 'admin':
        router.push('/(admin)/dashboard');
        break;
      case 'worker':
        router.push('/(worker)/dashboard');
        break;
      case 'mrf':
        router.push('/(mrf)/dashboard');
        break;
      case 'buyer':
        router.push('/(buyer)/dashboard');
        break;
      case 'citizen':
        router.push('/(citizen)/home');
        break;
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        switchToRole,
        isSwitcherOpen,
        openSwitcher: () => setIsSwitcherOpen(true),
        closeSwitcher: () => setIsSwitcherOpen(false),
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return ctx;
}
