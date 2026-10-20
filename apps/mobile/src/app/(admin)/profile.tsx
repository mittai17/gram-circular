import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { BottomNav } from '../../components/common/BottomNav';
import { Card, Button, StatusBadge, SectionHeader } from '../../components/ui';
import { colors } from '../../theme/colors';
import {
  ShieldCheck,
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Building,
  Truck,
  Clock,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react-native';

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

const MENU_ITEMS = [
  { id: 'edit', title: 'Edit Profile', icon: User },
  { id: 'notif', title: 'Notifications', icon: Bell, badge: '3 New' },
  { id: 'settings', title: 'App Settings', icon: Settings },
  { id: 'help', title: 'Help & Support', icon: HelpCircle },
];

const AUDIT_HISTORY: AuditEntry[] = [
  { id: 'a-1', action: 'Role access granted', entity: 'Panchayat Admin Dashboard', timestamp: '19 Oct 2026, 8:15 AM', status: 'success' },
  { id: 'a-2', action: 'Route optimization viewed', entity: 'Vehicle TN-29-BA-4821', timestamp: '18 Oct 2026, 2:30 PM', status: 'success' },
  { id: 'a-3', action: 'Compliance report downloaded', entity: 'Mass-Balance Ledger', timestamp: '17 Oct 2026, 4:15 PM', status: 'success' },
  { id: 'a-4', action: 'User role updated', entity: 'Ramesh K → Collection Worker', timestamp: '16 Oct 2026, 11:00 AM', status: 'warning' },
  { id: 'a-5', action: 'Village status changed', entity: 'Kaveri Nagar → Active', timestamp: '15 Oct 2026, 9:00 AM', status: 'info' },
];

export default function AdminProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Admin Profile" subtitle="Account & Configuration" showBack />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card padding={20} shadow="md" style={styles.profileHeaderCard}>
          <View style={styles.avatar}>
            <ShieldCheck size={36} color="#ffffff" />
          </View>
          <Text style={styles.name}>Panchayat Admin</Text>
          <Text style={styles.email}>admin@panchayat.gov.in</Text>
          <View style={styles.deptBadge}>
            <Building size={12} color="#15803d" />
            <Text style={styles.deptText}>Kaveripattinam Block Union</Text>
          </View>
          <Text style={styles.roleCaption}>Panchayat Admin • System Administrator</Text>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <Card padding={14} shadow="none" style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={styles.statIcon}><ShieldCheck size={18} color={colors.primary} /></View>
              <View style={styles.statText}>
                <Text style={styles.statValue}>28</Text>
                <Text style={styles.statLabel}>Villages</Text>
              </View>
            </View>
          </Card>
          <Card padding={14} shadow="none" style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: '#eff6ff' }]}><Truck size={18} color="#2563eb" /></View>
              <View style={styles.statText}>
                <Text style={styles.statValue}>96</Text>
                <Text style={styles.statLabel}>Collection Points</Text>
              </View>
            </View>
          </Card>
          <Card padding={14} shadow="none" style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}><CheckCircle2 size={18} color="#10b981" /></View>
              <View style={styles.statText}>
                <Text style={styles.statValue}>100%</Text>
                <Text style={styles.statLabel}>EPR Compliant</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Settings Menu */}
        <SectionHeader title="Settings" subtitle="Configure your experience" />
        <Card padding={0} shadow="md">
          {MENU_ITEMS.map((item, index) => {
            const IconComp = item.icon;
            const isLast = index === MENU_ITEMS.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, !isLast && styles.menuItemBorder]}
                onPress={() => Alert.alert(item.title, `${item.title} opened.`)}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconBox}>
                    <IconComp size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <View style={styles.menuRight}>
                  {item.badge && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <ChevronRight size={16} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Audit History Preview */}
        <SectionHeader title="Recent Audit History" subtitle="System access & activity log" />
        <Card padding={0} shadow="md">
          {AUDIT_HISTORY.map((entry) => {
            const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
              success: { bg: '#ecfdf5', color: '#15803d', label: 'Success' },
              warning: { bg: '#fef3c7', color: '#b45309', label: 'Warning' },
              info: { bg: '#eff6ff', color: '#1d4ed8', label: 'Info' },
            };
            const cfg = statusConfig[entry.status];
            return (
              <TouchableOpacity key={entry.id} style={styles.auditRow} activeOpacity={0.8}>
                <View style={styles.auditIcon}>
                  <Clock size={16} color={colors.textMuted} />
                </View>
                <View style={styles.auditContent}>
                  <Text style={styles.auditAction}>{entry.action}</Text>
                  <View style={styles.auditMetaRow}>
                    <Text style={styles.auditEntity}>{entry.entity}</Text>
                    <Text style={styles.auditTime}>{entry.timestamp}</Text>
                  </View>
                </View>
                <StatusBadge variant={entry.status as any} small>
                  {cfg.label}
                </StatusBadge>
              </TouchableOpacity>
            );
          })}
          <View style={styles.divider} />
          <TouchableOpacity style={styles.viewAllRow} onPress={() => Alert.alert('Audit Log', 'Full audit history coming soon.')}>
            <Text style={styles.viewAllText}>View Full Audit Trail</Text>
            <ChevronRight size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <Button
          title="Return to Demo Selector"
          variant="destructive"
          fullWidth
          style={{ marginTop: 16 }}
          onPress={handleLogout}
          leftIcon={<LogOut size={16} color="#dc2626" />}
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
  profileHeaderCard: {
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  deptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  deptText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  roleCaption: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
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
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.roles.admin.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePill: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '700',
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  auditIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  auditContent: {
    flex: 1,
  },
  auditAction: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  auditMetaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  auditEntity: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  auditTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
