/**
 * Weight stabilization logic for the HX711-based weighbridge used in the
 * Gram-Circular collection workflow.
 *
 * A raw scale reading is considered "stable" when a sequence of consecutive
 * readings stays within a small tolerance (anti-jitter / anti-drift filter).
 * Unstable readings must not be used to finalize a batch unless the operator
 * explicitly overrides.
 */

export interface WeightReading {
  /** Raw gross weight in kg as reported by the scale. */
  grossKg: number;
  /** Timestamp of the reading (ISO string). */
  ts: string;
  /** Whether the scale reported motion/instability for this reading. */
  unstable?: boolean;
}

export interface StabilizationResult {
  stable: boolean;
  /** The stabilized weight (average of the stable window). */
  weightKg: number;
  /** Number of readings considered. */
  samples: number;
  /** Variance (max - min) across the window in kg. */
  varianceKg: number;
}

export interface StabilizationConfig {
  /** Max allowed variance (max - min) across the window for stability. */
  toleranceKg: number;
  /** Minimum number of consecutive readings required to declare stability. */
  minSamples: number;
  /** Whether to treat any `unstable: true` reading as instability. */
  treatMotionAsUnstable: boolean;
}

export const DEFAULT_STABILIZATION_CONFIG: StabilizationConfig = {
  toleranceKg: 0.05,
  minSamples: 3,
  treatMotionAsUnstable: true,
};

/**
 * Determine whether a sequence of weight readings is stable, returning the
 * stabilized weight (mean of the window) and the observed variance.
 */
export function stabilizeReading(
  readings: WeightReading[],
  config: StabilizationConfig = DEFAULT_STABILIZATION_CONFIG,
): StabilizationResult {
  const window = readings.slice();
  if (window.length === 0) {
    return { stable: false, weightKg: 0, samples: 0, varianceKg: 0 };
  }

  const hasMotion = window.some((r) => r.unstable === true);
  const values = window.map((r) => r.grossKg);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const varianceKg = max - min;

  const stable =
    window.length >= config.minSamples &&
    varianceKg <= config.toleranceKg &&
    !(config.treatMotionAsUnstable && hasMotion);

  const weightKg = stable
    ? values.reduce((sum, v) => sum + v, 0) / values.length
    : values[values.length - 1];

  return { stable, weightKg, samples: window.length, varianceKg };
}

/**
 * Apply a tare to a gross weight, producing a net weight. Net weight is never
 * negative (tare cannot exceed gross; the scale is zeroed/clamped at zero).
 */
export function applyTare(grossKg: number, tareKg: number) {
  const gross = Math.max(0, Number(grossKg) || 0);
  const tare = Math.max(0, Number(tareKg) || 0);
  const net = Math.max(0, gross - tare);
  return { gross, tare, net, clamped: net !== gross - tare };
}

/**
 * Zero the scale: returns a zeroed reading with the given timestamp.
 */
export function zeroScale(ts: string): WeightReading {
  return { grossKg: 0, ts, unstable: false };
}

/**
 * Whether a batch may be finalized from a given reading. A batch must NOT be
 * finalized from an unstable reading unless `override` is true.
 */
export function canFinalize(reading: WeightReading, override = false): boolean {
  if (override) return true;
  return !!(reading && reading.unstable !== true);
}
