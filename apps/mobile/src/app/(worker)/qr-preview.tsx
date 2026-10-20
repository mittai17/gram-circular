import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { QRDisplay } from '../../components/qr/QRDisplay';
import { colors } from '../../theme/colors';
import {
  Share2,
  CheckCircle2,
  Printer,
  Copy,
  Layers,
  MapPin,
  Calendar,
  Download,
  Eye,
} from 'lucide-react-native';

export default function WorkerQrPreviewScreen() {
  const router = useRouter();

  const batchNumber = 'MLP-2026-0143';
  const weight = 12.8;
  const point = 'CP-03 Gandhi Street';
  const ward = 'Shanti Nagar Ward 2';
  const dateStr = '16 Oct 2026, 10:24 AM';
  const qrData = JSON.stringify({
    batch: batchNumber,
    weightKg: weight,
    type: 'MLP',
    point: 'CP-03',
    union: 'Kaveripattinam',
    timestamp: dateStr,
  });

  const handlePrint = () => {
    Alert.alert('Bluetooth Printer', 'Sent label print command to portable BT thermal printer.');
  };

  const handleShare = () => {
    Alert.alert('Share Label', `Batch QR payload for ${batchNumber} copied to clipboard.`);
  };

  const handleViewPassport = () => {
    Alert.alert('Batch Passport', `Opening digital passport for ${batchNumber}.`);
  };

  return (
    <Screen
      title="QR Batch Passport"
      subtitle="Batch Tag Ready for Dispatch"
      showBack
      showOfflineBanner
      showBottomNav
    >
      {/* Success Banner */}
      <Card style={styles.successBanner} padding={12} shadow="none">
        <View style={styles.successRow}>
          <CheckCircle2 size={16} color="#15803d" />
          <Text style={styles.successText}>Batch Record Created & Saved to Queue</Text>
        </View>
      </Card>

      {/* QR Code Display */}
      <Card style={styles.qrCard} padding={20} shadow="md">
        <View style={styles.qrWrapper}>
          <QRDisplay
            value={qrData}
            batchNumber={batchNumber}
            weightKg={weight}
            collectionPoint={point}
            size={240}
          />
        </View>

        <SectionHeader
          title="Batch Details"
          subtitle="Scannable collection record"
          style={styles.sectionHeader}
        />

        <View style={styles.metaBox}>
          <View style={styles.metaRow}>
            <Layers size={14} color={colors.textSecondary} />
            <View style={styles.metaText}>
              <Text style={styles.metaLabel}>Stream</Text>
              <Text style={styles.metaVal}>MLP (Multi-Layer Plastic)</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <MapPin size={14} color={colors.textSecondary} />
            <View style={styles.metaText}>
              <Text style={styles.metaLabel}>Origin</Text>
              <Text style={styles.metaVal}>{point}, {ward}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={14} color={colors.textSecondary} />
            <View style={styles.metaText}>
              <Text style={styles.metaLabel}>Timestamp</Text>
              <Text style={styles.metaVal}>{dateStr}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <Copy size={14} color={colors.textSecondary} />
            <View style={styles.metaText}>
              <Text style={styles.metaLabel}>Weight</Text>
              <Text style={styles.metaVal}>{weight} kg</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonsRow}>
        <Button
          title="Print Label"
          leftIcon={<Printer size={16} color="#ffffff" />}
          onPress={handlePrint}
          variant="outline"
          style={styles.printBtn}
          textStyle={styles.printBtnText}
        />
        <Button
          title="View Passport"
          leftIcon={<Eye size={16} color="#ffffff" />}
          onPress={handleViewPassport}
          style={styles.viewBtn}
          textStyle={styles.viewBtnText}
        />
      </View>

      <View style={styles.shareRow}>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Share2 size={16} color="#ffffff" />
          <Text style={styles.shareBtnText}>Share QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downloadBtn}
          activeOpacity={0.8}
        >
          <Download size={16} color="#2563eb" />
          <Text style={styles.downloadBtnText}>Download Label</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.doneBtn}
        onPress={() => router.push('/(worker)/my-collections')}
        activeOpacity={0.85}
      >
        <Text style={styles.doneBtnText}>Done • View Today's Bags</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  successBanner: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    marginBottom: 16,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  qrCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  qrWrapper: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginTop: 4,
    marginBottom: 12,
  },
  metaBox: {
    width: '100%',
    backgroundColor: '#f8faf9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  metaText: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  printBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderColor: colors.border,
  },
  printBtnText: {
    color: colors.textPrimary,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  viewBtnText: {
    color: '#ffffff',
  },
  shareRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  downloadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  doneBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a5c38',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 4,
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
});
