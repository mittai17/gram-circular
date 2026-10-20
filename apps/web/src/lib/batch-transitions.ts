/**
 * Batch state machine for the Gram-Circular waste traceability app.
 *
 * Defines the allowed status transitions for a WasteBatch and a validator that
 * rejects invalid transitions. REJECTED and PROCESSING_CONFIRMED are terminal
 * states (no outgoing transitions).
 *
 * Happy path:
 *   CREATED → WEIGHED → INSPECTION_PENDING → INSPECTED → IN_STORAGE →
 *   RESERVED → DISPATCHED → RECEIVED_BY_PROCESSOR → PROCESSING_CONFIRMED
 *
 * A batch may be REJECTED from any non-terminal state. Once REJECTED, no
 * further transitions are allowed.
 */

export type BatchStatus =
  | 'CREATED'
  | 'WEIGHED'
  | 'IN_TRANSIT'
  | 'RECEIVED_AT_MRF'
  | 'INSPECTION_PENDING'
  | 'INSPECTED'
  | 'IN_STORAGE'
  | 'RESERVED'
  | 'DISPATCHED'
  | 'RECEIVED_BY_PROCESSOR'
  | 'PROCESSING_CONFIRMED'
  | 'REJECTED';

export interface TransitionResult {
  ok: boolean;
  from: BatchStatus;
  to: BatchStatus;
  error?: string;
}

/**
 * Terminal states: no outgoing transitions are permitted.
 */
const TERMINAL_STATES: BatchStatus[] = ['REJECTED', 'PROCESSING_CONFIRMED'];

/**
 * Map of each status to the statuses it may transition to.
 */
export const VALID_TRANSITIONS: Record<BatchStatus, BatchStatus[]> = {
  CREATED: ['WEIGHED', 'REJECTED'],
  WEIGHED: ['INSPECTION_PENDING', 'REJECTED'],
  IN_TRANSIT: ['RECEIVED_AT_MRF', 'REJECTED'],
  RECEIVED_AT_MRF: ['INSPECTION_PENDING', 'REJECTED'],
  INSPECTION_PENDING: ['INSPECTED', 'REJECTED'],
  INSPECTED: ['IN_STORAGE', 'REJECTED'],
  IN_STORAGE: ['RESERVED', 'REJECTED'],
  RESERVED: ['DISPATCHED', 'REJECTED'],
  DISPATCHED: ['RECEIVED_BY_PROCESSOR', 'REJECTED'],
  RECEIVED_BY_PROCESSOR: ['PROCESSING_CONFIRMED', 'REJECTED'],
  PROCESSING_CONFIRMED: [],
  REJECTED: [],
};

/**
 * The canonical happy-path sequence (used for documentation and ordering).
 */
export const HAPPY_PATH: BatchStatus[] = [
  'CREATED',
  'WEIGHED',
  'INSPECTION_PENDING',
  'INSPECTED',
  'IN_STORAGE',
  'RESERVED',
  'DISPATCHED',
  'RECEIVED_BY_PROCESSOR',
  'PROCESSING_CONFIRMED',
];

/**
 * Check whether a single-step transition from `from` to `to` is allowed.
 */
export function canTransition(from: BatchStatus, to: BatchStatus): boolean {
  if (TERMINAL_STATES.includes(from)) return false;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Validate a transition and return a result describing success or failure.
 * Invalid transitions are rejected with a descriptive error message.
 */
export function validateTransition(
  from: BatchStatus,
  to: BatchStatus,
): TransitionResult {
  if (TERMINAL_STATES.includes(from)) {
    return {
      ok: false,
      from,
      to,
      error: `Cannot transition out of terminal state "${from}".`,
    };
  }
  if (from === to) {
    return {
      ok: false,
      from,
      to,
      error: `Cannot transition from "${from}" to the same state.`,
    };
  }
  if (VALID_TRANSITIONS[from]?.includes(to)) {
    return { ok: true, from, to };
  }
  return {
    ok: false,
    from,
    to,
    error: `Invalid transition from "${from}" to "${to}".`,
  };
}

/**
 * Apply a transition to a batch, mutating a copy. Returns the updated batch
 * and the transition result. Invalid transitions leave the batch unchanged.
 */
export function transitionBatch<T extends { status: BatchStatus }>(
  batch: T,
  to: BatchStatus,
): { batch: T; result: TransitionResult } {
  const result = validateTransition(batch.status, to);
  if (!result.ok) {
    return { batch, result };
  }
  return { batch: { ...batch, status: to } as T, result };
}
