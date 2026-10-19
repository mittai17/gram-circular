import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
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
  CheckCircle2,
} from 'lucide-react-native';

const MENU_ITEMS = [
  {
    id: 'edit',
    title: 'Edit Profile',
    icon: User,
  },
  {
    id: 'notif',
    title: 'Notifications',
    icon: Bell,
    badge: '3 New',
  },
  {
    id: 'settings',
    title: 'App Settings',
    icon: Settings,
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: HelpCircle,
  },
];

export default function AdminProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Admin Profile" subtitle="Account & Configuration" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar}>
            <ShieldCheck size={36} color="#ffffff" />
          </View>
          <Text style={styles.name}>Panchayat Admin</Text>
          <Text style={styles.email}>admin@panchayat.gov.in</Text>
          <View style={styles.deptBadge}>
            <Building size={12} color="#15803d" />
            <Text style={styles.deptText}>Kaveripattinam Block Union</Text>
          </View>
        </View>

        {/* Quick Stats Summary */}
        <View style={styles.statsSummaryCard}>
          <View style={styles.statCol}>
            <Text style={styles.statNum}>28</Text>
            <Text style={styles.statLbl}>Villages</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>96</Text>
            <Text style={styles.statLbl}>Collection CPs</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>100%</Text>
            <Text style={styles.statLbl}>EPR Compliant</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
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
                    <IconComp size={18} color="#1a5c38" />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
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
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut size={16} color="#dc2626" />
          <Text style={styles.logoutText}>Return to Demo Selector</Text>
        </TouchableOpacity>

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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1a5c38',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 12,
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
  statsSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  statLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDiv: {
    width: 1,
    backgroundColor: colors.border,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
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
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 13,
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
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
});
