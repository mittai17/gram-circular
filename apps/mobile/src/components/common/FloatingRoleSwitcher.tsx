import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useRole } from '../../context/RoleContext';
import { colors } from '../../theme/colors';
import { ShieldCheck, Truck, Building2, Factory, Users, RefreshCw } from 'lucide-react-native';

const ROLE_ICONS = {
  admin: ShieldCheck,
  worker: Truck,
  mrf: Building2,
  buyer: Factory,
  citizen: Users,
};

export function FloatingRoleSwitcher() {
  const { role, openSwitcher } = useRole();
  const Icon = ROLE_ICONS[role] || RefreshCw;
  const roleTheme = colors.roles[role];

  return (
    <View style={styles.anchor} pointerEvents="box-none">
      <TouchableOpacity
        style={[styles.floatingPill, { backgroundColor: roleTheme.primary }]}
        onPress={openSwitcher}
        activeOpacity={0.85}
      >
        <Icon size={16} color="#ffffff" />
        <Text style={styles.text}>Switch Role</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    bottom: 74,
    right: 16,
    zIndex: 9999,
  },
  floatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  text: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
