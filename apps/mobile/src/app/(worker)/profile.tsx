import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { USERS_ROSTER } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Truck,
  User,
  Navigation,
  RefreshCw,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Settings,
  Bell,
  Wallet,
  IdCard,
} from 'lucide-react-native';

const WORKER = USERS_ROSTER[0]; // Ramesh K - Collection Worker

const PROFILE_MENU = [
  { id: 'profile', title: 'My Profile', icon: IdCard, description: 'View & edit personal details' },
  { id: 'route', title: 'Assigned Route', icon: Navigation, description: 'Route 1 • Shanti Nagar', route: '/(worker)/stop-detail' },
  { id: 'sync', title: 'Sync Data & Storage', icon: RefreshCw, description: 'SQLite Outbox Queue', route: '/(worker)/offline-mode', badge: 'Pending' },
  { id: 'help', title: 'Help & Field Support', icon: HelpCircle, description: 'Contact panchayat office' },
];

const APP_SETTINGS = [
  { id: 'notifications', title: 'Notifications', icon: Bell, description: 'Collection alerts & reminders', toggle: true },
  { id: 'offline', title: 'Offline Mode', icon: ShieldCheck, description: 'Cache data when offline', toggle: true },
  { id: 'units', title: 'Measurement Units', icon: Wallet, description: 'kg / lbs • Metric system' },
  { id: 'language', title: 'Language', icon: User, description: 'English • தமிழ் • हिंदी' },
];

export default function WorkerProfileScreen() {
  const router = useRouter();

  return (
    <Screen
      title="Worker Profile"
      subtitle={`ID: GC-FW-104 • ${WORKER.assignedArea}`}
      showBack
      showOfflineBanner
      showBottomNav
    >
      {/* User Profile Card */}
      <Card style={styles.profileCard} padding={20}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Truck size={34} color="#ffffff" />
          </View>
          <StatusBadge variant="success" small style={styles.onlineBadge}>
            Active
          </StatusBadge>
        </View>
        <Text style={styles.name}>{WORKER.name}</Text>
        <Text style={styles.role}>{WORKER.role}</Text>
        <View style={styles.vehicleBadge}>
          <Text style={styles.vehicleText}>
            Vehicle {WORKER.assignedArea.split(' • ')[0]} • TN-29-BA-4821
          </Text>
        </View>
      </Card>

      {/* Daily Stats */}
      <Card style={styles.statsCard} padding={16}>
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statNum}>104.5</Text>
            <Text style={styles.statLabel}>kg Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>6/6</Text>
            <Text style={styles.statLabel}>Stops Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>100%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
        </View>
      </Card>

      {/* Menu Options */}
      <SectionHeader title="Field Options" />

      <Card style={styles.menuCard} padding={0}>
        {PROFILE_MENU.map((item, index) => {
          const IconComp = item.icon;
          const isLast = index === PROFILE_MENU.length - 1;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, !isLast && styles.menuItemBorder]}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                } else {
                  Alert.alert(item.title, `${item.title} opened.`);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: '#eff6ff' }]}>
                  <IconComp size={18} color="#2563eb" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.description}</Text>
                </View>
              </View>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <ChevronRight size={16} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          );
        })}
      </Card>

      {/* App Settings */}
      <SectionHeader title="App Settings" />

      <Card style={styles.settingsCard} padding={0}>
        {APP_SETTINGS.map((item, index) => {
          const IconComp = item.icon;
          const isLast = index === APP_SETTINGS.length - 1;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, !isLast && styles.menuItemBorder]}
              onPress={() => Alert.alert(item.title, `${item.title} settings opened.`)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: '#f1f5f9' }]}>
                  <IconComp size={18} color={colors.textSecondary} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.description}</Text>
                </View>
              </View>
              {item.toggle !== undefined && (
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[styles.toggleTrack, { backgroundColor: item.toggle ? '#2563eb' : '#e2e8f0' }]}
                    activeOpacity={0.8}
                  >
                    {item.toggle && (
                      <View style={styles.toggleThumb}>
                        <View style={styles.toggleCheck} />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              )}
              {!item.toggle && (
                <ChevronRight size={16} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          );
        })}
      </Card>

      {/* Logout Button */}
      <Button
        title="Return to Demo Selector"
        leftIcon={<LogOut size={16} color="#ffffff" />}
        fullWidth
        variant="destructive"
        onPress={() => router.push('/')}
        style={styles.logoutBtn}
        textStyle={styles.logoutBtnText}
      />

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#10b981',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  role: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  vehicleBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 10,
  },
  vehicleText: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '700',
  },
  statsCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  menuCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  settingsCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextCol: {
    gap: 2,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  menuDesc: {
    fontSize: 11,
    color: colors.textMuted,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePill: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#15803d',
    fontWeight: '700',
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  toggleCheck: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563eb',
    marginTop: 3,
    marginLeft: 3,
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    marginBottom: 8,
  },
  logoutBtnText: {
    color: '#ffffff',
  },
  bottomSpacer: {
    height: 20,
  },
});
