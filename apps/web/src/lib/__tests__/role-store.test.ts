import { describe, it, expect, beforeEach } from 'vitest';
import { useRoleStore, ROLE_PROFILES } from '../../stores/role-store';
import type { DemoRole } from '@/types';

describe('useRoleStore (zustand)', () => {
  beforeEach(() => {
    // Reset to the default role before each test.
    useRoleStore.setState({ currentRole: 'admin' });
    // Clear persisted storage so tests are hermetic.
    localStorage.removeItem('gram-circular-role-storage');
  });

  it('has a default currentRole of admin', () => {
    expect(useRoleStore.getState().currentRole).toBe('admin');
  });

  it('setRole switches currentRole', () => {
    const roles: DemoRole[] = ['admin', 'worker', 'mrf', 'buyer', 'citizen'];
    roles.forEach((role) => {
      useRoleStore.setState({ currentRole: role });
      expect(useRoleStore.getState().currentRole).toBe(role);
    });
  });

  it('getUserProfile returns the correct profile per role', () => {
    const roleProfiles: Record<DemoRole, string> = {
      admin: 'Panchayat Admin',
      worker: 'Ramesh K',
      mrf: 'Selvam M',
      buyer: 'GreenCycle Pvt Ltd',
      citizen: 'Karthik S',
    };
    (Object.keys(roleProfiles) as DemoRole[]).forEach((role) => {
      useRoleStore.setState({ currentRole: role });
      expect(useRoleStore.getState().getUserProfile().name).toBe(roleProfiles[role]);
    });
  });

  it('getUserProfile matches ROLE_PROFILES for each role', () => {
    (Object.keys(ROLE_PROFILES) as DemoRole[]).forEach((role) => {
      useRoleStore.setState({ currentRole: role });
      expect(useRoleStore.getState().getUserProfile()).toEqual(ROLE_PROFILES[role]);
    });
  });
});
