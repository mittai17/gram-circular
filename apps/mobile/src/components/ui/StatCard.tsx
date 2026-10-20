import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';

interface StatCardProps {
  value: string;
  label: string;
  subtext?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: string;
  trendPositive?: boolean;
  style?: ViewStyle;
}

export function StatCard({
  value,
  label,
  subtext,
  icon,
  children,
  iconBg = '#f1f5f9',
  iconColor = colors.textPrimary,
  trend,
  trendPositive = true,
  style,
}: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.headerRow}>
        {icon || children ? (
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            {icon || children}
          </View>
        ) : null}
        {trend !== undefined && (
          <View style={styles.trendBadge}>
            <Text style={[styles.trendText, { color: trendPositive ? '#15803d' : '#b91c1c' }]}>
              {trendPositive ? '\u25B2' : '\u25BC'} {trend}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#ecfdf5',
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subtext: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
});
