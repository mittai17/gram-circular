import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
  radius?: number;
}

export function Skeleton({
  width = '100%',
  height = 12,
  style,
  radius = 6,
}: SkeletonProps) {
  return (
    <View
      style={[
        { width: width as any, height, borderRadius: radius, backgroundColor: '#e2e8f0' },
        style,
      ]}
    />
  );
}
