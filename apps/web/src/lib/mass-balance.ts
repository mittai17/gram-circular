/**
 * Mass-balance ledger math for the Gram-Circular waste traceability app.
 *
 * All quantities are in kilograms (kg). The ledger enforces the conservation
 * principle: every kilogram collected must be accounted for either as rejected
 * waste, stored stock, reserved stock, dispatched stock, received stock,
 * accepted stock, or processed stock. Any leftover is an "unresolved
 * discrepancy" that must be investigated (and flagged as an anomaly).
 */

export interface MassBalanceInput {
  /** Total waste collected at the collection point. */
  collected: number;
  /** Waste rejected at intake (contamination, wrong stream, etc.). */
  rejected: number;
  /** Waste placed into storage zones. */
  storage: number;
  /** Waste reserved for a buyer but not yet dispatched. */
  reserved: number;
  /** Waste dispatched to a processor/buyer. */
  dispatched: number;
  /** Waste received at the destination facility. */
  received: number;
  /** Waste accepted into the destination process. */
  accepted: number;
  /** Waste actually processed (shredded/baled/recycled). */
  processed: number;
}

export interface MassBalanceResult {
  collected: number;
  rejected: number;
  storage: number;
  reserved: number;
  dispatched: number;
  received: number;
  accepted: number;
  processed: number;
  /** Sum of all downstream sinks (rejected + storage + reserved + dispatched). */
  totalAccounted: number;
  /** collected - totalAccounted. Positive = unaccounted loss; negative = over-accounting. */
  unresolvedDiscrepancy: number;
  discrepancyPercent: number;
  isConsistent: boolean;
  isBalanced: boolean;
}

/**
 * Tolerance (kg) below which a discrepancy is treated as rounding noise and
 * the ledger is considered balanced.
 */
const DISCREPANCY_TOLERANCE_KG = 0.01;

/**
 * Compute the mass-balance ledger for a set of quantities.
 *
 * The function clamps negative inputs to zero (inventory cannot be negative)
 * and never allows a sink to exceed the mass available to it, preventing
 * over-accounting that would hide a real discrepancy.
 */
export function computeMassBalance(input: MassBalanceInput): MassBalanceResult {
  const clamp = (v: number) => Math.max(0, Number(v) || 0);

  const collected = clamp(input.collected);
  const rejected = clamp(input.rejected);
  const storage = clamp(input.storage);
  const reserved = clamp(input.reserved);
  const dispatched = clamp(input.dispatched);
  const received = clamp(input.received);
  const accepted = clamp(input.accepted);
  const processed = clamp(input.processed);

  // The sinks that leave the collection point's direct custody.
  const totalAccounted = rejected + storage + reserved + dispatched;

  let unresolvedDiscrepancy = collected - totalAccounted;
  const discrepancyPercent =
    collected > 0 ? (unresolvedDiscrepancy / collected) * 100 : 0;

  const isBalanced = Math.abs(unresolvedDiscrepancy) <= DISCREPANCY_TOLERANCE_KG;
  // Consistency: no sink exceeds collected, and each downstream stage is
  // bounded by the stage before it (you cannot receive more than dispatched,
  // accept more than received, process more than accepted).
  const isConsistent =
    totalAccounted <= collected + DISCREPANCY_TOLERANCE_KG &&
    received <= dispatched + DISCREPANCY_TOLERANCE_KG &&
    accepted <= received + DISCREPANCY_TOLERANCE_KG &&
    processed <= accepted + DISCREPANCY_TOLERANCE_KG;

  return {
    collected,
    rejected,
    storage,
    reserved,
    dispatched,
    received,
    accepted,
    processed,
    totalAccounted,
    unresolvedDiscrepancy,
    discrepancyPercent,
    isConsistent,
    isBalanced,
  };
}

/**
 * Prevent negative inventory: given a current stock and a requested withdrawal,
 * return the actual withdrawable amount (clamped at zero) and the remaining stock.
 * Throws nothing; callers should check `withdrawn < requested` to detect an
 * attempted over-withdrawal.
 */
export function withdrawStock(currentStock: number, requested: number) {
  const stock = Math.max(0, Number(currentStock) || 0);
  const request = Math.max(0, Number(requested) || 0);
  const withdrawn = Math.min(stock, request);
  const remaining = stock - withdrawn;
  return { withdrawn, remaining, ok: withdrawn === request };
}

/**
 * Verify that a storage zone's current weight is consistent with its capacity.
 */
export function verifyZoneConsistency(currentWeightKg: number, capacityKg: number) {
  const current = Math.max(0, Number(currentWeightKg) || 0);
  const capacity = Math.max(0, Number(capacityKg) || 0);
  const percentage = capacity > 0 ? (current / capacity) * 100 : 0;
  const overCapacity = current > capacity;
  return { current, capacity, percentage, overCapacity, ok: !overCapacity };
}
