import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import CollectionPointMap from '../../components/map/OSMWebViewCollectionPoints';
import { db } from '../../lib/db';
import { colors } from '../../theme/colors';
import {
  MapPin,
  Navigation,
  Camera,
  Scale,
  CheckCircle2,
  Leaf,
  Trash2,
  Layers,
  ShieldAlert,
} from 'lucide-react-native';

// CP-03 Gandhi Street — demo coordinates for the map thumbnail
const CURRENT_STOP_POINT = [{
  id: 'cp3',
  name: 'CP-03 Gandhi Street',
  lat: 9.1650,
  lng: 77.6180,
  fillPercent: 72,
  wasteStreams: ['Wet', 'MLP'],
  isActive: true,
}];


const BIN_TYPES = [
  { id: 'wet', name: 'Wet Waste', color: '#10b981', light: '#ecfdf5', icon: Leaf, desc: 'Kitchen & organic waste' },
  { id: 'dry', name: 'Dry Waste', color: '#3b82f6', light: '#eff6ff', icon: Trash2, desc: 'Paper, cardboard, cans' },
  { id: 'mlp', name: 'MLP Plastic', color: '#1a5c38', light: '#e8f5e9', icon: Layers, desc: 'Chips, snack wrappers' },
  { id: 'sanitary', name: 'Sanitary', color: '#ef4444', light: '#fef2f2', icon: ShieldAlert, desc: 'Biomedical / hazardous' },
];

const stopDetailSchema = z.object({
  weightKg: z.coerce.number().min(0.1, 'Weight must be at least 0.1 kg').max(500, 'Weight too high'),
  category: z.enum(['MLP', 'Dry', 'Wet', 'Sanitary']),
  notes: z.string().optional(),
});

type StopDetailFormData = z.infer<typeof stopDetailSchema>;

const CATEGORY_INFO: Record<string, { color: string; light: string }> = {
  MLP: { color: '#1a5c38', light: '#e8f5e9' },
  Dry: { color: '#3b82f6', light: '#eff6ff' },
  Wet: { color: '#10b981', light: '#ecfdf5' },
  Sanitary: { color: '#ef4444', light: '#fef2f2' },
};

export default function WorkerStopDetailScreen() {
  const router = useRouter();
  const [selectedBins, setSelectedBins] = useState<string[]>(['wet', 'dry', 'mlp']);
  const [hasPhoto, setHasPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StopDetailFormData>({
    defaultValues: { weightKg: 12.8, category: 'MLP', notes: '' },
  });

  useEffect(() => {
    setValue('weightKg', 12.8);
    setValue('category', 'MLP');
  }, [setValue]);

  const weight = watch('weightKg');
  const category = watch('category');

  const toggleBin = (id: string) => {
    setSelectedBins((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: StopDetailFormData) => {
    const result = stopDetailSchema.safeParse(data);
    if (!result.success) {
      Alert.alert('Validation Error', result.error.errors[0].message);
      return;
    }

    const batchNumber = `MLP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const clientOpId = `op-${Date.now()}`;

    db.createOfflineBatch({
      batchNumber,
      collectionPointId: 'cp-03',
      collectionPointName: 'CP-03 Gandhi Street',
      wasteType: category,
      weightKg: data.weightKg,
      condition: 'Clean',
      moisture: 'Low',
      qualityGrade: 'A',
      status: 'RECEIVED',
      notes: data.notes || 'Collected from Shanti Nagar CP-03',
      clientOperationId: clientOpId,
    }).then(() => {
      router.push('/(worker)/qr-preview');
    }).catch(() => {
      Alert.alert('Error', 'Failed to create batch. Please try again.');
    });
  };

  return (
    <Screen
      title="CP-03 Gandhi Street"
      subtitle="Stop Details & Inspection"
      showBack
      showOfflineBanner
      showBottomNav
    >
      {/* Collection Point Info Card */}
      <Card style={styles.infoCard} padding={16}>
        <View style={styles.infoCardTop}>
          <View style={styles.pinCircle}>
            <MapPin size={22} color="#2563eb" />
          </View>
          <View style={styles.infoMeta}>
            <Text style={styles.pointName}>CP-03 Gandhi Street</Text>
            <Text style={styles.pointWard}>
              Shanti Nagar Ward 2 • Kaveripattinam
            </Text>
          </View>
        </View>

        <View style={styles.stopInfoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Stop Code</Text>
            <Text style={styles.infoValue}>CP-03</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ward</Text>
            <Text style={styles.infoValue}>Ward 2</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>2.1 km</Text>
          </View>
        </View>

        <View style={styles.nextStopBanner}>
          <Navigation size={14} color="#2563eb" />
          <Text style={styles.nextStopText}>
            Next Stop: CP-07 School Road (2.1 km away)
          </Text>
        </View>

        {/* Collection point location thumbnail */}
        <View style={styles.mapThumbnail}>
          <CollectionPointMap points={CURRENT_STOP_POINT} height={160} />
        </View>
      </Card>

      {/* Bin Streams Section */}
      <SectionHeader
        title="Available Bin Streams"
        subtitle="Select streams present for collection and digital weighing"
      />

      <View style={styles.binsGrid}>
        {BIN_TYPES.map((bin) => {
          const IconComp = bin.icon;
          const isSelected = selectedBins.includes(bin.id);

          return (
            <TouchableOpacity
              key={bin.id}
              style={[
                styles.binCard,
                isSelected && {
                  borderColor: bin.color,
                  borderWidth: 2,
                  backgroundColor: bin.light,
                },
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

      {/* Smart Weighing Integration */}
      <Card style={styles.weighCard} padding={16}>
        <SectionHeader
          title="Smart Weighing"
          subtitle="Confirm weight before batch creation"
        />

        <View style={styles.formRow}>
          <View style={styles.inputGroup}>
            <Input
              {...register('weightKg')}
              label="Weight (kg)"
              value={String(weight)}
              onChangeText={(text) => setValue('weightKg', parseFloat(text) || 0)}
              keyboardType="numeric"
              error={errors.weightKg?.message}
            />
          </View>
          <View style={styles.inputGroup}>
            <Input
              label="Category"
              value={category}
              onChangeText={(text) => setValue('category', text as 'MLP' | 'Dry' | 'Wet' | 'Sanitary')}
              editable={false}
            />
          </View>
        </View>

        {errors.weightKg && (
          <View style={styles.errorRow}>
            <Text style={styles.errorText}>{errors.weightKg.message}</Text>
          </View>
        )}

        <View style={styles.categorySelector}>
          <Text style={styles.categorySectionTitle}>Waste Category</Text>
          <View style={styles.categoryRows}>
            {(['MLP', 'Dry', 'Wet', 'Sanitary'] as const).map((cat) => {
              const info = CATEGORY_INFO[cat];
              const isSelected = category === cat;

              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryRow,
                    isSelected && { borderColor: info.color, borderWidth: 2, backgroundColor: info.light },
                  ]}
                  onPress={() => setValue('category', cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoryName, isSelected && { color: info.color, fontWeight: '700' }]}>
                    {cat}
                  </Text>
                  {isSelected && (
                    <CheckCircle2 size={18} color={info.color} style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Card>

      {/* Photo Capture Card */}
      <Card style={styles.photoCard} padding={16}>
        <View style={styles.photoHeader}>
          <Text style={styles.photoTitle}>Collection Point Proof Photo</Text>
          <Text style={styles.photoSub}>Capture geotagged verification before weighing</Text>
        </View>

        <TouchableOpacity
          style={[styles.cameraBtn, hasPhoto && styles.cameraBtnActive]}
          onPress={() => {
            setHasPhoto(!hasPhoto);
            Alert.alert(
              'Camera',
              hasPhoto ? 'Photo removed' : 'Photo captured with GPS coordinates (14.2°N, 78.3°E).'
            );
          }}
          activeOpacity={0.8}
        >
          <Camera size={22} color={hasPhoto ? '#15803d' : '#475569'} />
          <Text style={[styles.cameraBtnText, hasPhoto && { color: '#15803d', fontWeight: '700' }]}>
            {hasPhoto ? 'Photo Attached • 14.2°N, 78.3°E' : 'Take Verification Photo'}
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Batch Creation Button */}
      <Button
        title="Create Batch & Proceed to Weigh"
        leftIcon={<Scale size={18} color="#ffffff" />}
        fullWidth
        onPress={handleSubmit(onSubmit)}
      />

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    marginBottom: 16,
  },
  infoCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
  stopInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
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
  mapThumbnail: {
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden',
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
  weighCard: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  inputGroup: {
    flex: 1,
  },
  errorRow: {
    marginBottom: 10,
  },
  errorText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  categorySelector: {
    marginBottom: 10,
  },
  categorySectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  categoryRows: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  photoCard: {
    marginBottom: 16,
  },
  photoHeader: {
    marginBottom: 14,
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
  bottomSpacer: {
    height: 20,
  },
});
