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
  Factory,
  User,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

const BUYER_MENU = [
  { id: 'profile', title: 'My Profile', icon: User, route: null },
  { id: 'company', title: 'Company Details & GSTIN', icon: Building, route: null },
  { id: 'requirements', title: 'Material Specifications & Purity', icon: FileSpreadsheet, route: '/(buyer)/available-batches' },
  { id: 'help', title: 'B2B Recycler Support', icon: HelpCircle, route: null },
];

export default function BuyerProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <HeaderBar title="Recycler Profile" subtitle="Arun Kumar • GreenCycle Pvt Ltd" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Factory size={32} color="#ffffff" />
          </View>
          <Text style={styles.name}>Arun Kumar</Text>
          <Text style={styles.role}>Chief Procurement Officer • GreenCycle Pvt Ltd</Text>
          <View style={styles.badge}>
            <ShieldCheck size={12} color="#7c3aed" />
            <Text style={styles.badgeText}>Verified CPCB EPR Recycler</Text>
          </View>
        </View>

        {/* Procurement Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statNum}>412 kg</Text>
            <Text style={styles.statLabel}>Oct Volume</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>₹48.5k</Text>
            <Text style={styles.statLabel}>Procured</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>100%</Text>
            <Text style={styles.statLabel}>Settlement</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {BUYER_MENU.map((item, index) => {
            const IconComp = item.icon;
            const isLast = index === BUYER_MENU.length - 1;

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
                    <IconComp size={18} color="#7c3aed" />
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
    backgroundColor: '#7c3aed',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 11,
    color: '#7c3aed',
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
    color: '#7c3aed',
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
    backgroundColor: '#f5f3ff',
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
