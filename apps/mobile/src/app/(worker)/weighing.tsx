import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { db } from '../../lib/db';
import { colors } from '../../theme/colors';
import { WasteCategory } from '../../types';
import {
  Scale,
  CheckCircle2,
  Camera,
  QrCode,
  Layers,
  Trash2,
  Leaf,
  ShieldAlert,
  Bluetooth,
  RefreshCw,
} from 'lucide-react-native';

const CATEGORIES: { id: WasteCategory; name: string; icon: any; color: string; light: string }[] = [
  { id: 'MLP', name: 'MLP (Multi-Layer Plastic)', icon: Layers, color: '#1a5c38', light: '#e8f5e9' },
  { id: 'Dry', name: 'Dry Recyclables', icon: Trash2, color: '#2563eb', light: '#eff6ff' },
  { id: 'Wet', name: 'Wet / Organic Waste', icon: Leaf, color: '#10b981', light: '#ecfdf5' },
  { id: 'Sanitary', name: 'Sanitary / Hazardous', icon: ShieldAlert, color: '#ef4444', light: '#fef2f2' },
];

const weighingSchema = z.object({
  weightKg: z.number().min(0.1).max(500),
  category: z.enum(['MLP', 'Dry', 'Wet', 'Sanitary']),
});

type WeighingFormData = z.infer<typeof weighingSchema>;

export default function WorkerWeighingScreen() {
  const router = useRouter();

  const [weight, setWeight] = useState(12.8);
  const [isStable, setIsStable] = useState(true);
  const [photoCount, setPhotoCount] = useState(2);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WeighingFormData>({
    defaultValues: { weightKg: 12.8, category: 'MLP' },
  });

  const category = CATEGORIES.find((c) => c.id === 'MLP')?.id || 'MLP';

  const adjustWeight = (delta: number) => {
    setIsStable(false);
    setTimeout(() => {
      setWeight((prev) => Math.max(0.1, Number((prev + delta).toFixed(1))));
      setIsStable(true);
      setValue('weightKg', Math.max(0.1, Number((weight + delta).toFixed(1))));
    }, 300);
  };

  const handleSaveAndGenerateQR = async (data: WeighingFormData) => {
    const result = weighingSchema.safeParse(data);
    if (!result.success) {
      return;
    }

    setIsSaving(true);
    try {
      const batchNum = `MLP-2026-${Math.floor(100 + Math.random() * 900)}`;
      const clientOpId = `op-${Date.now()}`;

      await db.createOfflineBatch({
        batchNumber: batchNum,
        collectionPointId: 'cp-03',
        collectionPointName: 'CP-03 Gandhi Street',
        wasteType: data.category,
        weightKg: data.weightKg,
        condition: 'Clean',
        moisture: 'Low',
        qualityGrade: 'A',
        status: 'RECEIVED',
        notes: 'Collected from Shanti Nagar CP-03',
        clientOperationId: clientOpId,
      });

      setIsSaving(false);
      router.push('/(worker)/qr-preview');
    } catch (e) {
      setIsSaving(false);
      Alert.alert('Error', 'Failed to save record.');
    }
  };

  return (
    <Screen
      title="Digital Weighing"
      subtitle="Scale-BT-409 • Connected"
      showBack
      showOfflineBanner
      showBottomNav
    >
      {/* Scale Reading Card */}
      <Card style={styles.scaleCard} padding={18}>
        <View style={styles.scaleHeader}>
          <View style={styles.bluetoothStatus}>
            <Bluetooth size={14} color="#2563eb" />
            <Text style={styles.btText}>Scale-BT-409 • Signal Strong</Text>
          </View>

          <View style={[styles.stablePill, isStable ? styles.stableGreen : styles.stableYellow]}>
            <CheckCircle2 size={12} color={isStable ? '#15803d' : '#b45309'} />
            <Text style={[styles.stableText, { color: isStable ? '#15803d' : '#b45309' }]}>
              {isStable ? 'Stable Reading' : 'Stabilizing...'}
            </Text>
          </View>
        </View>

        {/* Big Weight Display */}
        <View style={styles.weightDisplay}>
          <Text style={styles.weightNumber}>{weight.toFixed(1)}</Text>
          <Text style={styles.weightUnit}>kg</Text>
        </View>

        {/* Scale Control Row */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlPill} onPress={() => adjustWeight(-0.5)} activeOpacity={0.8}>
            <Text style={styles.controlText}>-0.5 kg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlPill, styles.tareBtn]}
            onPress={() => {
              setWeight(12.8);
              setIsStable(true);
              setValue('weightKg', 12.8);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.tareText}>Tare / Zero</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlPill} onPress={() => adjustWeight(0.5)} activeOpacity={0.8}>
            <Text style={styles.controlText}>+0.5 kg</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Waste Stream Category Selector */}
      <SectionHeader title="Select Waste Category" />

      <View style={styles.categoriesList}>
        {CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const isSelected = category === cat.id;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryRow,
                isSelected && { borderColor: cat.color, borderWidth: 2, backgroundColor: cat.light },
              ]}
              onPress={() => setValue('category', cat.id as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: cat.light }]}>
                <IconComp size={20} color={cat.color} />
              </View>
              <Text style={[styles.categoryName, isSelected && { color: cat.color, fontWeight: '700' }]}>
                {cat.name}
              </Text>
              {isSelected && (
                <CheckCircle2 size={18} color={cat.color} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Photos Attachment Section */}
      <Card style={styles.photosSection} padding={14}>
        <View style={styles.photosHeader}>
          <Text style={styles.photosTitle}>Bag Photos ({photoCount}/3)</Text>
          <TouchableOpacity onPress={() => setPhotoCount((prev) => (prev < 3 ? prev + 1 : prev))} activeOpacity={0.8}>
            <Text style={styles.addPhotoLink}>+ Add Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photosRow}>
          {Array.from({ length: photoCount }).map((_, i) => (
            <View key={i} style={styles.photoThumb}>
              <Camera size={16} color="#475569" />
              <Text style={styles.photoThumbText}>Bag {i + 1}</Text>
            </View>
          ))}
          {photoCount < 3 && (
            <TouchableOpacity
              style={styles.addPhotoBox}
              onPress={() => setPhotoCount((prev) => prev + 1)}
              activeOpacity={0.8}
            >
              <Camera size={20} color={colors.textSecondary} />
              <Text style={styles.addPhotoText}>Capture</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>

      {/* Action Button: Save & Generate QR */}
      <Button
        title={isSaving ? 'Saving...' : 'Save & Generate QR Code'}
        leftIcon={<QrCode size={20} color="#ffffff" />}
        fullWidth
        loading={isSaving}
        onPress={handleSubmit(handleSaveAndGenerateQR)}
        variant="success"
      />

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scaleCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  scaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  bluetoothStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  btText: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
  },
  stablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  stableGreen: {
    backgroundColor: '#ecfdf5',
  },
  stableYellow: {
    backgroundColor: '#fef3c7',
  },
  stableText: {
    fontSize: 11,
    fontWeight: '700',
  },
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  weightNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  weightUnit: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  controlPill: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  controlText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  tareBtn: {
    backgroundColor: '#e2e8f0',
  },
  tareText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  categoriesList: {
    gap: 8,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  photosSection: {
    marginBottom: 18,
  },
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  photosTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addPhotoLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  photosRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoThumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  photoThumbText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  addPhotoBox: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  bottomSpacer: {
    height: 20,
  },
});
