import { describe, it, expect } from 'vitest';
import {
  formatWeight,
  formatCurrency,
  formatDate,
  getBatchStatusColor,
  getFillLevelColor,
  getGradeColor,
} from '../utils';

describe('utils.formatWeight', () => {
  it('formats kilograms below 1000 kg', () => {
    expect(formatWeight(12.8)).toBe('12.8 kg');
    expect(formatWeight(0)).toBe('0.0 kg');
    expect(formatWeight(999.99)).toBe('1000.0 kg');
  });

  it('formats tonnes at or above 1000 kg', () => {
    expect(formatWeight(1000)).toBe('1.00 t');
    expect(formatWeight(2500)).toBe('2.50 t');
    expect(formatWeight(1234.567)).toBe('1.23 t');
  });
});

describe('utils.formatCurrency', () => {
  it('formats amounts in INR with no fraction digits', () => {
    expect(formatCurrency(1250)).toContain('₹');
    expect(formatCurrency(0)).toContain('₹');
    const formatted = formatCurrency(1250);
    expect(formatted).toMatch(/₹?\s*1,?250/);
  });
});

describe('utils.formatDate', () => {
  it('formats an ISO date string', () => {
    expect(formatDate('2026-10-16T10:24:00Z')).toMatch(/\d{2} \w{3} 2026, \d{2}:\d{2}/);
  });

  it('formats a Date object', () => {
    const d = new Date('2026-10-16T10:24:00Z');
    expect(formatDate(d)).toMatch(/\d{2} \w{3} 2026, \d{2}:\d{2}/);
  });
});

describe('utils.getBatchStatusColor', () => {
  it('returns a known color for each status', () => {
    expect(getBatchStatusColor('CREATED')).toBe('bg-blue-100 text-blue-700');
    expect(getBatchStatusColor('WEIGHED')).toBe('bg-cyan-100 text-cyan-700');
    expect(getBatchStatusColor('IN_STORAGE')).toBe('bg-green-100 text-green-700');
    expect(getBatchStatusColor('REJECTED')).toBe('bg-red-100 text-red-700');
    expect(getBatchStatusColor('PROCESSING_CONFIRMED')).toBe(
      'bg-green-200 text-green-800',
    );
  });

  it('returns a gray fallback for unknown statuses', () => {
    expect(getBatchStatusColor('UNKNOWN_STATUS')).toBe(
      'bg-gray-100 text-gray-700',
    );
  });
});

describe('utils.getFillLevelColor', () => {
  it('returns green below 40%', () => {
    expect(getFillLevelColor(0)).toBe('text-green-600');
    expect(getFillLevelColor(39)).toBe('text-green-600');
  });

  it('returns yellow between 40% and 69%', () => {
    expect(getFillLevelColor(40)).toBe('text-yellow-500');
    expect(getFillLevelColor(69)).toBe('text-yellow-500');
  });

  it('returns orange between 70% and 89%', () => {
    expect(getFillLevelColor(70)).toBe('text-orange-500');
    expect(getFillLevelColor(89)).toBe('text-orange-500');
  });

  it('returns red at or above 90%', () => {
    expect(getFillLevelColor(90)).toBe('text-red-600');
    expect(getFillLevelColor(100)).toBe('text-red-600');
  });
});

describe('utils.getGradeColor', () => {
  it('returns a known color for each grade', () => {
    expect(getGradeColor('A')).toBe('bg-green-100 text-green-700');
    expect(getGradeColor('B')).toBe('bg-yellow-100 text-yellow-700');
    expect(getGradeColor('C')).toBe('bg-orange-100 text-orange-700');
    expect(getGradeColor('REJECTED')).toBe('bg-red-100 text-red-700');
  });

  it('returns a gray fallback for unknown grades', () => {
    expect(getGradeColor('UNKNOWN')).toBe('bg-gray-100 text-gray-700');
  });
});
