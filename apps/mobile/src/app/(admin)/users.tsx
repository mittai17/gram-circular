import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { USERS_ROSTER } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  UserPlus,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Building2,
  Factory,
  Users as UsersIcon,
} from 'lucide-react-native';

const FILTER_ROLES = ['All', 'Admin', 'Worker', 'MRF', 'Buyer'];

export default function AdminUsersScreen() {
  const [filter, setFilter] = useState('All');

  const filteredUsers = USERS_ROSTER.filter((user) => {
    if (filter === 'All') return true;
    if (filter === 'Admin') return user.role.includes('Admin');
    if (filter === 'Worker') return user.role.includes('Worker');
    if (filter === 'MRF') return user.role.includes('MRF');
    if (filter === 'Buyer') return user.role.includes('Buyer');
    return true;
  });

  const getRoleIcon = (roleName: string) => {
    if (roleName.includes('Admin')) return ShieldCheck;
    if (roleName.includes('Worker')) return Truck;
    if (roleName.includes('MRF')) return Building2;
    if (roleName.includes('Buyer')) return Factory;
    return UsersIcon;
  };

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="Personnel Roster"
        subtitle="Roles & Operational Contacts"
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => Alert.alert('Add User', 'Modal to onboard new worker/operator')}
          >
            <UserPlus size={16} color="#ffffff" />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          <View style={styles.chipsRow}>
            {FILTER_ROLES.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, filter === item && styles.activeChip]}
                onPress={() => setFilter(item)}
              >
                <Text style={[styles.chipText, filter === item && styles.activeChipText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* User Cards List */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role);

            return (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.userAvatar}>
                    <RoleIcon size={20} color="#1a5c38" />
                  </View>
                  <View style={styles.userMeta}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <CheckCircle2 size={10} color="#15803d" />
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <MapPin size={12} color={colors.textSecondary} />
                    <Text style={styles.infoText}>{user.assignedArea}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <TouchableOpacity
                      style={styles.contactBtn}
                      onPress={() => Alert.alert('Call', `Dialing ${user.phone}...`)}
                    >
                      <Phone size={12} color="#15803d" />
                      <Text style={styles.contactBtnText}>{user.phone}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.contactBtn}
                      onPress={() => Alert.alert('Email', `Opening mail client for ${user.email}...`)}
                    >
                      <Mail size={12} color="#2563eb" />
                      <Text style={[styles.contactBtnText, { color: '#2563eb' }]}>Email</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addBtn: {
    backgroundColor: '#1a5c38',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: {
    maxHeight: 44,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: '#1a5c38',
    borderColor: '#1a5c38',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeChipText: {
    color: '#ffffff',
  },
  list: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userRole: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  cardBody: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8faf9',
    borderWidth: 0.8,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  contactBtnText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
  },
});
