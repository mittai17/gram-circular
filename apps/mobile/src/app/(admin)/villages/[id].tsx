import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../../components/common/HeaderBar';
import { OfflineBanner } from '../../../components/common/OfflineBanner';
import { BottomNav } from '../../../components/common/BottomNav';
import { Card, Button, StatusBadge, SectionHeader } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { VILLAGES_DATA } from '../../../lib/mock-data';
import { VillageSummary } from '../../../types';
import {
  MapPin,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Trash2,
  Phone,
  Mail,
} from 'lucide-react-native';

interface VillageCardData extends VillageSummary {
  population: number;
  dailyWasteKg: number;
  segregationRate: number;
}

const VILLAGE_DETAILS: VillageCardData[] = [
  { ...VILLAGES_DATA[0], population: 12400, dailyWasteKg: 10.7, segregationRate: 78 },
  { ...VILLAGES_DATA[1], population: 15600, dailyWasteKg: 9.5, segregationRate: 72 },
  { ...VILLAGES_DATA[2], population: 9800, dailyWasteKg: 8.1, segregationRate: 81 },
  { ...VILLAGES_DATA[3], population: 11200, dailyWasteKg: 6.6, segregationRate: 65 },
  { ...VILLAGES_DATA[4], population: 7400, dailyWasteKg: 3.8, segregationRate: 54 },
];

export default function VillageDetailScreen() {
  const router = useRouter();
  const id = (router as any).params?.id || 'v-01';
  const village = VILLAGE_DETAILS.find((v) => v.id === id) ?? VILLAGE_DETAILS[0];

  return (
    <View style={styles.screen}>
      <HeaderBar
        title={village.name}
        subtitle={`${village.panchayat} • ${village.wardCount} wards`}
        showBack
      />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Village Header Card */}
        <Card padding={20} shadow="md" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.avatar}>
              <MapPin size={32} color="#ffffff" />
            </View>
            <View style={styles.titleArea}>
              <Text style={styles.villageName}>{village.name}</Text>
              <Text style={styles.villagePanchayat}>{village.panchayat}</Text>
            </View>
            <StatusBadge variant={village.status === 'Active' ? 'success' : 'warning'}>
              {village.status}
            </StatusBadge>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaValue}>{village.population.toLocaleString()}</Text>
              <Text style={styles.metaLabel}>Population</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaCol}>
              <Text style={styles.metaValue}>{village.dailyWasteKg} kg/day</Text>
              <Text style={styles.metaLabel}>Daily Waste</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaCol}>
              <Text style={styles.metaValue}>{village.segregationRate}%</Text>
              <Text style={styles.metaLabel}>Segregation Rate</Text>
            </View>
          </View>
        </Card>

        {/* Collection Points */}
        <SectionHeader
          title="Collection Points"
          subtitle={`${village.collectionPointsCount} drop-off locations`}
        />
        <Card padding={0} shadow="md">
          {[
            { id: 'cp-1', name: 'Main Collection Point', ward: 'Ward 1', kg: 42.0, status: 'Completed' as const },
            { id: 'cp-2', name: 'Community Hall', ward: 'Ward 2', kg: 31.5, status: 'Completed' as const },
            { id: 'cp-3', name: 'School Road', ward: 'Ward 3', kg: 28.0, status: 'In Progress' as const },
            { id: 'cp-4', name: 'Market Junction', ward: 'Ward 4', kg: 0, status: 'Pending' as const },
          ].slice(0, village.collectionPointsCount).map((cp) => (
            <TouchableOpacity key={cp.id} style={styles.cpRow} activeOpacity={0.8}>
              <View style={styles.cpLeft}>
                <Text style={styles.cpName}>{cp.name}</Text>
                <Text style={styles.cpWard}>{cp.ward}</Text>
              </View>
              <View style={styles.cpRight}>
                <Text style={styles.cpKg}>{cp.kg} kg</Text>
                <StatusBadge variant={cp.status === 'Completed' ? 'success' : cp.status === 'In Progress' ? 'info' : 'default'} small>
                  {cp.status}
                </StatusBadge>
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.divider} />
          <TouchableOpacity style={styles.viewAllRow} onPress={() => {}}>
            <Text style={styles.viewAllText}>Manage Collection Points</Text>
            <ChevronRight size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Quick Contacts */}
        <SectionHeader title="Village Contacts" subtitle="Local administration & support" />
        <Card padding={14} shadow="md">
          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Phone size={16} color={colors.primary} />
              <View style={styles.contactMeta}>
                <Text style={styles.contactLabel}>Panchayat Office</Text>
                <Text style={styles.contactValue}>+91 94420 54321</Text>
              </View>
            </View>
            <View style={styles.contactDivider} />
            <View style={styles.contactItem}>
              <Mail size={16} color="#2563eb" />
              <View style={styles.contactMeta}>
                <Text style={styles.contactLabel}>Village Secretary</Text>
                <Text style={styles.contactValue}>secretary@panchayat.gov.in</Text>
              </View>
            </View>
          </View>
        </Card>

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
  headerCard: {
    alignItems: 'center',
    textAlign: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: {
    flex: 1,
  },
  villageName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  villagePanchayat: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 4,
  },
  metaCol: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metaLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  cpLeft: {
    flex: 1,
  },
  cpName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cpWard: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  cpRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  cpKg: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
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
  contactRow: {
    flexDirection: 'row',
    gap: 4,
  },
  contactItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
  },
  contactMeta: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
});
