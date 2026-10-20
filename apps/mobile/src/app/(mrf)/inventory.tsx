import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { MRF_STORAGE_ZONES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  BarChart2,
  ArrowUpRight,
  ArrowDownLeft,
  Archive,
  Send,
  Layers,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react-native';

const mrf = colors.roles.mrf;

type MovementType = 'IN' | 'OUT';

type Movement = {
  id: string;
  title: string;
  type: MovementType;
  weight: string;
  date: string;
  zone: string;
};

const MOVEMENTS: Movement[] = [
  {
    id: 'm-1',
    title: 'Batch MLP-2026-0143 Intake',
    type: 'IN',
    weight: '+12.8 kg',
    date: 'Today, 10:24 AM',
    zone: 'Zone A',
  },
  {
    id: 'm-2',
    title: 'Batch MLP-2026-0142 Intake',
    type: 'IN',
    weight: '+16.2 kg',
    date: 'Today, 09:15 AM',
    zone: 'Zone A',
  },
  {
    id: 'm-3',
    title: 'Dispatch to GreenCycle PO-89',
    type: 'OUT',
    weight: '-180.0 kg',
    date: 'Yesterday, 04:30 PM',
    zone: 'Zone A',
  },
  {
    id: 'm-4',
    title: 'Batch MLP-2026-0140 Intake',
    type: 'IN',
    weight: '+24.5 kg',
    date: '15 Oct, 04:00 PM',
    zone: 'Zone B',
  },
  {
    id: 'm-5',
    title: 'Quality Rework - MLP-2026-0139',
    type: 'OUT',
    weight: '-5.2 kg',
    date: '14 Oct, 11:20 AM',
    zone: 'Zone C',
  },
];

const totalStockKg = 420;
const totalCapacityKg = 1000;
const capacityPercent = Math.round((totalStockKg / totalCapacityKg) * 100);

export default function MrfInventoryScreen() {
  const router = useRouter();

  const inboundKg = MOVEMENTS.filter((m) => m.type === 'IN').reduce((acc, m) => acc + Number(m.weight.replace('+', '').replace(' kg', '')), 0);
  const outboundKg = MOVEMENTS.filter((m) => m.type === 'OUT').reduce((acc, m) => acc + Number(m.weight.replace('-', '').replace(' kg', '')), 0);

  return (
    <Screen title="MLP Inventory" subtitle="Stock Balance & Ledger">
      {/* Stock Summary */}
      <SectionHeader title="Stock Summary" />
      <View style={styles.statGrid}>
        <StatCard
          value={`${totalStockKg} kg`}
          label="Total Stock"
          subtext={`${capacityPercent}% of capacity`}
          icon={<Layers size={20} color="#2563eb" />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />
        <StatCard
          value={`+${inboundKg} kg`}
          label="Inbound Today"
          subtext="Received into zones"
          icon={<ArrowDownLeft size={20} color="#15803d" />}
          iconBg="#ecfdf5"
          iconColor="#15803d"
        />
        <StatCard
          value={`-${outboundKg} kg`}
          label="Outbound Today"
          subtext="Dispatched to processors"
          icon={<ArrowUpRight size={20} color="#7c3aed" />}
          iconBg="#f5f3ff"
          iconColor="#7c3aed"
        />
        <StatCard
          value="100%"
          label="Grade Accuracy"
          subtext="All batches inspected"
          icon={<CheckCircle2 size={20} color="#10b981" />}
          iconBg="#ecfdf5"
          iconColor="#10b981"
        />
      </View>

      {/* Stock Levels per Zone */}
      <SectionHeader title="Stock Levels by Zone" />
      <View style={styles.zonesList}>
        {MRF_STORAGE_ZONES.map((zone) => {
          const nearFull = zone.percentage > 85;
          return (
            <Card key={zone.id} style={styles.zoneCard} padding={14}>
              <View style={styles.zoneRow}>
                <View style={styles.zoneLeft}>
                  <View style={[styles.zoneDot, { backgroundColor: zone.color }]} />
                  <View>
                    <Text style={styles.zoneName}>{zone.name}</Text>
                    <Text style={styles.zoneType}>{zone.type}</Text>
                  </View>
                </View>
                <View style={styles.zoneRight}>
                  <Text style={styles.zoneKg}>{zone.currentKg} kg</Text>
                  <Text style={styles.zonePercent}>{zone.capacityKg} kg capacity</Text>
                </View>
              </View>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${zone.percentage}%`,
                      backgroundColor: nearFull ? '#dc2626' : zone.color,
                    },
                  ]}
                />
              </View>
              {nearFull && (
                <View style={styles.warningRow}>
                  <Text style={styles.warningText}>Near full capacity</Text>
                </View>
              )}
            </Card>
          );
        })}
      </View>

      {/* Reconciliation Section */}
      <Card style={styles.reconCard} padding={16}>
        <SectionHeader title="Reconciliation" style={styles.sectionNoMargin} />
        <View style={styles.reconRow}>
          <View style={styles.reconCol}>
            <Text style={styles.reconLabel}>Physical Count</Text>
            <Text style={styles.reconValue}>420 kg</Text>
          </View>
          <View style={styles.reconDivider} />
          <View style={styles.reconCol}>
            <Text style={styles.reconLabel}>System Balance</Text>
            <Text style={styles.reconValue}>420 kg</Text>
          </View>
          <View style={styles.reconDivider} />
          <View style={styles.reconCol}>
            <Text style={styles.reconLabel}>Variance</Text>
            <Text style={styles.reconValue}>0 kg</Text>
          </View>
        </View>
        <View style={styles.reconAction}>
          <Button
            title="Reconcile Stock"
            variant="outline"
            leftIcon={<RefreshCw size={16} color={mrf.primary} />}
            style={styles.reconBtn}
            onPress={() => Alert.alert('Reconciliation complete', 'Stock matches system records.')}
          />
        </View>
      </Card>

      {/* Recent Movements Ledger */}
      <SectionHeader title="Recent Movements" viewAllLabel="View All" onViewAll={() => router.push('/(mrf)/inventory')} />
      {MOVEMENTS.map((movement) => {
        const isIncoming = movement.type === 'IN';
        return (
          <Card key={movement.id} style={styles.moveCard} padding={12}>
            <TouchableOpacity style={styles.moveTouch} activeOpacity={0.8}>
              <View style={styles.moveRow}>
                <View style={[styles.moveIcon, isIncoming ? styles.moveIn : styles.moveOut]}>
                  {isIncoming ? (
                    <ArrowDownLeft size={16} color="#15803d" />
                  ) : (
                    <ArrowUpRight size={16} color="#7c3aed" />
                  )}
                </View>
                <View style={styles.moveMeta}>
                  <Text style={styles.moveTitle}>{movement.title}</Text>
                  <Text style={styles.moveSub}>{movement.date} • {movement.zone}</Text>
                </View>
                <View style={styles.moveWeightWrapper}>
                  <Text style={[styles.moveWeight, isIncoming ? styles.moveWeightIn : styles.moveWeightOut]}>
                    {movement.weight}
                  </Text>
                  <StatusBadge
                    variant={isIncoming ? 'success' : 'primary'}
                    small
                    children={isIncoming ? 'Inbound' : 'Outbound'}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        );
      })}

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  zonesList: {
    gap: 10,
    marginBottom: 4,
  },
  zoneCard: {
    marginBottom: 0,
  },
  zoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  zoneDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  zoneType: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  zoneRight: {
    alignItems: 'flex-end',
  },
  zoneKg: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  zonePercent: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  barBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  warningRow: {
    marginTop: 6,
  },
  warningText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#b91c1c',
  },
  reconCard: {
    marginTop: 4,
    marginBottom: 4,
  },
  sectionNoMargin: {
    marginTop: 0,
    marginBottom: 10,
  },
  reconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reconCol: {
    alignItems: 'center',
  },
  reconDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderLight,
    marginVertical: 2,
  },
  reconLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  reconValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  reconAction: {
    marginTop: 12,
  },
  reconBtn: {
    alignSelf: 'center',
    width: 180,
  },
  moveCard: {
    marginBottom: 8,
  },
  moveTouch: {
    minHeight: 44,
  },
  moveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moveIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  moveIn: {
    backgroundColor: '#ecfdf5',
  },
  moveOut: {
    backgroundColor: '#f5f3ff',
  },
  moveMeta: {
    flex: 1,
  },
  moveTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  moveSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  moveWeightWrapper: {
    alignItems: 'flex-end',
    gap: 6,
  },
  moveWeight: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  moveWeightIn: {
    color: '#15803d',
  },
  moveWeightOut: {
    color: '#7c3aed',
  },
  bottomSpacer: {
    height: 20,
  },
});
