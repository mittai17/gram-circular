import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatCard } from '../../components/ui/StatCard';
import { colors } from '../../theme/colors';
import {
  Building2,
  ChevronRight,
  FileSpreadsheet,
  HelpCircle,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react-native';

const PRIMARY = colors.roles.buyer.primary; // #7c3aed
const PRIMARY_LIGHT = colors.roles.buyer.light; // #f5f3ff

interface ProfileContact {
  name: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  certification: string;
  certified: boolean;
}

const CONTACT: ProfileContact = {
  name: 'Arun Kumar',
  role: 'Chief Procurement Officer • GreenCycle Pvt Ltd',
  phone: '+91 80234 56789',
  email: 'procurement@greencycle.in',
  address: 'Hosur Industrial Hub, Kaveripattinam Block, Tamil Nadu',
  gstin: '33AABCG1234H1Z5',
  certification: 'Verified CPCB EPR Recycler',
  certified: true,
};

const SETTINGS = [
  { id: 'profile', title: 'My Profile', icon: User, subtitle: 'View & edit buyer details' },
  { id: 'company', title: 'Company Details & GSTIN', icon: Building2, subtitle: 'Tax registration & address' },
  { id: 'requirements', title: 'Material Specifications & Purity', icon: FileSpreadsheet, subtitle: 'Preferred grades & streams' },
  { id: 'support', title: 'B2B Recycler Support', icon: HelpCircle, subtitle: 'Dedicated procurement desk' },
];

export default function BuyerProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Buyer Profile" subtitle={`${CONTACT.name} • GreenCycle Pvt Ltd`} showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Building2 size={32} color="#ffffff" />
            </View>
            <View style={styles.avatarText}>
              <Text style={styles.profileName}>{CONTACT.name}</Text>
              <Text style={styles.profileRole}>{CONTACT.role}</Text>
            </View>
            <View style={styles.certBadge}>
              <ShieldCheck size={14} color="#15803d" />
              <Text style={styles.certText}>Verified CPCB EPR Recycler</Text>
            </View>
          </View>
        </Card>

        {/* Procurement Stats */}
        <SectionHeader title="Procurement Summary" subtitle="October 2026" />
        <View style={styles.statGrid}>
          <StatCard
            value="412 kg"
            label="Oct Volume"
            subtext="Purchased this month"
            icon={<ShieldCheck size={18} color="#15803d" />}
            iconBg="#ecfdf5"
            iconColor="#15803d"
            style={{ width: '48%' }}
          />
          <StatCard
            value="₹48.5k"
            label="Procured"
            subtext="Total spend this month"
            icon={<ShieldCheck size={18} color={PRIMARY} />}
            iconBg={PRIMARY_LIGHT}
            iconColor={PRIMARY}
            style={{ width: '48%' }}
          />
          <StatCard
            value="100%"
            label="Settlement"
            subtext="All invoices cleared"
            icon={<ShieldCheck size={18} color="#10b981" />}
            iconBg="#ecfdf5"
            iconColor="#10b981"
            style={{ width: '48%' }}
          />
        </View>

        {/* Company Information */}
        <Card style={styles.infoCard}>
          <SectionHeader title="Company Information" subtitle="Official buyer details" />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Company</Text>
            <Text style={styles.infoValue}>GreenCycle Pvt Ltd</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GSTIN</Text>
            <Text style={styles.infoValue}>{CONTACT.gstin}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{CONTACT.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{CONTACT.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{CONTACT.address}</Text>
          </View>
        </Card>

        {/* Settings */}
        <SectionHeader title="Settings" subtitle="Configure your buyer experience" />
        <View style={styles.settingsCard}>
          {SETTINGS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingsItem}
              activeOpacity={0.8}
            >
              <View style={styles.settingsLeft}>
                <View style={styles.settingsIcon}>
                  <item.icon size={18} color={PRIMARY} />
                </View>
                <View>
                  <Text style={styles.settingsTitle}>{item.title}</Text>
                  <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <Button
          title="Return to Demo Selector"
          variant="destructive"
          onPress={handleLogout}
          style={{ marginTop: 10 }}
          leftIcon={<LogOut size={18} color="#ffffff" />}
        />

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  profileRole: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  certText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingsSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
