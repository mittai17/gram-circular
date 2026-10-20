import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors } from '../../theme/colors';
import { CITIZEN_SCHEDULE } from '../../lib/mock-data';
import { CollectionScheduleItem } from '../../types';
import { Calendar, Clock, CheckCircle2, Bell, Layers, Leaf, Trash2, ShieldAlert, ChevronRight } from 'lucide-react-native';

const CITIZEN_PRIMARY = colors.roles.citizen.primary; // #d97706

const STREAM_ICONS: Record<string, { icon: any; color: string; light: string }> = {
  Wet: { icon: Leaf, color: '#10b981', light: '#ecfdf5' },
  Dry: { icon: Trash2, color: '#2563eb', light: '#eff6ff' },
  MLP: { icon: Layers, color: '#1a5c38', light: '#e8f5e9' },
  Sanitary: { icon: ShieldAlert, color: '#ef4444', light: '#fef2f2' },
};

export default function CitizenScheduleScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<string[]>([]);

  const upcoming = CITIZEN_SCHEDULE.find((s) => s.status === 'Upcoming');
  const nextConfig = upcoming
    ? STREAM_ICONS[upcoming.wasteType] || STREAM_ICONS.Dry
    : undefined;
  const NextIconComp = nextConfig?.icon;

  const handleRemind = (item: CollectionScheduleItem) => {
    if (reminders.includes(item.id)) {
      Alert.alert('Already Set', `Reminder already set for ${item.dayName}.`);
      return;
    }
    setReminders([...reminders, item.id]);
    Alert.alert(
      'Reminder Set',
      `You will be notified before the ${item.wasteType} collection on ${item.dayName} at ${item.timing}.`
    );
  };

  const handleRemoveReminder = (id: string) => {
    setReminders(reminders.filter((r) => r !== id));
  };

  return (
    <Screen title="Collection Schedule" subtitle="Shanti Nagar Ward 3 Timetable" showBack>
      {/* Info Banner */}
      <Card padding={14} style={styles.bannerCard}>
        <View style={styles.bannerRow}>
          <Calendar size={20} color={CITIZEN_PRIMARY} />
          <View style={styles.bannerMeta}>
            <Text style={styles.bannerTitle}>Daily Collection Window</Text>
            <Text style={styles.bannerSub}>
              7:30 AM - 10:00 AM • Please keep your segregated bin outside your gate before 7:30 AM.
            </Text>
          </View>
        </View>
      </Card>

      {/* Next Collection Highlight */}
      {upcoming && (
        <Card padding={14} style={styles.nextCard}>
          <View style={styles.nextHeader}>
            <Text style={styles.nextLabel}>Next Collection</Text>
            <Text style={styles.nextDay}>{upcoming.dayName}</Text>
          </View>
          <View style={styles.nextBody}>
            {nextConfig && (
              <View style={[styles.streamIcon, { backgroundColor: nextConfig.light }]}>
                <NextIconComp size={22} color={nextConfig.color} />
              </View>
            )}
            <View style={styles.nextMeta}>
              <Text style={styles.nextWaste}>
                {upcoming.wasteType === 'MLP' ? 'MLP Multi-Layer Plastic' : `${upcoming.wasteType} Waste`}
              </Text>
              <Text style={styles.nextTiming}>{upcoming.timing}</Text>
            </View>
            <TouchableOpacity
              style={styles.remindBtn}
              onPress={() => handleRemind(upcoming)}
              activeOpacity={0.85}
            >
              <Bell size={14} color={CITIZEN_PRIMARY} />
              <Text style={styles.remindText}>Set Reminder</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Weekly Timetable */}
      <SectionHeader
        title="Weekly Timetable"
        subtitle="Collection days and waste streams"
        viewAllLabel="Report a Bin"
        onViewAll={() => router.push('/(citizen)/report-bin')}
      />

      {CITIZEN_SCHEDULE.map((item) => {
        const config = STREAM_ICONS[item.wasteType] || STREAM_ICONS.Dry;
        const IconComp = config.icon;
        const isDone = item.status === 'Completed';
        const hasReminder = reminders.includes(item.id);

        return (
          <Card
            key={item.id}
            padding={14}
            style={{
              ...styles.scheduleCard,
              ...(item.wasteType === 'MLP' ? styles.mlpCard : {}),
            }}
          >
            <View style={styles.cardRow}>
              <View style={[styles.streamIcon, { backgroundColor: config.light }]}>
                <IconComp size={22} color={config.color} />
              </View>
              <View style={styles.meta}>
                <View style={styles.titleRow}>
                  <Text style={styles.dayText}>{item.dayName}</Text>
                  {item.wasteType === 'MLP' && (
                    <View style={styles.focusBadge}>
                      <Text style={styles.focusText}>MLP Focus</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.wasteText, { color: config.color }]}>
                  {item.wasteType === 'MLP' ? 'Multi-Layer Plastic' : `${item.wasteType} Waste`}
                </Text>
                <Text style={styles.timingText}>
                  <Clock size={10} color={colors.textSecondary} /> {item.timing}
                </Text>
              </View>
              <View style={styles.right}>
                <StatusBadge
                  variant={isDone ? 'success' : 'info'}
                  small
                  style={styles.statusBadge}
                >
                  {isDone ? 'Collected' : 'Upcoming'}
                </StatusBadge>
                {!isDone && (
                  <TouchableOpacity
                    style={styles.remindBtn}
                    onPress={() => handleRemind(item)}
                    activeOpacity={0.85}
                  >
                    {hasReminder ? (
                      <CheckCircle2 size={14} color="#15803d" />
                    ) : (
                      <Bell size={14} color={CITIZEN_PRIMARY} />
                    )}
                    <Text style={styles.remindText}>{hasReminder ? 'Reminder Set' : 'Set Reminder'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
        );
      })}

      {/* Reminders */}
      <SectionHeader
        title="Your Reminders"
        subtitle="Stay on top of collection days"
      />
      {reminders.length === 0 ? (
        <EmptyState
          title="No reminders set yet"
          subtitle="Tap 'Set Reminder' on any collection day to get notified before pickup."
          icon={<Bell size={40} color={colors.textMuted} />}
          action={{
            label: 'Set Reminder',
            onPress: () => {
              if (upcoming) handleRemind(upcoming);
            },
          }}
        />
      ) : (
        <View style={styles.remindersList}>
          {reminders.map((id) => {
            const item = CITIZEN_SCHEDULE.find((s) => s.id === id);
            if (!item) return null;
            const config = STREAM_ICONS[item.wasteType];
            return (
              <Card key={id} padding={12} style={styles.reminderCard}>
                <View style={styles.reminderRow}>
                  <Text style={styles.reminderDay}>{item.dayName}</Text>
                  <Text style={[styles.reminderWaste, { color: config.color }]}>
                    {item.wasteType} Waste
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveReminder(id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.reminderRemove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bannerCard: {},
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerMeta: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bannerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  nextCard: {},
  nextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nextLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  nextDay: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  nextBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streamIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextMeta: {
    flex: 1,
  },
  nextWaste: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nextTiming: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  remindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  remindText: {
    fontSize: 11,
    fontWeight: '700',
    color: CITIZEN_PRIMARY,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mlpCard: {
    borderColor: '#1a5c38',
    borderWidth: 1.5,
    backgroundColor: '#f8fdfa',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  focusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  focusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803d',
  },
  wasteText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  timingText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    marginBottom: 4,
  },
  remindersList: {
    gap: 8,
  },
  reminderCard: {},
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderDay: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  reminderWaste: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  reminderRemove: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
  },
});
