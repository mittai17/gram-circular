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
import { CITIZEN_REPORTS } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  User,
  Award,
  AlertTriangle,
  HelpCircle,
  LogOut,
  ChevronRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react-native';

const CITIZEN_MENU = [
  { id: 'profile', title: 'My Resident Profile', icon: User, route: null },
  { id: 'reports', title: 'My Reported Bins History', icon: AlertTriangle, route: null, badge: '4 Logged' },
  { id: 'rewards', title: 'Redeem Eco-Points', icon: Award, route: '/(citizen)/rewards', badge: '125 pts' },
  { id: 'help', title: 'Gram Panchayat Helpline', icon: HelpCircle, route: null },
];

export default function CitizenProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <HeaderBar title="Resident Profile" subtitle="Karthik S • Shanti Nagar" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={32} color="#ffffff" />
          </View>
          <Text style={styles.name}>Karthik S</Text>
          <Text style={styles.role}>Resident • Shanti Nagar Ward 3</Text>
          <View style={styles.badge}>
            <MapPin size={12} color="#d97706" />
            <Text style={styles.badgeText}>House No. 42, Gandhi Street</Text>
          </View>
        </View>

        {/* Eco Wallet Stat Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statNum}>125</Text>
            <Text style={styles.statLabel}>Eco-Points</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLabel}>Reports Logged</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>Rank #14</Text>
            <Text style={styles.statLabel}>Village Rank</Text>
          </View>
        </View>

        {/* Recent Reports Log */}
        <Text style={styles.sectionHeader}>My Recent Bin Reports</Text>
        {CITIZEN_REPORTS.slice(0, 2).map((r) => (
          <View key={r.id} style={styles.reportItem}>
            <View style={styles.reportLeft}>
              <Text style={styles.reportLoc}>{r.locationName}</Text>
              <Text style={styles.reportDate}>{r.createdAt} • {r.stream} Waste</Text>
            </View>
            <View style={styles.reportRight}>
              <View style={styles.statusBadge}>
                <CheckCircle2 size={10} color="#15803d" />
                <Text style={styles.statusText}>{r.status}</Text>
              </View>
              <Text style={styles.ptsText}>+{r.pointsEarned} pts</Text>
            </View>
          </View>
        ))}

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {CITIZEN_MENU.map((item, index) => {
            const IconComp = item.icon;
            const isLast = index === CITIZEN_MENU.length - 1;

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
                  <View style={styles.menuIconBox}>
                    <IconComp size={18} color="#d97706" />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>

                <View style={styles.menuRight}>
                  {item.badge && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgePillText}>{item.badge}</Text>
                    </View>
                  )}
                  <ChevronRight size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
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
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#d97706',
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
    backgroundColor: '#fef3c7',
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#d97706',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDiv: {
    width: 1,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
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
    gap: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803d',
  },
  ptsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#d97706',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
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
    backgroundColor: '#fef3c7',
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
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    color: '#b45309',
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
