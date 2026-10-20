import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { WORKER_COLLECTIONS } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Layers,
  CheckCircle2,
  Clock,
  QrCode,
  MapPin,
  ChevronRight,
  Plus,
  Search,
  Filter,
} from 'lucide-react-native';

type TabKey = 'all' | 'today' | 'this-week' | 'this-month';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'this-week', label: 'This Week' },
  { key: 'this-month', label: 'This Month' },
];

const SYNC_BADGE_VARIANT: Record<string, 'success' | 'default' | 'info'> = {
  SYNCED: 'success',
  PENDING: 'default',
  SYNCING: 'info',
  FAILED: 'default',
};

export default function WorkerMyCollectionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = WORKER_COLLECTIONS.filter((item) => {
    const matchesSearch =
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.collectionPointName.toLowerCase().includes(searchQuery.toLowerCase());

    const now = new Date();
    const created = new Date(item.createdAt);
    let matchesTab = true;

    if (activeTab === 'today') {
      matchesTab =
        created.toDateString() === now.toDateString();
    } else if (activeTab === 'this-week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesTab = created >= weekAgo;
    } else if (activeTab === 'this-month') {
      matchesTab = created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesTab;
  });

  const totalKg = filtered.reduce((acc, c) => acc + c.weightKg, 0);

  const renderItem = ({ item }: { item: (typeof WORKER_COLLECTIONS)[number] }) => {
    const isSynced = item.syncStatus === 'SYNCED';
    return (
      <Card style={styles.itemCard} padding={14}>
        <TouchableOpacity
          onPress={() => router.push('/(worker)/qr-preview')}
          activeOpacity={0.8}
        >
          <View style={styles.itemRow}>
            <View style={[styles.bagIcon, { backgroundColor: isSynced ? '#e8f5e9' : '#fff7ed' }]}>
              <Layers size={20} color={isSynced ? '#1a5c38' : '#ea580c'} />
            </View>
            <View style={styles.itemMeta}>
              <Text style={styles.itemBatch}>{item.batchNumber}</Text>
              <Text style={styles.itemPoint}>{item.collectionPointName}</Text>
              <Text style={styles.itemTime}>
                {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                {', '}
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemKg}>{item.weightKg.toFixed(1)} kg</Text>
              <StatusBadge
                variant={SYNC_BADGE_VARIANT[item.syncStatus] as any}
                small
                style={styles.statusChip}
              >
                {item.syncStatus}
              </StatusBadge>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <Screen
      title="My Collections"
      subtitle={`Today • ${WORKER_COLLECTIONS.length} Records`}
      showBack
      showOfflineBanner
      showBottomNav
    >
      {/* Search Bar */}
      <Input
        placeholder="Search batch ID or location..."
        leftIcon={<Search size={18} color={colors.textMuted} />}
        value={searchQuery}
        onChangeText={setSearchQuery}
        containerStyle={styles.searchContainer}
      />

      {/* Total Summary Banner */}
      <Card style={styles.summaryCard} padding={16}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryTitle}>Total Collected Weight</Text>
          <Text style={styles.summaryKg}>{totalKg.toFixed(1)} kg</Text>
        </View>
        <View style={styles.summaryRight}>
          <View style={[styles.statPill, { backgroundColor: '#ecfdf5' }]}>
            <Text style={styles.statPillText}>
              {WORKER_COLLECTIONS.filter((c) => c.syncStatus === 'SYNCED').length} Synced
            </Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#fff7ed' }]}>
            <Text style={[styles.statPillText, { color: '#c2410c' }]}>
              {WORKER_COLLECTIONS.filter((c) => c.syncStatus === 'PENDING').length} In Queue
            </Text>
          </View>
        </View>
      </Card>

      {/* Tab Filter */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Collections List */}
      <SectionHeader title="Collected Bags" subtitle={`${filtered.length} record${filtered.length !== 1 ? 's' : ''}`} />

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Layers size={32} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No collections found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search or tab filter.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 16,
  },
  summaryCard: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    gap: 4,
  },
  summaryTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryKg: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  summaryRight: {
    gap: 8,
  },
  statPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  statPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  tabItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: '#2563eb',
  },
  itemCard: {
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bagIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemMeta: {
    flex: 1,
  },
  itemBatch: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemPoint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  itemTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  itemKg: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusChip: {
    minWidth: 70,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 20,
  },
});
