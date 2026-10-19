import React from 'react';
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
} from 'lucide-react-native';

export default function WorkerMyCollectionsScreen() {
  const router = useRouter();

  const totalKg = WORKER_COLLECTIONS.reduce((acc, c) => acc + c.weightKg, 0);

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="My Collections"
        subtitle={`Today • ${WORKER_COLLECTIONS.length} Records`}
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(worker)/weighing')}
          >
            <Plus size={18} color="#ffffff" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Total Summary Banner */}
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryTitle}>Today's Total MLP Weight</Text>
            <Text style={styles.summaryKg}>{totalKg.toFixed(1)} kg</Text>
          </View>
          <View style={styles.summaryRight}>
            <View style={styles.statPill}>
              <Text style={styles.statPillText}>
                {WORKER_COLLECTIONS.filter((c) => c.syncStatus === 'SYNCED').length} Synced
              </Text>
            </View>
            <View style={[styles.statPill, styles.statPillPending]}>
              <Text style={[styles.statPillText, { color: '#c2410c' }]}>
                {WORKER_COLLECTIONS.filter((c) => c.syncStatus === 'PENDING').length} In Queue
              </Text>
            </View>
          </View>
        </View>

        {/* Collections List */}
        <Text style={styles.sectionHeader}>Collected Bags ({WORKER_COLLECTIONS.length})</Text>

        {WORKER_COLLECTIONS.map((item) => {
          const isSynced = item.syncStatus === 'SYNCED';

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push('/(worker)/qr-preview')}
              activeOpacity={0.8}
            >
              <View style={styles.itemLeft}>
                <View style={[styles.bagIcon, { backgroundColor: isSynced ? '#e8f5e9' : '#fff7ed' }]}>
                  <Layers size={20} color={isSynced ? '#1a5c38' : '#ea580c'} />
                </View>

                <View style={styles.itemMeta}>
                  <Text style={styles.itemBatch}>{item.batchNumber}</Text>
                  <Text style={styles.itemPoint}>{item.collectionPointName}</Text>
                  <Text style={styles.itemTime}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>

              <View style={styles.itemRight}>
                <Text style={styles.itemKg}>{item.weightKg} kg</Text>

                <View style={[styles.statusChip, isSynced ? styles.chipSynced : styles.chipPending]}>
                  {isSynced ? (
                    <CheckCircle2 size={10} color="#15803d" />
                  ) : (
                    <Clock size={10} color="#c2410c" />
                  )}
                  <Text style={[styles.statusChipText, { color: isSynced ? '#15803d' : '#c2410c' }]}>
                    {item.syncStatus}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
  addBtn: {
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryKg: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  summaryRight: {
    gap: 6,
    alignItems: 'flex-end',
  },
  statPill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statPillPending: {
    backgroundColor: '#fff7ed',
  },
  statPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  itemCard: {
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
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    gap: 4,
  },
  itemKg: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chipSynced: {
    backgroundColor: '#ecfdf5',
  },
  chipPending: {
    backgroundColor: '#fff7ed',
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
