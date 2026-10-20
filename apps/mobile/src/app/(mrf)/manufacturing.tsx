import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { colors } from '../../theme/colors';
import {
  Factory,
  Layers,
  CheckCircle,
  Zap,
  Award,
  Plus,
  X,
  QrCode,
  FlaskConical,
  Gauge,
  Droplets,
} from 'lucide-react-native';

const PRODUCTION_RUNS = [
  {
    id: 'PR-001',
    serialRun: 'RUN-2026-001',
    qrToken: 'QR-MLP-7X9K2',
    mlpKg: 30,
    mSandKg: 60,
    binderKg: 10,
    totalKg: 100,
    energyKwh: 12.4,
    compressiveStrength: 42.5,
    absorptionPct: 3.2,
    status: 'CERTIFIED',
    batchInput: 'WB-MLP-2026-0143',
  },
  {
    id: 'PR-002',
    serialRun: 'RUN-2026-002',
    qrToken: 'QR-MLP-4A8P1',
    mlpKg: 60,
    mSandKg: 120,
    binderKg: 20,
    totalKg: 200,
    energyKwh: 24.8,
    compressiveStrength: 40.1,
    absorptionPct: 3.8,
    status: 'IN_PROGRESS',
    batchInput: 'WB-MLP-2026-0144',
  },
  {
    id: 'PR-003',
    serialRun: 'RUN-2026-003',
    qrToken: 'QR-MLP-2C5M9',
    mlpKg: 45,
    mSandKg: 90,
    binderKg: 15,
    totalKg: 150,
    energyKwh: 18.6,
    compressiveStrength: 44.0,
    absorptionPct: 2.9,
    status: 'QUALITY_TEST',
    batchInput: 'WB-MLP-2026-0145',
  },
];

const MIX_MATRIX = [
  { material: 'MLP Flakes', percentage: 30, color: '#ea580c', desc: 'Processed multi-layer plastic' },
  { material: 'M-Sand', percentage: 60, color: '#64748b', desc: 'Manufactured fine aggregate' },
  { material: 'Binder', percentage: 10, color: '#7c3aed', desc: 'Polymer binding agent' },
];

export default function ManufacturingScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [batchKg, setBatchKg] = useState('');

  const totalOutput = PRODUCTION_RUNS.reduce((s, r) => s + r.totalKg, 0);
  const totalEnergy = PRODUCTION_RUNS.reduce((s, r) => s + r.energyKwh, 0);
  const certifiedRuns = PRODUCTION_RUNS.filter((r) => r.status === 'CERTIFIED').length;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'CERTIFIED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'QUALITY_TEST': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CERTIFIED': return 'Certified';
      case 'IN_PROGRESS': return 'In Progress';
      case 'QUALITY_TEST': return 'Quality Test';
      default: return status;
    }
  };

  const handleLaunch = () => {
    if (!qrToken || !batchKg) {
      Alert.alert('Missing Fields', 'Enter QR token and batch weight.');
      return;
    }
    setModalVisible(false);
    setQrToken('');
    setBatchKg('');
    Alert.alert('Production Started', `Run initiated: ${qrToken}`);
  };

  return (
    <Screen title="MLP Upcycling" subtitle="IS 15658 / IRC:SP:98 Certified Production">
      {/* Certification Badges */}
      <View style={styles.badgeRow}>
        {['IS 15658', 'IRC:SP:98', 'BIS Approved'].map((badge) => (
          <View key={badge} style={styles.certBadge}>
            <Award size={12} color="#1a5c38" />
            <Text style={styles.certText}>{badge}</Text>
          </View>
        ))}
      </View>

      {/* KPI Stats */}
      <View style={styles.statRow}>
        <StatCard
          value={`${totalOutput} kg`}
          label="Output"
          subtext="Blocks produced"
          icon={<Layers size={18} color="#1a5c38" />}
          iconBg="#e8f5e9"
          iconColor="#1a5c38"
          style={{ flex: 1 }}
        />
        <StatCard
          value={`${totalEnergy.toFixed(1)} kWh`}
          label="Energy"
          subtext="Machine total"
          icon={<Zap size={18} color="#f59e0b" />}
          iconBg="#fef3c7"
          iconColor="#f59e0b"
          style={{ flex: 1 }}
        />
      </View>
      <View style={styles.statRow}>
        <StatCard
          value={`${certifiedRuns}/${PRODUCTION_RUNS.length}`}
          label="Certified Runs"
          subtext="Passed quality"
          icon={<CheckCircle size={18} color="#2563eb" />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
          style={{ flex: 1 }}
        />
        <StatCard
          value="42.5 MPa"
          label="Avg Strength"
          subtext="Compressive"
          icon={<Gauge size={18} color="#ea580c" />}
          iconBg="#fff7ed"
          iconColor="#ea580c"
          style={{ flex: 1 }}
        />
      </View>

      {/* Mix Matrix */}
      <SectionHeader title="Standard Mix Matrix" subtitle="IS 15658 ratio (per 100 kg)" />
      <Card padding={14}>
        {MIX_MATRIX.map((item, i) => (
          <View
            key={item.material}
            style={[styles.mixRow, i < MIX_MATRIX.length - 1 && styles.mixRowBorder]}
          >
            <View style={styles.mixLeft}>
              <View style={[styles.mixDot, { backgroundColor: item.color }]} />
              <View>
                <Text style={styles.mixMaterial}>{item.material}</Text>
                <Text style={styles.mixDesc}>{item.desc}</Text>
              </View>
            </View>
            <View style={styles.mixRight}>
              <Text style={[styles.mixPct, { color: item.color }]}>{item.percentage}%</Text>
              <View style={styles.mixBarBg}>
                <View
                  style={[
                    styles.mixBarFill,
                    { width: `${item.percentage}%` as any, backgroundColor: item.color },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
        <View style={styles.mixTotal}>
          <Text style={styles.mixTotalText}>Target: ≥35 MPa strength | ≤5% absorption</Text>
        </View>
      </Card>

      {/* Launch Button */}
      <TouchableOpacity
        style={styles.launchBtn}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Plus size={18} color="#ffffff" />
        <Text style={styles.launchBtnText}>Launch New Production Batch</Text>
      </TouchableOpacity>

      {/* Production Log */}
      <SectionHeader title="Live Production Log" subtitle="Active & recent runs" />
      {PRODUCTION_RUNS.map((run) => (
        <Card key={run.id} padding={14} style={styles.runCard}>
          <View style={styles.runHeader}>
            <View style={styles.runLeft}>
              <View style={styles.runIconBox}>
                <Factory size={16} color="#ea580c" />
              </View>
              <View>
                <Text style={styles.runSerial}>{run.serialRun}</Text>
                <View style={styles.qrRow}>
                  <QrCode size={10} color={colors.textMuted} />
                  <Text style={styles.runQr}> {run.qrToken}</Text>
                </View>
              </View>
            </View>
            <StatusBadge variant={getStatusVariant(run.status) as any} small>
              {getStatusLabel(run.status)}
            </StatusBadge>
          </View>

          <View style={styles.runMixRow}>
            {[
              { label: 'MLP', value: run.mlpKg, color: '#ea580c' },
              { label: 'M-Sand', value: run.mSandKg, color: '#64748b' },
              { label: 'Binder', value: run.binderKg, color: '#7c3aed' },
              { label: 'Total', value: run.totalKg, color: '#1a5c38' },
            ].map((item, i, arr) => (
              <React.Fragment key={item.label}>
                <View style={styles.runMixItem}>
                  <Text style={[styles.runMixValue, { color: item.color }]}>{item.value}kg</Text>
                  <Text style={styles.runMixLabel}>{item.label}</Text>
                </View>
                {i < arr.length - 1 && (
                  <Text style={styles.runSep}>{item.label === 'Binder' ? '=' : '+'}</Text>
                )}
              </React.Fragment>
            ))}
          </View>

          <View style={styles.runMetrics}>
            {[
              { icon: <Zap size={11} color="#f59e0b" />, label: `${run.energyKwh} kWh` },
              { icon: <Gauge size={11} color="#2563eb" />, label: `${run.compressiveStrength} MPa` },
              { icon: <Droplets size={11} color="#0ea5e9" />, label: `${run.absorptionPct}% abs` },
              { icon: <FlaskConical size={11} color="#16a34a" />, label: run.batchInput },
            ].map((m) => (
              <View key={m.label} style={styles.runMetric}>
                {m.icon}
                <Text style={styles.runMetricText}>{m.label}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}

      {/* Launch Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Launch Production Batch</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sheetSubtitle}>
              Map input waste batch QR token to new manufacturing serial run
            </Text>

            <Text style={styles.inputLabel}>Input Batch QR Token</Text>
            <View style={styles.inputRow}>
              <QrCode size={15} color={colors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="QR-MLP-XXXXX"
                value={qrToken}
                onChangeText={setQrToken}
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <Text style={styles.inputLabel}>Total Batch Weight (kg)</Text>
            <TextInput
              style={styles.textInputStandalone}
              placeholder="e.g. 100"
              value={batchKg}
              onChangeText={setBatchKg}
              keyboardType="numeric"
              placeholderTextColor={colors.textMuted}
            />

            {!!batchKg && Number(batchKg) > 0 && (
              <View style={styles.autoCalc}>
                <Text style={styles.autoCalcTitle}>Auto-calculated Mix (IS 15658)</Text>
                <View style={styles.autoCalcRow}>
                  <Text style={styles.autoCalcItem}>
                    MLP: {Math.round(Number(batchKg) * 0.3)} kg
                  </Text>
                  <Text style={styles.autoCalcItem}>
                    M-Sand: {Math.round(Number(batchKg) * 0.6)} kg
                  </Text>
                  <Text style={styles.autoCalcItem}>
                    Binder: {Math.round(Number(batchKg) * 0.1)} kg
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.confirmBtn} onPress={handleLaunch} activeOpacity={0.85}>
              <Factory size={16} color="#ffffff" />
              <Text style={styles.confirmBtnText}>Start Production Run</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  certText: { fontSize: 11, fontWeight: '700', color: '#1a5c38' },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  mixRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  mixRowBorder: { borderBottomWidth: 0.8, borderBottomColor: colors.borderLight },
  mixLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  mixDot: { width: 10, height: 10, borderRadius: 5 },
  mixMaterial: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  mixDesc: { fontSize: 10, color: colors.textSecondary },
  mixRight: { alignItems: 'flex-end', minWidth: 80 },
  mixPct: { fontSize: 16, fontWeight: '900' },
  mixBarBg: { width: 80, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, marginTop: 4, overflow: 'hidden' },
  mixBarFill: { height: '100%', borderRadius: 2 },
  mixTotal: { paddingTop: 10, alignItems: 'center' },
  mixTotalText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a5c38',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
    marginTop: 4,
    elevation: 3,
  },
  launchBtnText: { fontSize: 14, fontWeight: '800', color: '#ffffff' },
  runCard: { marginBottom: 10 },
  runHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  runLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  runIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' },
  runSerial: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  qrRow: { flexDirection: 'row', alignItems: 'center' },
  runQr: { fontSize: 10, color: colors.textMuted },
  runMixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  runMixItem: { alignItems: 'center', minWidth: 44 },
  runMixValue: { fontSize: 11, fontWeight: '800' },
  runMixLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '600' },
  runSep: { fontSize: 11, color: colors.textMuted, fontWeight: '700' },
  runMetrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  runMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  runMetricText: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  sheetSubtitle: { fontSize: 12, color: colors.textSecondary, marginBottom: 18 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginBottom: 6, marginTop: 12 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
  },
  textInput: { flex: 1, fontSize: 13, color: colors.textPrimary },
  textInputStandalone: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    fontSize: 13,
    color: colors.textPrimary,
  },
  autoCalc: { marginTop: 14, backgroundColor: '#e8f5e9', borderRadius: 10, padding: 12 },
  autoCalcTitle: { fontSize: 11, fontWeight: '700', color: '#1a5c38', marginBottom: 8 },
  autoCalcRow: { flexDirection: 'row', justifyContent: 'space-between' },
  autoCalcItem: { fontSize: 12, fontWeight: '700', color: '#166534' },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a5c38',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  confirmBtnText: { fontSize: 14, fontWeight: '800', color: '#ffffff' },
});
