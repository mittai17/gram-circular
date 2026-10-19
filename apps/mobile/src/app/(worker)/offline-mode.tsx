import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { useNetwork } from '../../context/NetworkContext';
import { useSync } from '../../context/SyncContext';
import { colors } from '../../theme/colors';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  ShieldCheck,
} from 'lucide-react-native';

export default function WorkerOfflineModeScreen() {
  const { isOnline, toggleNetwork } = useNetwork();
  const { pendingCount, isSyncing, triggerSync, lastSyncedAt } = useSync();
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = async () => {
    if (!isOnline) {
      Alert.alert(
        'Offline Mode',
        'Device is currently offline. Toggle network connection to online first to test synchronization.'
      );
      return;
    }

    setSyncFeedback(null);
    const result = await triggerSync();
    if (result.success) {
      setSyncFeedback(`Successfully synchronized ${result.syncedCount} records to cloud.`);
    } else {
      setSyncFeedback('Sync failed. Please verify your connection.');
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Offline Queue & Sync" subtitle="SQLite Outbox Manager" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Status Hero Card */}
        <View style={styles.heroCard}>
          <View style={[styles.iconCircle, !isOnline ? styles.iconCircleOffline : styles.iconCircleOnline]}>
            {!isOnline ? (
              <WifiOff size={42} color="#dc2626" />
            ) : (
              <Wifi size={42} color="#16a34a" />
            )}
          </View>

          <Text style={styles.heroTitle}>{!isOnline ? 'No Internet' : 'Network Connected'}</Text>
          <Text style={styles.heroSub}>
            {!isOnline
              ? 'Data is being safely queued in local SQLite storage.'
              : 'Connection established. Ready to upload local queue.'}
          </Text>

          {/* Pending Records Badge */}
          <View style={[styles.counterBadge, pendingCount > 0 ? styles.counterBadgeOrange : styles.counterBadgeGreen]}>
            <Text style={[styles.counterBadgeText, pendingCount > 0 ? { color: '#c2410c' } : { color: '#15803d' }]}>
              {pendingCount} Pending Record{pendingCount !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Sync Button */}
          <TouchableOpacity
            style={[styles.syncBtn, isSyncing && styles.syncBtnDisabled]}
            onPress={handleManualSync}
            disabled={isSyncing}
            activeOpacity={0.85}
          >
            {isSyncing ? (
              <View style={styles.syncingRow}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.syncBtnText}>Syncing SQLite Queue...</Text>
              </View>
            ) : (
              <View style={styles.syncingRow}>
                <RefreshCw size={16} color="#ffffff" />
                <Text style={styles.syncBtnText}>Sync Now</Text>
              </View>
            )}
          </TouchableOpacity>

          {syncFeedback && (
            <View style={styles.feedbackRow}>
              <CheckCircle2 size={14} color="#15803d" />
              <Text style={styles.feedbackText}>{syncFeedback}</Text>
            </View>
          )}

          {/* Simulate Network Toggle for Judges */}
          <TouchableOpacity
            style={styles.simulateToggle}
            onPress={toggleNetwork}
            activeOpacity={0.8}
          >
            <Text style={styles.simulateToggleText}>
              Tap to simulate {!isOnline ? 'Network Reconnection (Online)' : 'Signal Loss (Offline)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SQLite Architecture Explainer Card */}
        <View style={styles.explainerCard}>
          <View style={styles.explainerHeader}>
            <Database size={18} color="#1a5c38" />
            <Text style={styles.explainerTitle}>Offline-First Outbox Architecture</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <View style={styles.stepMeta}>
              <Text style={styles.stepHead}>Local SQLite Storage</Text>
              <Text style={styles.stepBody}>
                All weights, bag labels, and GPS coordinates are stored in SQLite `offline_batches`.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <View style={styles.stepMeta}>
              <Text style={styles.stepHead}>Idempotent UUID Keys</Text>
              <Text style={styles.stepBody}>
                Every operation has a unique `clientOperationId` preventing duplicate records upon retries.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <View style={styles.stepMeta}>
              <Text style={styles.stepHead}>Automatic Background Sync</Text>
              <Text style={styles.stepBody}>
                When internet connectivity is restored, the queue uploads automatically with exponential backoff.
              </Text>
            </View>
          </View>
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
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
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
  },
  heroSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  counterBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: 16,
  },
  counterBadgeOrange: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  counterBadgeGreen: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  counterBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  syncBtn: {
    backgroundColor: '#1a5c38',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBtnDisabled: {
    opacity: 0.7,
  },
  syncingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  feedbackText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
  },
  simulateToggle: {
    marginTop: 14,
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
  explainerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  explainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  explainerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1a5c38',
  },
  stepMeta: {
    flex: 1,
  },
  stepHead: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepBody: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});
