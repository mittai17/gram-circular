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
  MapPin,
  Navigation,
  Camera,
  Scale,
  CheckCircle2,
  Trash2,
  Leaf,
  Layers,
  ShieldAlert,
} from 'lucide-react-native';

const BIN_TYPES = [
  { id: 'wet', name: 'Wet Waste', color: '#10b981', light: '#ecfdf5', icon: Leaf, desc: 'Kitchen & organic' },
  { id: 'dry', name: 'Dry Waste', color: '#3b82f6', light: '#eff6ff', icon: Trash2, desc: 'Paper, cardboard, cans' },
  { id: 'mlp', name: 'MLP Plastic', color: '#1a5c38', light: '#e8f5e9', icon: Layers, desc: 'Chips, snack wrappers' },
  { id: 'sanitary', name: 'Sanitary', color: '#ef4444', light: '#fef2f2', icon: ShieldAlert, desc: 'Biomedical / hazardous' },
];

export default function WorkerStopDetailScreen() {
  const router = useRouter();
  const [selectedBins, setSelectedBins] = useState<string[]>(['wet', 'dry', 'mlp']);
  const [hasPhoto, setHasPhoto] = useState(false);

  const toggleBin = (id: string) => {
    setSelectedBins((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="CP-03 Gandhi Street" subtitle="Stop Details & Inspection" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Collection Point Meta Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardTop}>
            <View style={styles.pinCircle}>
              <MapPin size={22} color="#2563eb" />
            </View>
            <View style={styles.infoMeta}>
              <Text style={styles.pointName}>CP-03 Gandhi Street</Text>
              <Text style={styles.pointWard}>Shanti Nagar Ward 2 • Kaveripattinam</Text>
            </View>
          </View>

          <View style={styles.nextStopBanner}>
            <Navigation size={14} color="#2563eb" />
            <Text style={styles.nextStopText}>
              Next Stop: CP-07 School Road (2.1 km away)
            </Text>
          </View>
        </View>

        {/* Bin Streams Section */}
        <Text style={styles.sectionTitle}>Available Bin Streams at Point</Text>
        <Text style={styles.sectionSubtitle}>
          Select streams present for collection and digital weighing
        </Text>

        <View style={styles.binsGrid}>
          {BIN_TYPES.map((bin) => {
            const IconComp = bin.icon;
            const isSelected = selectedBins.includes(bin.id);

            return (
              <TouchableOpacity
                key={bin.id}
                style={[
                  styles.binCard,
                  isSelected && { borderColor: bin.color, borderWidth: 2, backgroundColor: bin.light },
                ]}
                onPress={() => toggleBin(bin.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.binIconBox, { backgroundColor: bin.light }]}>
                  <IconComp size={22} color={bin.color} />
                </View>
                <Text style={[styles.binName, isSelected && { color: bin.color }]}>
                  {bin.name}
                </Text>
                <Text style={styles.binDesc}>{bin.desc}</Text>

                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: bin.color }]}>
                    <CheckCircle2 size={12} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Photo Capture Card */}
        <View style={styles.photoCard}>
          <Text style={styles.photoTitle}>Collection Point Proof Photo</Text>
          <Text style={styles.photoSub}>Capture geotagged verification before weighing</Text>

          <TouchableOpacity
            style={[styles.cameraBtn, hasPhoto && styles.cameraBtnActive]}
            onPress={() => {
              setHasPhoto(!hasPhoto);
              Alert.alert('Camera', hasPhoto ? 'Photo removed' : 'Photo captured with GPS coordinates.');
            }}
            activeOpacity={0.8}
          >
            <Camera size={22} color={hasPhoto ? '#15803d' : '#475569'} />
            <Text style={[styles.cameraBtnText, hasPhoto && { color: '#15803d', fontWeight: '700' }]}>
              {hasPhoto ? 'Photo Attached (14.2°N, 78.3°E)' : 'Take Verification Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Proceed to Weigh Button */}
        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={() => router.push('/(worker)/weighing')}
          activeOpacity={0.85}
        >
          <Scale size={20} color="#ffffff" />
          <Text style={styles.proceedBtnText}>Proceed to Weigh Waste</Text>
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
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  infoCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoMeta: {
    flex: 1,
  },
  pointName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  pointWard: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  nextStopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
  },
  nextStopText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  binsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  binCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  binIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  binName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  binDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  photoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  photoSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
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
    paddingVertical: 14,
    backgroundColor: '#f8faf9',
  },
  cameraBtnActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
    borderStyle: 'solid',
  },
  cameraBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
  },
  proceedBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
