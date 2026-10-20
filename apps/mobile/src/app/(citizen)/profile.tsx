import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Input } from '../../components/ui/Input';
import { colors } from '../../theme/colors';
import { CITIZEN_REPORTS } from '../../lib/mock-data';
import { CitizenBinReport } from '../../types';
import {
  User,
  Award,
  AlertTriangle,
  HelpCircle,
  LogOut,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Settings,
  ToggleLeft,
  Mail,
  Phone,
  Clock,
} from 'lucide-react-native';

const CITIZEN_PRIMARY = colors.roles.citizen.primary; // #d97706
const CITIZEN_LIGHT = colors.roles.citizen.light; // #fef3c7

const CITIZEN_MENU: { id: string; title: string; subtitle: string; icon: any; route?: string }[] = [
  { id: 'profile', title: 'My Resident Profile', subtitle: 'Edit your details & address', icon: User },
  { id: 'reports', title: 'My Reported Bins History', subtitle: '4 bins logged this month', icon: AlertTriangle, route: '/(citizen)/report-bin' },
  { id: 'rewards', title: 'Redeem Eco-Points', subtitle: '125 pts available', icon: Award, route: '/(citizen)/rewards' },
  { id: 'help', title: 'Gram Panchayat Helpline', subtitle: '+91 94420 54321', icon: HelpCircle },
];

const NOTIFICATION_SETTINGS: { id: string; title: string; subtitle: string; defaultValue: boolean }[] = [
  { id: 'collection', title: 'Collection Day Reminders', subtitle: 'Notify before pickup each ward day', defaultValue: true },
  { id: 'report', title: 'Report Status Updates', subtitle: 'Get notified when your bin report is collected', defaultValue: true },
  { id: 'promo', title: 'Promotions & Rewards', subtitle: 'New vouchers and eco-point offers', defaultValue: false },
];

export default function CitizenProfileScreen() {
  const router = useRouter();
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    NOTIFICATION_SETTINGS.reduce((acc, s) => ({ ...acc, [s.id]: s.defaultValue }), {})
  );

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Screen title="Citizen Profile" subtitle="Karthik S • Shanti Nagar Ward 3">
      {/* User Card */}
      <Card padding={18} style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={34} color="#ffffff" />
        </View>
        <Text style={styles.name}>Karthik S</Text>
        <Text style={styles.role}>Resident • Shanti Nagar Ward 3</Text>
        <View style={styles.badge}>
          <MapPin size={12} color={CITIZEN_PRIMARY} />
          <Text style={styles.badgeText}>House No. 42, Gandhi Street</Text>
        </View>
      </Card>

      {/* Eco Wallet */}
      <StatCard
        value="125 pts"
        label="Eco-Points Balance"
        subtext="Redeem for compost & vouchers"
        icon={<Award size={20} color={CITIZEN_PRIMARY} />}
        iconBg={CITIZEN_LIGHT}
        iconColor={CITIZEN_PRIMARY}
      />

      {/* Recent Reports */}
      <SectionHeader title="My Recent Bin Reports" subtitle="Your community watch activity" />
      <View style={styles.reportsList}>
        {CITIZEN_REPORTS.slice(0, 3).map((r: CitizenBinReport) => (
          <Card key={r.id} padding={12} style={styles.reportItem}>
            <View style={styles.reportRow}>
              <View style={styles.reportLeft}>
                <Text style={styles.reportLoc}>{r.locationName}</Text>
                <Text style={styles.reportDate}>{r.createdAt} • {r.stream} Waste</Text>
              </View>
              <View style={styles.reportRight}>
                <View style={styles.statusBadgeRow}>
                  <CheckCircle2 size={10} color="#15803d" />
                  <StatusBadge variant="success" small>{r.status}</StatusBadge>
                </View>
                <Text style={styles.reportPts}>+{r.pointsEarned} pts</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Menu Items */}
      <SectionHeader title="Settings & Support" subtitle="Manage your account preferences" />
      <Card padding={0} style={styles.menuCard}>
        {CITIZEN_MENU.map((item, index) => {
          const IconComp = item.icon;
          const isLast = index === CITIZEN_MENU.length - 1;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, !isLast && styles.menuItemBorder]}
              onPress={() => {
                if (item.route) {
                  router.push(item.route);
                } else if (item.id === 'help') {
                  Alert.alert('Gram Panchayat Helpline', '+91 94420 54321 • admin@panchayat.gov.in');
                } else {
                  Alert.alert(item.title, `${item.title} opened.`);
                }
              }}
              activeOpacity={0.75}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <IconComp size={18} color={CITIZEN_PRIMARY} />
                </View>
                <View style={styles.menuTexts}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={styles.menuRight}>
                {item.route && <ChevronRight size={16} color={colors.textSecondary} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </Card>

      {/* Notification Preferences */}
      <SectionHeader title="Notification Preferences" subtitle="Choose what you'd like to hear about" />
      <View style={styles.settingsList}>
        {NOTIFICATION_SETTINGS.map((s) => (
          <Card key={s.id} padding={12} style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingMeta}>
                <Text style={styles.settingTitle}>{s.title}</Text>
                <Text style={styles.settingSubtitle}>{s.subtitle}</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggleTrack, toggles[s.id] && styles.toggleTrackOn]}
                onPress={() => handleToggle(s.id)}
                activeOpacity={0.8}
              >
                <AnimatedThumb toggles={toggles} id={s.id} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.push('/')}
        activeOpacity={0.8}
      >
        <LogOut size={16} color="#dc2626" />
        <Text style={styles.logoutText}>Return to Demo Selector</Text>
      </TouchableOpacity>
    </Screen>
  );
}

function AnimatedThumb({ toggles, id }: { toggles: Record<string, boolean>; id: string }) {
  return (
    <View style={[styles.toggleThumb, toggles[id] && styles.toggleThumbOn]}>
      {toggles[id] ? <CheckCircle2 size={14} color="#ffffff" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CITIZEN_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  role: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: CITIZEN_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 11,
    color: '#b45309',
    fontWeight: '700',
  },
  reportsList: {
    gap: 8,
  },
  reportItem: {},
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportLeft: {
    flex: 1,
  },
  reportLoc: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reportDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reportRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  reportPts: {
    fontSize: 11,
    fontWeight: '800',
    color: CITIZEN_PRIMARY,
  },
  menuCard: {},
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
    backgroundColor: CITIZEN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTexts: {},
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsList: {
    gap: 8,
  },
  settingCard: {},
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingMeta: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 4,
    minHeight: 44,
  },
  toggleTrackOn: {
    backgroundColor: CITIZEN_PRIMARY,
    alignItems: 'flex-end',
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffffff',
  },
  toggleThumbOn: {
    transform: [{ translateX: 20 }],
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
    minHeight: 52,
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
});
