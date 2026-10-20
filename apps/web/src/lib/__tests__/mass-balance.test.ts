import { describe, it, expect } from 'vitest';
import {
  computeMassBalance,
  withdrawStock,
  verifyZoneConsistency,
  type MassBalanceInput,
} from '../mass-balance';

function makeInput(overrides: Partial<MassBalanceInput> = {}): MassBalanceInput {
  return {
    collected: 100,
    rejected: 5,
    storage: 40,
    reserved: 10,
    dispatched: 30,
    received: 30,
    accepted: 28,
    processed: 28,
    ...overrides,
  };
}

describe('computeMassBalance', () => {
  it('computes total accounted and unresolved discrepancy for a balanced ledger', () => {
    const result = computeMassBalance(makeInput());
    expect(result.totalAccounted).toBe(5 + 40 + 10 + 30); // 85
    expect(result.unresolvedDiscrepancy).toBe(100 - 85); // 15
    expect(result.discrepancyPercent).toBe(15);
    expect(result.isBalanced).toBe(false);
  });

  it('reports a balanced ledger when collected equals total accounted', () => {
    const result = computeMassBalance(makeInput({ rejected: 5, storage: 40, reserved: 10, dispatched: 45 }));
    expect(result.totalAccounted).toBe(100);
    expect(result.unresolvedDiscrepancy).toBe(0);
    expect(result.isBalanced).toBe(true);
  });

  it('detects over-accounting (negative discrepancy)', () => {
    const result = computeMassBalance(
      makeInput({ collected: 50, rejected: 60, storage: 0, reserved: 0, dispatched: 0 }),
    );
    expect(result.unresolvedDiscrepancy).toBe(-10);
    expect(result.discrepancyPercent).toBe(-20);
  });

  it('clamps negative inputs to zero (prevents negative inventory)', () => {
    const result = computeMassBalance(
      makeInput({ collected: -10, rejected: -5 }),
    );
    expect(result.collected).toBe(0);
    expect(result.rejected).toBe(0);
  });

  it('treats non-numeric inputs as zero', () => {
    const result = computeMassBalance(makeInput({ collected: NaN as unknown as number }));
    expect(result.collected).toBe(0);
  });

  it('flags inconsistency when downstream exceeds upstream', () => {
    const result = computeMassBalance(
      makeInput({ received: 40, dispatched: 30 }), // received > dispatched
    );
    expect(result.isConsistent).toBe(false);
  });

  it('flags inconsistency when accepted exceeds received', () => {
    const result = computeMassBalance(
      makeInput({ accepted: 35, received: 30 }), // accepted > received
    );
    expect(result.isConsistent).toBe(false);
  });

  it('flags inconsistency when processed exceeds accepted', () => {
    const result = computeMassBalance(
      makeInput({ processed: 30, accepted: 28 }), // processed > accepted
    );
    expect(result.isConsistent).toBe(false);
  });

  it('is consistent when each downstream stage is bounded by the one before', () => {
    const result = computeMassBalance(makeInput());
    expect(result.isConsistent).toBe(true);
  });
});

describe('withdrawStock', () => {
  it('withdraws the full requested amount when stock is sufficient', () => {
    expect(withdrawStock(100, 30)).toEqual({ withdrawn: 30, remaining: 70, ok: true });
  });

  it('clamps withdrawal to available stock and reports ok=false', () => {
    expect(withdrawStock(10, 50)).toEqual({ withdrawn: 10, remaining: 0, ok: false });
  });

  it('prevents negative inventory', () => {
    expect(withdrawStock(0, 5)).toEqual({ withdrawn: 0, remaining: 0, ok: false });
    expect(withdrawStock(-10, 5)).toEqual({ withdrawn: 0, remaining: 0, ok: false });
  });
});

describe('verifyZoneConsistency', () => {
  it('reports ok when current weight is within capacity', () => {
    expect(verifyZoneConsistency(120, 500)).toEqual({
      current: 120,
      capacity: 500,
      percentage: 24,
      overCapacity: false,
      ok: true,
    });
  });

  it('flags over-capacity zones', () => {
    expect(verifyZoneConsistency(550, 500).overCapacity).toBe(true);
    expect(verifyZoneConsistency(550, 500).ok).toBe(false);
  });

  it('clamps negative values', () => {
    expect(verifyZoneConsistency(-10, 500).current).toBe(0);
    expect(verifyZoneConsistency(100, -50).capacity).toBe(0);
  });
});
