import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { colors } from '../../theme/colors';
import {
  Calendar,
  ChevronRight,
  Image,
  ImageOff,
  Layers,
  MapPin,
  Truck,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRIMARY = colors.roles.buyer.primary; // #7c3aed
const PRIMARY_LIGHT = colors.roles.buyer.light; // #f5f3ff

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';

interface Photo {
  id: string;
  label: string;
}

interface TimelineEvent {
  id: string;
  time: string;
  status: string;
  location: string;
  note?: string;
  variant: BadgeVariant;
}

interface BatchDetail {
  id: string;
  batchNumber: string;
  wasteType: 'MLP' | 'HDPE' | 'LDPE' | 'PET';
  originVillage: string;
  collectionPoint: string;
  collectionPointCode: string;
  weightKg: number;
  grade: 'A' | 'B' | 'C';
  gradeLabel: string;
  moisture: string;
  condition: 'Clean' | 'Slightly Dirty' | 'Contaminated';
  distanceKm: number;
  pricePerKg: number;
  photos: Photo[];
  timeline: TimelineEvent[];
}

const BATCH: BatchDetail = {
  id: 'b-buy-143',
  batchNumber: 'MLP-2026-0143',
  wasteType: 'MLP',
  originVillage: 'Shanti Nagar',
  collectionPoint: 'Gandhi Street Collection Point',
  collectionPointCode: 'CP-03',
  weightKg: 162,
  grade: 'A',
  gradeLabel: 'A Grade • Clean • Low Moisture',
  moisture: '1.8% (Low)',
  condition: 'Clean',
  distanceKm: 50,
  pricePerKg: 38,
  photos: [
    { id: 'p1', label: 'Load 1 • Gross weighbridge slip' },
    { id: 'p2', label: 'Load 2 • Truck security seal' },
    { id: 'p3', label: 'Load 3 • Material close-up' },
    { id: 'p4', label: 'Load 4 • Collection point' },
  ],
  timeline: [
    {
      id: 't1',
      time: '16 Oct, 10:24 AM',
      status: 'Collected',
      location: 'CP-03 Gandhi Street',
      note: '162 kg collected from village collection point',
      variant: 'success',
    },
    {
      id: 't2',
      time: '16 Oct, 11:05 AM',
      status: 'Inspected',
      location: 'Tidel MRF Facility',
      note: 'Quality inspection passed — Grade A, 1.8% moisture',
      variant: 'success',
    },
    {
      id: 't3',
      time: '16 Oct, 02:30 PM',
      status: 'Stored',
      location: 'Zone A (MLP)',
      note: 'Stored in dedicated MLP storage zone',
      variant: 'info',
    },
    {
      id: 't4',
      time: '17 Oct, 09:00 AM',
      status: 'Ready for Dispatch',
      location: 'Dispatch Bay 2',
      note: 'Awaiting buyer pickup scheduling',
      variant: 'warning',
    },
  ],
};

const GRADE_COLORS: Record<string, { bg: string; color: string }> = {
  A: { bg: '#ecfdf5', color: '#15803d' },
  B: { bg: '#fef3c7', color: '#b45309' },
  C: { bg: '#fef2f2', color: '#b91c1c' },
};

const conditionColor = (condition: 'Clean' | 'Slightly Dirty' | 'Contaminated') => {
  if (condition === 'Clean') return { bg: '#ecfdf5', color: '#15803d' };
  if (condition === 'Slightly Dirty') return { bg: '#fef3c7', color: '#b45309' };
  return { bg: '#fef2f2', color: '#b91c1c' };
};

const variantMap: Record<BadgeVariant, { bg: string; color: string }> = {
  default: { bg: '#f1f5f9', color: '#475569' },
  success: { bg: '#ecfdf5', color: '#15803d' },
  warning: { bg: '#fef3c7', color: '#b45309' },
  error: { bg: '#fef2f2', color: '#b91c1c' },
  info: { bg: '#eff6ff', color: '#1d4ed8' },
  primary: { bg: PRIMARY_LIGHT, color: PRIMARY },
};

export default function BuyerBatchDetailScreen() {
  const router = useRouter();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photoWidth = (SCREEN_WIDTH - 32 - 10) / 2;

  const gradeTheme = GRADE_COLORS[BATCH.grade];
  const conditionTheme = conditionColor(BATCH.condition);

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="Batch Details"
        subtitle={`${BATCH.batchNumber} • Ready for pickup`}
        showBack
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Batch Information Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoTop}>
            <View style={styles.infoBadge}>
              <Layers size={18} color={PRIMARY} />
            </View>
            <View style={styles.infoMeta}>
              <Text style={styles.batchNumber}>{BATCH.batchNumber}</Text>
              <Text style={styles.batchType}>
                {BATCH.wasteType} • {BATCH.originVillage}
              </Text>
            </View>
            <Text style={styles.batchWeight}>{BATCH.weightKg} kg</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Origin Village</Text>
              <Text style={styles.infoValue}>{BATCH.originVillage}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Collection Point</Text>
              <Text style={styles.infoValue}>
                {BATCH.collectionPointCode} • {BATCH.collectionPoint}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Quality Grade</Text>
              <View style={[styles.gradeChip, { backgroundColor: gradeTheme.bg }]}>
                <Text style={[styles.gradeChipText, { color: gradeTheme.color }]}>
                  Grade {BATCH.grade}
                </Text>
              </View>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Moisture</Text>
              <Text style={styles.infoValue}>{BATCH.moisture}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Condition</Text>
              <View style={[styles.conditionChip, { backgroundColor: conditionTheme.bg }]}>
                <Text style={[styles.conditionChipText, { color: conditionTheme.color }]}>
                  {BATCH.condition}
                </Text>
              </View>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{BATCH.distanceKm} km away</Text>
            </View>
          </View>
        </Card>

        {/* Quality Photos */}
        <SectionHeader
          title="Quality Photos"
          subtitle="Tap a photo to enlarge"
          onViewAll={() => {}}
        />
        <View style={styles.photosGrid}>
          {BATCH.photos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={[styles.photoBox, selectedPhoto === photo.id && styles.photoBoxSelected]}
              onPress={() => setSelectedPhoto(selectedPhoto === photo.id ? null : photo.id)}
              activeOpacity={0.8}
            >
              {selectedPhoto === photo.id ? (
                <ImageOff size={20} color={colors.textMuted} />
              ) : (
                <Image size={20} color={colors.textMuted} />
              )}
              <Text style={styles.photoLabel}>{photo.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custody Timeline */}
        <SectionHeader title="Custody Timeline" subtitle="Chain of custody events" />
        <View style={styles.timeline}>
          {BATCH.timeline.map((event, index) => {
            const isLast = index === BATCH.timeline.length - 1;
            const theme = variantMap[event.variant];
            return (
              <View key={event.id} style={styles.timelineItem}>
                <View style={styles.timelineLine}>
                  {!isLast && <View style={styles.timelineConnector} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineEventRow}>
                    <StatusBadge variant={event.variant} style={styles.timelineBadge}>
                      {event.status}
                    </StatusBadge>
                    <Text style={styles.timelineTime}>{event.time}</Text>
                  </View>
                  <Text style={styles.timelineLocation}>{event.location}</Text>
                  {event.note && <Text style={styles.timelineNote}>{event.note}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Button
            title="Request Pickup"
            variant="outline"
            onPress={() => router.push('/(buyer)/receipt-confirm')}
            style={{
              borderColor: PRIMARY,
              backgroundColor: 'transparent',
            }}
            textStyle={{ color: PRIMARY, fontWeight: '700' }}
          />
          <Button
            title="Schedule Pickup"
            variant="primary"
            onPress={() => router.push('/(buyer)/receipt-confirm')}
            style={{
              backgroundColor: PRIMARY,
              borderColor: 'transparent',
              marginLeft: 10,
            }}
            textStyle={{ color: '#ffffff', fontWeight: '700' }}
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
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoMeta: {
    flex: 1,
    marginHorizontal: 12,
  },
  batchNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchType: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchWeight: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  infoRow: {
    gap: 10,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  gradeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradeChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  conditionChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  conditionChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoBox: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  photoBoxSelected: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_LIGHT,
  },
  photoLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timeline: {
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineLine: {
    width: 24,
    alignItems: 'center',
  },
  timelineConnector: {
    width: 2,
    backgroundColor: colors.borderLight,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 10,
  },
  timelineEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  timelineBadge: {
    // variant handles color
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timelineLocation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  timelineNote: {
    fontSize: 10,
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
