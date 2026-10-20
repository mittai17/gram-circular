import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { colors } from '../../theme/colors';
import {
  Navigation,
  Fuel,
  Wind,
  AlertTriangle,
  RefreshCw,
  MapPin,
  ChevronRight,
  TrendingDown,
  Zap,
} from 'lucide-react-native';
import OSMWebViewMap, { RouteStop as MapRouteStop } from '../../components/map/OSMWebViewMap';

const DYNAMIC_DEPOT = { lat: 9.1726, lng: 77.6050 };

const DYNAMIC_MAP_STOPS: MapRouteStop[] = [
  { id: 's1', name: 'CP-01 Shanti Nagar', coordinate: { lat: 9.1850, lng: 77.5980 }, status: 'COMPLETED', sequence: 1, fillPercent: 42 },
  { id: 's2', name: 'CP-03 Gandhi Street Ward 4', coordinate: { lat: 9.1650, lng: 77.6180 }, status: 'CURRENT', sequence: 2, fillPercent: 85 },
  { id: 's3', name: 'CP-05 Temple Road Circle', coordinate: { lat: 9.1620, lng: 77.5920 }, status: 'PENDING', sequence: 3, fillPercent: 60 },
  { id: 's4', name: 'CP-07 School Road Junction', coordinate: { lat: 9.1580, lng: 77.6050 }, status: 'PENDING', sequence: 4, fillPercent: 30 },
];

const PICKUP_REQUESTS = [
  {
    id: 'PR-001',
    point: 'CP-03 Gandhi Street Ward 4',
    fillLevel: 85,
    urgency: 'HIGH',
    lastCollection: '3 days ago',
    wasteStream: 'MLP + DRY + WET + SANITARY',
  },
  {
    id: 'PR-002',
    point: 'CP-01 Shanti Nagar Center',
    fillLevel: 70,
    urgency: 'MEDIUM',
    lastCollection: '2 days ago',
    wasteStream: 'MLP + DRY + WET',
  },
  {
    id: 'PR-003',
    point: 'CP-05 Temple Road Circle',
    fillLevel: 60,
    urgency: 'MEDIUM',
    lastCollection: '1 day ago',
    wasteStream: 'MLP + DRY',
  },
  {
    id: 'PR-004',
    point: 'CP-02 Bus Stand Junction',
    fillLevel: 36,
    urgency: 'LOW',
    lastCollection: 'Today',
    wasteStream: 'MLP + DRY',
  },
];

const ROUTE_STOPS = [
  { seq: 1, point: 'CP-01 Shanti Nagar', weight: '42 kg', eta: '08:15 AM +0km', status: 'COMPLETED' },
  { seq: 2, point: 'CP-03 Gandhi Street Ward 4', weight: '28 kg', eta: '08:30 AM +1.6km', status: 'IN_PROGRESS' },
  { seq: 3, point: 'CP-05 Temple Road Circle', weight: '28 kg', eta: '10:45 AM +2.4km', status: 'PENDING' },
  { seq: 4, point: 'CP-07 School Road Junction', weight: '0 kg', eta: '11:45 AM +3.1km', status: 'PENDING' },
];

const FUEL_LOGS = [
  { date: 'Oct 16', baseline: '7.8 L', optimized: '4.9 L', saved: '2.9 L', co2: '7.8 kg' },
  { date: 'Oct 17', baseline: '8.2 L', optimized: '5.1 L', saved: '3.1 L', co2: '8.3 kg' },
  { date: 'Oct 18', baseline: '7.5 L', optimized: '4.7 L', saved: '2.8 L', co2: '7.5 kg' },
];

export default function DynamicRoutingScreen() {
  const [optimizing, setOptimizing] = useState(false);
  const [fuelLogVisible, setFuelLogVisible] = useState(false);

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      Alert.alert('Route Optimized!', 'CVRP Guided Local Search complete.\nDistance saved: 12.4 km\nDiesel saved: 2.9 L (₹275)');
    }, 2000);
  };

  const urgencyColor = (u: string) => {
    switch (u) {
      case 'HIGH': return '#dc2626';
      case 'MEDIUM': return '#f59e0b';
      default: return '#16a34a';
    }
  };

  const stopStatusColor = (s: string) => {
    switch (s) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      default: return 'default';
    }
  };

  const stopStatusLabel = (s: string) => {
    switch (s) {
      case 'COMPLETED': return 'Done';
      case 'IN_PROGRESS': return 'In Progress';
      default: return 'Pending';
    }
  };

  return (
    <Screen title="Dynamic Routing" subtitle="Demand-Driven CVRP Optimization">
      {/* KPI Cards */}
      <View style={styles.statRow}>
        <StatCard
          value="34.2 km"
          label="Baseline"
          subtext="Unoptimized route"
          icon={<Navigation size={18} color="#64748b" />}
          iconBg="#f1f5f9"
          iconColor="#64748b"
          style={{ flex: 1 }}
        />
        <StatCard
          value="21.8 km"
          label="Optimized"
          subtext="-36.3% savings"
          trend="-36.3%"
          trendPositive
          icon={<Navigation size={18} color="#1a5c38" />}
          iconBg="#e8f5e9"
          iconColor="#1a5c38"
          style={{ flex: 1 }}
        />
      </View>
      <View style={styles.statRow}>
        <StatCard
          value="84%"
          label="Vehicle Util."
          subtext="420/500 kg payload"
          icon={<Zap size={18} color="#2563eb" />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
          style={{ flex: 1 }}
        />
        <StatCard
          value="7.8 kg CO₂"
          label="Daily Offset"
          subtext="Based on 2.9 L savings"
          icon={<Wind size={18} color="#16a34a" />}
          iconBg="#dcfce7"
          iconColor="#16a34a"
          style={{ flex: 1 }}
        />
      </View>

      {/* Savings Banner */}
      <Card padding={14} style={styles.savingsBanner}>
        <View style={styles.savingsRow}>
          <TrendingDown size={20} color="#16a34a" />
          <View style={styles.savingsMeta}>
            <Text style={styles.savingsTitle}>Today's Route Savings</Text>
            <Text style={styles.savingsSub}>vs. unoptimized baseline (34.2 km / 7.8 L diesel)</Text>
          </View>
        </View>
        <View style={styles.savingsMetrics}>
          <View style={styles.savingsMetric}>
            <Text style={styles.savingsValue}>12.4 km</Text>
            <Text style={styles.savingsLabel}>Distance Saved</Text>
          </View>
          <View style={styles.savingsDiv} />
          <View style={styles.savingsMetric}>
            <Text style={styles.savingsValue}>2.9 L</Text>
            <Text style={styles.savingsLabel}>Diesel Saved</Text>
          </View>
          <View style={styles.savingsDiv} />
          <View style={styles.savingsMetric}>
            <Text style={styles.savingsValue}>₹275</Text>
            <Text style={styles.savingsLabel}>Cost Avoided</Text>
          </View>
        </View>
      </Card>

      {/* IoT Fill Alerts */}
      <SectionHeader
        title="Live IoT Fill Alerts"
        subtitle="Auto-escalated by fill level"
      />
      {PICKUP_REQUESTS.map((req) => (
        <Card key={req.id} padding={12} style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={[styles.urgencyDot, { backgroundColor: urgencyColor(req.urgency) }]} />
            <View style={styles.alertMeta}>
              <Text style={styles.alertPoint}>{req.point}</Text>
              <Text style={styles.alertSub}>{req.wasteStream} • {req.lastCollection}</Text>
            </View>
            <View style={styles.alertRight}>
              <Text
                style={[styles.alertFill, { color: urgencyColor(req.urgency) }]}
              >
                {req.fillLevel}%
              </Text>
              <Text style={styles.alertUrgency}>{req.urgency}</Text>
            </View>
          </View>
          <View style={styles.fillBarBg}>
            <View
              style={[
                styles.fillBarFill,
                {
                  width: `${req.fillLevel}%` as any,
                  backgroundColor: urgencyColor(req.urgency),
                },
              ]}
            />
          </View>
        </Card>
      ))}

      {/* Optimize Button */}
      <TouchableOpacity
        style={[styles.optimizeBtn, optimizing && styles.optimizingBtn]}
        onPress={handleOptimize}
        activeOpacity={0.85}
        disabled={optimizing}
      >
        <RefreshCw size={18} color="#ffffff" style={optimizing ? { opacity: 0.7 } : {}} />
        <Text style={styles.optimizeBtnText}>
          {optimizing ? 'Running CVRP Optimization...' : 'Re-optimize Route (GLS-CVRP)'}
        </Text>
      </TouchableOpacity>

      {/* OpenStreetMap + OSRM CVRP Route Map */}
      <View style={{ marginBottom: 16 }}>
        <OSMWebViewMap
          stops={DYNAMIC_MAP_STOPS}
          depot={DYNAMIC_DEPOT}
          showRouting
          height={260}
        />
      </View>

      {/* Scheduled Stop Sequence */}
      <SectionHeader title="Scheduled Stop Sequence" subtitle="TN-20-CZ-8104 • Ramesh K • 4 optimized stops" />
      <Card padding={0}>
        {ROUTE_STOPS.map((stop, i) => (
          <View
            key={stop.seq}
            style={[styles.stopRow, i < ROUTE_STOPS.length - 1 && styles.stopBorder]}
          >
            <View style={[styles.stopSeq, stop.status === 'COMPLETED' && styles.stopSeqDone]}>
              <Text style={[styles.stopSeqText, stop.status === 'COMPLETED' && { color: '#ffffff' }]}>
                {stop.seq}
              </Text>
            </View>
            <View style={styles.stopMeta}>
              <Text style={styles.stopPoint}>{stop.point}</Text>
              <Text style={styles.stopEta}>{stop.eta}</Text>
            </View>
            <View style={styles.stopRight}>
              <Text style={styles.stopWeight}>{stop.weight}</Text>
              <StatusBadge variant={stopStatusColor(stop.status) as any} small>
                {stopStatusLabel(stop.status)}
              </StatusBadge>
            </View>
          </View>
        ))}
      </Card>

      {/* Fuel Audit Log */}
      <SectionHeader
        title="Empirical Fuel Audit"
        subtitle="Daily diesel savings log"
        viewAllLabel={fuelLogVisible ? 'Collapse' : 'Expand'}
        onViewAll={() => setFuelLogVisible(!fuelLogVisible)}
      />
      {fuelLogVisible && (
        <Card padding={0}>
          <View style={styles.auditHeadRow}>
            <Text style={[styles.auditCell, { flex: 1 }]}>Date</Text>
            <Text style={styles.auditCell}>Baseline</Text>
            <Text style={styles.auditCell}>Actual</Text>
            <Text style={styles.auditCell}>Saved</Text>
            <Text style={styles.auditCell}>CO₂</Text>
          </View>
          {FUEL_LOGS.map((log, i) => (
            <View
              key={log.date}
              style={[styles.auditRow, i % 2 === 1 && styles.auditRowAlt]}
            >
              <Text style={[styles.auditCellVal, { flex: 1 }]}>{log.date}</Text>
              <Text style={styles.auditCellVal}>{log.baseline}</Text>
              <Text style={styles.auditCellVal}>{log.optimized}</Text>
              <Text style={[styles.auditCellVal, { color: '#16a34a', fontWeight: '700' }]}>
                {log.saved}
              </Text>
              <Text style={styles.auditCellVal}>{log.co2}</Text>
            </View>
          ))}
        </Card>
      )}

      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  savingsBanner: { marginBottom: 4, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' },
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  savingsMeta: { flex: 1 },
  savingsTitle: { fontSize: 14, fontWeight: '800', color: '#166534' },
  savingsSub: { fontSize: 10, color: '#15803d', marginTop: 1 },
  savingsMetrics: { flexDirection: 'row', justifyContent: 'space-around' },
  savingsMetric: { alignItems: 'center' },
  savingsValue: { fontSize: 18, fontWeight: '900', color: '#16a34a' },
  savingsLabel: { fontSize: 10, color: '#15803d', marginTop: 2 },
  savingsDiv: { width: 1, backgroundColor: '#bbf7d0' },
  alertCard: { marginBottom: 8 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  urgencyDot: { width: 10, height: 10, borderRadius: 5, marginTop: 2 },
  alertMeta: { flex: 1 },
  alertPoint: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  alertSub: { fontSize: 10, color: colors.textSecondary, marginTop: 1 },
  alertRight: { alignItems: 'flex-end' },
  alertFill: { fontSize: 16, fontWeight: '900' },
  alertUrgency: { fontSize: 9, fontWeight: '700', color: colors.textMuted },
  fillBarBg: { height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' },
  fillBarFill: { height: '100%', borderRadius: 2 },
  optimizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a5c38',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
    elevation: 3,
  },
  optimizingBtn: { backgroundColor: '#64748b' },
  optimizeBtnText: { fontSize: 14, fontWeight: '800', color: '#ffffff' },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  stopBorder: { borderBottomWidth: 0.8, borderBottomColor: colors.borderLight },
  stopSeq: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopSeqDone: { backgroundColor: '#1a5c38' },
  stopSeqText: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },
  stopMeta: { flex: 1 },
  stopPoint: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  stopEta: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  stopRight: { alignItems: 'flex-end', gap: 4 },
  stopWeight: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  auditHeadRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  auditCell: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    flex: 0.8,
    textAlign: 'center',
  },
  auditRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  auditRowAlt: { backgroundColor: '#f8fafc' },
  auditCellVal: {
    fontSize: 11,
    color: colors.textPrimary,
    flex: 0.8,
    textAlign: 'center',
  },
});
