import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useRole } from '../../context/RoleContext';
import { colors } from '../../theme/colors';
import {
  Home,
  MapPin,
  FileText,
  Users as UsersIcon,
  Navigation,
  PlusCircle,
  RefreshCw,
  Layers,
  Archive,
  BarChart2,
  Send,
  ShoppingBag,
  Clock,
  Award,
  BookOpen,
  Calendar,
  AlertTriangle,
} from 'lucide-react-native';

interface NavItem {
  key: string;
  label: string;
  route: string;
  icon: any;
}

const NAV_CONFIG: Record<string, NavItem[]> = {
  admin: [
    { key: 'home', label: 'Home', route: '/(admin)/dashboard', icon: Home },
    { key: 'villages', label: 'Villages', route: '/(admin)/villages', icon: MapPin },
    { key: 'routes', label: 'Routes', route: '/(admin)/routes', icon: Navigation },
    { key: 'reports', label: 'Reports', route: '/(admin)/reports', icon: FileText },
    { key: 'users', label: 'Users', route: '/(admin)/users', icon: UsersIcon },
  ],
  worker: [
    { key: 'home', label: 'Home', route: '/(worker)/dashboard', icon: Home },
    { key: 'route', label: 'Route', route: '/(worker)/stop-detail', icon: Navigation },
    { key: 'weigh', label: 'Weigh', route: '/(worker)/weighing', icon: PlusCircle },
    { key: 'collections', label: 'My Bags', route: '/(worker)/my-collections', icon: Layers },
    { key: 'sync', label: 'Sync', route: '/(worker)/offline-mode', icon: RefreshCw },
  ],
  mrf: [
    { key: 'home', label: 'Home', route: '/(mrf)/dashboard', icon: Home },
    { key: 'batches', label: 'Batches', route: '/(mrf)/batches', icon: Layers },
    { key: 'storage', label: 'Storage', route: '/(mrf)/storage', icon: Archive },
    { key: 'inventory', label: 'Inventory', route: '/(mrf)/inventory', icon: BarChart2 },
    { key: 'dispatch', label: 'Dispatch', route: '/(mrf)/dispatch', icon: Send },
  ],
  buyer: [
    { key: 'home', label: 'Home', route: '/(buyer)/dashboard', icon: Home },
    { key: 'batches', label: 'Available', route: '/(buyer)/available-batches', icon: ShoppingBag },
    { key: 'receipt', label: 'Receipt', route: '/(buyer)/receipt-confirm', icon: FileText },
    { key: 'history', label: 'History', route: '/(buyer)/history', icon: Clock },
    { key: 'analytics', label: 'Procure', route: '/(buyer)/procurement-chart', icon: BarChart2 },
  ],
  citizen: [
    { key: 'home', label: 'Home', route: '/(citizen)/home', icon: Home },
    { key: 'report', label: 'Report', route: '/(citizen)/report-bin', icon: AlertTriangle },
    { key: 'schedule', label: 'Schedule', route: '/(citizen)/schedule', icon: Calendar },
    { key: 'learn', label: 'Learn', route: '/(citizen)/learn', icon: BookOpen },
    { key: 'rewards', label: 'Rewards', route: '/(citizen)/rewards', icon: Award },
  ],
};

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useRole();

  const items = NAV_CONFIG[role] || NAV_CONFIG.admin;
  const roleTheme = colors.roles[role];

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const IconComp = item.icon;
        const isActive = pathname.includes(item.route.split('/').pop() || '');

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tabItem}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconWrapper,
                isActive && { backgroundColor: roleTheme.light },
              ]}
            >
              <IconComp
                size={20}
                color={isActive ? roleTheme.primary : colors.textMuted}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                isActive && { color: roleTheme.primary, fontWeight: '700' },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconWrapper: {
    width: 36,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
});
