import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import {
  Building2,
  User,
  Sliders,
  FileText,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Layers,
  Archive,
  CheckCircle2,
} from 'lucide-react-native';

const mrf = colors.roles.mrf;

const USER = {
  id: 'u-2',
  name: 'Selvam M',
  role: 'MRF Operator',
  title: 'MRF Facility Operator & Quality Inspector',
  phone: '+91 94432 89123',
  email: 'selvam.m@tidelmrf.in',
  facility: 'Tidel Block MRF Facility',
  assignedArea: 'Kaveripattinam Block Union',
};

const METRICS = [
  { value: '420 kg', label: 'Current Stock', icon: <Layers size={18} color="#2563eb" />, iconBg: '#eff6ff' },
  { value: '12', label: 'Batches Today', icon: <Archive size={18} color="#16a34a" />, iconBg: '#ecfdf5' },
  { value: '100%', label: 'Grade Accuracy', icon: <CheckCircle2 size={18} color="#10b981" />, iconBg: '#ecfdf5' },
];

const MENU = [
  { id: 'profile', title: 'My Profile', icon: User, subtitle: 'View and edit profile details' },
  { id: 'facility', title: 'Facility Settings', icon: Sliders, subtitle: 'Scales, zones and equipment' },
  { id: 'report', title: 'Monthly Inventory Report', icon: FileText, subtitle: 'Export stock and movement logs' },
  { id: 'help', title: 'Help & Support', icon: HelpCircle, subtitle: 'Operations support desk' },
];

export default function MrfProfileScreen() {
  const router = useRouter();

  const handleMenuPress = (item: typeof MENU[number]) => {
    if (item.id === 'report') {
      router.push('/(mrf)/inventory');
      return;
    }
    Alert.alert(item.title, `${item.title} opened.`);
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <Screen title="MRF Facility Profile" subtitle={`${USER.name} • ${USER.role}`} showBack>
      {/* Profile Card */}
      <Card style={styles.profileCard} padding={20}>
        <View style={styles.avatar}>
          <Building2 size={30} color="#ffffff" />
        </View>
        <Text style={styles.name}>{USER.name}</Text>
        <Text style={styles.role}>{USER.title}</Text>
        <StatusBadge variant="primary" children={USER.facility} />
        <View style={styles.contactRow}>
          <View style={styles.contactCol}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{USER.phone}</Text>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactCol}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{USER.email}</Text>
          </View>
        </View>
      </Card>

      {/* Metrics */}
      <SectionHeader title="Your Stats" />
      <View style={styles.statGrid}>
        {METRICS.map((m) => (
          <StatCard key={m.label} {...m} />
        ))}
      </View>

      {/* Facility Info */}
      <Card style={styles.infoCard} padding={16}>
        <SectionHeader title="Facility Information" style={styles.sectionNoMargin} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assigned Area</Text>
          <Text style={styles.infoValue}>{USER.assignedArea}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role Theme</Text>
          <Text style={styles.infoValue}>MRF Operator</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <StatusBadge variant="success" small children="Active" />
        </View>
      </Card>

      {/* Settings Menu */}
      <SectionHeader title="Settings" />
      <Card style={styles.menuCard} padding={0}>
        {MENU.map((item, index) => {
          const IconComp = item.icon;
          const isLast = index === MENU.length - 1;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, !isLast && styles.menuItemBorder]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.8}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <IconComp size={18} color={mrf.primary} />
                </View>
                <View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSub}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}
      </Card>

      {/* Logout */}
      <Button
        title="Return to Demo Selector"
        variant="destructive"
        leftIcon={<LogOut size={16} color="#ffffff" />}
        fullWidth
        style={styles.logoutBtn}
        onPress={handleLogout}
      />

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    marginBottom: 4,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: mrf.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  role: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  contactCol: {
    alignItems: 'center',
  },
  contactDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
    textAlign: 'center',
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  infoCard: {
    marginBottom: 4,
  },
  sectionNoMargin: {
    marginTop: 0,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  infoDivider: {
    height: 0.8,
    backgroundColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuCard: {
    marginBottom: 4,
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
    borderRadius: 9,
    backgroundColor: mrf.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  logoutBtn: {
    marginTop: 4,
  },
  bottomSpacer: {
    height: 20,
  },
});
