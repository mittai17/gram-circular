import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface BarData {
  label: string;
  value: number;
  highlight?: boolean;
}

interface MiniBarChartProps {
  data: BarData[];
  height?: number;
  barColor?: string;
  highlightColor?: string;
  unit?: string;
}

export function MiniBarChart({
  data,
  height = 120,
  barColor = '#2d8653',
  highlightColor = '#1a5c38',
  unit = 'kg',
}: MiniBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height: height + 36 }]}>
      <View style={[styles.barsRow, { height }]}>
        {data.map((item, index) => {
          const barHeight = Math.max((item.value / maxValue) * (height - 24), 6);
          const isHigh = item.highlight || index === data.length - 1;

          return (
            <View key={index} style={styles.barCol}>
              <Text style={styles.valText}>{Math.round(item.value)}</Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: isHigh ? highlightColor : barColor,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {data.map((item, index) => (
          <View key={index} style={styles.labelCol}>
            <Text style={styles.labelText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  valText: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  bar: {
    width: 22,
    borderRadius: 6,
    opacity: 0.9,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  labelCol: {
    flex: 1,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
