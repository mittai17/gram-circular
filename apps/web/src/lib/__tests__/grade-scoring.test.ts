import { describe, it, expect } from 'vitest';
import {
  scoreGrade,
  isGradeAcceptable,
  GRADE_MATRIX,
  type BatchCondition,
  type BatchMoisture,
  type QualityGrade,
} from '../grade-scoring';

const conditions: BatchCondition[] = ['Clean', 'Slightly Dirty', 'Contaminated'];
const moistures: BatchMoisture[] = ['Low', 'Medium', 'High'];

describe('grade scoring domain', () => {
  it('defines a complete 3x3 grade matrix', () => {
    conditions.forEach((c) => {
      expect(GRADE_MATRIX[c]).toBeDefined();
      moistures.forEach((m) => {
        expect(GRADE_MATRIX[c][m]).toBeDefined();
      });
    });
  });
});

describe('scoreGrade', () => {
  const cases: Array<[BatchCondition, BatchMoisture, QualityGrade]> = [
    ['Clean', 'Low', 'A'],
    ['Clean', 'Medium', 'B'],
    ['Clean', 'High', 'C'],
    ['Slightly Dirty', 'Low', 'B'],
    ['Slightly Dirty', 'Medium', 'C'],
    ['Slightly Dirty', 'High', 'C'],
    ['Contaminated', 'Low', 'C'],
    ['Contaminated', 'Medium', 'REJECTED'],
    ['Contaminated', 'High', 'REJECTED'],
  ];

  it.each(cases)('scores %s condition + %s moisture as %s', (condition, moisture, expected) => {
    expect(scoreGrade(condition, moisture)).toBe(expected);
  });

  it('throws on unknown condition', () => {
    expect(() => scoreGrade('Unknown' as BatchCondition, 'Low')).toThrow();
  });

  it('throws on unknown moisture', () => {
    expect(() => scoreGrade('Clean', 'Very High' as BatchMoisture)).toThrow();
  });
});

describe('isGradeAcceptable', () => {
  it('returns true for A, B, C', () => {
    expect(isGradeAcceptable('A')).toBe(true);
    expect(isGradeAcceptable('B')).toBe(true);
    expect(isGradeAcceptable('C')).toBe(true);
  });

  it('returns false for REJECTED', () => {
    expect(isGradeAcceptable('REJECTED')).toBe(false);
  });
});
