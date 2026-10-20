import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { colors } from '../../theme/colors';
import {
  Wifi,
  WifiOff,
  Upload,
  Database,
  FileCode2,
  Gauge,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Radio,
} from 'lucide-react-native';

const OFFLINE_QUEUE = [
  {
    id: 'OP-001',
    type: 'BATCH_CREATE',
    desc: 'WasteBatch CP-03 • 28 kg MLP',
    size: '1.2 KB',
    createdAt: '10:34 AM',
    status: 'PENDING',
    retries: 0,
  },
  {
    id: 'OP-002',
    type: 'WEIGHING_READING',
    desc: 'DeviceReading scale-007 • 14.5 kg',
    size: '0.4 KB',
    createdAt: '10:41 AM',
    status: 'PENDING',
    retries: 1,
  },
  {
    id: 'OP-003',
    type: 'CITIZEN_REPORT',
    desc: 'Bin overflow CP-05 • GPS tagged',
    size: '2.1 KB',
    createdAt: '10:58 AM',
    status: 'FAILED',
    retries: 3,
  },
  {
    id: 'OP-004',
    type: 'BATCH_CREATE',
    desc: 'WasteBatch CP-01 • 42 kg DRY',
    size: '1.1 KB',
    createdAt: '11:12 AM',
    status: 'SYNCED',
    retries: 0,
  },
];

const SIGNAL_BARS = [
  { label: '2G', speed: '32 Kbps', usable: true },
  { label: 'EDGE', speed: '128 Kbps', usable: true },
  { label: '3G', speed: '1 Mbps', usable: false },
  { label: '4G', speed: '10+ Mbps', usable: false },
];

export default function EdgeSyncScreen() {
  const [isFlushing, setIsFlushing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const pendingCount = OFFLINE_QUEUE.filter((o) => o.status === 'PENDING').length;
  const failedCount = OFFLINE_QUEUE.filter((o) => o.status === 'FAILED').length;
  const syncedCount = OFFLINE_QUEUE.filter((o) => o.status === 'SYNCED').length;
  const totalSizeKb = OFFLINE_QUEUE.reduce((s, o) => s + parseFloat(o.size), 0).toFixed(1);

  const handleFlush = () => {
    if (!isOnline) {
      Alert.alert('Offline', 'Cannot flush queue — device is offline.\nConnect to network first.');
      return;
    }
    setIsFlushing(true);
    setTimeout(() => {
      setIsFlushing(false);
      Alert.alert('Sync Complete!', `${pendingCount} operations flushed.\nAll payloads synced to server.`);
    }, 2500);
  };

  const statusVariant = (s: string) => {
    switch (s) {
      case 'SYNCED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const typeColor = (t: string) => {
    switch (t) {
      case 'BATCH_CREATE': return '#1a5c38';
      case 'WEIGHING_READING': return '#2563eb';
      case 'CITIZEN_REPORT': return '#ea580c';
      default: return colors.textMuted;
    }
  };

  const typeLabel = (t: string) => {
    switch (t) {
      case 'BATCH_CREATE': return 'Batch';
      case 'WEIGHING_READING': return 'Scale';
      case 'CITIZEN_REPORT': return 'Report';
      default: return t;
    }
  };

  return (
    <Screen title="Edge Sync" subtitle="Low-Bandwidth Field Device Diagnostics">
      {/* Network Status */}
      <View style={[styles.networkCard, isOnline ? styles.networkOnline : styles.networkOffline]}>
        <View style={styles.networkLeft}>
          {isOnline ? (
            <Wifi size={24} color="#16a34a" />
          ) : (
            <WifiOff size={24} color="#dc2626" />
          )}
          <View>
            <Text style={[styles.networkStatus, { color: isOnline ? '#16a34a' : '#dc2626' }]}>
              {isOnline ? 'Online — Syncing Active' : 'Offline — Outbox Queued'}
            </Text>
            <Text style={styles.networkSub}>
              {isOnline ? 'Server reachable • Low-bandwidth mode' : '2G/offline field device mode'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: isOnline ? '#dcfce7' : '#fee2e2' }]}
          onPress={() => setIsOnline(!isOnline)}
        >
          <Text style={[styles.toggleText, { color: isOnline ? '#16a34a' : '#dc2626' }]}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* KPI Stats */}
      <View style={styles.statRow}>
        <StatCard
          value={String(pendingCount)}
          label="Pending"
          subtext="In outbox queue"
          icon={<Clock size={18} color="#f59e0b" />}
          iconBg="#fef3c7"
          iconColor="#f59e0b"
          style={{ flex: 1 }}
        />
        <StatCard
          value={String(failedCount)}
          label="Failed"
          subtext="Need retry"
          icon={<AlertTriangle size={18} color="#dc2626" />}
          iconBg="#fee2e2"
          iconColor="#dc2626"
          style={{ flex: 1 }}
        />
      </View>
      <View style={styles.statRow}>
        <StatCard
          value={`${totalSizeKb} KB`}
          label="Queue Size"
          subtext="CBOR/Gzip encoded"
          icon={<Database size={18} color="#7c3aed" />}
          iconBg="#f5f3ff"
          iconColor="#7c3aed"
          style={{ flex: 1 }}
        />
        <StatCard
          value="82%"
          label="Compression"
          subtext="CBOR+Gzip savings"
          icon={<FileCode2 size={18} color="#0ea5e9" />}
          iconBg="#e0f2fe"
          iconColor="#0ea5e9"
          style={{ flex: 1 }}
        />
      </View>

      {/* Signal Diagnostics */}
      <SectionHeader title="Signal Diagnostics" subtitle="2G-compatible threshold check" />
      <Card padding={14}>
        <View style={styles.signalRow}>
          {SIGNAL_BARS.map((bar) => (
            <View key={bar.label} style={styles.signalItem}>
              <Radio size={18} color={bar.usable ? '#1a5c38' : '#94a3b8'} />
              <Text style={[styles.signalLabel, { color: bar.usable ? '#1a5c38' : '#94a3b8' }]}>
                {bar.label}
              </Text>
              <Text style={styles.signalSpeed}>{bar.speed}</Text>
              {bar.usable && (
                <CheckCircle size={12} color="#16a34a" />
              )}
            </View>
          ))}
        </View>
        <View style={styles.compressionBox}>
          <Zap size={14} color="#7c3aed" />
          <Text style={styles.compressionText}>
            CBOR encoding + Gzip compression = 82% bandwidth reduction vs. raw JSON
          </Text>
        </View>
      </Card>

      {/* Flush Button */}
      <TouchableOpacity
        style={[
          styles.flushBtn,
          (!isOnline || isFlushing) && styles.flushBtnDisabled,
        ]}
        onPress={handleFlush}
        activeOpacity={0.85}
        disabled={!isOnline || isFlushing}
      >
        <Upload size={18} color="#ffffff" />
        <Text style={styles.flushBtnText}>
          {isFlushing ? 'Flushing...' : `Flush Queue (${pendingCount} pending)`}
        </Text>
      </TouchableOpacity>

      {/* Offline Queue */}
      <SectionHeader title="Client-side Offline Queue" subtitle="SQLite idempotent outbox" />
      <Card padding={0}>
        {OFFLINE_QUEUE.map((op, i) => (
          <View
            key={op.id}
            style={[styles.opRow, i < OFFLINE_QUEUE.length - 1 && styles.opBorder]}
          >
            <View
              style={[styles.opTypeTag, { backgroundColor: `${typeColor(op.type)}15` }]}
            >
              <Text style={[styles.opTypeText, { color: typeColor(op.type) }]}>
                {typeLabel(op.type)}
              </Text>
            </View>
            <View style={styles.opMeta}>
              <Text style={styles.opDesc}>{op.desc}</Text>
              <Text style={styles.opSub}>
                {op.id} • {op.createdAt} • {op.size}
                {op.retries > 0 ? ` • ${op.retries} retries` : ''}
              </Text>
            </View>
            <StatusBadge variant={statusVariant(op.status) as any} small>
              {op.status === 'SYNCED' ? 'Synced' : op.status === 'FAILED' ? 'Failed' : 'Pending'}
            </StatusBadge>
          </View>
        ))}
      </Card>

      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  networkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  networkOnline: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  networkOffline: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  networkLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  networkStatus: { fontSize: 13, fontWeight: '800' },
  networkSub: { fontSize: 10, color: colors.textSecondary, marginTop: 1 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  toggleText: { fontSize: 11, fontWeight: '700' },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  signalRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  signalItem: { alignItems: 'center', gap: 4 },
  signalLabel: { fontSize: 13, fontWeight: '800' },
  signalSpeed: { fontSize: 9, color: colors.textMuted },
  compressionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f5f3ff',
    padding: 10,
    borderRadius: 10,
  },
  compressionText: { flex: 1, fontSize: 11, color: '#7c3aed', fontWeight: '600', lineHeight: 16 },
  flushBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a5c38',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
    elevation: 3,
  },
  flushBtnDisabled: { backgroundColor: '#94a3b8' },
  flushBtnText: { fontSize: 14, fontWeight: '800', color: '#ffffff' },
  opRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  opBorder: { borderBottomWidth: 0.8, borderBottomColor: colors.borderLight },
  opTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 52,
    alignItems: 'center',
  },
  opTypeText: { fontSize: 9, fontWeight: '800' },
  opMeta: { flex: 1 },
  opDesc: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  opSub: { fontSize: 10, color: colors.textSecondary, marginTop: 1 },
});
