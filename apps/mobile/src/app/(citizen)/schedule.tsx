import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { CITIZEN_SCHEDULE } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Bell,
  Layers,
  Leaf,
  Trash2,
  ShieldAlert,
} from 'lucide-react-native';

const STREAM_ICONS = {
  Wet: { icon: Leaf, color: '#10b981', light: '#ecfdf5' },
  Dry: { icon: Trash2, color: '#2563eb', light: '#eff6ff' },
  MLP: { icon: Layers, color: '#1a5c38', light: '#e8f5e9' },
  Sanitary: { icon: ShieldAlert, color: '#ef4444', light: '#fef2f2' },
};

export default function CitizenScheduleScreen() {
  const handleSetReminder = (day: string) => {
    Alert.alert('Collection Reminder', `Reminder set for 7:00 AM on ${day}. You'll receive a phone notification.`);
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Collection Timetable" subtitle="Shanti Nagar Ward 3 Schedule" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.banner}>
          <Calendar size={20} color="#1a5c38" />
          <View style={styles.bannerMeta}>
            <Text style={styles.bannerTitle}>Daily Collection Window: 7:30 - 10:00 AM</Text>
            <Text style={styles.bannerSub}>
              Please keep your segregated bin outside your gate before 7:30 AM.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Weekly Waste Streams</Text>

        {CITIZEN_SCHEDULE.map((item) => {
          const config = STREAM_ICONS[item.wasteType as keyof typeof STREAM_ICONS] || STREAM_ICONS.Dry;
          const IconComp = config.icon;
          const isDone = item.status === 'Completed';

          return (
            <View
              key={item.id}
              style={[
                styles.scheduleCard,
                item.wasteType === 'MLP' && styles.mlpSpecialCard,
              ]}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.streamIconBox, { backgroundColor: config.light }]}>
                  <IconComp size={22} color={config.color} />
                </View>

                <View style={styles.streamMeta}>
                  <View style={styles.titleRow}>
                    <Text style={styles.dayText}>{item.dayName}</Text>
                    {item.wasteType === 'MLP' && (
                      <View style={styles.specialBadge}>
                        <Text style={styles.specialBadgeText}>Special Focus</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.streamType, { color: config.color }]}>
                    {item.wasteType === 'MLP' ? 'MLP Multi-Layer Plastic' : `${item.wasteType} Waste`}
                  </Text>
                  <Text style={styles.timingText}>
                    <Clock size={10} color={colors.textSecondary} /> {item.timing}
                  </Text>
                </View>
              </View>

              <View style={styles.cardRight}>
                <View
                  style={[
                    styles.statusPill,
                    isDone ? styles.pillDone : styles.pillUpcoming,
                  ]}
                >
                  {isDone ? (
                    <CheckCircle2 size={10} color="#15803d" />
                  ) : (
                    <Clock size={10} color="#2563eb" />
                  )}
                  <Text
                    style={[
                      styles.statusText,
                      isDone ? { color: '#15803d' } : { color: '#2563eb' },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>

                {!isDone && (
                  <TouchableOpacity
                    style={styles.remindBtn}
                    onPress={() => handleSetReminder(item.dayName)}
                    activeOpacity={0.8}
                  >
                    <Bell size={12} color="#1a5c38" />
                    <Text style={styles.remindText}>Remind</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
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
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  scheduleCard: {
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
  mlpSpecialCard: {
    borderColor: '#1a5c38',
    borderWidth: 1.5,
    backgroundColor: '#f8fdfa',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  streamIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamMeta: {
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
  specialBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  specialBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803d',
  },
  streamType: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  timingText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillDone: {
    backgroundColor: '#ecfdf5',
  },
  pillUpcoming: {
    backgroundColor: '#eff6ff',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  remindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  remindText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a5c38',
  },
});
