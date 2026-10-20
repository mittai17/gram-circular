/**
 * Grade scoring rules for incoming waste batches.
 *
 * A batch's quality grade is derived from two observable attributes:
 *   - condition: 'Clean' | 'Slightly Dirty' | 'Contaminated'
 *   - moisture:  'Low' | 'Medium' | 'High'
 *
 * Documented rule set (grade matrix):
 *
 *                    moisture
 *                 Low   Medium   High
 *   condition
 *   Clean            A       B       C
 *   Slightly Dirty   B       C       C
 *   Contaminated     C   REJECTED  REJECTED
 *
 * Rationale:
 *   - Clean, low-moisture material is premium (Grade A) and commands the best
 *     buyer price.
 *   - Dirty or damp material requires more sorting/drying, downgrading it.
 *   - Contaminated, wet material is unsuitable for recycling and is rejected.
 *
 * Grades: 'A' | 'B' | 'C' | 'REJECTED'
 */

export type BatchCondition = 'Clean' | 'Slightly Dirty' | 'Contaminated';
export type BatchMoisture = 'Low' | 'Medium' | 'High';
export type QualityGrade = 'A' | 'B' | 'C' | 'REJECTED';

/**
 * The documented grade matrix, keyed by `condition.moisture`.
 */
export const GRADE_MATRIX: Record<BatchCondition, Record<BatchMoisture, QualityGrade>> = {
  Clean: {
    Low: 'A',
    Medium: 'B',
    High: 'C',
  },
  'Slightly Dirty': {
    Low: 'B',
    Medium: 'C',
    High: 'C',
  },
  Contaminated: {
    Low: 'C',
    Medium: 'REJECTED',
    High: 'REJECTED',
  },
};

/**
 * Score a batch's quality grade from its condition and moisture.
 * Throws if either input is outside the documented domain.
 */
export function scoreGrade(
  condition: BatchCondition,
  moisture: BatchMoisture,
): QualityGrade {
  const byCondition = GRADE_MATRIX[condition];
  if (!byCondition) {
    throw new Error(`Unknown condition: ${condition}`);
  }
  const grade = byCondition[moisture];
  if (!grade) {
    throw new Error(`Unknown moisture for condition "${condition}": ${moisture}`);
  }
  return grade;
}

/**
 * Whether a grade is considered acceptable for onward processing/storage.
 * Grades A, B, C are acceptable; REJECTED is not.
 */
export function isGradeAcceptable(grade: QualityGrade): boolean {
  return grade !== 'REJECTED';
}
