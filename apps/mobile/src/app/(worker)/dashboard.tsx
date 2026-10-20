import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { WORKER_ROUTE } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Truck,
  Scale,
  QrCode,
  RefreshCw,
  Play,
  ChevronRight,
  MapPin,
  Activity,
  Target,
} from 'lucide-react-native';

export default function WorkerDashboard() {
  const router = useRouter();

  const completedStops = WORKER_ROUTE.completedStops;
  const totalStops = WORKER_ROUTE.totalStops;
  const progressPercent = Math.round((completedStops / totalStops) * 100);
  const collectedToday = 70;
  const dailyTarget = 120;

  const quickActions = [
    {
      id: 'weigh',
      title: 'Weigh Waste',
      sub: 'Bluetooth Scale',
      icon: Scale,
      color: '#2563eb',
      light: '#eff6ff',
      route: '/(worker)/weighing',
    },
    {
      id: 'bags',
      "title": "Today's Bags",
      sub: '5 Collections',
      icon: QrCode,
      color: '#15803d',
      light: '#f0fdf4',
      route: '/(worker)/my-collections',
    },
    {
      id: 'outbox',
      title: 'Offline Outbox',
      sub: 'SQLite Queue',
      icon: RefreshCw,
      color: '#ea580c',
      light: '#fff7ed',
      route: '/(worker)/offline-mode',
    },
  ];

  return (
    <Screen
      title="Good Morning, Ramesh!"
      subtitle="Vehicle 1 • Shanti Nagar Route"
      showOfflineBanner
      showBottomNav
    >
      {/* Stat Cards Row */}
      <View style={styles.statsRow}>
        <StatCard
          value={`${collectedToday} kg`}
          label="Collected Today"
          subtext="5 stops completed"
          iconBg="#eff6ff"
          iconColor="#2563eb"
          trend="+12%"
          trendPositive
        >
          <Truck size={18} />
        </StatCard>
        <StatCard
          value={`${dailyTarget} kg`}
          label="Daily Target"
          subtext="Vehicle 1 capacity"
          iconBg="#f0fdf4"
          iconColor="#15803d"
          trend={`${dailyTarget - collectedToday} kg remaining`}
          trendPositive
        >
          <Target size={18} />
        </StatCard>
        <StatCard
          value="58%"
          label="Progress"
          subtext="Route completion"
          iconBg="#f1f5f9"
          iconColor="#475569"
          trend="On track"
          trendPositive
        >
          <Activity size={18} />
        </StatCard>
      </View>

      {/* Today's Route Card */}
      <Card style={styles.routeCard} padding={16}>
        <View style={styles.routeHeaderRow}>
          <View>
            <Text style={styles.routeTitle}>Today's Route</Text>
            <Text style={styles.routeSubtitle}>
              {totalStops} Collection Points • {WORKER_ROUTE.totalDistanceKm} km
            </Text>
          </View>
          <StatusBadge variant="default">{String(completedStops) + '/' + String(totalStops)}</StatusBadge>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{progressPercent}% Complete</Text>
        </View>

        <Button
          title={`Continue Route • Stop ${completedStops + 1}`}
          leftIcon={<Play size={16} color="#ffffff" />}
          fullWidth
          onPress={() => router.push('/(worker)/stop-detail')}
        />
      </Card>

      {/* Quick Actions */}
      <SectionHeader
        title="Quick Actions"
        subtitle="Start your next collection step"
      />

      <View style={styles.actionsRow}>
        {quickActions.map((action) => {
          const IconComp = action.icon;
          return (
            <Card
              key={action.id}
              style={[styles.actionCard, { backgroundColor: action.light || '#ffffff' }] as unknown as ViewStyle}
              padding={14}
            >
              <TouchableOpacity
                style={[styles.actionIconBox, { borderColor: action.color }]}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <IconComp size={20} color={action.color} />
              </TouchableOpacity>
              <View style={styles.actionMeta}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSub}>{action.sub}</Text>
              </View>
            </Card>
          );
        })}
      </View>

      {/* Assigned Stops */}
      <SectionHeader
        title="Assigned Stops"
        subtitle={`Next: ${WORKER_ROUTE.stops.find((s) => s.status === 'In Progress')?.name || 'All stops assigned'}`}
      />

      {WORKER_ROUTE.stops.map((stop) => {
        const isDone = stop.status === 'Completed';
        const isInProgress = stop.status === 'In Progress';

        return (
          <Card key={stop.id} style={styles.stopCard} padding={14}>
            <View style={styles.stopRow}>
              <View
                style={[
                  styles.stopBadge,
                  isDone ? styles.badgeDone : isInProgress ? styles.badgeActive : styles.badgePending,
                ]}
              >
                <Text
                  style={[
                    styles.stopCodeText,
                    { color: isDone ? '#15803d' : isInProgress ? '#2563eb' : '#64748b' },
                  ]}
                >
                  {stop.code}
                </Text>
              </View>
              <View style={styles.stopMeta}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopWard}>
                  {stop.ward} • {stop.distanceKm} km
                </Text>
              </View>
              <View style={styles.stopRight}>
                <Text style={styles.stopKg}>{stop.weightKg} kg</Text>
                <StatusBadge
                  variant={isDone ? 'success' : isInProgress ? 'primary' : 'default'}
                  small
                  style={styles.statusChip}
                >
                  {stop.status}
                </StatusBadge>
              </View>
            </View>
          </Card>
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
    marginBottom: 16,
  },
  routeCard: {
    marginBottom: 16,
  },
  routeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
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
  progressBarContainer: {
    gap: 8,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionMeta: {
    gap: 2,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  stopCard: {
    marginBottom: 10,
  },
  stopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  stopMeta: {
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
    marginTop: 2,
  },
  stopRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  stopKg: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusChip: {
    minWidth: 70,
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
});
