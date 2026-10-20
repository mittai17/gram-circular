import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { BottomNav } from '../../components/common/BottomNav';
import { Card, Button, StatusBadge, SectionHeader, EmptyState, Input } from '../../components/ui';
import { USERS_ROSTER } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import { UserContact } from '../../types';
import {
  UserPlus,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Building2,
  Factory,
  Users,
  ChevronRight,
} from 'lucide-react-native';

const roleSchema = z.object({
  role: z.enum([
    'Collection Worker',
    'MRF Operator',
    'Buyer / Processor',
    'Panchayat Admin',
    'Village Citizen',
  ]),
});

type RoleFormValues = z.infer<typeof roleSchema>;

const ROLE_ICONS: Record<string, React.ComponentType<any>> = {
  'Collection Worker': Truck,
  'MRF Operator': Building2,
  'Buyer / Processor': Factory,
  'Panchayat Admin': ShieldCheck,
  'Village Citizen': Users,
};

const USER_DISTRICTS: Record<string, string> = {
  'Ramesh K': 'Kaveripattinam',
  'Selvam M': 'Kaveripattinam',
  'GreenCycle Pvt Ltd': 'Hosur',
  'Kavitha': 'Kaveripattinam',
  'Panchayat Admin': 'Kaveripattinam',
};

const FILTER_ROLES = ['All', 'Admin', 'Worker', 'MRF', 'Buyer', 'Citizen'];

const ROLE_FILTER_MAP: Record<string, string> = {
  Admin: 'Panchayat Admin',
  Worker: 'Collection Worker',
  MRF: 'MRF Operator',
  Buyer: 'Buyer / Processor',
  Citizen: 'Village Citizen',
};

export default function AdminUsersScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('All');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const form = useForm<RoleFormValues>({
    defaultValues: { role: 'Collection Worker' },
  });

  const filteredUsers = USERS_ROSTER.filter((user) => {
    if (filter === 'All') return true;
    const targetRole = ROLE_FILTER_MAP[filter];
    return targetRole ? user.role === targetRole : true;
  });

  const handleRoleSubmit = (data: RoleFormValues, user: UserContact) => {
    try {
      roleSchema.parse(data);
      Alert.alert('Role Assigned', `${user.name} is now assigned as ${data.role}.`, [
        { text: 'OK', style: 'default' },
      ]);
      setEditingUserId(null);
      form.reset();
    } catch {
      Alert.alert('Validation Error', 'Please select a valid role.');
    }
  };

  const getRoleIcon = (roleName: string) => {
    return ROLE_ICONS[roleName] ?? Users;
  };

  if (filteredUsers.length === 0) {
    return (
      <View style={styles.screen}>
        <HeaderBar title="User & Role Management" subtitle="Personnel Roster & Contacts" showBack />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <EmptyState
            title="No users found"
            subtitle="Try adjusting your role filter"
            icon={<Users size={24} color={colors.textMuted} />}
          />
        </ScrollView>
        <BottomNav />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="User & Role Management"
        subtitle="Personnel Roster & Contacts"
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => Alert.alert('Add User', 'Open onboarding form for new personnel')}
          >
            <UserPlus size={16} color="#ffffff" />
          </TouchableOpacity>
        }
      />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.chipsContainer}>
          <SectionHeader title="User Roster" subtitle={`${filteredUsers.length} active personnel`} />

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
        </View>

        {filteredUsers.map((user) => {
          const RoleIcon = getRoleIcon(user.role);
          const isEditing = editingUserId === user.id;
          const district = USER_DISTRICTS[user.name] ?? 'Kaveripattinam';

          return (
            <Card key={user.id} padding={14} shadow="md" style={{ marginBottom: 10 }}>
              <View style={styles.cardHeader}>
                <View style={styles.userAvatar}>
                  <RoleIcon size={20} color={colors.primary} />
                </View>
                <View style={styles.userMeta}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userRole}>{user.role}</Text>
                  <Text style={styles.userDistrict}>District: {district}</Text>
                </View>
                <StatusBadge variant="success" small>
                  {user.active ? 'Online' : 'Offline'}
                </StatusBadge>
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
                    onPress={() => Alert.alert('Email', `Opening ${user.email}...`)}
                  >
                    <Mail size={12} color="#2563eb" />
                    <Text style={[styles.contactBtnText, { color: '#2563eb' }]}>Email</Text>
                  </TouchableOpacity>
                </View>

                {isEditing ? (
                  <View style={styles.formContainer}>
                    <Input
                      label="Assign Role"
                      value={form.watch('role')}
                      onChangeText={(text) => form.setValue('role', text as any)}
                    />
                    <View style={styles.formActions}>
                      <Button
                        title="Cancel"
                        variant="ghost"
                        style={{ flex: 1, marginRight: 6, minHeight: 40, paddingVertical: 8 }}
                        onPress={() => {
                          setEditingUserId(null);
                          form.reset();
                        }}
                      />
                      <Button
                        title="Save"
                        variant="primary"
                        style={{ flex: 1, minHeight: 40, paddingVertical: 8 }}
                        onPress={() => {
                          form.handleSubmit((data) => {
                            handleRoleSubmit(data, user);
                          })();
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <Button
                    title="Assign Role"
                    variant="outline"
                    fullWidth
                    style={{ marginTop: 8, minHeight: 40, paddingVertical: 8 }}
                    onPress={() => {
                      setEditingUserId(user.id);
                      form.reset({ role: user.role });
                    }}
                    leftIcon={<Users size={14} color={colors.primary} />}
                  />
                )}
              </View>
            </Card>
          );
        })}

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
  scrollContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60%',
  },
  chipsContainer: {
    gap: 10,
  },
  chipsScroll: {
    height: 44,
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeChipText: {
    color: '#ffffff',
  },
  addBtn: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.roles.admin.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userRole: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  userDistrict: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  cardBody: {
    gap: 10,
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
  formContainer: {
    marginTop: 8,
    gap: 10,
  },
  formActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
});
