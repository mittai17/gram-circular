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
import { BottomNav } from '../../components/common/BottomNav';
import { MRF_STORAGE_ZONES, MRF_BATCHES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Building2,
  Layers,
  SearchCheck,
  Archive,
  Send,
  BarChart2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

export default function MrfDashboard() {
  const router = useRouter();

  const totalStockKg = 420;
  const totalCapacityKg = 1000;
  const capacityPercent = Math.round((totalStockKg / totalCapacityKg) * 100);

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="Welcome, Selvam!"
        subtitle="Tidel MRF Processing Facility"
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Today's Batches 4-Stat Grid */}
        <Text style={styles.sectionTitle}>Today's Batches</Text>

        <View style={styles.statGrid}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push('/(mrf)/batches')}
            activeOpacity={0.8}
          >
            <Text style={[styles.statNum, { color: '#2563eb' }]}>12</Text>
            <Text style={styles.statLabel}>Received</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push('/(mrf)/inspection')}
            activeOpacity={0.8}
          >
            <Text style={[styles.statNum, { color: '#ea580c' }]}>8</Text>
            <Text style={styles.statLabel}>In Inspection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push('/(mrf)/storage')}
            activeOpacity={0.8}
          >
            <Text style={[styles.statNum, { color: '#16a34a' }]}>6</Text>
            <Text style={styles.statLabel}>In Storage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push('/(mrf)/dispatch')}
            activeOpacity={0.8}
          >
            <Text style={[styles.statNum, { color: '#7c3aed' }]}>3</Text>
            <Text style={styles.statLabel}>Ready Dispatch</Text>
          </TouchableOpacity>
        </View>

        {/* Total MLP Stock Capacity Card */}
        <View style={styles.stockCard}>
          <View style={styles.stockHeader}>
            <View>
              <Text style={styles.stockTitle}>Total MLP Stock</Text>
              <Text style={styles.stockSubtitle}>Multi-layer plastic segregated storage</Text>
            </View>
            <View style={styles.capacityBadge}>
              <Text style={styles.capacityText}>{capacityPercent}% capacity</Text>
            </View>
          </View>

          <View style={styles.stockAmountRow}>
            <Text style={styles.stockAmount}>{totalStockKg}</Text>
            <Text style={styles.stockUnit}>kg / {totalCapacityKg} kg max</Text>
          </View>

          {/* Capacity Progress Bar */}
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${capacityPercent}%` }]} />
          </View>

          <View style={styles.zonesMiniRow}>
            {MRF_STORAGE_ZONES.map((zone) => (
              <View key={zone.id} style={styles.zoneMiniCol}>
                <View style={[styles.colorDot, { backgroundColor: zone.color }]} />
                <Text style={styles.zoneMiniText}>
                  {zone.name}: {zone.currentKg} kg
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Shortcuts */}
        <Text style={styles.sectionTitle}>Operations</Text>

        <TouchableOpacity
          style={styles.actionRowCard}
          onPress={() => router.push('/(mrf)/inspection')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#fff7ed' }]}>
            <SearchCheck size={22} color="#ea580c" />
          </View>
          <View style={styles.actionMeta}>
            <Text style={styles.actionName}>Quality Inspection</Text>
            <Text style={styles.actionDesc}>Inspect MLP-2026-0143 (12.8 kg • CP-03)</Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRowCard}
          onPress={() => router.push('/(mrf)/storage')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#e8f5e9' }]}>
            <Archive size={22} color="#1a5c38" />
          </View>
          <View style={styles.actionMeta}>
            <Text style={styles.actionName}>Storage Zone Update</Text>
            <Text style={styles.actionDesc}>Assign batches to Zone A, Zone B, Zone C</Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRowCard}
          onPress={() => router.push('/(mrf)/dispatch')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#f5f3ff' }]}>
            <Send size={22} color="#7c3aed" />
          </View>
          <View style={styles.actionMeta}>
            <Text style={styles.actionName}>Dispatch to Recycler</Text>
            <Text style={styles.actionDesc}>GreenCycle Pvt Ltd • 180 kg available</Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Recent Batches Feed */}
        <View style={styles.batchesHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Inbound Batches</Text>
          <TouchableOpacity onPress={() => router.push('/(mrf)/batches')}>
            <Text style={styles.viewAllLink}>View All ({MRF_BATCHES.length})</Text>
          </TouchableOpacity>
        </View>

        {MRF_BATCHES.slice(0, 3).map((b) => (
          <View key={b.id} style={styles.batchItem}>
            <View style={styles.batchLeft}>
              <Text style={styles.batchNum}>{b.batchNumber}</Text>
              <Text style={styles.batchPoint}>{b.collectionPointName}</Text>
            </View>
            <View style={styles.batchRight}>
              <Text style={styles.batchKg}>{b.weightKg} kg</Text>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>Grade {b.qualityGrade || 'A'}</Text>
              </View>
            </View>
          </View>
        ))}

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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop: 4,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  stockCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  stockSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  capacityBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  capacityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  stockAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
  },
  stockAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  stockUnit: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  barBg: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    marginVertical: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#1a5c38',
    borderRadius: 5,
  },
  zonesMiniRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  zoneMiniCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  zoneMiniText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  actionRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionMeta: {
    flex: 1,
  },
  actionName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  viewAllLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ea580c',
  },
  batchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  batchLeft: {
    flex: 1,
  },
  batchNum: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  batchPoint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  batchRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  batchKg: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  gradeBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  gradeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
});
