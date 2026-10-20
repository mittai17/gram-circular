import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'destructive' | 'success';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; color: string; border?: string }> = {
  primary: { bg: '#1a5c38', color: '#ffffff' },
  outline: { bg: '#ffffff', color: '#1a5c38', border: '#1a5c38' },
  ghost: { bg: 'transparent', color: '#1a5c38' },
  destructive: { bg: '#ef4444', color: '#ffffff' },
  success: { bg: '#10b981', color: '#ffffff' },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const theme = VARIANT_STYLES[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        { backgroundColor: isDisabled ? '#cbd5e1' : theme.bg, borderColor: theme.border },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.color} />
      ) : (
        <>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              { color: isDisabled ? '#94a3b8' : theme.color },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 52,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
    marginRight: 4,
  },
  icon: {
    marginLeft: 6,
    marginRight: 6,
  },
});
