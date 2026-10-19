import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, G } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface QRDisplayProps {
  value: string;
  batchNumber: string;
  weightKg: number;
  collectionPoint: string;
  size?: number;
}

export function QRDisplay({
  value,
  batchNumber,
  weightKg,
  collectionPoint,
  size = 200,
}: QRDisplayProps) {
  // Deterministic pseudo-random pattern based on string hash for realistic visual QR matrix
  const matrixSize = 21;
  const cellSize = size / matrixSize;

  const getBit = (r: number, c: number): boolean => {
    // Standard QR finder patterns top-left, top-right, bottom-left (7x7)
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    if (r < 7 && c >= matrixSize - 7) {
      const oc = c - (matrixSize - 7);
      if (r === 0 || r === 6 || oc === 0 || oc === 6) return true;
      if (r >= 2 && r <= 4 && oc >= 2 && oc <= 4) return true;
      return false;
    }
    if (r >= matrixSize - 7 && c < 7) {
      const or = r - (matrixSize - 7);
      if (or === 0 || or === 6 || c === 0 || c === 6) return true;
      if (or >= 2 && or <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }

    // Timing patterns
    if (r === 6 || c === 6) {
      return (r + c) % 2 === 0;
    }

    // Data hash based pattern
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash * 31 + value.charCodeAt(i) + r * 17 + c * 37) % 100000;
    }
    return hash % 3 !== 0;
  };

  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (getBit(r, c)) {
        cells.push({ r, c });
      }
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.qrWrapper}>
        <Svg width={size} height={size}>
          <Rect width={size} height={size} fill="#ffffff" />
          {cells.map(({ r, c }, idx) => (
            <Rect
              key={idx}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.2}
              height={cellSize + 0.2}
              fill="#0f172a"
            />
          ))}
        </Svg>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.batchId}>{batchNumber}</Text>
        <Text style={styles.batchSub}>
          {weightKg} kg • {collectionPoint}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  metaRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  batchId: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  batchSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
});
