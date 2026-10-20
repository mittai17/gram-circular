import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { MRF_STORAGE_ZONES, MRF_BATCHES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  PackageCheck,
  SearchCheck,
  Archive,
  Send,
  ChevronRight,
  Layers,
  Factory,
} from 'lucide-react-native';

const mrf = colors.roles.mrf; // primary: #ea580c, light: #fff7ed

type BatchSummary = {
  batchNumber: string;
  collectionPointName: string;
  weightKg: number;
  qualityGrade: string | undefined;
};

export default function MrfDashboard() {
  const router = useRouter();

  const totalStockKg = 420;
  const totalCapacityKg = 1000;
  const capacityPercent = Math.round((totalStockKg / totalCapacityKg) * 100);

  const handleStatPress = (route: string) => () => router.push(`/(mrf)${route}` as any);

  return (
    <Screen title="Welcome, Selvam!" subtitle="Tidel MRF Processing Facility">
      {/* Stat Grid */}
      <SectionHeader title="Today's Batches" />
      <View style={styles.statGrid}>
        <TouchableOpacity
          style={styles.statWrap}
          onPress={handleStatPress('/batches')}
          activeOpacity={0.8}
        >
          <StatCard
            value="12"
            label="Received"
            subtext="Awaiting inspection"
            icon={<PackageCheck size={20} color="#2563eb" />}
            iconBg="#eff6ff"
            iconColor="#2563eb"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statWrap}
          onPress={handleStatPress('/inspection')}
          activeOpacity={0.8}
        >
          <StatCard
            value="8"
            label="In Inspection"
            subtext="Quality checks pending"
            icon={<SearchCheck size={20} color="#ea580c" />}
            iconBg="#fff7ed"
            iconColor="#ea580c"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statWrap}
          onPress={handleStatPress('/storage')}
          activeOpacity={0.8}
        >
          <StatCard
            value="6"
            label="In Storage"
            subtext="Allocated to zones"
            icon={<Archive size={20} color="#16a34a" />}
            iconBg="#ecfdf5"
            iconColor="#16a34a"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statWrap}
          onPress={handleStatPress('/dispatch')}
          activeOpacity={0.8}
        >
          <StatCard
            value="3"
            label="Ready Dispatch"
            subtext="Outbound queue"
            icon={<Send size={20} color="#7c3aed" />}
            iconBg="#f5f3ff"
            iconColor="#7c3aed"
          />
        </TouchableOpacity>
      </View>

      {/* Total MLP Stock Capacity Card */}
      <Card style={styles.stockCard}>
        <View style={styles.stockHeader}>
          <View>
            <Text style={styles.stockTitle}>Total MLP Stock</Text>
            <Text style={styles.stockSubtitle}>
              Multi-layer plastic segregated storage
            </Text>
          </View>
          <StatusBadge variant="success" children={`${capacityPercent}% capacity`} />
        </View>

        <View style={styles.stockAmountRow}>
          <Text style={styles.stockAmount}>{totalStockKg}</Text>
          <Text style={styles.stockUnit}>kg / {totalCapacityKg} kg max</Text>
        </View>

        {/* Capacity Progress Bar */}
        <View style={styles.barLabelRow}>
          <Text style={styles.barLabel}>Storage Utilization</Text>
          <Text style={styles.barValue}>{totalStockKg} kg of {totalCapacityKg} kg</Text>
        </View>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${capacityPercent}%`, backgroundColor: mrf.primary }]} />
        </View>

        <View style={styles.zonesMiniRow}>
          {MRF_STORAGE_ZONES.map((zone) => (
            <View key={zone.id} style={styles.zoneMiniCol}>
              <View style={[styles.colorDot, { backgroundColor: zone.color }]} />
              <Text style={styles.zoneMiniText}>{zone.name}: {zone.currentKg} kg</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Operation Shortcuts */}
      <SectionHeader title="Operations" />
      <View style={styles.shortcuts}>
        {[
          {
            title: 'MLP Upcycling Engine',
            desc: 'Launch production run • IS 15658 / IRC:SP:98',
            icon: <Factory size={20} color="#ea580c" />,
            iconBg: mrf.light,
            color: mrf.primary,
            onPress: () => router.push('/(mrf)/manufacturing'),
          },
          {
            title: 'Quality Inspection',
            desc: 'Inspect MLP-2026-0143 • 12.8 kg',
            icon: <SearchCheck size={20} color="#ea580c" />,
            iconBg: mrf.light,
            color: mrf.primary,
            onPress: () => router.push('/(mrf)/inspection'),
          },
          {
            title: 'Storage Zone Update',
            desc: 'Assign batches to Zone A, B, C',
            icon: <Archive size={20} color="#1a5c38" />,
            iconBg: '#e8f5e9',
            color: '#1a5c38',
            onPress: () => router.push('/(mrf)/storage'),
          },
          {
            title: 'Dispatch to Recycler',
            desc: 'GreenCycle Pvt Ltd • 180 kg available',
            icon: <Send size={20} color="#7c3aed" />,
            iconBg: '#f5f3ff',
            color: '#7c3aed',
            onPress: () => router.push('/(mrf)/dispatch'),
          },
        ].map((shortcut) => (
          <TouchableOpacity
            key={shortcut.title}
            style={styles.shortcutRow}
            onPress={shortcut.onPress}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: shortcut.iconBg }]}>
              {shortcut.icon}
            </View>
            <View style={styles.shortcutMeta}>
              <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
              <Text style={styles.shortcutDesc}>{shortcut.desc}</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Inbound Batches Feed */}
      <SectionHeader
        title="Recent Inbound Batches"
        viewAllLabel="View All"
        onViewAll={() => router.push('/(mrf)/batches')}
      />
      {MRF_BATCHES.slice(0, 3).map((batch) => (
        <Card key={batch.id} style={styles.batchCard} padding={14}>
          <View style={styles.batchRow}>
            <View style={styles.batchLeft}>
              <View style={[styles.batchIcon, { backgroundColor: '#fff7ed' }]}>
                <Layers size={18} color={mrf.primary} />
              </View>
              <View>
                <Text style={styles.batchNum}>{batch.batchNumber}</Text>
                <Text style={styles.batchPoint}>{batch.collectionPointName}</Text>
              </View>
            </View>
            <View style={styles.batchRight}>
              <Text style={styles.batchKg}>{batch.weightKg} kg</Text>
              <StatusBadge variant="success" small children={`Grade ${batch.qualityGrade || 'A'}`} />
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  statWrap: {
    flex: 1,
  },
  stockCard: {
    marginTop: 4,
    marginBottom: 4,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stockTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  stockSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stockAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
  },
  stockAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  stockUnit: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '700',
    color: mrf.primary,
  },
  barBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  zonesMiniRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
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
  shortcuts: {
    gap: 10,
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shortcutMeta: {
    flex: 1,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  shortcutDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchCard: {
    marginBottom: 8,
  },
  batchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  batchIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchNum: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchPoint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  batchKg: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});
