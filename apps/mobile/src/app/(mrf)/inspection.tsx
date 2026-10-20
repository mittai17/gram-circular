import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import {
  Layers,
  Image,
  ImageMinus,
  CheckCircle2,
  Droplets,
  Award,
  Save,
  AlertTriangle,
} from 'lucide-react-native';

const mrf = colors.roles.mrf;

const inspectionSchema = z.object({
  condition: z.enum(['Clean', 'Slightly Dirty', 'Contaminated']),
  moisture: z.enum(['Low', 'Medium', 'High']),
  qualityGrade: z.enum(['A', 'B', 'C']),
  remarks: z.string().optional(),
});

type InspectionForm = z.infer<typeof inspectionSchema>;

const CONDITION_OPTIONS = ['Clean', 'Slightly Dirty', 'Contaminated'] as const;
const MOISTURE_OPTIONS = ['Low', 'Medium', 'High'] as const;
const GRADE_OPTIONS = ['A', 'B', 'C'] as const;

const BATCH = {
  id: 'mrf-b-0143',
  batchNumber: 'MLP-2026-0143',
  collectionPointName: 'CP-03 Gandhi Street',
  inspector: 'Ramesh K',
  weightKg: 12.8,
  wasteType: 'MLP' as const,
};

const PHOTOS = [
  { id: 'p1', uri: 'https://images.unsplash.com/photo-1542281284-97026f9e77f2?w=400&q=80' },
  { id: 'p2', uri: 'https://images.unsplash.com/photo-1586520667076-2228b04490e3?w=400&q=80' },
  { id: 'p3', uri: 'https://images.unsplash.com/photo-1533022796081-4be9f70059ed?w=400&q=80' },
];

export default function MrfInspectionScreen() {
  const router = useRouter();

  const form = useForm<InspectionForm>({
    defaultValues: {
      condition: 'Clean',
      moisture: 'Low',
      qualityGrade: 'A',
      remarks: '',
    },
  });

  const condition = form.watch('condition');
  const moisture = form.watch('moisture');
  const qualityGrade = form.watch('qualityGrade');

  const onSubmit = (values: InspectionForm) => {
    const result = inspectionSchema.safeParse(values);
    if (!result.success) {
      Alert.alert('Validation Error', 'Please complete all required fields.');
      return;
    }
    Alert.alert(
      'Inspection Saved',
      `Batch ${BATCH.batchNumber} evaluated as Grade ${values.qualityGrade}. Ready for storage assignment.`,
      [
        { text: 'Assign Storage Zone', onPress: () => router.push('/(mrf)/storage') },
        { text: 'Back to Dashboard', onPress: () => router.push('/(mrf)/dashboard') },
      ]
    );
  };

  const toggleCondition = (value: (typeof CONDITION_OPTIONS)[number]) => {
    form.setValue('condition', value);
  };
  const toggleMoisture = (value: (typeof MOISTURE_OPTIONS)[number]) => {
    form.setValue('moisture', value);
  };
  const toggleGrade = (value: (typeof GRADE_OPTIONS)[number]) => {
    form.setValue('qualityGrade', value);
  };

  return (
    <Screen title="Quality Inspection" subtitle={`${BATCH.batchNumber} • ${BATCH.weightKg} kg`} showBack>
      {/* Batch Info Header */}
      <Card style={styles.batchCard} padding={14}>
        <View style={styles.batchRow}>
          <View style={[styles.batchIcon, { backgroundColor: '#e8f5e9' }]}>
            <Layers size={18} color="#1a5c38" />
          </View>
          <View style={styles.batchMeta}>
            <Text style={styles.batchTitle}>Batch: {BATCH.batchNumber}</Text>
            <Text style={styles.batchSubtitle}>
              Origin: {BATCH.collectionPointName} • {BATCH.inspector}
            </Text>
          </View>
          <Text style={styles.batchWeight}>{BATCH.weightKg} kg</Text>
        </View>
      </Card>

      {/* Photo Grid */}
      <SectionHeader title="Inspection Photos" viewAllLabel="Add Photo" onViewAll={() => {}} />
      <View style={styles.photoGrid}>
        {PHOTOS.map((photo) => (
          <TouchableOpacity key={photo.id} style={styles.photoCard} activeOpacity={0.8}>
            <View style={styles.photoPlaceholder}>
              <Image size={20} color={colors.textMuted} />
            </View>
            <View style={styles.photoRemove}>
              <ImageMinus size={14} color="#dc2626" />
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.photoAdd} activeOpacity={0.8}>
          <View style={styles.photoPlaceholderBorder}>
            <Image size={20} color={colors.textMuted} />
          </View>
          <Text style={styles.photoAddText}>Add Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Surface Condition */}
      <SectionHeader title="Surface Condition" />
      <View style={styles.optionsRow}>
        {CONDITION_OPTIONS.map((opt) => {
          const isActive = condition === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.optionBtn, isActive && styles.optionBtnActive]}
              onPress={() => toggleCondition(opt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Moisture Level */}
      <SectionHeader title="Moisture Level" />
      <View style={styles.optionsRow}>
        {MOISTURE_OPTIONS.map((opt) => {
          const isActive = moisture === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.optionBtn, isActive && styles.optionBtnActive]}
              onPress={() => toggleMoisture(opt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quality Grade */}
      <SectionHeader title="Quality Grade" />
      <View style={styles.optionsRow}>
        {GRADE_OPTIONS.map((opt) => {
          const isActive = qualityGrade === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.optionBtn, isActive && styles.optionBtnActive]}
              onPress={() => toggleGrade(opt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Remarks */}
      <Input
        value={form.watch('remarks') ?? ''}
        onChangeText={(text) => form.setValue('remarks', text)}
        label="Remarks"
        placeholder="Add inspection notes..."
        containerStyle={styles.inputContainer}
      />

      {/* Save Button */}
      <Button
        title="Save Inspection"
        variant="primary"
        leftIcon={<Save size={18} color="#ffffff" />}
        fullWidth
        onPress={form.handleSubmit(onSubmit)}
      />

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  batchCard: {
    marginBottom: 4,
  },
  batchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchMeta: {
    flex: 1,
  },
  batchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchWeight: {
    fontSize: 16,
    fontWeight: '800',
    color: mrf.primary,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  photoCard: {
    width: 88,
    height: 88,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  photoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderBorder: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAdd: {
    width: 88,
    height: 88,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
  },
  optionBtnActive: {
    backgroundColor: mrf.light,
    borderColor: mrf.primary,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: mrf.primary,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 10,
  },
  bottomSpacer: {
    height: 20,
  },
});
