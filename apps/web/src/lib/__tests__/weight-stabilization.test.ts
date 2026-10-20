import { describe, it, expect } from 'vitest';
import {
  stabilizeReading,
  applyTare,
  zeroScale,
  canFinalize,
  DEFAULT_STABILIZATION_CONFIG,
  type WeightReading,
} from '../weight-stabilization';

const reading = (grossKg: number, unstable = false): WeightReading => ({
  grossKg,
  ts: '2026-10-16T10:24:00Z',
  unstable,
});

describe('stabilizeReading', () => {
  it('declares a stable reading when variance is within tolerance', () => {
    const r = stabilizeReading([reading(10.0), reading(10.02), reading(9.99)]);
    expect(r.stable).toBe(true);
    expect(r.samples).toBe(3);
    expect(r.weightKg).toBeCloseTo(10.003, 2);
  });

  it('declares instability when variance exceeds tolerance', () => {
    const r = stabilizeReading([reading(10.0), reading(10.2), reading(9.8)]); // variance 0.4
    expect(r.stable).toBe(false);
    expect(r.varianceKg).toBeGreaterThan(DEFAULT_STABILIZATION_CONFIG.toleranceKg);
  });

  it('requires the minimum number of samples to declare stability', () => {
    const r = stabilizeReading([reading(10.0), reading(10.01)]); // only 2 samples < minSamples 3
    expect(r.stable).toBe(false);
  });

  it('treats a motion-flagged reading as unstable', () => {
    const r = stabilizeReading([reading(10.0), reading(10.01, true), reading(10.0)]);
    expect(r.stable).toBe(false);
  });

  it('returns the last reading as the weight when unstable', () => {
    const r = stabilizeReading([reading(10.0), reading(10.5)]);
    expect(r.weightKg).toBe(10.5);
  });

  it('handles an empty reading list', () => {
    const r = stabilizeReading([]);
    expect(r.stable).toBe(false);
    expect(r.samples).toBe(0);
  });
});

describe('applyTare', () => {
  it('subtracts tare from gross to produce net weight', () => {
    expect(applyTare(14.0, 1.2)).toEqual({ gross: 14, tare: 1.2, net: 12.8, clamped: false });
  });

  it('clamps net weight at zero (tare cannot exceed gross)', () => {
    const r = applyTare(5.0, 10.0);
    expect(r.net).toBe(0);
    expect(r.clamped).toBe(true);
  });

  it('clamps negative inputs', () => {
    expect(applyTare(-5, 1).gross).toBe(0);
    expect(applyTare(5, -1).tare).toBe(0);
  });
});

describe('zeroScale', () => {
  it('returns a zeroed reading', () => {
    const z = zeroScale('2026-10-16T10:00:00Z');
    expect(z.grossKg).toBe(0);
    expect(z.unstable).toBe(false);
    expect(z.ts).toBe('2026-10-16T10:00:00Z');
  });
});

describe('canFinalize', () => {
  it('allows finalizing from a stable reading', () => {
    expect(canFinalize(reading(10.0, false))).toBe(true);
  });

  it('disallows finalizing from an unstable reading', () => {
    expect(canFinalize(reading(10.0, true))).toBe(false);
  });

  it('allows finalizing an unstable reading when overridden', () => {
    expect(canFinalize(reading(10.0, true), true)).toBe(true);
  });
});
