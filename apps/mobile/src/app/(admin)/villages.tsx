import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { BottomNav } from '../../components/common/BottomNav';
import { Card, Button, StatusBadge, SectionHeader, EmptyState, Input } from '../../components/ui';
import { VILLAGES_DATA } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import { VillageSummary } from '../../types';
import {
  Search,
  MapPin,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
} from 'lucide-react-native';

interface VillageCardData extends VillageSummary {
  population: number;
  dailyWasteKg: number;
  segregationRate: number;
}

const VILLAGE_CARDS: VillageCardData[] = [
  { ...VILLAGES_DATA[0], population: 12400, dailyWasteKg: 10.7, segregationRate: 78 },
  { ...VILLAGES_DATA[1], population: 15600, dailyWasteKg: 9.5, segregationRate: 72 },
  { ...VILLAGES_DATA[2], population: 9800, dailyWasteKg: 8.1, segregationRate: 81 },
  { ...VILLAGES_DATA[3], population: 11200, dailyWasteKg: 6.6, segregationRate: 65 },
  { ...VILLAGES_DATA[4], population: 7400, dailyWasteKg: 3.8, segregationRate: 54 },
];

type FilterKey = 'all' | 'active' | 'pending';

export default function AdminVillagesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const activeCount = VILLAGE_CARDS.filter((v) => v.status === 'Active').length;
  const pendingCount = VILLAGE_CARDS.filter((v) => v.status === 'Pending').length;

  const filtered = VILLAGE_CARDS.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.panchayat.toLowerCase().includes(search.toLowerCase());
    if (filter === 'active') return matchSearch && v.status === 'Active';
    if (filter === 'pending') return matchSearch && v.status === 'Pending';
    return matchSearch;
  });

  const villageSubtitle = `${filtered.length} village${filtered.length === 1 ? '' : 's'} found`;

  if (filtered.length === 0) {
    return (
      <View style={styles.screen}>
        <HeaderBar title="Villages & Collection Points" subtitle="Kaveripattinam Block" showBack />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <EmptyState
            title="No villages found"
            subtitle="Try adjusting your search or filter"
            icon={<MapPin size={24} color={colors.textMuted} />}
            action={{
              label: 'Reset Filters',
              onPress: () => {
                setSearch('');
                setFilter('all');
              },
            }}
          />
        </ScrollView>
        <BottomNav />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <HeaderBar title="Villages & Collection Points" subtitle="Kaveripattinam Block" showBack />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrapper}>
          <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
          <Input
            placeholder="Search village or panchayat..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.chipsRow}>
          <Button
            title={`All (${VILLAGE_CARDS.length})`}
            variant={filter === 'all' ? 'primary' : 'outline'}
            onPress={() => setFilter('all')}
            style={{ flex: 1 }}
          />
          <Button
            title={`Active (${activeCount})`}
            variant={filter === 'active' ? 'primary' : 'outline'}
            onPress={() => setFilter('active')}
            style={{ flex: 1 }}
          />
          <Button
            title={`Pending (${pendingCount})`}
            variant={filter === 'pending' ? 'primary' : 'outline'}
            onPress={() => setFilter('pending')}
            style={{ flex: 1 }}
          />
        </View>

        <SectionHeader
          title="Village Directory"
          subtitle={villageSubtitle}
        />

        {filtered.map((village) => (
          <TouchableOpacity
            key={village.id}
            style={styles.itemContainer}
            onPress={() => router.push(`/(admin)/villages/${village.id}`)}
            activeOpacity={0.8}
          >
            <Card padding={14} shadow="md">
              <View style={styles.cardTop}>
                <View style={styles.titleArea}>
                  <Text style={styles.villageTitle}>{village.name}</Text>
                  <Text style={styles.panchayatText}>{village.panchayat}</Text>
                </View>
                <StatusBadge
                  variant={village.status === 'Active' ? 'success' : 'warning'}
                  small
                >
                  {village.status}
                </StatusBadge>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricCol}>
                  <Text style={styles.metricVal}>{village.population.toLocaleString()}</Text>
                  <Text style={styles.metricSub}>Population</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricCol}>
                  <Text style={styles.metricVal}>{village.dailyWasteKg} kg/day</Text>
                  <Text style={styles.metricSub}>Daily Waste</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricCol}>
                  <Text style={styles.metricVal}>{village.monthlyMlpKg} kg</Text>
                  <Text style={styles.metricSub}>MLP This Month</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricCol}>
                  <Text style={styles.metricVal}>{village.segregationRate}%</Text>
                  <Text style={styles.metricSub}>Segregation Rate</Text>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.metaPill}>
                  <Layers size={12} color={colors.textSecondary} />
                  <Text style={styles.metaPillText}>{village.wardCount} Wards</Text>
                </View>
                <View style={styles.metaPill}>
                  <MapPin size={12} color={colors.textSecondary} />
                  <Text style={styles.metaPillText}>
                    {village.collectionPointsCount} Collection Points
                  </Text>
                </View>
                <View style={styles.rightArrow}>
                  <ChevronRight size={16} color={colors.textMuted} />
                </View>
              </View>

              <View style={styles.trendRow}>
                <Text style={styles.trendLabel}>Segregation Trend</Text>
                <TrendingUp size={14} color="#15803d" />
                <Text style={styles.trendValue}>+{village.growthPercentage}% vs last month</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

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
  searchWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 40,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  itemContainer: {
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
  },
  villageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  panchayatText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8faf9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 4,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metricSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaPillText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  rightArrow: {
    marginLeft: 8,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  trendLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
});
