import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { colors } from '../../theme/colors';
import { VILLAGES_DATA } from '../../lib/mock-data';
import { VillageSummary } from '../../types';
import {
  TrendingUp,
  MapPin,
  Award,
  Layers,
  Leaf,
  Users,
  ChevronRight,
  Clock,
} from 'lucide-react-native';

const CITIZEN_PRIMARY = colors.roles.citizen.primary; // #d97706

const village = VILLAGES_DATA[0];

export default function CitizenVillageProgressScreen() {
  const router = useRouter();

  return (
    <Screen title="Village Progress" subtitle="Shanti Nagar Cleanliness Drive">
      {/* District Rank Hero */}
      <Card padding={14} style={styles.rankCard}>
        <View style={styles.rankBadge}>
          <Award size={22} color="#ffffff" />
        </View>
        <View style={styles.rankMeta}>
          <Text style={styles.rankTitle}>Rank #2 in District</Text>
          <Text style={styles.rankSub}>Kaveripattinam Block Clean Village Trophy</Text>
        </View>
        <View style={styles.rankChip}>
          <TrendingUp size={12} color="#ffffff" />
          <Text style={styles.rankChipText}>+12% vs last month</Text>
        </View>
      </Card>

      {/* Main Metrics */}
      <View style={styles.kpiRow}>
        <StatCard
          value="320.5 kg"
          label="Total Waste Collected"
          subtext="This month • All streams"
          icon={<Layers size={18} color="#1a5c38" />}
          iconBg="#f0fdf4"
          iconColor="#166534"
          trend="+12%"
          trendPositive
        />
        <StatCard
          value="86.4 kg"
          label="MLP Diverted"
          subtext="Multi-layer plastic kept out of landfill"
          icon={<Leaf size={18} color="#15803d" />}
          iconBg="#ecfdf5"
          iconColor="#15803d"
          trend="+18%"
          trendPositive
        />
      </View>

      {/* Village Leaderboard */}
      <SectionHeader
        title="Village Leaderboard"
        subtitle="Monthly segregation by village"
        viewAllLabel="See All"
        onViewAll={() => router.push('/(citizen)/village-progress')}
      />
      <View style={styles.leaderboardList}>
        {(VILLAGES_DATA as VillageSummary[]).map((v) => (
          <TouchableOpacity
            key={v.id}
            style={styles.leaderboardCard}
            onPress={() => {}}
            activeOpacity={0.85}
          >
            <View style={styles.leaderboardRow}>
              <View style={styles.rankBadgeInner}>
                <Text style={styles.rankText}>{getRankEmoji(VILLAGES_DATA.indexOf(v) + 1)}</Text>
              </View>
              <View style={styles.leaderboardMeta}>
                <Text style={styles.leaderboardName}>{v.name}</Text>
                <Text style={styles.leaderboardSub}>
                  {v.wardCount} wards • {v.collectionPointsCount} points
                </Text>
              </View>
              <View style={styles.leaderboardValues}>
                <Text style={styles.leaderboardValue}>{v.monthlyTotalKg} kg</Text>
                <Text style={styles.leaderboardValueLabel}>Total</Text>
                <Text style={[styles.leaderboardValue, { color: CITIZEN_PRIMARY }]}>{v.monthlyMlpKg} kg</Text>
                <Text style={styles.leaderboardValueLabel}>MLP</Text>
              </View>
            </View>
            <View style={styles.growthRow}>
              <TrendingUp size={10} color={v.growthPercentage >= 0 ? '#15803d' : '#b91c1c'} />
              <Text style={[styles.growthText, { color: v.growthPercentage >= 0 ? '#15803d' : '#b91c1c' }]}>
                {v.growthPercentage >= 0 ? '+' : ''}{v.growthPercentage}% vs last month
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Community Impact */}
      <SectionHeader title="Community Impact" subtitle="Shanti Nagar milestones" />
      <View style={styles.impactRow}>
        <Card padding={14} style={styles.impactCard}>
          <Text style={styles.impactValue}>100 kg</Text>
          <Text style={styles.impactLabel}>MLP Target</Text>
          <Text style={styles.impactSub}>13.6 kg remaining</Text>
        </Card>
        <Card padding={14} style={styles.impactCard}>
          <Text style={styles.impactValue}>28</Text>
          <Text style={styles.impactLabel}>Households</Text>
          <Text style={styles.impactSub}>Actively segregating</Text>
        </Card>
      </View>

      {/* Next Milestone */}
      <Card padding={14} style={styles.milestoneCard}>
        <View style={styles.milestoneRow}>
          <Leaf size={20} color="#15803d" />
          <View style={styles.milestoneMeta}>
            <Text style={styles.milestoneTitle}>Next Milestone: 100 kg MLP Target</Text>
            <Text style={styles.milestoneSub}>
              Unlocks community solar garden streetlights grant!
            </Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </View>
      </Card>
    </Screen>
  );
}

function getRankEmoji(rank: number): string {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return String(rank);
  }
}

const styles = StyleSheet.create({
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a5c38',
    borderRadius: 16,
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
  rankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  rankChipText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  leaderboardList: {
    gap: 8,
  },
  leaderboardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rankBadgeInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  leaderboardMeta: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  leaderboardSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  leaderboardValues: {
    alignItems: 'flex-end',
    gap: 2,
  },
  leaderboardValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  leaderboardValueLabel: {
    fontSize: 9,
    color: colors.textMuted,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  growthText: {
    fontSize: 10,
    fontWeight: '700',
  },
  impactRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  impactCard: {
    flex: 1,
    backgroundColor: '#f8faf9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  impactLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 4,
  },
  impactSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
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
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  milestoneMeta: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803d',
  },
  milestoneSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
  },
});
