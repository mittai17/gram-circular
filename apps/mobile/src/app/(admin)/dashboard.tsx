import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { BottomNav } from '../../components/common/BottomNav';
import { Card, Button, StatCard, StatusBadge, SectionHeader } from '../../components/ui';
import { MiniBarChart } from '../../components/charts/MiniBarChart';
import { ADMIN_STATS, VILLAGES_DATA, WORKER_ROUTE } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  MapPin,
  Trash2,
  Truck,
  FileText,
  Users,
  ChevronRight,
  Layers,
  Navigation,
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
      <HeaderBar title="Panchayat Admin" subtitle="Kaveripattinam Block Union" />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Quick Counters */}
        <View style={styles.row}>
          <StatCard
            value={String(ADMIN_STATS.villagesCount)}
            label="Villages"
            subtext="Monitored across block"
            icon={<MapPin size={20} color={colors.primary} />}
            iconBg={colors.roles.admin.light}
            iconColor={colors.primary}
            style={{ flex: 1 }}
          />
          <StatCard
            value={String(ADMIN_STATS.collectionPointsCount)}
            label="Collection Points"
            subtext="Active drop-off locations"
            icon={<Trash2 size={20} color="#2563eb" />}
            iconBg="#eff6ff"
            iconColor="#2563eb"
            style={{ flex: 1 }}
          />
        </View>

        {/* KPI Cards */}
        <View style={styles.row}>
          <StatCard
            value={`${ADMIN_STATS.totalWasteKg.toLocaleString()} kg`}
            label="Total Waste"
            subtext="Recorded this week"
            trend={`+${ADMIN_STATS.totalWasteGrowth}%`}
            trendPositive
            icon={<Trash2 size={20} color="#15803d" />}
            iconBg="#ecfdf5"
            iconColor="#15803d"
            style={{ flex: 1 }}
          />
          <StatCard
            value={`${ADMIN_STATS.mlpWasteKg} kg`}
            label="MLP Waste"
            subtext="Traceable multi-layer"
            trend={`+${ADMIN_STATS.mlpWasteGrowth}%`}
            trendPositive
            icon={<Layers size={20} color="#166534" />}
            iconBg="#f0fdf4"
            iconColor="#166534"
            style={{ flex: 1 }}
          />
        </View>

        {/* Collection Trend Chart */}
        <SectionHeader
          title="Collection Trend"
          subtitle="Daily intake (kg) — past 7 days"
        />
        <Card padding={16} shadow="md">
          <MiniBarChart
            data={chartData}
            height={110}
            barColor="#2d8653"
            highlightColor={colors.primary}
          />
        </Card>

        {/* Route Optimization Live Banner */}
        <SectionHeader
          title="Route Optimization"
          subtitle="Live vehicle status"
        />
        <Card padding={14} shadow="md">
          <View style={styles.routeHeader}>
            <View style={styles.routeIconBox}>
              <Truck size={20} color="#ffffff" />
            </View>
            <View style={styles.routeMeta}>
              <Text style={styles.routeVehicle}>{WORKER_ROUTE.vehicleNumber}</Text>
              <Text style={styles.routeDriver}>
                {WORKER_ROUTE.driverName} • {WORKER_ROUTE.completedStops}/{WORKER_ROUTE.totalStops} stops
              </Text>
            </View>
            <StatusBadge variant="success" small>
              Optimized
            </StatusBadge>
          </View>
          <View style={styles.routeStatsRow}>
            <View style={styles.routeStat}>
              <Text style={styles.routeStatValue}>{WORKER_ROUTE.totalDistanceKm} km</Text>
              <Text style={styles.routeStatLabel}>Total Distance</Text>
            </View>
            <View style={styles.routeStatDivider} />
            <View style={styles.routeStat}>
              <Text style={styles.routeStatValue}>~5.0 km</Text>
              <Text style={styles.routeStatLabel}>Avg per Stop</Text>
            </View>
          </View>
          <Button
            title="View Route Map"
            variant="outline"
            style={{ flex: 1, marginTop: 8 }}
            onPress={() => router.push('/(admin)/routes')}
            leftIcon={<ChevronRight size={14} color={colors.primary} />}
          />
        </Card>

        {/* Monitored Villages Preview */}
        <SectionHeader
          title="Monitored Villages"
          subtitle="Top performing villages"
          onViewAll={() => router.push('/(admin)/villages')}
          viewAllLabel="View All"
        />
        <Card padding={0} shadow="none">
          {VILLAGES_DATA.slice(0, 3).map((village) => (
            <View key={village.id} style={styles.villageRow}>
              <View style={styles.villageInfo}>
                <Text style={styles.villageName}>{village.name}</Text>
                <Text style={styles.villageSub}>
                  {village.collectionPointsCount} Points • {village.monthlyTotalKg} kg/mo
                </Text>
              </View>
              <View style={styles.villageStatus}>
                <StatusBadge
                  variant={village.status === 'Active' ? 'success' : 'warning'}
                  small
                >
                  {village.status}
                </StatusBadge>
                <Text style={styles.villageGrowth}>+{village.growthPercentage}%</Text>
              </View>
            </View>
          ))}
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.viewAllRow}
            onPress={() => router.push('/(admin)/villages')}
          >
            <MapPin size={14} color={colors.primary} />
            <Text style={styles.viewAllText}>View All {VILLAGES_DATA.length} Villages</Text>
            <ChevronRight size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Quick Links */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.row}>
          <Button
            title="Dynamic Routing"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => router.push('/(admin)/dynamic-routing')}
            leftIcon={<Navigation size={16} color={colors.primary} />}
          />
          <Button
            title="O&M Ledger"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => router.push('/(admin)/sustainability')}
            leftIcon={<FileText size={16} color={colors.primary} />}
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Compliance Reports"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => router.push('/(admin)/reports')}
            leftIcon={<FileText size={16} color={colors.primary} />}
          />
          <Button
            title="User Roster"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => router.push('/(admin)/users')}
            leftIcon={<Users size={16} color={colors.primary} />}
          />
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
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  routeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeMeta: {
    flex: 1,
  },
  routeVehicle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  routeDriver: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  routeStatsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  routeStat: {
    flex: 1,
    alignItems: 'center',
  },
  routeStatDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  routeStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  routeStatLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  villageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  villageInfo: {
    flex: 1,
  },
  villageName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  villageSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  villageStatus: {
    alignItems: 'flex-end',
    gap: 6,
  },
  villageGrowth: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
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
});
