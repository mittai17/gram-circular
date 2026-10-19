import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNetwork } from '../../context/NetworkContext';
import { useSync } from '../../context/SyncContext';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export function OfflineBanner() {
  const { isOnline } = useNetwork();
  const { pendingCount, isSyncing, triggerSync } = useSync();
  const router = useRouter();

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <View style={[styles.banner, !isOnline ? styles.offlineBanner : styles.pendingBanner]}>
      <View style={styles.leftRow}>
        {!isOnline ? (
          <WifiOff size={16} color="#b91c1c" />
        ) : (
          <RefreshCw size={16} color="#c2410c" />
        )}
        <View style={styles.textCol}>
          <Text style={[styles.title, !isOnline ? styles.offlineText : styles.pendingText]}>
            {!isOnline
              ? 'Offline Mode Active'
              : `${pendingCount} record${pendingCount > 1 ? 's' : ''} waiting to sync`}
          </Text>
          <Text style={styles.subtitle}>
            {!isOnline
              ? 'Data saved locally in SQLite queue'
              : 'Network restored, ready to upload'}
          </Text>
        </View>
      </View>

      {isOnline && pendingCount > 0 ? (
        <TouchableOpacity
          style={styles.syncBtn}
          onPress={triggerSync}
          disabled={isSyncing}
          activeOpacity={0.8}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.syncBtnText}>Sync Now</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => router.push('/(worker)/offline-mode')}
          activeOpacity={0.8}
        >
          <Text style={styles.viewBtnText}>Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  offlineBanner: {
    backgroundColor: '#fef2f2',
    borderBottomColor: '#fecaca',
  },
  pendingBanner: {
    backgroundColor: '#fff7ed',
    borderBottomColor: '#fed7aa',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
  },
  offlineText: {
    color: '#991b1b',
  },
  pendingText: {
    color: '#9a3412',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  syncBtn: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  syncBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  viewBtn: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewBtnText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '600',
  },
});
