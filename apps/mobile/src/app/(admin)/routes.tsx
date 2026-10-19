import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { WORKER_ROUTE } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Truck,
  CheckCircle2,
  Clock,
  Navigation,
  ArrowRight,
  MapPin,
  RefreshCw,
} from 'lucide-react-native';

export default function AdminRoutesScreen() {
  const [activeDay, setActiveDay] = useState<'today' | 'tomorrow'>('today');

  return (
    <View style={styles.screen}>
      <HeaderBar title="Route Optimization" subtitle="Vehicle Dispatch & Sequence" showBack />

      <View style={styles.content}>
        {/* Day Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeDay === 'today' && styles.activeTab]}
            onPress={() => setActiveDay('today')}
          >
            <Text style={[styles.tabText, activeDay === 'today' && styles.activeTabText]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeDay === 'tomorrow' && styles.activeTab]}
            onPress={() => setActiveDay('tomorrow')}
          >
            <Text style={[styles.tabText, activeDay === 'tomorrow' && styles.activeTabText]}>
              Tomorrow
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Vehicle Summary Card */}
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleIcon}>
                <Truck size={20} color="#ffffff" />
              </View>
              <View style={styles.vehicleMeta}>
                <Text style={styles.vehicleTitle}>{WORKER_ROUTE.vehicleNumber}</Text>
                <Text style={styles.driverText}>
                  Driver: {WORKER_ROUTE.driverName} • {WORKER_ROUTE.totalDistanceKm} km Total
                </Text>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercent}>50%</Text>
              </View>
            </View>

            {/* Visual Route Progress Track */}
            <View style={styles.trackContainer}>
              <View style={styles.trackLine} />
              <View style={[styles.trackFill, { width: '50%' }]} />
              <View style={styles.trackPointsRow}>
                {WORKER_ROUTE.stops.map((stop, i) => {
                  const isDone = stop.status === 'Completed';
                  const isCurrent = stop.status === 'In Progress';
                  return (
                    <View
                      key={stop.id}
                      style={[
                        styles.trackDot,
                        isDone && styles.trackDotDone,
                        isCurrent && styles.trackDotCurrent,
                      ]}
                    >
                      <Text
                        style={[
                          styles.trackDotText,
                          (isDone || isCurrent) && { color: '#ffffff' },
                        ]}
                      >
                        {i + 1}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Stops List */}
          <Text style={styles.sectionHeader}>Stop Sequence ({WORKER_ROUTE.stops.length})</Text>

          {WORKER_ROUTE.stops.map((stop, index) => {
            const isCompleted = stop.status === 'Completed';
            const isInProgress = stop.status === 'In Progress';

            return (
              <View key={stop.id} style={styles.stopCard}>
                <View style={styles.stopLeft}>
                  <View
                    style={[
                      styles.stopIndexBadge,
                      isCompleted && { backgroundColor: '#dcfce7' },
                      isInProgress && { backgroundColor: '#eff6ff' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stopIndexText,
                        isCompleted && { color: '#15803d' },
                        isInProgress && { color: '#2563eb' },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View style={styles.stopInfo}>
                    <Text style={styles.stopNameText}>{stop.name}</Text>
                    <Text style={styles.stopWardText}>{stop.ward}</Text>
                    <View style={styles.binTypesRow}>
                      {stop.binTypes.map((bin, bi) => (
                        <View key={bi} style={styles.binTypeTag}>
                          <Text style={styles.binTypeText}>{bin}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.stopRight}>
                  <Text style={styles.weightValue}>{stop.weightKg} kg</Text>
                  <View
                    style={[
                      styles.statusPill,
                      isCompleted
                        ? styles.pillCompleted
                        : isInProgress
                        ? styles.pillInProgress
                        : styles.pillPending,
                    ]}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={10} color="#15803d" />
                    ) : (
                      <Clock size={10} color={isInProgress ? '#2563eb' : '#64748b'} />
                    )}
                    <Text
                      style={[
                        styles.statusPillText,
                        isCompleted
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
              </View>
            );
          })}

          <TouchableOpacity style={styles.optimizeBtn} activeOpacity={0.85}>
            <RefreshCw size={16} color="#ffffff" />
            <Text style={styles.optimizeBtnText}>Recalculate AI Route Sequence</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  vehicleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1a5c38',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleMeta: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  driverText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
  },
  trackContainer: {
    marginTop: 20,
    marginBottom: 6,
    position: 'relative',
    height: 24,
    justifyContent: 'center',
  },
  trackLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
  },
  trackFill: {
    position: 'absolute',
    left: 8,
    height: 4,
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  trackPointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  trackDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  stopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stopIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stopIndexText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  stopInfo: {
    flex: 1,
  },
  stopNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stopWardText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  binTypesRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  binTypeTag: {
    backgroundColor: '#f8faf9',
    borderWidth: 0.8,
    borderColor: colors.border,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  binTypeText: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  stopRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  weightValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pillCompleted: {
    backgroundColor: '#ecfdf5',
  },
  pillInProgress: {
    backgroundColor: '#eff6ff',
  },
  pillPending: {
    backgroundColor: '#f1f5f9',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  optimizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a5c38',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
  },
  optimizeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
