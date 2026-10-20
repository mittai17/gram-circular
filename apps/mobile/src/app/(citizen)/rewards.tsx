import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { colors } from '../../theme/colors';
import { CITIZEN_REPORTS } from '../../lib/mock-data';
import { CitizenBinReport } from '../../types';
import {
  Award,
  Sparkles,
  ShoppingBag,
  Gift,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react-native';

const CITIZEN_PRIMARY = colors.roles.citizen.primary; // #d97706
const CITIZEN_LIGHT = colors.roles.citizen.light; // #fef3c7

const REWARD_VOUCHERS: { id: string; title: string; costPts: number; source: string; validTill: string; icon: any; color: string; light: string }[] = [
  {
    id: 'v-1',
    title: 'Free 5kg Organic Compost Bag',
    costPts: 50,
    source: 'Kaveripattinam Block Compost Center',
    validTill: '31 Dec 2026',
    icon: Leaf,
    color: '#15803d',
    light: '#ecfdf5',
  },
  {
    id: 'v-2',
    title: '₹100 Eco-Store Voucher',
    costPts: 100,
    source: 'Panchayat Cooperative Mart',
    validTill: '15 Nov 2026',
    icon: Gift,
    color: '#7c3aed',
    light: '#f5f3ff',
  },
  {
    id: 'v-3',
    title: 'Indigenous Tree Sapling Kit',
    costPts: 120,
    source: 'Tamil Nadu Green Mission Nursery',
    validTill: '30 Nov 2026',
    icon: Sparkles,
    color: CITIZEN_PRIMARY,
    light: CITIZEN_LIGHT,
  },
];

const TRANSACTIONS: { id: string; title: string; points: number; date: string; type: 'earned' | 'redeemed' }[] = [
  { id: 't-1', title: 'Bin Report - Gandhi Street', points: 25, date: '16 Oct 2026', type: 'earned' },
  { id: 't-2', title: 'MLP Segregation Bonus', points: 10, date: '15 Oct 2026', type: 'earned' },
  { id: 't-3', title: 'Wet Waste Drop-off', points: 15, date: '12 Oct 2026', type: 'earned' },
  { id: 't-4', title: 'Compost Voucher Redeem', points: -50, date: '10 Oct 2026', type: 'redeemed' },
];

const LEADERBOARD: { id: string; name: string; points: number; rank: number }[] = [
  { id: 'l-1', name: 'Karthik S', points: 125, rank: 1 },
  { id: 'l-2', name: 'Meena R', points: 98, rank: 2 },
  { id: 'l-3', name: 'Arun P', points: 76, rank: 3 },
];

export default function CitizenRewardsScreen() {
  const router = useRouter();
  const currentPoints = 125;

  const handleRedeem = (title: string, cost: number) => {
    if (currentPoints < cost) {
      Alert.alert('Not Enough Points', `You need ${cost - currentPoints} more points to redeem "${title}".`);
      return;
    }
    Alert.alert(
      'Voucher Generated!',
      `Voucher code: GP-ECO-${Math.floor(1000 + Math.random() * 9000)}. Show this at the Panchayat office.`,
      [
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  return (
    <Screen title="Swachh Rewards" subtitle="Citizen Eco-Credit Wallet">
      {/* Points Balance */}
      <StatCard
        value="125 pts"
        label="My Green Rewards"
        subtext="Redeem for eco-vouchers & compost"
        icon={<Award size={20} color={CITIZEN_PRIMARY} />}
        iconBg={CITIZEN_LIGHT}
        iconColor={CITIZEN_PRIMARY}
      />

      {/* Redeemable Rewards */}
      <SectionHeader title="Redeem Your Points" subtitle="Available eco-vouchers" />
      <View style={styles.vouchersRow}>
        {REWARD_VOUCHERS.map((voucher) => {
          const IconComp = voucher.icon;
          const canAfford = currentPoints >= voucher.costPts;
          return (
            <Card key={voucher.id} padding={14} style={styles.voucherCard}>
              <View style={styles.voucherTop}>
                <View style={[styles.voucherIcon, { backgroundColor: voucher.light }]}>
                  <IconComp size={22} color={voucher.color} />
                </View>
                <View style={styles.voucherMeta}>
                  <Text style={styles.voucherTitle}>{voucher.title}</Text>
                  <Text style={styles.voucherSource}>{voucher.source}</Text>
                  <Text style={styles.voucherExpiry}>Valid till {voucher.validTill}</Text>
                </View>
                <View style={[styles.costBadge, !canAfford && styles.costBadgeDisabled]}>
                  <Text style={[styles.costText, !canAfford && { color: colors.textMuted }]}>
                    {voucher.costPts} pts
                  </Text>
                </View>
              </View>
              <Button
                title={canAfford ? 'Redeem Voucher' : 'Need More Points'}
                variant="primary"
                style={{
                  backgroundColor: canAfford ? CITIZEN_PRIMARY : '#cbd5e1',
                  borderColor: canAfford ? CITIZEN_PRIMARY : '#cbd5e1',
                }}
                fullWidth
                textStyle={{ color: canAfford ? '#ffffff' : '#94a3b8' }}
                disabled={!canAfford}
                onPress={() => handleRedeem(voucher.title, voucher.costPts)}
              />
            </Card>
          );
        })}
      </View>

      {/* Transaction History */}
      <SectionHeader title="Transaction History" subtitle="Recent eco-points activity" />
      <View style={styles.transactionsList}>
        {TRANSACTIONS.map((tx) => (
          <Card key={tx.id} padding={12} style={styles.transactionCard}>
            <View style={styles.transactionRow}>
              <View style={styles.transactionMeta}>
                <Text style={styles.transactionTitle}>{tx.title}</Text>
                <Text style={styles.transactionDate}>{tx.date}</Text>
              </View>
              <View style={styles.transactionPoints}>
                <View style={[styles.pointsBadge, tx.type === 'earned' && styles.pointsEarned]}>
                  <Text style={styles.pointsText}>{tx.points > 0 ? '+' : ''}{tx.points} pts</Text>
                </View>
                <CheckCircle2 size={12} color="#15803d" />
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Leaderboard Preview */}
      <SectionHeader
        title="Village Leaderboard Preview"
        subtitle="Top recyclers in Shanti Nagar"
        viewAllLabel="See All"
        onViewAll={() => router.push('/(citizen)/village-progress')}
      />
      <View style={styles.leaderboardList}>
        {LEADERBOARD.map((user) => (
          <Card key={user.id} padding={12} style={styles.leaderboardCard}>
            <View style={styles.leaderboardRow}>
              <Text style={[styles.rank, user.rank === 1 && styles.rankTop]}>{user.rank}</Text>
              <View style={[styles.avatar, user.rank === 1 && styles.avatarTop]}>
                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
              </View>
              <View style={styles.leaderboardMeta}>
                <Text style={styles.leaderboardName}>{user.name}</Text>
                <Text style={styles.leaderboardSub}>Rank #{user.rank} • Villager</Text>
              </View>
              <Text style={styles.leaderboardPoints}>{user.points} pts</Text>
              <ChevronRight size={14} color={colors.textMuted} />
            </View>
          </Card>
        ))}
      </View>

      {/* Coming Soon Skeleton Placeholders */}
      <SectionHeader title="New Rewards Coming Soon" subtitle="Redeem your points for exciting eco-rewards" />
      <View style={styles.comingSoon}>
        <Skeleton width={150} height={170} style={styles.skeletonCard} />
        <Skeleton width={150} height={170} style={styles.skeletonCard} />
        <Skeleton width={150} height={170} style={styles.skeletonCard} />
      </View>

      <EmptyState
        title="No transactions yet"
        subtitle="Start reporting bins and segregating waste to earn points."
        icon={<Clock size={40} color={colors.textMuted} />}
        action={{ label: 'Report a Bin', onPress: () => router.push('/(citizen)/report-bin') }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  vouchersRow: {
    gap: 10,
  },
  voucherCard: {},
  voucherTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  voucherIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherMeta: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  voucherSource: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  voucherExpiry: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  costBadge: {
    backgroundColor: CITIZEN_LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  costBadgeDisabled: {
    backgroundColor: '#e2e8f0',
  },
  costText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#b45309',
  },
  transactionsList: {
    gap: 8,
  },
  transactionCard: {},
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionMeta: {},
  transactionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  transactionDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  transactionPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsEarned: {
    backgroundColor: '#ecfdf5',
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
  },
  leaderboardList: {
    gap: 8,
  },
  leaderboardCard: {},
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rank: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  rankTop: {
    color: CITIZEN_PRIMARY,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTop: {
    backgroundColor: CITIZEN_LIGHT,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  leaderboardMeta: {
    flex: 1,
    marginHorizontal: 8,
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
  leaderboardPoints: {
    fontSize: 13,
    fontWeight: '800',
    color: CITIZEN_PRIMARY,
  },
  comingSoon: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  skeletonCard: {
    width: 150,
    height: 170,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
});
