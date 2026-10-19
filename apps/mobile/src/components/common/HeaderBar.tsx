import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRole } from '../../context/RoleContext';
import { useNetwork } from '../../context/NetworkContext';
import { colors } from '../../theme/colors';
import {
  ChevronLeft,
  Wifi,
  WifiOff,
  Layers,
  ShieldCheck,
  Truck,
  Building2,
  Factory,
  Users,
} from 'lucide-react-native';

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const ROLE_ICONS = {
  admin: ShieldCheck,
  worker: Truck,
  mrf: Building2,
  buyer: Factory,
  citizen: Users,
};

export function HeaderBar({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}: HeaderBarProps) {
  const router = useRouter();
  const { role, openSwitcher } = useRole();
  const { isOnline, toggleNetwork } = useNetwork();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const RoleIcon = ROLE_ICONS[role] || Layers;
  const roleTheme = colors.roles[role];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.leftRow}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={10}>
              <ChevronLeft size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            {title ? (
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.rightRow}>
          {/* Online / Offline Toggle Pill */}
          <TouchableOpacity
            style={[
              styles.networkPill,
              isOnline ? styles.onlinePill : styles.offlinePill,
            ]}
            onPress={toggleNetwork}
            activeOpacity={0.7}
          >
            {isOnline ? (
              <Wifi size={12} color="#16a34a" />
            ) : (
              <WifiOff size={12} color="#dc2626" />
            )}
            <Text
              style={[
                styles.networkText,
                { color: isOnline ? '#16a34a' : '#dc2626' },
              ]}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>

          {/* Quick Demo Switcher Pill */}
          <TouchableOpacity
            style={[styles.roleSwitchPill, { backgroundColor: roleTheme.light }]}
            onPress={openSwitcher}
            activeOpacity={0.7}
          >
            <RoleIcon size={14} color={roleTheme.primary} />
            <Text style={[styles.roleSwitchText, { color: roleTheme.primary }]}>
              {role.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {rightAction}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    minHeight: 52,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitleText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  networkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  onlinePill: {
    backgroundColor: '#ecfdf5',
  },
  offlinePill: {
    backgroundColor: '#fef2f2',
  },
  networkText: {
    fontSize: 10,
    fontWeight: '600',
  },
  roleSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  roleSwitchText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
