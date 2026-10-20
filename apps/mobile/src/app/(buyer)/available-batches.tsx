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
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { colors } from '../../theme/colors';
import {
  ChevronRight,
  Clock,
  Droplets,
  MapPin,
  MapPin as MapPinIcon,
  ShieldCheck,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRIMARY = colors.roles.buyer.primary; // #7c3aed
const PRIMARY_LIGHT = colors.roles.buyer.light; // #f5f3ff
const BORDER = colors.roles.buyer.border; // #ddd6fe

const MATERIAL_TAGS = ['All', 'MLP', 'HDPE', 'LDPE', 'PET'] as const;
const GRADE_TAGS = ['All', 'A', 'B', 'C'] as const;

interface CatalogBatch {
  id: string;
  batchNumber: string;
  wasteType: 'MLP' | 'HDPE' | 'LDPE' | 'PET';
  weightKg: number;
  grade: 'A' | 'B' | 'C';
  gradeLabel: string;
  moisture: string;
  condition: 'Clean' | 'Slightly Dirty' | 'Contaminated';
  origin: string;
  distanceKm: number;
  pricePerKg: number;
}

const CATALOG: CatalogBatch[] = [
  {
    id: 'cat-1',
    batchNumber: 'MLP-2026-0143',
    wasteType: 'MLP',
    weightKg: 162,
    grade: 'A',
    gradeLabel: 'A Grade • Clean',
    moisture: 'Low (1.8%)',
    condition: 'Clean',
    origin: 'CP-03 Gandhi Street, Kaveripattinam',
    distanceKm: 50,
    pricePerKg: 38,
  },
  {
    id: 'cat-2',
    batchNumber: 'MLP-2026-0142',
    wasteType: 'MLP',
    weightKg: 98,
    grade: 'B',
    gradeLabel: 'B Grade • Standard',
    moisture: 'Medium (3.2%)',
    condition: 'Slightly Dirty',
    origin: 'CP-07 School Road, Kaveripattinam',
    distanceKm: 54,
    pricePerKg: 32,
  },
  {
    id: 'cat-3',
    batchNumber: 'HDPE-2026-0089',
    wasteType: 'HDPE',
    weightKg: 210,
    grade: 'A',
    gradeLabel: 'A Grade • Rigid HDPE',
    moisture: 'Low (1.2%)',
    condition: 'Clean',
    origin: 'Tidel MRF Facility Zone 2',
    distanceKm: 60,
    pricePerKg: 44,
  },
  {
    id: 'cat-4',
    batchNumber: 'LDPE-2026-0044',
    wasteType: 'LDPE',
    weightKg: 185,
    grade: 'A',
    gradeLabel: 'A Grade • Film LDPE',
    moisture: 'Low (1.5%)',
    condition: 'Clean',
    origin: 'Tidel MRF Facility Zone 2',
    distanceKm: 60,
    pricePerKg: 36,
  },
  {
    id: 'cat-5',
    batchNumber: 'PET-2026-0067',
    wasteType: 'PET',
    weightKg: 140,
    grade: 'B',
    gradeLabel: 'B Grade • Bottle Flakes',
    moisture: 'Medium (2.8%)',
    condition: 'Slightly Dirty',
    origin: 'CP-05 Temple Street, Shanti Nagar',
    distanceKm: 45,
    pricePerKg: 41,
  },
  {
    id: 'cat-6',
    batchNumber: 'MLP-2026-0150',
    wasteType: 'MLP',
    weightKg: 75,
    grade: 'C',
    gradeLabel: 'C Grade • Mixed',
    moisture: 'High (5.1%)',
    condition: 'Contaminated',
    origin: 'CP-01 Shanti Nagar Main',
    distanceKm: 38,
    pricePerKg: 24,
  },
];

const WASTE_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  All: { bg: '#f1f5f9', color: '#64748b' },
  MLP: { bg: '#ecfdf5', color: '#15803d' },
  HDPE: { bg: '#eff6ff', color: '#2563eb' },
  LDPE: { bg: '#f0fdfa', color: '#0d9488' },
  PET: { bg: '#faf5ff', color: '#7c3aed' },
};

const GRADE_COLORS: Record<string, { bg: string; color: string }> = {
  All: { bg: '#f1f5f9', color: '#64748b' },
  A: { bg: '#ecfdf5', color: '#15803d' },
  B: { bg: '#fef3c7', color: '#b45309' },
  C: { bg: '#fef2f2', color: '#b91c1c' },
};

const conditionColor = (condition: 'Clean' | 'Slightly Dirty' | 'Contaminated') => {
  if (condition === 'Clean') return { bg: '#ecfdf5', color: '#15803d' };
  if (condition === 'Slightly Dirty') return { bg: '#fef3c7', color: '#b45309' };
  return { bg: '#fef2f2', color: '#b91c1c' };
};

export default function BuyerAvailableBatchesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMaterial, setActiveMaterial] = useState<typeof MATERIAL_TAGS[number]>('All');
  const [activeGrade, setActiveGrade] = useState<typeof GRADE_TAGS[number]>('All');

  const filteredBatches = CATALOG.filter((b) => {
    const matchMaterial = activeMaterial === 'All' || b.wasteType === activeMaterial;
    const matchGrade = activeGrade === 'All' || b.grade === activeGrade;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      q === '' ||
      b.batchNumber.toLowerCase().includes(q) ||
      b.origin.toLowerCase().includes(q) ||
      b.wasteType.toLowerCase().includes(q);
    return matchMaterial && matchGrade && matchSearch;
  });

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="Available Batches"
        subtitle="B2B Marketplace & EPR Verified"
        showBack
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <Input
          placeholder="Search batch ID, origin or material…"
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.inputContainer}
        />

        {/* Grade filter pills */}
        <SectionHeader
          title="Filter by Grade"
          subtitle="Tap a grade to refine results"
          style={styles.pillSection}
        />
        <View style={styles.pillsRow}>
          {GRADE_TAGS.map((grade) => {
            const active = activeGrade === grade;
            return (
              <TouchableOpacity
                key={grade}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setActiveGrade(grade)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, active && styles.pillActiveText]}>
                  Grade {grade}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Material type tabs */}
        <SectionHeader
          title="Material Type"
          subtitle="MLP, HDPE, LDPE, PET"
          style={styles.pillSection}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.materialScroll}
        >
          {MATERIAL_TAGS.map((tag) => {
            const active = activeMaterial === tag;
            const theme = WASTE_TYPE_COLORS[tag] ?? { bg: '#f1f5f9', color: '#64748b' };
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.materialPill, active && styles.materialPillActive]}
                onPress={() => setActiveMaterial(tag)}
                activeOpacity={0.8}
              >
                <View style={[styles.materialDot, { backgroundColor: theme.color }]} />
                <Text style={[styles.materialText, active && styles.materialTextActive]}>
                  {tag}
                </Text>
                {active && <CheckMark color="#ffffff" />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results */}
        <SectionHeader
          title={`Available Batches (${filteredBatches.length})`}
          subtitle="Tap a batch to view details & request pickup"
        />

        {filteredBatches.length === 0 ? (
          <EmptyState
            title="No batches found"
            subtitle="Try adjusting your grade, material or search filters."
            icon={<ShieldCheck size={32} color={colors.textMuted} />}
            action={{
              label: 'Clear Filters',
              onPress: () => {
                setSearchQuery('');
                setActiveMaterial('All');
                setActiveGrade('All');
              },
            }}
          />
        ) : (
          filteredBatches.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.batchCard}
              onPress={() => router.push('/(buyer)/batch-detail')}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.batchIdGroup}>
                  <View
                    style={[
                      styles.materialPill,
                      { backgroundColor: WASTE_TYPE_COLORS[item.wasteType].bg },
                    ]}
                  >
                    <Text style={[styles.materialText, { color: WASTE_TYPE_COLORS[item.wasteType].color }]}>
                      {item.wasteType}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.batchId}>{item.batchNumber}</Text>
                    <Text style={styles.batchGradeLabel}>{item.gradeLabel}</Text>
                  </View>
                </View>
                <View style={styles.batchPrice}>
                  <Text style={styles.priceValue}>₹{item.pricePerKg}</Text>
                  <Text style={styles.priceUnit}>/kg</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardBody}>
                <View style={styles.metaRow}>
                  <MapPinIcon size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{item.origin}</Text>
                  <Text style={styles.metaText}>{` • ${item.distanceKm} km`}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Droplets size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{item.moisture}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Clock size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{item.condition}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.weightGradeRow}>
                  <View style={styles.weightCol}>
                    <Text style={styles.weightLabel}>Weight</Text>
                    <Text style={styles.weightValue}>{item.weightKg} kg</Text>
                  </View>
                  <View style={[styles.gradeChip, { backgroundColor: GRADE_COLORS[item.grade].bg }]}>
                    <Text style={[styles.gradeChipText, { color: GRADE_COLORS[item.grade].color }]}>
                      Grade {item.grade}
                    </Text>
                  </View>
                </View>
                <Button
                  title="Request Pickup"
                  variant="primary"
                  onPress={() => router.push('/(buyer)/batch-detail')}
                  style={{
                    backgroundColor: PRIMARY,
                    borderColor: 'transparent',
                    marginTop: 6,
                  }}
                  textStyle={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}
                />
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

function CheckMark({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <View style={[styles.checkWrap, { backgroundColor: color, width: size, height: size }]}>
      <ShieldCheck size={Math.max(8, Math.round(size * 0.6))} color="#ffffff" />
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
  inputContainer: {
    marginBottom: 14,
  },
  pillSection: {
    marginTop: 14,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#ffffff',
  },
  pillActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillActiveText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  materialScroll: {
    gap: 8,
    paddingRight: 4,
  },
  materialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#ffffff',
  },
  materialPillActive: {
    borderColor: PRIMARY,
  },
  materialDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  materialText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  materialTextActive: {
    color: PRIMARY,
    fontWeight: '700',
  },
  checkWrap: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  batchIdGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  materialPillCard: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  batchPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  priceUnit: {
    fontSize: 10,
    color: colors.textMuted,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  cardBody: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cardFooter: {
    marginTop: 4,
  },
  weightGradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  weightCol: {},
  weightLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  weightValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
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
  batchId: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchGradeLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
