import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { useNetwork } from '../../context/NetworkContext';
import { useSync } from '../../context/SyncContext';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import { SyncQueueItem } from '../../types';
import { db } from '../../lib/db';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  ShieldCheck,
  Clock,
  Loader2,
} from 'lucide-react-native';

export default function WorkerOfflineModeScreen() {
  const { isOnline, toggleNetwork } = useNetwork();
  const { pendingCount, isSyncing, triggerSync, lastSyncedAt, refreshPendingCount } = useSync();
  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const items = await db.getPending();
        setQueueItems(items);
      } catch {
        // fallback: empty queue
      }
    };
    loadQueue();
  }, [refreshPendingCount]);

  const handleManualSync = async () => {
    if (!isOnline) {
      setSyncFeedback({ type: 'error', message: 'Device is offline. Reconnect to sync.' });
      return;
    }

    setSyncFeedback(null);
    const result = await triggerSync();
    await refreshPendingCount();
    try {
      setQueueItems(await db.getPending());
    } catch {
      setQueueItems([]);
    }

    if (result.success) {
      setSyncFeedback({
        type: 'success',
        message: `Successfully synchronized ${result.syncedCount} record${result.syncedCount !== 1 ? 's' : ''} to cloud.`,
      });
    } else {
      setSyncFeedback({ type: 'error', message: 'Sync failed. Please verify your connection.' });
    }
  };

  const handleRetryItem = async (item: SyncQueueItem) => {
    setSyncFeedback(null);
    try {
      await db.markSynced(item.clientOperationId);
      setQueueItems((prev) => prev.filter((i) => i.id !== item.id));
      await refreshPendingCount();
      setSyncFeedback({ type: 'success', message: `Item ${item.clientOperationId} synced successfully.` });
    } catch {
      setSyncFeedback({ type: 'error', message: 'Retry failed. Please try again.' });
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Offline Queue & Sync" subtitle="SQLite Outbox Manager" showBack />

      <View style={styles.scrollContent}>
        {/* Main Status Hero Card */}
        <Card style={styles.heroCard} padding={24} shadow="none">
          <View style={styles.heroIconContainer}>
            <View style={[styles.iconCircle, !isOnline ? styles.iconCircleOffline : styles.iconCircleOnline]}>
              {!isOnline ? (
                <WifiOff size={42} color="#dc2626" />
              ) : (
                <Wifi size={42} color="#16a34a" />
              )}
            </View>
          </View>

          <Text style={styles.heroTitle}>{!isOnline ? 'No Internet' : 'Network Connected'}</Text>
          <Text style={styles.heroSub}>
            {!isOnline
              ? 'Data is being safely queued in local SQLite storage.'
              : 'Connection established. Ready to upload local queue.'}
          </Text>

          {/* Pending Records Badge */}
          <View style={styles.counterBadgeContainer}>
            <StatusBadge
              variant={pendingCount > 0 ? 'warning' : 'success'}
            >
              {`${pendingCount} Pending Record${pendingCount !== 1 ? 's' : ''}`}
            </StatusBadge>
          </View>

          {/* Last Synced Timestamp */}
          <View style={styles.lastSyncRow}>
            <Clock size={14} color={colors.textMuted} />
            <Text style={styles.lastSyncText}>
              Last sync: {lastSyncedAt || 'Never'}
            </Text>
          </View>

          {/* Sync Button */}
          <Button
            title={isSyncing ? 'Syncing SQLite Queue...' : 'Sync Now'}
            leftIcon={<RefreshCw size={16} color="#ffffff" />}
            fullWidth
            loading={isSyncing}
            onPress={handleManualSync}
            variant="success"
          />

          {syncFeedback && (
            <View style={[styles.feedbackRow, syncFeedback.type === 'success' && styles.feedbackSuccess]}>
              {syncFeedback.type === 'success' ? (
                <CheckCircle2 size={14} color="#15803d" />
              ) : (
                <AlertCircle size={14} color="#ef4444" />
              )}
              <Text style={[styles.feedbackText, { color: syncFeedback.type === 'success' ? '#15803d' : '#ef4444' }]}>
                {syncFeedback.message}
              </Text>
            </View>
          )}

          {/* Simulate Network Toggle */}
          <TouchableOpacity
            style={styles.simulateToggle}
            onPress={toggleNetwork}
            activeOpacity={0.8}
          >
            <HardDrive size={14} color="#475569" style={{ marginRight: 6 }} />
            <Text style={styles.simulateToggleText}>
              Simulate {!isOnline ? 'Reconnect' : 'Signal Loss'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Sync Queue List */}
        <SectionHeader title="Pending Operations" subtitle="Items waiting to upload" />

        {queueItems.length === 0 ? (
          <Card style={styles.emptyCard} padding={30}>
            <View style={styles.emptyContent}>
              <View style={styles.emptyIconBox}>
                <ShieldCheck size={32} color="#10b981" />
              </View>
              <Text style={styles.emptyTitle}>Queue is Clear</Text>
              <Text style={styles.emptySubtitle}>All pending operations have been synced.</Text>
            </View>
          </Card>
        ) : (
          <FlatList
            data={queueItems}
            renderItem={({ item }: { item: SyncQueueItem }) => (
              <Card style={styles.queueItemCard} padding={14} shadow="sm">
                <View style={styles.queueItemRow}>
                  <View style={styles.queueItemIcon}>
                    <Database size={18} color="#1a5c38" />
                  </View>
                  <View style={styles.queueItemMeta}>
                    <Text style={styles.queueItemType}>{item.entityType}</Text>
                    <Text style={styles.queueItemAction}>{item.action}</Text>
                    <Text style={styles.queueItemTime}>
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={styles.queueItemRight}>
                    <StatusBadge
                      variant={item.status === 'FAILED' ? 'default' : 'info'}
                      small
                      style={styles.queueItemStatus}
                    >
                      {item.status}
                    </StatusBadge>
                    <TouchableOpacity
                      style={styles.retryBtn}
                      onPress={() => handleRetryItem(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {item.lastError && (
                  <View style={styles.errorRow}>
                    <AlertCircle size={12} color="#ef4444" />
                    <Text style={styles.errorText}>{item.lastError}</Text>
                  </View>
                )}
              </Card>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.queueListContent}
          />
        )}

        <View style={styles.bottomSpacer} />
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 100,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIconContainer: {
    marginBottom: 14,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconCircleOffline: {
    backgroundColor: '#fee2e2',
  },
  iconCircleOnline: {
    backgroundColor: '#dcfce7',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  counterBadgeContainer: {
    marginVertical: 16,
  },
  counterBadge: {
    minWidth: 150,
    alignItems: 'center',
  },
  lastSyncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  lastSyncText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  feedbackSuccess: {
    backgroundColor: '#ecfdf5',
  },
  feedbackText: {
    fontSize: 11,
    fontWeight: '600',
  },
  simulateToggle: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  simulateToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ecfdf5',
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
  queueItemCard: {
    marginBottom: 10,
  },
  queueItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  queueItemMeta: {
    flex: 1,
    gap: 2,
  },
  queueItemType: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  queueItemAction: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  queueItemTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  queueItemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  queueItemStatus: {
    minWidth: 60,
    alignItems: 'center',
  },
  retryBtn: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  retryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  queueListContent: {
    paddingBottom: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});
