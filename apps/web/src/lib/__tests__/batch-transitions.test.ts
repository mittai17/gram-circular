import { describe, it, expect } from 'vitest';
import {
  canTransition,
  validateTransition,
  transitionBatch,
  VALID_TRANSITIONS,
  HAPPY_PATH,
  type BatchStatus,
} from '../batch-transitions';

const STATUS: BatchStatus[] = [
  'CREATED',
  'WEIGHED',
  'IN_TRANSIT',
  'RECEIVED_AT_MRF',
  'INSPECTION_PENDING',
  'INSPECTED',
  'IN_STORAGE',
  'RESERVED',
  'DISPATCHED',
  'RECEIVED_BY_PROCESSOR',
  'PROCESSING_CONFIRMED',
  'REJECTED',
];

describe('batch transitions domain', () => {
  it('defines the canonical happy path', () => {
    expect(HAPPY_PATH).toEqual([
      'CREATED',
      'WEIGHED',
      'INSPECTION_PENDING',
      'INSPECTED',
      'IN_STORAGE',
      'RESERVED',
      'DISPATCHED',
      'RECEIVED_BY_PROCESSOR',
      'PROCESSING_CONFIRMED',
    ]);
  });

  it('exposes valid transitions for every status', () => {
    STATUS.forEach((s) => {
      expect(VALID_TRANSITIONS[s]).toBeDefined();
      expect(Array.isArray(VALID_TRANSITIONS[s])).toBe(true);
    });
  });
});

describe('canTransition', () => {
  it('allows each step of the happy path', () => {
    for (let i = 0; i < HAPPY_PATH.length - 1; i++) {
      expect(canTransition(HAPPY_PATH[i], HAPPY_PATH[i + 1])).toBe(true);
    }
  });

  it('allows rejection from any non-terminal state', () => {
    STATUS.filter((s) => s !== 'REJECTED' && s !== 'PROCESSING_CONFIRMED').forEach((s) => {
      expect(canTransition(s, 'REJECTED')).toBe(true);
    });
  });

  it('does not allow transitions out of terminal states', () => {
    expect(canTransition('REJECTED', 'CREATED')).toBe(false);
    expect(canTransition('REJECTED', 'PROCESSING_CONFIRMED')).toBe(false);
    expect(canTransition('PROCESSING_CONFIRMED', 'REJECTED')).toBe(false);
    expect(canTransition('PROCESSING_CONFIRMED', 'CREATED')).toBe(false);
  });

  it('rejects invalid happy-path skips', () => {
    expect(canTransition('CREATED', 'INSPECTED')).toBe(false);
    expect(canTransition('WEIGHED', 'IN_STORAGE')).toBe(false);
    expect(canTransition('IN_STORAGE', 'PROCESSING_CONFIRMED')).toBe(false);
  });

  it('rejects self-transitions', () => {
    expect(canTransition('WEIGHED', 'WEIGHED')).toBe(false);
  });
});

describe('validateTransition', () => {
  it('returns ok for valid transitions', () => {
    const r = validateTransition('CREATED', 'WEIGHED');
    expect(r.ok).toBe(true);
    expect(r.from).toBe('CREATED');
    expect(r.to).toBe('WEIGHED');
    expect(r.error).toBeUndefined();
  });

  it('returns a descriptive error for invalid transitions', () => {
    const r = validateTransition('CREATED', 'INSPECTED');
    expect(r.ok).toBe(false);
    expect(typeof r.error).toBe('string');
    expect(r.error).toContain('CREATED');
    expect(r.error).toContain('INSPECTED');
  });

  it('returns an error for transitions out of terminal states', () => {
    const r = validateTransition('REJECTED', 'CREATED');
    expect(r.ok).toBe(false);
    expect(r.error).toContain('terminal');
  });

  it('returns an error for self-transitions', () => {
    const r = validateTransition('WEIGHED', 'WEIGHED');
    expect(r.ok).toBe(false);
    expect(r.error).toContain('same state');
  });
});

describe('transitionBatch', () => {
  const batch = { id: 'b-1', status: 'CREATED' as BatchStatus };

  it('applies a valid transition to a copy of the batch', () => {
    const { batch: next, result } = transitionBatch(batch, 'WEIGHED');
    expect(result.ok).toBe(true);
    expect(next.status).toBe('WEIGHED');
    // original is unchanged
    expect(batch.status).toBe('CREATED');
  });

  it('leaves the batch unchanged on invalid transitions', () => {
    const { batch: next, result } = transitionBatch(batch, 'INSPECTED');
    expect(result.ok).toBe(false);
    expect(next.status).toBe('CREATED');
  });

  it('rejects transitions out of terminal states', () => {
    const rejected = { id: 'b-2', status: 'REJECTED' as BatchStatus };
    const { batch: next, result } = transitionBatch(rejected, 'CREATED');
    expect(result.ok).toBe(false);
    expect(next.status).toBe('REJECTED');
  });
});
