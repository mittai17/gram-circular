import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  backgroundColor?: string;
  borderColor?: string;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({
  children,
  style,
  padding = 16,
  backgroundColor = '#ffffff',
  borderColor = colors.border,
  shadow = 'md',
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        shadow !== 'none' && shadows[shadow],
        { backgroundColor, borderColor, padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
});
