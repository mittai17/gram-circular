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
import { WasteCategory } from '../../types';
import {
  AlertTriangle,
  Camera,
  MapPin,
  CheckCircle2,
  Layers,
  Leaf,
  Trash2,
  ShieldAlert,
  Award,
} from 'lucide-react-native';

const STREAMS: { id: WasteCategory; name: string; color: string; light: string; icon: any }[] = [
  { id: 'Wet', name: 'Wet', color: '#10b981', light: '#ecfdf5', icon: Leaf },
  { id: 'Dry', name: 'Dry', color: '#3b82f6', light: '#eff6ff', icon: Trash2 },
  { id: 'Sanitary', name: 'Sanitary', color: '#ef4444', light: '#fef2f2', icon: ShieldAlert },
  { id: 'MLP', name: 'MLP Plastic', color: '#1a5c38', light: '#e8f5e9', icon: Layers },
];

export default function CitizenReportBinScreen() {
  const router = useRouter();

  const [stream, setStream] = useState<WasteCategory>('MLP');
  const [hasPhoto, setHasPhoto] = useState(true);
  const location = 'Gandhi Street Corner, Shanti Nagar Ward 2';

  const handleSubmit = () => {
    Alert.alert(
      'Report Submitted!',
      'Thank you for keeping Shanti Nagar clean!\n+25 Green Points awarded to your eco-wallet.\nCollection driver Ramesh K notified.',
      [
        {
          text: 'View My Rewards',
          onPress: () => router.push('/(citizen)/rewards'),
        },
        {
          text: 'Back Home',
          onPress: () => router.push('/(citizen)/home'),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Report Full Bin" subtitle="Community Cleanliness Watch" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Stream Selector */}
        <Text style={styles.sectionTitle}>Select Overflowing Stream</Text>

        <View style={styles.streamsGrid}>
          {STREAMS.map((s) => {
            const IconComp = s.icon;
            const isSelected = stream === s.id;

            return (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.streamCard,
                  isSelected && { borderColor: s.color, borderWidth: 2, backgroundColor: s.light },
                ]}
                onPress={() => setStream(s.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.streamIcon, { backgroundColor: s.light }]}>
                  <IconComp size={22} color={s.color} />
                </View>
                <Text style={[styles.streamName, isSelected && { color: s.color, fontWeight: '800' }]}>
                  {s.name}
                </Text>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: s.color }]}>
                    <CheckCircle2 size={12} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Location Box */}
        <View style={styles.locationCard}>
          <Text style={styles.cardHeader}>Bin Location</Text>
          <View style={styles.locRow}>
            <MapPin size={18} color="#1a5c38" />
            <View style={styles.locMeta}>
              <Text style={styles.locText}>{location}</Text>
              <Text style={styles.locGps}>GPS: 12.5186° N, 78.2144° E • Accurate to 3m</Text>
            </View>
          </View>
        </View>

        {/* Photo Upload Card */}
        <View style={styles.photoCard}>
          <Text style={styles.cardHeader}>Photo of Full Bin</Text>
          <Text style={styles.cardSub}>Helps workers gauge necessary vehicle space</Text>

          <TouchableOpacity
            style={[styles.cameraBtn, hasPhoto && styles.cameraBtnActive]}
            onPress={() => setHasPhoto(!hasPhoto)}
            activeOpacity={0.8}
          >
            <Camera size={24} color={hasPhoto ? '#15803d' : '#64748b'} />
            <Text style={[styles.cameraText, hasPhoto && { color: '#15803d', fontWeight: '700' }]}>
              {hasPhoto ? 'Photo Attached (bin_overflow_cp03.jpg)' : 'Take Photo of Bin'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Points Reward Banner */}
        <View style={styles.rewardBanner}>
          <Award size={20} color="#d97706" />
          <View style={styles.rewardMeta}>
            <Text style={styles.rewardTitle}>Earn 25 Eco-Points</Text>
            <Text style={styles.rewardSub}>
              Credited instantly upon driver pickup confirmation.
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <AlertTriangle size={18} color="#ffffff" />
          <Text style={styles.submitBtnText}>Submit Bin Report</Text>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  streamsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  streamCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  streamIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  streamName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  locMeta: {
    flex: 1,
  },
  locText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locGps: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  photoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  cameraBtn: {
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
    marginTop: 8,
  },
  cameraBtnActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
    borderStyle: 'solid',
  },
  cameraText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  rewardMeta: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b45309',
  },
  rewardSub: {
    fontSize: 10,
    color: '#92400e',
    marginTop: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ea580c',
    borderRadius: 14,
    paddingVertical: 16,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
