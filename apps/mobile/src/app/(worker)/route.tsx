import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import OSMWebViewMap, { RouteStop } from '../../components/map/OSMWebViewMap';
import { LatLng } from '../../lib/osmRouting';
import { WORKER_ROUTE } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import { Truck, MapPin, Play, RefreshCw, ChevronRight } from 'lucide-react-native';

// ---------------------------------------------------------------------------
// Depot / MRF — Tirunelveli region, Tamil Nadu
// ---------------------------------------------------------------------------
const DEPOT: LatLng = { lat: 9.1726, lng: 77.6050 };

// ---------------------------------------------------------------------------
// Worker route stops with real coordinates (OpenStreetMap + OSRM quantum routing)
// ---------------------------------------------------------------------------
const WORKER_ROUTE_STOPS: RouteStop[] = [
  {
    id: 'cp-01',
    name: 'Shanti Nagar Main',
    coordinate: { lat: 9.1850, lng: 77.5980 },
    status: 'COMPLETED',
    sequence: 1,
    fillPercent: 20,
  },
  {
    id: 'cp-02',
    name: 'Panchayat Community Hall',
    coordinate: { lat: 9.1780, lng: 77.6120 },
    status: 'COMPLETED',
    sequence: 2,
    fillPercent: 45,
  },
  {
    id: 'cp-03',
    name: 'Gandhi Street',
    coordinate: { lat: 9.1650, lng: 77.6180 },
    status: 'CURRENT',
    sequence: 3,
    fillPercent: 72,
  },
  {
    id: 'cp-07',
    name: 'School Road',
    coordinate: { lat: 9.1580, lng: 77.6050 },
    status: 'PENDING',
    sequence: 4,
    fillPercent: 88,
  },
  {
    id: 'cp-09',
    name: 'Temple Road',
    coordinate: { lat: 9.1620, lng: 77.5920 },
    status: 'PENDING',
    sequence: 5,
    fillPercent: 60,
  },
  {
    id: 'cp-12',
    name: 'Market Junction',
    coordinate: { lat: 9.1700, lng: 77.5850 },
    status: 'PENDING',
    sequence: 6,
    fillPercent: 95,
  },
];

export default function WorkerRouteScreen() {
  const router = useRouter();

  const completedStops = WORKER_ROUTE_STOPS.filter(
    (s) => s.status === 'COMPLETED'
  ).length;
  const totalStops = WORKER_ROUTE_STOPS.length;
  const progressPercent = Math.round((completedStops / totalStops) * 100);

  return (
    <Screen title="Collection Route" subtitle="OSRM-optimised sequence • OpenStreetMap" showBottomNav>
      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <StatCard
          value={`${WORKER_ROUTE.totalDistanceKm} km`}
          label="Route Distance"
          subtext="OSRM quantum routing"
          iconBg="#eff6ff"
          iconColor="#2563eb"
          trend={`${progressPercent}% complete`}
          trendPositive
        >
          <Truck size={18} />
        </StatCard>
        <StatCard
          value={`${completedStops} / ${totalStops}`}
          label="Stops"
          subtext="Collection points visited"
          iconBg="#f0fdf4"
          iconColor="#15803d"
          trend={progressPercent === 100 ? 'Route finished' : 'In progress'}
          trendPositive
        >
          <MapPin size={18} />
        </StatCard>
        <StatCard
          value="~2.6 h"
          label="Est. Duration"
          subtext="Includes service time"
          iconBg="#f1f5f9"
          iconColor="#475569"
          trend="On schedule"
          trendPositive
        >
          <Play size={18} />
        </StatCard>
      </View>

      {/* OpenStreetMap + OSRM Quantum Route Map */}
      <Card style={styles.mapCard} padding={0}>
        <OSMWebViewMap
          stops={WORKER_ROUTE_STOPS}
          depot={DEPOT}
          showRouting
          height={300}
        />
      </Card>

      {/* Stop Sequence List */}
      <SectionHeader title="Stop Sequence" subtitle="Tap a stop to open collection details" />

      {WORKER_ROUTE_STOPS.map((stop) => {
        const isDone = stop.status === 'COMPLETED';
        const isCurrent = stop.status === 'CURRENT';
        const isPending = stop.status === 'PENDING';

        return (
          <TouchableOpacity
            key={stop.id}
            style={styles.stopRow}
            onPress={() => router.push('/(worker)/stop-detail' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.stopBadge, isDone && styles.badgeDone, isCurrent && styles.badgeCurrent, isPending && styles.badgePending]}>
              <Text style={styles.stopSequenceText}>{stop.sequence}</Text>
            </View>
            <View style={styles.stopMeta}>
              <Text style={styles.stopName}>{stop.name}</Text>
              <Text style={styles.stopStatus}>
                {isDone ? 'Collected' : isCurrent ? 'Current stop' : 'Pending'} • {stop.fillPercent}% fill
              </Text>
            </View>
            <View style={styles.stopRight}>
              <StatusBadge
                variant={isDone ? 'success' : isCurrent ? 'primary' : 'default'}
                small
              >
                {isDone ? 'Done' : isCurrent ? 'Current' : 'Pending'}
              </StatusBadge>
              <ChevronRight size={14} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  mapCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  stopBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#f1f5f9',
  },
  badgeDone: {
    backgroundColor: '#ecfdf5',
  },
  badgeCurrent: {
    backgroundColor: '#eff6ff',
  },
  badgePending: {
    backgroundColor: '#f1f5f9',
  },
  stopSequenceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  stopMeta: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stopStatus: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stopRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  bottomSpacer: {
    height: 20,
  },
});
