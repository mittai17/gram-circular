import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { BUYER_AVAILABLE_BATCHES, BUYER_PURCHASE_HISTORY } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Factory,
  ShoppingBag,
  Calendar,
  Layers,
  IndianRupee,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Clock,
} from 'lucide-react-native';

export default function BuyerDashboard() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="GreenCycle Pvt Ltd"
        subtitle="Recycler Portal • Hosur Industrial Area"
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 4 KPI Cards Grid */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(buyer)/available-batches')}
            activeOpacity={0.8}
          >
            <View style={[styles.kpiIcon, { backgroundColor: '#f5f3ff' }]}>
              <ShoppingBag size={18} color="#7c3aed" />
            </View>
            <Text style={styles.kpiNumber}>12</Text>
            <Text style={styles.kpiLabel}>Available Batches</Text>
            <Text style={styles.kpiSub}>2.1 tons ready</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(buyer)/batch-detail')}
            activeOpacity={0.8}
          >
            <View style={[styles.kpiIcon, { backgroundColor: '#eff6ff' }]}>
              <Calendar size={18} color="#2563eb" />
            </View>
            <Text style={styles.kpiNumber}>2</Text>
            <Text style={styles.kpiLabel}>Scheduled Pickups</Text>
            <Text style={styles.kpiSub}>Next: Tomorrow</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(buyer)/receipt-confirm')}
            activeOpacity={0.8}
          >
            <View style={[styles.kpiIcon, { backgroundColor: '#ecfdf5' }]}>
              <Layers size={18} color="#15803d" />
            </View>
            <Text style={styles.kpiNumber}>412 kg</Text>
            <Text style={styles.kpiLabel}>Total Received</Text>
            <Text style={styles.kpiSub}>Oct 2026</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(buyer)/procurement-chart')}
            activeOpacity={0.8}
          >
            <View style={[styles.kpiIcon, { backgroundColor: '#fef3c7' }]}>
              <IndianRupee size={18} color="#b45309" />
            </View>
            <Text style={styles.kpiNumber}>₹48.5k</Text>
            <Text style={styles.kpiLabel}>Monthly Spend</Text>
            <Text style={[styles.kpiSub, { color: '#15803d' }]}>+18% volume</Text>
          </TouchableOpacity>
        </View>

        {/* Action Banners */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionBanner}
            onPress={() => router.push('/(buyer)/available-batches')}
            activeOpacity={0.85}
          >
            <View style={styles.actionBannerLeft}>
              <ShoppingBag size={22} color="#ffffff" />
              <View>
                <Text style={styles.actionBannerTitle}>Browse MLP & Polymer Batches</Text>
                <Text style={styles.actionBannerSub}>Filter by Grade A purity & block locations</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBanner, { backgroundColor: '#1a5c38' }]}
            onPress={() => router.push('/(buyer)/receipt-confirm')}
            activeOpacity={0.85}
          >
            <View style={styles.actionBannerLeft}>
              <FileCheck2 size={22} color="#ffffff" />
              <View>
                <Text style={styles.actionBannerTitle}>Confirm Truck Delivery Receipt</Text>
                <Text style={styles.actionBannerSub}>Weighbridge verification & proof upload</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Recent Available Batches */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured MLP Batches</Text>
          <TouchableOpacity onPress={() => router.push('/(buyer)/available-batches')}>
            <Text style={styles.viewAllText}>See All (12)</Text>
          </TouchableOpacity>
        </View>

        {BUYER_AVAILABLE_BATCHES.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.batchCard}
            onPress={() => router.push('/(buyer)/batch-detail')}
            activeOpacity={0.8}
          >
            <View style={styles.batchLeft}>
              <View style={styles.polymerTag}>
                <Text style={styles.polymerText}>{item.wasteType}</Text>
              </View>
              <View style={styles.batchMeta}>
                <Text style={styles.batchId}>{item.batchNumber}</Text>
                <Text style={styles.batchOrigin}>{item.origin}</Text>
              </View>
            </View>

            <View style={styles.batchRight}>
              <Text style={styles.batchWeight}>{item.weightKg} kg</Text>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>Grade {item.grade}</Text>
              </View>
            </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  kpiLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  kpiSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 18,
  },
  actionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    padding: 14,
  },
  actionBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionBannerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  actionBannerSub: {
    color: '#e9d5ff',
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7c3aed',
  },
  batchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  batchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  polymerTag: {
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  polymerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7c3aed',
  },
  batchMeta: {
    flex: 1,
  },
  batchId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  batchOrigin: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  batchWeight: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  gradeBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  gradeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
});
