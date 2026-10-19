import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { colors } from '../../theme/colors';
import {
  TrendingUp,
  MapPin,
  Award,
  Layers,
  Leaf,
  Users,
  ChevronRight,
} from 'lucide-react-native';

const WARDS = [
  { id: 'w-1', name: 'Ward 1 (Temple & Main Road)', totalKg: 94.2, mlpKg: 28.5, rank: '1st' },
  { id: 'w-2', name: 'Ward 2 (Gandhi Street)', totalKg: 86.0, mlpKg: 24.0, rank: '2nd' },
  { id: 'w-3', name: 'Ward 3 (School Junction)', totalKg: 78.5, mlpKg: 20.4, rank: '3rd' },
  { id: 'w-4', name: 'Ward 4 (Market & Colony)', totalKg: 61.8, mlpKg: 13.5, rank: '4th' },
];

export default function CitizenVillageProgressScreen() {
  return (
    <View style={styles.screen}>
      <HeaderBar title="Village Progress" subtitle="Shanti Nagar Cleanliness Drive" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* District Rank Hero */}
        <View style={styles.rankCard}>
          <View style={styles.rankBadge}>
            <Award size={22} color="#ffffff" />
          </View>
          <View style={styles.rankMeta}>
            <Text style={styles.rankTitle}>Rank #2 in District</Text>
            <Text style={styles.rankSub}>Kaveripattinam Block Clean Village Trophy</Text>
          </View>
        </View>

        {/* 2 Main Metric Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Waste Collected</Text>
            <Text style={styles.kpiVal}>320.5 kg</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={12} color="#15803d" />
              <Text style={styles.trendText}>+12% vs last month</Text>
            </View>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: '#f0fdf4' }]}>
            <Text style={[styles.kpiLabel, { color: '#166534' }]}>MLP Recycled</Text>
            <Text style={[styles.kpiVal, { color: '#14532d' }]}>86.4 kg</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={12} color="#15803d" />
              <Text style={styles.trendText}>+18% segregation</Text>
            </View>
          </View>
        </View>

        {/* Ward Breakdown Table */}
        <Text style={styles.sectionHeader}>Ward-by-Ward Segregation Leaderboard</Text>

        {WARDS.map((w) => (
          <View key={w.id} style={styles.wardCard}>
            <View style={styles.wardRankBadge}>
              <Text style={styles.wardRankText}>{w.rank}</Text>
            </View>

            <View style={styles.wardMeta}>
              <Text style={styles.wardName}>{w.name}</Text>
              <Text style={styles.wardKg}>
                {w.totalKg} kg Total • <Text style={{ color: '#15803d', fontWeight: '700' }}>{w.mlpKg} kg MLP</Text>
              </Text>
            </View>
          </View>
        ))}

        {/* Community Milestone */}
        <View style={styles.milestoneCard}>
          <Leaf size={20} color="#15803d" />
          <View style={styles.milestoneMeta}>
            <Text style={styles.milestoneTitle}>Next Milestone: 100 kg MLP Target</Text>
            <Text style={styles.milestoneSub}>
              Only 13.6 kg left to unlock community solar garden streetlights grant!
            </Text>
          </View>
        </View>

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
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1a5c38',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankMeta: {
    flex: 1,
  },
  rankTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  rankSub: {
    color: '#a7f3d0',
    fontSize: 11,
    marginTop: 2,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  trendText: {
    fontSize: 10,
    color: '#15803d',
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  wardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  wardRankBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wardRankText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1a5c38',
  },
  wardMeta: {
    flex: 1,
  },
  wardName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  wardKg: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  milestoneMeta: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803d',
  },
  milestoneSub: {
    fontSize: 10,
    color: '#166534',
    marginTop: 2,
  },
});
