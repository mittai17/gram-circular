import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { BottomNav } from '../../components/common/BottomNav';
import { MiniBarChart } from '../../components/charts/MiniBarChart';
import { ADMIN_STATS, VILLAGES_DATA, WORKER_ROUTE } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  MapPin,
  Trash2,
  TrendingUp,
  Truck,
  ArrowUpRight,
  ChevronRight,
  FileText,
  Users,
  CheckCircle2,
} from 'lucide-react-native';

export default function AdminDashboard() {
  const router = useRouter();

  const chartData = ADMIN_STATS.collectionTrends.map((item) => ({
    label: item.day,
    value: item.total,
    highlight: item.day === 'Sat',
  }));

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="Panchayat Admin"
        subtitle="Kaveripattinam Block Union"
      />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top 2 Quick Counters */}
        <View style={styles.topCountersRow}>
          <TouchableOpacity
            style={styles.topCounterCard}
            onPress={() => router.push('/(admin)/villages')}
            activeOpacity={0.8}
          >
            <View style={[styles.counterIconBox, { backgroundColor: '#e8f5e9' }]}>
              <MapPin size={18} color="#1a5c38" />
            </View>
            <View>
              <Text style={styles.counterNumber}>{ADMIN_STATS.villagesCount}</Text>
              <Text style={styles.counterLabel}>Villages</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topCounterCard}
            onPress={() => router.push('/(admin)/routes')}
            activeOpacity={0.8}
          >
            <View style={[styles.counterIconBox, { backgroundColor: '#eff6ff' }]}>
              <Trash2 size={18} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.counterNumber}>{ADMIN_STATS.collectionPointsCount}</Text>
              <Text style={styles.counterLabel}>Collection Points</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 2 Main KPI Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiTitle}>Total Waste</Text>
              <View style={styles.badgeSuccess}>
                <ArrowUpRight size={12} color="#15803d" />
                <Text style={styles.badgeText}>+{ADMIN_STATS.totalWasteGrowth}%</Text>
              </View>
            </View>
            <Text style={styles.kpiValue}>
              {ADMIN_STATS.totalWasteKg.toLocaleString()} <Text style={styles.kpiUnit}>kg</Text>
            </Text>
            <Text style={styles.kpiSub}>Recorded this week</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }]}>
            <View style={styles.kpiHeader}>
              <Text style={[styles.kpiTitle, { color: '#166534' }]}>MLP Waste</Text>
              <View style={[styles.badgeSuccess, { backgroundColor: '#dcfce7' }]}>
                <ArrowUpRight size={12} color="#15803d" />
                <Text style={styles.badgeText}>+{ADMIN_STATS.mlpWasteGrowth}%</Text>
              </View>
            </View>
            <Text style={[styles.kpiValue, { color: '#14532d' }]}>
              {ADMIN_STATS.mlpWasteKg} <Text style={styles.kpiUnit}>kg</Text>
            </Text>
            <Text style={styles.kpiSub}>Traceable multi-layer</Text>
          </View>
        </View>

        {/* Collection Trend Chart */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardSectionTitle}>Collection Trend</Text>
              <Text style={styles.cardSectionSub}>Daily intake (kg) past 7 days</Text>
            </View>
            <View style={styles.chartBadge}>
              <TrendingUp size={12} color="#15803d" />
              <Text style={styles.chartBadgeText}>Peak 230 kg</Text>
            </View>
          </View>

          <MiniBarChart data={chartData} height={100} />
        </View>

        {/* Route Optimization Live Banner */}
        <View style={styles.routeCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.routeHeaderLeft}>
              <View style={styles.vehiclePill}>
                <Truck size={14} color="#ffffff" />
                <Text style={styles.vehiclePillText}>Vehicle 1</Text>
              </View>
              <Text style={styles.routeStatsText}>
                {WORKER_ROUTE.completedStops}/{WORKER_ROUTE.totalStops} stops • {WORKER_ROUTE.totalDistanceKm} km
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(admin)/routes')}
              style={styles.viewFullBtn}
            >
              <Text style={styles.viewFullBtnText}>Route Map</Text>
              <ChevronRight size={14} color="#1a5c38" />
            </TouchableOpacity>
          </View>

          <View style={styles.stopsPreviewList}>
            {WORKER_ROUTE.stops.slice(0, 3).map((stop, i) => (
              <View key={stop.id} style={styles.stopItemRow}>
                <View style={styles.stopNumCircle}>
                  <Text style={styles.stopNumText}>{i + 1}</Text>
                </View>
                <View style={styles.stopMeta}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopWard}>{stop.ward}</Text>
                </View>
                <Text style={styles.stopWeight}>{stop.weightKg} kg</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Villages Overview Preview */}
        <View style={styles.villagesCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionTitle}>Monitored Villages</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/villages')}>
              <Text style={styles.linkText}>View all {VILLAGES_DATA.length}</Text>
            </TouchableOpacity>
          </View>

          {VILLAGES_DATA.slice(0, 2).map((village) => (
            <TouchableOpacity
              key={village.id}
              style={styles.villageItem}
              onPress={() => router.push('/(admin)/villages')}
            >
              <View style={styles.villageLeft}>
                <Text style={styles.villageName}>{village.name}</Text>
                <Text style={styles.villageSub}>
                  {village.collectionPointsCount} Points • {village.monthlyTotalKg} kg/mo
                </Text>
              </View>
              <View style={styles.villageRight}>
                <View style={styles.activeTag}>
                  <Text style={styles.activeTagText}>Active</Text>
                </View>
                <Text style={styles.growthText}>+{village.growthPercentage}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinksRow}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => router.push('/(admin)/reports')}
          >
            <FileText size={16} color="#1a5c38" />
            <Text style={styles.quickActionText}>Compliance Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => router.push('/(admin)/users')}
          >
            <Users size={16} color="#1a5c38" />
            <Text style={styles.quickActionText}>User Roster</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
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
  topCountersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  topCounterCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  counterLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  kpiUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  kpiSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  badgeText: {
    fontSize: 10,
    color: '#15803d',
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSectionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  chartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chartBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803d',
  },
  routeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  routeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a5c38',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  vehiclePillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  routeStatsText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  viewFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewFullBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a5c38',
  },
  stopsPreviewList: {
    marginTop: 10,
    gap: 8,
  },
  stopItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  stopNumCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stopNumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  stopMeta: {
    flex: 1,
  },
  stopName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  stopWard: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  stopWeight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a5c38',
  },
  villagesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  linkText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  villageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
  },
  villageLeft: {
    flex: 1,
  },
  villageName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  villageSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  villageRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  activeTag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803d',
  },
  growthText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803d',
  },
  quickLinksRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
