import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { MRF_BATCHES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Layers,
  SearchCheck,
  MapPin,
  ChevronRight,
  Clock,
  Scan,
  Smartphone,
} from 'lucide-react-native';

const mrf = colors.roles.mrf;

type BatchStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'INSPECTION'
  | 'STORAGE'
  | 'READY_DISPATCH'
  | 'DISPATCHED'
  | 'ACCEPTED';

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'error' | 'primary' }> = {
  PENDING: { label: 'Pending', variant: 'default' },
  RECEIVED: { label: 'Received', variant: 'info' },
  INSPECTION: { label: 'In Inspection', variant: 'warning' },
  STORAGE: { label: 'In Storage', variant: 'success' },
  READY_DISPATCH: { label: 'Ready Dispatch', variant: 'primary' },
  DISPATCHED: { label: 'Dispatched', variant: 'success' },
  ACCEPTED: { label: 'Accepted', variant: 'success' },
};

const STATUS_TABS: { key: BatchStatus | 'All'; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'RECEIVED', label: 'Received' },
  { key: 'INSPECTION', label: 'Inspection' },
  { key: 'STORAGE', label: 'Storage' },
  { key: 'READY_DISPATCH', label: 'Ready Dispatch' },
];

export default function MrfBatchesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'All' | BatchStatus>('All');
  const [search, setSearch] = useState('');

  const filteredBatches = MRF_BATCHES.filter((batch) => {
    const matchesTab =
      activeTab === 'All' || batch.status === activeTab;
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      batch.collectionPointName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleScanQR = () => {
    router.push('/(mrf)/batches');
  };

  if (filteredBatches.length === 0) {
    return (
      <Screen title="Inbound Batches" subtitle="Traceability & Intake Ledger">
        <EmptyState
          icon={<Layers size={34} color={colors.textMuted} />}
          title="No batches found"
          subtitle="Try adjusting the status filter or search keyword."
          action={{ label: 'Clear Filters', onPress: () => setSearch('') }}
        />
      </Screen>
    );
  }

  return (
    <Screen title="Inbound Batches" subtitle="Traceability & Intake Ledger">
      {/* Search + Scan QR */}
      <View style={styles.topBar}>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search batch or origin..."
          containerStyle={styles.searchInput}
        />
        <Button
          title="Scan QR"
          variant="primary"
          leftIcon={<Scan size={18} color="#ffffff" />}
          fullWidth={false}
          style={styles.scanBtn}
          onPress={handleScanQR}
        />
      </View>

      {/* Status Tabs */}
      <SectionHeader title="Queue" />
      <View style={styles.tabsRow}>
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.label}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Batches List */}
      {filteredBatches.map((batch) => {
        const statusInfo = STATUS_LABELS[batch.status] ?? STATUS_LABELS.PENDING;
        return (
          <Card key={batch.id} style={styles.batchCard} padding={14}>
            <TouchableOpacity
              style={styles.batchTouch}
              onPress={() => router.push('/(mrf)/inspection')}
              activeOpacity={0.8}
            >
              <View style={styles.batchRow}>
                <View style={[styles.batchIcon, { backgroundColor: '#fff7ed' }]}>
                  <Layers size={18} color={mrf.primary} />
                </View>
                <View style={styles.batchMeta}>
                  <Text style={styles.batchTitle}>{batch.batchNumber}</Text>
                  <Text style={styles.batchOrigin}>
                    From {batch.collectionPointName}
                  </Text>
                </View>
                <View style={styles.batchRightTop}>
                  <StatusBadge
                    variant={statusInfo.variant}
                    children={statusInfo.label}
                  />
                </View>
              </View>
              <View style={styles.batchRowBottom}>
                <View style={styles.weightPill}>
                  <Text style={styles.weightText}>{batch.weightKg} kg</Text>
                </View>
                <View style={styles.timeRow}>
                  <Clock size={12} color={colors.textMuted} />
                  <Text style={styles.timeText}>
                    {new Date(batch.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeText}>Grade {batch.qualityGrade || 'A'}</Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  searchInput: {
    flex: 1,
  },
  scanBtn: {
    minHeight: 48,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#ffffff',
  },
  tabActive: {
    borderColor: mrf.primary,
    backgroundColor: mrf.light,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: mrf.primary,
    fontWeight: '700',
  },
  batchCard: {
    marginBottom: 10,
  },
  batchTouch: {
    minHeight: 44,
  },
  batchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchMeta: {
    flex: 1,
  },
  batchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchOrigin: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchRightTop: {
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  batchRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
  },
  weightPill: {
    backgroundColor: '#f8faf9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: colors.border,
  },
  weightText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  gradeBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
  },
});
