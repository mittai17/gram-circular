import React, { useState } from 'react';
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
import { colors } from '../../theme/colors';
import {
  FileCheck2,
  Scale,
  Camera,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react-native';

export default function BuyerReceiptConfirmScreen() {
  const router = useRouter();

  const [receivedWeight, setReceivedWeight] = useState(160);
  const expectedWeight = 162;
  const varianceKg = (receivedWeight - expectedWeight).toFixed(1);
  const [hasSlipPhoto, setHasSlipPhoto] = useState(true);

  const handleConfirm = () => {
    Alert.alert(
      'Receipt Confirmed',
      `PO-2026-089 Verified & Closed.\nReceived Weight: ${receivedWeight} kg (Variance: ${varianceKg} kg within acceptable 2% tolerance).\nEPR credit certificate generated.`,
      [
        {
          text: 'View Purchase History',
          onPress: () => router.push('/(buyer)/history'),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Confirm Receipt" subtitle="Batch MLP-2026-0143 Verification" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Verification Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.iconCircle}>
              <Scale size={24} color="#7c3aed" />
            </View>
            <View style={styles.meta}>
              <Text style={styles.title}>Batch: MLP-2026-0143</Text>
              <Text style={styles.subtitle}>Supplier: Kaveripattinam Block MRF Center</Text>
            </View>
          </View>

          {/* Weighbridge Comparison */}
          <View style={styles.comparisonBox}>
            <View style={styles.compCol}>
              <Text style={styles.compLabel}>Expected Weight</Text>
              <Text style={styles.compVal}>{expectedWeight} kg</Text>
            </View>

            <View style={styles.compDiv} />

            <View style={styles.compCol}>
              <Text style={styles.compLabel}>Received Weight</Text>
              <Text style={[styles.compVal, { color: '#7c3aed' }]}>{receivedWeight} kg</Text>
            </View>
          </View>

          {/* Variance Note */}
          <View style={styles.varianceRow}>
            <CheckCircle2 size={14} color="#15803d" />
            <Text style={styles.varianceText}>
              Variance: {varianceKg} kg (1.2% moisture loss, within EPR standard 2% limit)
            </Text>
          </View>
        </View>

        {/* Upload Proof Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Weighbridge Slip & Seal Proof</Text>
          <Text style={styles.sectionSubtitle}>
            Attach gross weighbridge slip and photo of unbroken truck security seal
          </Text>

          <TouchableOpacity
            style={[styles.uploadBox, hasSlipPhoto && styles.uploadBoxActive]}
            onPress={() => {
              setHasSlipPhoto(!hasSlipPhoto);
              Alert.alert('Proof Photo', hasSlipPhoto ? 'Photo unattached' : 'Slip photo attached.');
            }}
            activeOpacity={0.8}
          >
            <Camera size={24} color={hasSlipPhoto ? '#15803d' : '#64748b'} />
            <Text style={[styles.uploadText, hasSlipPhoto && { color: '#15803d', fontWeight: '700' }]}>
              {hasSlipPhoto ? 'Slip Attached: WB-SLIP-77402.JPG' : 'Upload Weighbridge Slip Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* EPR Compliance Note */}
        <View style={styles.eprBox}>
          <ShieldCheck size={20} color="#15803d" />
          <View style={styles.eprMeta}>
            <Text style={styles.eprTitle}>Automated EPR Credit Allocation</Text>
            <Text style={styles.eprSub}>
              Closing this receipt mints verifiable recycling credits under Central Pollution Control Board (CPCB) norms.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <FileCheck2 size={18} color="#ffffff" />
          <Text style={styles.confirmBtnText}>Confirm & Close Receipt</Text>
        </TouchableOpacity>

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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  comparisonBox: {
    flexDirection: 'row',
    backgroundColor: '#f8faf9',
    borderRadius: 12,
    padding: 14,
  },
  compCol: {
    flex: 1,
    alignItems: 'center',
  },
  compLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  compVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  compDiv: {
    width: 1,
    backgroundColor: colors.border,
  },
  varianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  varianceText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 18,
    backgroundColor: '#f8faf9',
  },
  uploadBoxActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
    borderStyle: 'solid',
  },
  uploadText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  eprBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  eprMeta: {
    flex: 1,
  },
  eprTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  eprSub: {
    fontSize: 10,
    color: '#166534',
    marginTop: 2,
    lineHeight: 14,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a5c38',
    borderRadius: 14,
    paddingVertical: 16,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
