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
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { BottomNav } from '../../components/common/BottomNav';
import { WORKER_ROUTE } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  Play,
  Scale,
  QrCode,
  RefreshCw,
  ChevronRight,
  MapPin,
} from 'lucide-react-native';

export default function WorkerDashboard() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="Good Morning, Ramesh!"
        subtitle="Vehicle 1 • Shanti Nagar Route"
      />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Today's Route Banner Card */}
        <View style={styles.routeHeaderCard}>
          <View style={styles.routeTopRow}>
            <View>
              <Text style={styles.routeTitle}>Today's Route</Text>
              <Text style={styles.routeSubtitle}>
                {WORKER_ROUTE.totalStops} Collection Points • {WORKER_ROUTE.totalDistanceKm} km
              </Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>
                {WORKER_ROUTE.completedStops}/{WORKER_ROUTE.totalStops}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(WORKER_ROUTE.completedStops / WORKER_ROUTE.totalStops) * 100}%`,
                },
              ]}
            />
          </View>

          <TouchableOpacity
            style={styles.startRouteBtn}
            onPress={() => router.push('/(worker)/stop-detail')}
            activeOpacity={0.85}
          >
            <Play size={16} color="#ffffff" fill="#ffffff" />
            <Text style={styles.startRouteText}>Continue Route • Stop 3</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(worker)/weighing')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#eff6ff' }]}>
              <Scale size={20} color="#2563eb" />
            </View>
            <Text style={styles.actionTitle}>Weigh Waste</Text>
            <Text style={styles.actionSub}>Bluetooth Scale</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(worker)/my-collections')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#f0fdf4' }]}>
              <QrCode size={20} color="#15803d" />
            </View>
            <Text style={styles.actionTitle}>Today's Bags</Text>
            <Text style={styles.actionSub}>5 Collections</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(worker)/offline-mode')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#fff7ed' }]}>
              <RefreshCw size={20} color="#ea580c" />
            </View>
            <Text style={styles.actionTitle}>Offline Outbox</Text>
            <Text style={styles.actionSub}>SQLite Queue</Text>
          </TouchableOpacity>
        </View>

        {/* Stops Sequence */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Assigned Stops</Text>
          <Text style={styles.sectionSub}>Next: CP-03 Gandhi Street</Text>
        </View>

        {WORKER_ROUTE.stops.map((stop) => {
          const isDone = stop.status === 'Completed';
          const isInProgress = stop.status === 'In Progress';

          return (
            <TouchableOpacity
              key={stop.id}
              style={[
                styles.stopCard,
                isInProgress && styles.stopCardActive,
              ]}
              onPress={() => router.push('/(worker)/stop-detail')}
              activeOpacity={0.8}
            >
              <View style={styles.stopCardLeft}>
                <View
                  style={[
                    styles.stopBadge,
                    isDone
                      ? styles.badgeDone
                      : isInProgress
                      ? styles.badgeActive
                      : styles.badgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.stopCodeText,
                      isDone
                        ? { color: '#15803d' }
                        : isInProgress
                        ? { color: '#2563eb' }
                        : { color: '#64748b' },
                    ]}
                  >
                    {stop.code}
                  </Text>
                </View>

                <View style={styles.stopTextMeta}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopWard}>
                    {stop.ward} • {stop.distanceKm} km
                  </Text>
                </View>
              </View>

              <View style={styles.stopCardRight}>
                <Text style={styles.stopKg}>{stop.weightKg} kg</Text>
                <View
                  style={[
                    styles.statusChip,
                    isDone
                      ? styles.statusDone
                      : isInProgress
                      ? styles.statusProgress
                      : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      isDone
                        ? { color: '#15803d' }
                        : isInProgress
                        ? { color: '#2563eb' }
                        : { color: '#64748b' },
                    ]}
                  >
                    {stop.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
  routeHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  routeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  routeSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginVertical: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  startRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
  },
  startRouteText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionSub: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
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
  sectionSub: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
  },
  stopCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  stopCardActive: {
    borderColor: '#3b82f6',
    borderWidth: 1.5,
    backgroundColor: '#f8faff',
  },
  stopCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stopBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeDone: {
    backgroundColor: '#ecfdf5',
  },
  badgeActive: {
    backgroundColor: '#eff6ff',
  },
  badgePending: {
    backgroundColor: '#f1f5f9',
  },
  stopCodeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stopTextMeta: {
    flex: 1,
  },
  stopName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stopWard: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stopCardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  stopKg: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusDone: {
    backgroundColor: '#ecfdf5',
  },
  statusProgress: {
    backgroundColor: '#eff6ff',
  },
  statusPending: {
    backgroundColor: '#f1f5f9',
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
