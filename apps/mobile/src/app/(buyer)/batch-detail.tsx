import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { colors } from '../../theme/colors';
import {
  Calendar as CalendarIcon,
  Truck,
  MapPin,
  Layers,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

export default function BuyerBatchDetailScreen() {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState(17);
  const [vehicle, setVehicle] = useState('6 Ton Truck');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleConfirmSchedule = () => {
    Alert.alert(
      'Pickup Scheduled',
      `Logistics order confirmed for ${selectedDay} October 2026.\nVehicle: ${vehicle}\nBatch: MLP-2026-0143`,
      [
        {
          text: 'Proceed to Receipt Confirmation',
          onPress: () => router.push('/(buyer)/receipt-confirm'),
        },
        {
          text: 'View Purchase History',
          onPress: () => router.push('/(buyer)/history'),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Schedule Pickup" subtitle="Batch MLP-2026-0143" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Batch Info Card */}
        <View style={styles.batchCard}>
          <View style={styles.batchTop}>
            <View style={styles.batchTag}>
              <Layers size={18} color="#7c3aed" />
            </View>
            <View style={styles.batchMeta}>
              <Text style={styles.batchTitle}>Batch MLP-2026-0143</Text>
              <Text style={styles.batchSub}>From: CP-03 Gandhi Street • Shanti Nagar</Text>
            </View>
            <Text style={styles.batchKg}>162.0 kg</Text>
          </View>

          <View style={styles.purityRow}>
            <View style={styles.purityBadge}>
              <Text style={styles.purityText}>A Grade • Low Moisture (1.8%)</Text>
            </View>
            <View style={styles.eprBadge}>
              <ShieldCheck size={12} color="#15803d" />
              <Text style={styles.eprText}>EPR Certified</Text>
            </View>
          </View>
        </View>

        {/* Calendar Picker (October 2026) */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Text style={styles.monthTitle}>October 2026</Text>
            <View style={styles.calNav}>
              <TouchableOpacity style={styles.calNavBtn}>
                <ChevronLeft size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.calNavBtn}>
                <ChevronRight size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekday headers */}
          <View style={styles.weekdaysRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => (
              <Text key={i} style={styles.weekdayText}>
                {w}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {/* Empty slots for month start on Thursday */}
            <View style={styles.emptyDay} />
            <View style={styles.emptyDay} />
            <View style={styles.emptyDay} />
            <View style={styles.emptyDay} />

            {daysInMonth.map((day) => {
              const isSelected = selectedDay === day;
              const isAvailable = day >= 16;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    !isAvailable && styles.dayCellDisabled,
                  ]}
                  onPress={() => isAvailable && setSelectedDay(day)}
                  disabled={!isAvailable}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      !isAvailable && styles.dayTextDisabled,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Vehicle Type Selection */}
        <View style={styles.vehicleCard}>
          <Text style={styles.sectionTitle}>Logistics Vehicle Type</Text>

          {['6 Ton Truck', '3.5 Ton Medium LCV'].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.vOption, vehicle === v && styles.vOptionSelected]}
              onPress={() => setVehicle(v)}
            >
              <Truck size={18} color={vehicle === v ? '#7c3aed' : colors.textSecondary} />
              <Text style={[styles.vText, vehicle === v && styles.vTextActive]}>{v}</Text>
              {vehicle === v && (
                <CheckCircle2 size={16} color="#7c3aed" style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm Schedule Button */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmSchedule}
          activeOpacity={0.85}
        >
          <CalendarIcon size={18} color="#ffffff" />
          <Text style={styles.confirmBtnText}>Confirm Pickup Schedule</Text>
        </TouchableOpacity>

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
  batchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  batchTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batchTag: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  batchMeta: {
    flex: 1,
  },
  batchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchKg: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7c3aed',
  },
  purityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
  },
  purityBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  purityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  eprBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  eprText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  calNav: {
    flexDirection: 'row',
    gap: 6,
  },
  calNavBtn: {
    padding: 4,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 32,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    height: 36,
  },
  dayCell: {
    width: '14.28%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: '#7c3aed',
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dayTextSelected: {
    color: '#ffffff',
    fontWeight: '800',
  },
  dayTextDisabled: {
    color: colors.textMuted,
  },
  vehicleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  vOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  vOptionSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#faf5ff',
  },
  vText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  vTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 16,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
