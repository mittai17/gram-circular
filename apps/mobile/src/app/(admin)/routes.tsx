import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { BottomNav } from '../../components/common/BottomNav';
import { Card, Button, StatusBadge, SectionHeader, EmptyState } from '../../components/ui';
import OSMWebViewMap, { RouteStop as MapRouteStop } from '../../components/map/OSMWebViewMap';
import { WORKER_ROUTE } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import { RouteStop, VehicleRoute } from '../../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  TrendingUp,
  ChevronRight,
} from 'lucide-react-native';

// ---------------------------------------------------------------------------
// Demo data — Tirunelveli / Kovilpatti region, Tamil Nadu
// ---------------------------------------------------------------------------
const DEMO_DEPOT = { lat: 9.1726, lng: 77.6050 }; // MRF / Depot

const DEMO_MAP_STOPS: MapRouteStop[] = [
  { id: 'cp1', name: 'Shanti Nagar CP-01', coordinate: { lat: 9.1850, lng: 77.5980 }, status: 'COMPLETED', sequence: 1, fillPercent: 20 },
  { id: 'cp2', name: 'Gandhi St CP-02',    coordinate: { lat: 9.1780, lng: 77.6120 }, status: 'COMPLETED', sequence: 2, fillPercent: 45 },
  { id: 'cp3', name: 'Kovilpattu CP-03',   coordinate: { lat: 9.1650, lng: 77.6180 }, status: 'CURRENT',   sequence: 3, fillPercent: 72 },
  { id: 'cp4', name: 'Murugan Nagar CP-04',coordinate: { lat: 9.1580, lng: 77.6050 }, status: 'PENDING',   sequence: 4, fillPercent: 88 },
  { id: 'cp5', name: 'Anna Colony CP-05',  coordinate: { lat: 9.1620, lng: 77.5920 }, status: 'PENDING',   sequence: 5, fillPercent: 60 },
  { id: 'cp6', name: 'Perumalpuram CP-06', coordinate: { lat: 9.1700, lng: 77.5850 }, status: 'PENDING',   sequence: 6, fillPercent: 95 },
];


type VehicleStatus = 'Active' | 'Idle' | 'Maintenance';

interface VehicleItem {
  id: string;
  vehicleNumber: string;
  driverName: string;
  capacityKg: number;
  status: VehicleStatus;
  totalStops: number;
  completedStops: number;
  totalDistanceKm: number;
  estimatedTimeMin: number;
  stops: RouteStop[];
}

const VEHICLES: VehicleItem[] = [
  {
    id: 'veh-01',
    vehicleNumber: 'TN-29-BA-4821',
    driverName: 'Ramesh K',
    capacityKg: 500,
    status: 'Active',
    totalStops: WORKER_ROUTE.totalStops,
    completedStops: WORKER_ROUTE.completedStops,
    totalDistanceKm: WORKER_ROUTE.totalDistanceKm,
    estimatedTimeMin: 135,
    stops: WORKER_ROUTE.stops,
  },
  {
    id: 'veh-02',
    vehicleNumber: 'TN-29-BA-4822',
    driverName: 'Lakshmi P',
    capacityKg: 450,
    status: 'Active',
    totalStops: 5,
    completedStops: 5,
    totalDistanceKm: 14.2,
    estimatedTimeMin: 110,
    stops: [],
  },
  {
    id: 'veh-03',
    vehicleNumber: 'TN-29-BA-4823',
    driverName: 'Arun M',
    capacityKg: 600,
    status: 'Idle',
    totalStops: 0,
    completedStops: 0,
    totalDistanceKm: 0,
    estimatedTimeMin: 0,
    stops: [],
  },
];

const STATUS_CONFIG: Record<VehicleStatus, { variant: 'success' | 'warning' | 'error'; label: string }> = {
  Active: { variant: 'success', label: 'Active' },
  Idle: { variant: 'warning', label: 'Idle' },
  Maintenance: { variant: 'error', label: 'Maintenance' },
};

export default function AdminRoutesScreen() {
  const router = useRouter();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('veh-01');

  const selectedVehicle = VEHICLES.find((v) => v.id === selectedVehicleId) ?? VEHICLES[0];
  const completionPct =
    selectedVehicle.totalStops > 0
      ? Math.round((selectedVehicle.completedStops / selectedVehicle.totalStops) * 100)
      : 0;

  if (VEHICLES.length === 0) {
    return (
      <View style={styles.screen}>
        <HeaderBar title="Route Management" subtitle="Vehicle Dispatch & Sequence" showBack />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <EmptyState
            title="No vehicles assigned"
            subtitle="No vehicles are currently registered for route dispatch"
            icon={<Truck size={24} color={colors.textMuted} />}
          />
        </ScrollView>
        <BottomNav />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <HeaderBar title="Route Management" subtitle="Vehicle Dispatch & Sequence" showBack />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Vehicle List */}
        <SectionHeader title="Fleet Vehicles" subtitle={`${VEHICLES.length} vehicles in fleet`} />

        {VEHICLES.map((vehicle) => {
          const isSelected = selectedVehicleId === vehicle.id;
          const statusCfg = STATUS_CONFIG[vehicle.status];
          return (
            <TouchableOpacity
              key={vehicle.id}
              style={[styles.vehicleRow, isSelected && styles.vehicleRowSelected]}
              onPress={() => setSelectedVehicleId(vehicle.id)}
              activeOpacity={0.8}
            >
              <Card padding={14} shadow="md" style={{ borderColor: isSelected ? colors.primary : colors.border }}>
                <View style={styles.vehicleHeader}>
                  <View style={styles.vehicleIconBox}>
                    <Truck size={20} color="#ffffff" />
                  </View>
                  <View style={styles.vehicleMeta}>
                    <Text style={styles.vehicleTitle}>{vehicle.vehicleNumber}</Text>
                    <Text style={styles.vehicleDriver}>
                      {vehicle.driverName} • {vehicle.capacityKg} kg capacity
                    </Text>
                  </View>
                  <StatusBadge variant={statusCfg.variant} small>
                    {statusCfg.label}
                  </StatusBadge>
                </View>

                <View style={styles.vehicleStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{vehicle.completedStops}/{vehicle.totalStops}</Text>
                    <Text style={styles.statLabel}>Stops</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{vehicle.totalDistanceKm} km</Text>
                    <Text style={styles.statLabel}>Distance</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{vehicle.estimatedTimeMin} min</Text>
                    <Text style={styles.statLabel}>Est. Time</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Selected Vehicle Route Detail */}
        <SectionHeader
          title={`Route: ${selectedVehicle.vehicleNumber}`}
          subtitle={`Driver: ${selectedVehicle.driverName} • ${completionPct}% complete`}
        />

        {/* OSM + OSRM Route Map */}
        <View style={styles.mapContainer}>
          <OSMWebViewMap
            stops={DEMO_MAP_STOPS}
            depot={DEMO_DEPOT}
            showRouting
            height={280}
          />
          {/* Route legend */}
          <View style={styles.mapLegend}>
            {[
              { color: '#22c55e', label: 'Completed' },
              { color: '#1a5c38', label: 'Current' },
              { color: '#f97316', label: 'Pending' },
              { color: '#9ca3af', label: 'Skipped' },
            ].map(({ color, label }) => (
              <View key={label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Card padding={14} shadow="md">
          <View style={styles.routeProgressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Route Progress</Text>
              <Text style={styles.progressValue}>{completionPct}%</Text>
            </View>
            <View style={styles.trackContainer}>
              <View style={styles.trackLine} />
              <View style={[styles.trackFill, { width: `${completionPct}%` }]} />
            </View>
            <View style={styles.trackDots}>
              {selectedVehicle.stops.map((stop, i) => (
                <TouchableOpacity
                  key={stop.id}
                  style={[
                    styles.trackDot,
                    stop.status === 'Completed' && styles.trackDotDone,
                    stop.status === 'In Progress' && styles.trackDotCurrent,
                  ]}
                >
                  <Text style={[styles.trackDotText, { color: stop.status !== 'Pending' ? '#ffffff' : '#475569' }]}>
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <SectionHeader title="Route Stops" subtitle={`${selectedVehicle.stops.length} collection points`} />

          {selectedVehicle.stops.length === 0 ? (
            <EmptyState
              title="No stops assigned"
              subtitle="No collection stops are scheduled for this vehicle"
              icon={<MapPin size={24} color={colors.textMuted} />}
            />
          ) : (
            selectedVehicle.stops.map((stop) => {
              const isCompleted = stop.status === 'Completed';
              const isInProgress = stop.status === 'In Progress';
              return (
                <TouchableOpacity
                  key={stop.id}
                  style={styles.stopRow}
                  onPress={() => router.push(`/(admin)/routes/${stop.id}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={styles.stopIndexBadge}>
                    <Text
                      style={[
                        styles.stopIndexText,
                        isCompleted && { color: '#15803d' },
                        isInProgress && { color: '#2563eb' },
                      ]}
                    >
                      {stop.status === 'Completed' ? '✓' : String(selectedVehicle.stops.indexOf(stop) + 1)}
                    </Text>
                  </View>
                  <View style={styles.stopInfo}>
                    <Text style={styles.stopName}>{stop.name}</Text>
                    <Text style={styles.stopWard}>{stop.ward}</Text>
                    <View style={styles.binRow}>
                      {stop.binTypes.map((bin) => (
                        <View key={bin} style={styles.binTag}>
                          <Text style={styles.binText}>{bin}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.stopRight}>
                    <Text style={styles.stopWeight}>{stop.weightKg} kg</Text>
                    <StatusBadge
                      variant={isCompleted ? 'success' : isInProgress ? 'info' : 'default'}
                      small
                    >
                      {stop.status}
                    </StatusBadge>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </Card>

        <Button
          title="Recalculate AI Route Sequence"
          variant="primary"
          fullWidth
          style={{ marginTop: 16 }}
          onPress={() => {}}
          leftIcon={<RefreshCw size={16} color="#ffffff" />}
        />

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
  mapContainer: {
    marginBottom: 14,
  },
  mapLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },

  vehicleRow: {
    marginBottom: 10,
  },
  vehicleRowSelected: {
    borderColor: colors.primary,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  vehicleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleMeta: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  vehicleDriver: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vehicleStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  routeProgressContainer: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  trackContainer: {
    position: 'relative',
    height: 24,
  },
  trackLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
  },
  trackFill: {
    position: 'absolute',
    left: 10,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  trackDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 6,
  },
  trackDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackDotDone: {
    backgroundColor: '#10b981',
  },
  trackDotCurrent: {
    backgroundColor: '#2563eb',
  },
  trackDotText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
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
  stopIndexBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stopIndexText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stopWard: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  binRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  binTag: {
    backgroundColor: '#f8faf9',
    borderWidth: 0.8,
    borderColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  binText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  stopRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  stopWeight: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});
