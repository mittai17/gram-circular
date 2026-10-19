import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRole } from '../../context/RoleContext';
import { colors } from '../../theme/colors';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Truck,
  Building2,
  Factory,
  Users,
  X,
  CheckCircle2,
} from 'lucide-react-native';

interface RoleOption {
  role: UserRole;
  title: string;
  badge: string;
  subtitle: string;
  color: string;
  lightColor: string;
  features: string[];
  icon: any;
}

const ROLES: RoleOption[] = [
  {
    role: 'admin',
    title: 'Panchayat Admin',
    badge: 'Admin',
    subtitle: 'Panchayat / Block / District HQ',
    color: '#1a5c38',
    lightColor: '#e8f5e9',
    features: ['Monitor all villages', 'View analytics & reports', 'Route optimization', 'User roster'],
    icon: ShieldCheck,
  },
  {
    role: 'worker',
    title: 'Collection Worker',
    badge: 'Field Staff',
    subtitle: 'Waste Collector • Ramesh K',
    color: '#2563eb',
    lightColor: '#eff6ff',
    features: ['Assigned vehicle route', 'Collect & weigh waste', 'Scan / generate QR', 'Offline mode & sync'],
    icon: Truck,
  },
  {
    role: 'mrf',
    title: 'MRF Operator',
    badge: 'Facility Staff',
    subtitle: 'Tidel Facility • Selvam M',
    color: '#ea580c',
    lightColor: '#fff7ed',
    features: ['Receive & inspect batches', 'Moisture & grade check', 'Zone storage update', 'Dispatch to processor'],
    icon: Building2,
  },
  {
    role: 'buyer',
    title: 'Buyer / Processor',
    badge: 'Recycle Industry',
    subtitle: 'GreenCycle Pvt Ltd • Arun Kumar',
    color: '#7c3aed',
    lightColor: '#f5f3ff',
    features: ['Browse available MLP batches', 'Schedule batch pickups', 'Confirm receipts', 'Procurement analytics'],
    icon: Factory,
  },
  {
    role: 'citizen',
    title: 'Village Citizen',
    badge: 'Community',
    subtitle: 'Shanti Nagar Resident • Karthik',
    color: '#d97706',
    lightColor: '#fef3c7',
    features: ['Learn MLP segregation', 'Collection schedules', 'Report full bins', 'Earn green reward points'],
    icon: Users,
  },
];

export function RoleSwitchModal() {
  const { role, switchToRole, isSwitcherOpen, closeSwitcher } = useRole();

  return (
    <Modal
      visible={isSwitcherOpen}
      transparent
      animationType="fade"
      onRequestClose={closeSwitcher}
    >
      <Pressable style={styles.overlay} onPress={closeSwitcher}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Demo Role Switcher</Text>
              <Text style={styles.subtitle}>Select any of the 5 roles to preview the mobile flow</Text>
            </View>
            <TouchableOpacity onPress={closeSwitcher} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {ROLES.map((item) => {
              const IconComp = item.icon;
              const isSelected = role === item.role;

              return (
                <TouchableOpacity
                  key={item.role}
                  style={[
                    styles.roleCard,
                    isSelected && { borderColor: item.color, borderWidth: 2, backgroundColor: item.lightColor },
                  ]}
                  onPress={() => switchToRole(item.role)}
                  activeOpacity={0.8}
                >
                  <View style={styles.roleCardTop}>
                    <View style={[styles.iconBox, { backgroundColor: item.lightColor }]}>
                      <IconComp size={24} color={item.color} />
                    </View>
                    <View style={styles.roleCardMeta}>
                      <View style={styles.roleTitleRow}>
                        <Text style={[styles.roleTitle, isSelected && { color: item.color }]}>
                          {item.title}
                        </Text>
                        <View style={[styles.roleBadge, { backgroundColor: item.lightColor }]}>
                          <Text style={[styles.roleBadgeText, { color: item.color }]}>
                            {item.badge}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.roleSub}>{item.subtitle}</Text>
                    </View>
                    {isSelected && (
                      <CheckCircle2 size={20} color={item.color} style={{ marginLeft: 6 }} />
                    )}
                  </View>

                  <View style={styles.featuresRow}>
                    {item.features.map((feat, idx) => (
                      <View key={idx} style={styles.featurePill}>
                        <Text style={styles.featurePillText}>• {feat}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  scrollList: {
    marginTop: 12,
  },
  roleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  roleCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roleCardMeta: {
    flex: 1,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  roleSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
  },
  featurePill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featurePillText: {
    fontSize: 10,
    color: '#475569',
  },
});
