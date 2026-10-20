import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'danger'
  | 'info'
  | 'primary'
  | 'mlp'
  | 'dry'
  | 'wet'
  | 'sanitary';

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string }> = {
  default: { bg: '#f1f5f9', color: '#475569' },
  success: { bg: '#ecfdf5', color: '#15803d' },
  warning: { bg: '#fef3c7', color: '#b45309' },
  error: { bg: '#fef2f2', color: '#b91c1c' },
  danger: { bg: '#fef2f2', color: '#b91c1c' },
  info: { bg: '#eff6ff', color: '#1d4ed8' },
  primary: { bg: '#e8f5e9', color: '#1a5c38' },
  mlp: { bg: '#e8f5e9', color: '#1a5c38' },
  dry: { bg: '#eff6ff', color: '#2563eb' },
  wet: { bg: '#ecfdf5', color: '#10b981' },
  sanitary: { bg: '#fef2f2', color: '#b91c1c' },
};

interface StatusBadgeProps {
  children: string;
  variant?: BadgeVariant;
  style?: TextStyle;
  small?: boolean;
}

const DEFAULT_THEME = { bg: '#f1f5f9', color: '#475569' };

export function StatusBadge({
  children,
  variant = 'default',
  style,
  small = false,
}: StatusBadgeProps) {
  const theme = (variant && (VARIANT_STYLES as Record<string, { bg: string; color: string }>)[variant]) || DEFAULT_THEME;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: theme?.bg ?? '#f1f5f9' },
        small && styles.small,
      ]}
    >
      <Text style={[styles.text, { color: theme?.color ?? '#475569' }, style]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
  },
});
