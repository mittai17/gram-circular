import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { colors } from '../../theme/colors';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Camera, FileCheck2, Scale, Truck } from 'lucide-react-native';

const PRIMARY = colors.roles.buyer.primary; // #7c3aed
const TOLERANCE_PCT = 2;

interface Receipt {
  id: string;
  poNumber: string;
  batchNumber: string;
  dispatchedKg: number;
  receivedKg: number | null;
  status: 'Pending' | 'Verified' | 'Discrepancy';
}

const RECEIPTS: Receipt[] = [
  { id: 'r-1', poNumber: 'PO-2026-089', batchNumber: 'MLP-2026-0143', dispatchedKg: 162, receivedKg: null, status: 'Pending' },
  { id: 'r-2', poNumber: 'PO-2026-084', batchNumber: 'MLP-2026-0128', dispatchedKg: 320, receivedKg: 320, status: 'Verified' },
  { id: 'r-3', poNumber: 'PO-2026-079', batchNumber: 'MLP-2026-0120', dispatchedKg: 280, receivedKg: 275, status: 'Discrepancy' },
  { id: 'r-4', poNumber: 'PO-2026-072', batchNumber: 'MLP-2026-0115', dispatchedKg: 150, receivedKg: 150, status: 'Verified' },
];

const ACTIVE = RECEIPTS[0];

const receiptSchema = z.object({
  receivedWeight: z
    .string({ required_error: 'Received weight is required' })
    .trim()
    .min(1, 'Received weight is required')
    .refine(
      (val) => {
        const n = Number(val);
        return !isNaN(n) && n > 0 && n <= 10000;
      },
      'Enter a valid weight',
    ),
  notes: z.string().optional(),
});

type ReceiptForm = z.infer<typeof receiptSchema>;

export default function BuyerReceiptConfirmScreen() {
  const router = useRouter();
  const [attachedSlip, setAttachedSlip] = useState<string | null>(null);

  const {
    control,
    getValues,
    setError,
    formState: { errors },
  } = useForm<ReceiptForm>({
    defaultValues: { receivedWeight: '', notes: '' },
  });

  const dispatched = ACTIVE.dispatchedKg;
  const toleranceKg = (dispatched * TOLERANCE_PCT) / 100;

  const handleConfirm = () => {
    const values = getValues();
    try {
      receiptSchema.parse(values);
      Alert.alert(
        'Receipt Confirmed',
        `${ACTIVE.poNumber} verified & closed.\nReceived Weight: ${values.receivedWeight} kg (Variance within ${TOLERANCE_PCT}% tolerance).\nEPR credit certificate generated.`,
        [
          {
            text: 'View Purchase History',
            onPress: () => router.push('/(buyer)/history'),
          },
        ]
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          setError(
            issue.path[0] as 'receivedWeight' | 'notes',
            { type: 'manual', message: issue.message },
          );
        });
      }
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Confirm Receipt" subtitle="Batch MLP-2026-0143 Verification" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Receipts List */}
        <SectionHeader
          title="Handover Receipts"
          subtitle="Dispatched vs received weight per purchase order"
        />
        <View style={styles.list}>
          {RECEIPTS.map((r) => {
            const variance = r.receivedKg != null ? r.receivedKg - r.dispatchedKg : null;
            const withinTolerance =
              variance != null ? Math.abs(variance) <= (r.dispatchedKg * TOLERANCE_PCT) / 100 : false;
            return (
              <TouchableOpacity
                key={r.id}
                style={styles.receiptCard}
                activeOpacity={0.8}
              >
                <View style={styles.receiptHeader}>
                  <View style={styles.receiptIds}>
                    <Text style={styles.receiptPo}>{r.poNumber}</Text>
                    <Text style={styles.receiptBatch}>{r.batchNumber}</Text>
                  </View>
                  <StatusBadge
                    variant={
                      r.status === 'Verified'
                        ? 'success'
                        : r.status === 'Discrepancy'
                        ? 'error'
                        : 'info'
                    }
                  >
                    {r.status}
                  </StatusBadge>
                </View>
                <View style={styles.receiptWeights}>
                  <View style={styles.weightCol}>
                    <Text style={styles.weightLabel}>Dispatched</Text>
                    <Text style={styles.weightValue}>{r.dispatchedKg} kg</Text>
                  </View>
                  <View style={styles.weightCol}>
                    <Text style={styles.weightLabel}>Received</Text>
                    <Text style={[styles.weightValue, r.receivedKg == null && styles.weightPending]}>
                      {r.receivedKg == null ? '—' : `${r.receivedKg} kg`}
                    </Text>
                  </View>
                </View>
                {variance != null && (
                  <View style={styles.varianceRow}>
                    <Text style={[styles.varianceText, !withinTolerance && styles.varianceOff]}>
                      {variance >= 0 ? '+' : ''}{variance} kg vs dispatched
                      {withinTolerance ? ' • within tolerance' : ' • discrepancy'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Receipt Form */}
        <SectionHeader
          title={`Active Receipt • ${ACTIVE.poNumber}`}
          subtitle="Confirm the received weight and upload weighbridge evidence"
        />

        <Card style={styles.formCard}>
          <StatCard
            value={`${dispatched} kg`}
            label="Dispatched Weight"
            subtext="Weighbridge gross weight"
            icon={<Truck size={18} color={colors.textSecondary} />}
            iconBg="#f1f5f9"
            iconColor={colors.textSecondary}
            style={{ width: '48%' }}
          />

          <Controller
            control={control}
            name="receivedWeight"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Received Weight (kg)"
                value={value ?? ''}
                onChangeText={(text: string) => {
                  onChange(text);
                  setError('receivedWeight', { type: 'manual', message: '' });
                }}
                keyboardType="numeric"
                error={errors.receivedWeight?.message}
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <View style={styles.varianceNote}>
            <Text style={styles.varianceLabel}>Acceptable variance:</Text>
            <Text style={styles.varianceValue}>
              ±{toleranceKg.toFixed(1)} kg ({TOLERANCE_PCT}% of dispatched)
            </Text>
          </View>

          {/* Evidence Upload */}
          <View style={styles.evidenceSection}>
            <Text style={styles.sectionTitle}>Evidence Upload</Text>
            <Text style={styles.sectionSubtitle}>
              Attach the gross weighbridge slip and a photo of the unbroken truck seal
            </Text>
            <TouchableOpacity
              style={[styles.uploadBox, attachedSlip ? styles.uploadBoxActive : {}]}
              onPress={() => setAttachedSlip(attachedSlip ? null : 'WB-SLIP-77402.JPG')}
              activeOpacity={0.8}
            >
              <Camera size={24} color={attachedSlip ? '#15803d' : colors.textSecondary} />
              <Text style={[styles.uploadText, attachedSlip && styles.uploadTextActive]}>
                {attachedSlip ? `Slip Attached: ${attachedSlip}` : 'Upload Weighbridge Slip Photo'}
              </Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name="notes"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Notes (optional)"
                  placeholder="Add remarks about condition, seals or shortages…"
                  value={value ?? ''}
                  onChangeText={onChange}
                  containerStyle={styles.noteInputContainer}
                />
              )}
            />
          </View>

          <TouchableOpacity style={styles.confirmPressable} activeOpacity={0.85}>
            <Button
              title="Confirm & Close Receipt"
              variant="primary"
              onPress={handleConfirm}
              style={{ backgroundColor: PRIMARY, borderColor: 'transparent' }}
              textStyle={{ color: '#ffffff', fontWeight: '700' }}
              fullWidth
            />
          </TouchableOpacity>
        </Card>

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
  list: {
    marginBottom: 16,
  },
  receiptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptIds: {
    flex: 1,
  },
  receiptPo: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  receiptBatch: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  receiptWeights: {
    flexDirection: 'row',
    gap: 10,
  },
  weightCol: {
    flex: 1,
  },
  weightLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  weightValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  weightPending: {
    color: colors.textMuted,
  },
  varianceRow: {
    marginTop: 6,
  },
  varianceText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  varianceOff: {
    color: '#b45309',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 14,
  },
  noteInputContainer: {
    marginTop: 4,
    marginBottom: 0,
  },
  varianceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#faf5ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.roles.buyer.border,
  },
  varianceLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  varianceValue: {
    fontSize: 11,
    color: PRIMARY,
    fontWeight: '800',
  },
  evidenceSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
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
    minHeight: 56,
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
  uploadTextActive: {
    color: '#15803d',
    fontWeight: '700',
  },
  confirmPressable: {
    width: '100%',
  },
});
