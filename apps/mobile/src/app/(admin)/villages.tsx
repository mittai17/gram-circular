import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { VILLAGES_DATA } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import { Search, MapPin, Layers, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react-native';

export default function AdminVillagesScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all');

  const filteredVillages = VILLAGES_DATA.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'active') return matchesSearch && v.status === 'Active';
    if (filter === 'pending') return matchesSearch && v.status === 'Pending';
    return matchesSearch;
  });

  return (
    <View style={styles.screen}>
      <HeaderBar title="Villages Directory" subtitle="Kaveripattinam Block" showBack />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search village..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.chipsRow}>
          <TouchableOpacity
            style={[styles.chip, filter === 'all' && styles.activeChip]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.chipText, filter === 'all' && styles.activeChipText]}>
              All 28
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, filter === 'active' && styles.activeChip]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.chipText, filter === 'active' && styles.activeChipText]}>
              Active 24
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, filter === 'pending' && styles.activeChip]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.chipText, filter === 'pending' && styles.activeChipText]}>
              Pending 4
            </Text>
          </TouchableOpacity>
        </View>

        {/* Villages List */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filteredVillages.map((village) => (
            <View key={village.id} style={styles.villageCard}>
              <View style={styles.cardTop}>
                <View style={styles.titleArea}>
                  <Text style={styles.villageTitle}>{village.name}</Text>
                  <Text style={styles.panchayatText}>{village.panchayat}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    village.status === 'Active' ? styles.statusActive : styles.statusPending,
                  ]}
                >
                  {village.status === 'Active' ? (
                    <CheckCircle2 size={12} color="#15803d" />
                  ) : (
                    <Clock size={12} color="#b45309" />
                  )}
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: village.status === 'Active' ? '#15803d' : '#b45309' },
                    ]}
                  >
                    {village.status}
                  </Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricCol}>
                  <Text style={styles.metricVal}>{village.monthlyTotalKg} kg</Text>
                  <Text style={styles.metricSub}>This month</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricCol}>
                  <Text style={styles.metricVal}>{village.monthlyMlpKg} kg</Text>
                  <Text style={styles.metricSub}>MLP collected</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricCol}>
                  <View style={styles.growthBadge}>
                    <ArrowUpRight size={12} color="#15803d" />
                    <Text style={styles.growthText}>+{village.growthPercentage}%</Text>
                  </View>
                  <Text style={styles.metricSub}>vs Last month</Text>
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
              </View>
            </View>
          ))}

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
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
  villageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  statusActive: {
    backgroundColor: '#ecfdf5',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faf9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
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
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  growthText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
  },
  cardBottom: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaPillText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
