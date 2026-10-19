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
} from 'lucide-react-native';

export default function WorkerQrPreviewScreen() {
  const router = useRouter();

  const batchNumber = 'MLP-2026-0143';
  const weight = 12.8;
  const point = 'CP-03 Gandhi Street';
  const dateStr = '16 Oct 2026, 10:24 AM';
  const qrData = JSON.stringify({
    batch: batchNumber,
    weightKg: weight,
    type: 'MLP',
    point: 'CP-03',
    union: 'Kaveripattinam',
    timestamp: dateStr,
  });

  const handleShare = () => {
    Alert.alert('Share Label', `Batch QR payload for ${batchNumber} copied to clipboard.`);
  };

  const handlePrint = () => {
    Alert.alert('Bluetooth Printer', 'Sent label print command to portable BT thermal printer.');
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="QR Generated" subtitle="Batch Tag Ready" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.successBanner}>
          <CheckCircle2 size={18} color="#15803d" />
          <Text style={styles.successText}>Bag Record Created & Saved to Queue</Text>
        </View>

        {/* QR Code Container */}
        <View style={styles.qrCard}>
          <QRDisplay
            value={qrData}
            batchNumber={batchNumber}
            weightKg={weight}
            collectionPoint={point}
            size={210}
          />

          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Layers size={14} color={colors.textSecondary} />
              <Text style={styles.metaLabel}>Stream:</Text>
              <Text style={styles.metaVal}>MLP (Multi-Layer Plastic)</Text>
            </View>
            <View style={styles.metaRow}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={styles.metaLabel}>Origin:</Text>
              <Text style={styles.metaVal}>Shanti Nagar CP-03</Text>
            </View>
            <View style={styles.metaRow}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={styles.metaLabel}>Timestamp:</Text>
              <Text style={styles.metaVal}>{dateStr}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.printBtn} onPress={handlePrint} activeOpacity={0.8}>
            <Printer size={16} color="#1e293b" />
            <Text style={styles.printBtnText}>Print Tag</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Share2 size={16} color="#ffffff" />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.push('/(worker)/my-collections')}
          activeOpacity={0.85}
        >
          <Text style={styles.doneBtnText}>Done • View Today's Bags</Text>
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
    flex: 1,
  },
  qrCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 16,
  },
  metaBox: {
    width: '100%',
    backgroundColor: '#f8faf9',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  printBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
  },
  printBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  doneBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a5c38',
    borderRadius: 14,
    paddingVertical: 16,
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
