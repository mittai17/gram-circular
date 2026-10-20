import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  subtitle,
  onViewAll,
  viewAllLabel = 'See All',
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7} hitSlop={10}>
          <Text style={styles.viewAll}>{viewAllLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  viewAll: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
