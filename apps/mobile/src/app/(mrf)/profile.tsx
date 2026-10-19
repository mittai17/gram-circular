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
  Building2,
  User,
  Sliders,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

const MRF_MENU = [
  { id: 'profile', title: 'My Profile', icon: User, route: null },
  { id: 'facility', title: 'Facility Settings & Scales', icon: Sliders, route: null },
  { id: 'inventory-rep', title: 'Monthly Inventory Report', icon: FileText, route: '/(mrf)/inventory' },
  { id: 'help', title: 'Help & Operations Support', icon: HelpCircle, route: null },
];

export default function MrfProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <HeaderBar title="MRF Facility Profile" subtitle="Selvam M • Supervisor" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Building2 size={32} color="#ffffff" />
          </View>
          <Text style={styles.name}>Selvam M</Text>
          <Text style={styles.role}>MRF Facility Operator & Quality Inspector</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Tidel MRF Block Facility</Text>
          </View>
        </View>

        {/* Facility Key Metrics */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statNum}>420 kg</Text>
            <Text style={styles.statLabel}>Current Stock</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Batches Today</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>100%</Text>
            <Text style={styles.statLabel}>Grade Accuracy</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {MRF_MENU.map((item, index) => {
            const IconComp = item.icon;
            const isLast = index === MRF_MENU.length - 1;

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
                    <IconComp size={18} color="#ea580c" />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>

                <ChevronRight size={16} color={colors.textSecondary} />
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
    backgroundColor: '#ea580c',
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
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 11,
    color: '#ea580c',
    fontWeight: '700',
  },
  statsCard: {
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
    color: '#ea580c',
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
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
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
