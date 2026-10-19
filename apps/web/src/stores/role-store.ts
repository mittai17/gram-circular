'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DemoRole, UserProfile } from '@/types';

interface RoleState {
  currentRole: DemoRole;
  setRole: (role: DemoRole) => void;
  getUserProfile: () => UserProfile;
}

export const ROLE_PROFILES: Record<DemoRole, UserProfile> = {
  admin: {
    name: 'Panchayat Admin',
    roleTitle: 'Admin',
    district: 'Thiruvallur District',
    online: true,
  },
  worker: {
    name: 'Ramesh K',
    roleTitle: 'Collection Worker',
    district: 'Panchayat Rural Sector 3',
    online: true,
  },
  mrf: {
    name: 'Selvam M',
    roleTitle: 'MRF Operator',
    district: 'Thiruvallur Central MRF',
    online: true,
  },
  buyer: {
    name: 'GreenCycle Pvt Ltd',
    roleTitle: 'Authorized Recycler',
    district: 'SIPCOT Industrial Area (50 km)',
    online: true,
  },
  citizen: {
    name: 'Karthik S',
    roleTitle: 'Resident Member',
    village: 'Shanti Nagar',
    points: 125,
    online: true,
  },
};

export const ROLE_LANDING_PAGES: Record<DemoRole, string> = {
  admin: '/admin/dashboard',
  worker: '/worker/dashboard',
  mrf: '/mrf/dashboard',
  buyer: '/buyer/dashboard',
  citizen: '/citizen/home',
};

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      currentRole: 'admin',
      setRole: (role: DemoRole) => set({ currentRole: role }),
      getUserProfile: () => ROLE_PROFILES[get().currentRole],
    }),
    {
      name: 'gram-circular-role-storage',
    }
  )
);
