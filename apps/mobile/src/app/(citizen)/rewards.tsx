import React from 'react';
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
import { colors } from '../../theme/colors';
import {
  Award,
  Sparkles,
  ShoppingBag,
  Gift,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Share2,
} from 'lucide-react-native';

const REWARD_VOUCHERS = [
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
    color: '#d97706',
    light: '#fef3c7',
  },
];

export default function CitizenRewardsScreen() {
  const currentPoints = 125;

  const handleRedeem = (title: string, cost: number) => {
    Alert.alert(
      'Redeem Reward',
      `Redeem "${title}" for ${cost} Eco-Points? Your QR voucher will be generated.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Redeem',
          onPress: () =>
            Alert.alert(
              'Voucher Generated!',
              `Voucher code: GP-ECO-${Math.floor(1000 + Math.random() * 9000)}. Show this at the Panchayat office.`
            ),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Green Rewards" subtitle="Citizen Eco-Credit Wallet" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Points Badge Card */}
        <View style={styles.pointsHero}>
          <View style={styles.awardCircle}>
            <Award size={44} color="#d97706" />
          </View>
          <Text style={styles.pointsAmount}>{currentPoints}</Text>
          <Text style={styles.pointsUnit}>Eco-Reward Points</Text>

          {/* 3 Step Progression */}
          <View style={styles.stepsRow}>
            <View style={styles.stepCol}>
              <View style={[styles.stepDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.stepTitle}>Recycle</Text>
              <Text style={styles.stepSub}>Segregate</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepCol}>
              <View style={[styles.stepDot, { backgroundColor: '#2563eb' }]} />
              <Text style={styles.stepTitle}>Report</Text>
              <Text style={styles.stepSub}>Full Bins</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepCol}>
              <View style={[styles.stepDot, { backgroundColor: '#d97706' }]} />
              <Text style={styles.stepTitle}>Participate</Text>
              <Text style={styles.stepSub}>Gram Sabha</Text>
            </View>
          </View>
        </View>

        {/* Redeemable Vouchers */}
        <Text style={styles.sectionHeader}>Redeem Your Points</Text>

        {REWARD_VOUCHERS.map((voucher) => {
          const IconComp = voucher.icon;
          const canAfford = currentPoints >= voucher.costPts;

          return (
            <View key={voucher.id} style={styles.voucherCard}>
              <View style={styles.voucherTop}>
                <View style={[styles.voucherIcon, { backgroundColor: voucher.light }]}>
                  <IconComp size={24} color={voucher.color} />
                </View>

                <View style={styles.voucherMeta}>
                  <Text style={styles.voucherTitle}>{voucher.title}</Text>
                  <Text style={styles.voucherSource}>{voucher.source}</Text>
                  <Text style={styles.voucherExpiry}>Valid till {voucher.validTill}</Text>
                </View>

                <View style={styles.costBadge}>
                  <Text style={styles.costText}>{voucher.costPts} pts</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.redeemBtn, !canAfford && styles.redeemDisabled]}
                onPress={() => handleRedeem(voucher.title, voucher.costPts)}
                disabled={!canAfford}
                activeOpacity={0.8}
              >
                <Text style={styles.redeemBtnText}>
                  {canAfford ? 'Redeem Voucher' : 'Need More Points'}
                </Text>
                <ArrowRight size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
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
  pointsHero: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  awardCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pointsAmount: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  pointsUnit: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
  },
  stepCol: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepSub: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
  },
  stepLine: {
    width: 28,
    height: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  voucherCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  voucherTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  voucherIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  costText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#b45309',
  },
  redeemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1a5c38',
    borderRadius: 10,
    paddingVertical: 10,
  },
  redeemDisabled: {
    backgroundColor: '#94a3b8',
  },
  redeemBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
