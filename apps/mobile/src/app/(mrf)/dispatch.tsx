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
  Factory,
  Layers,
  Truck,
  User,
  IndianRupee,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Send,
  MapPin,
} from 'lucide-react-native';

const mrf = colors.roles.mrf;

const dispatchSchema = z.object({
  processorId: z.string().min(1, 'Select a processor'),
  batchId: z.string().min(1, 'Select a batch'),
  quantityKg: z.number().min(1, 'Quantity must be greater than 0'),
  vehicleNumber: z.string().min(1, 'Enter vehicle number'),
  driverName: z.string().min(1, 'Enter driver name'),
});

type DispatchForm = z.infer<typeof dispatchSchema>;

type Processor = {
  id: string;
  name: string;
  location: string;
  material: string;
  pricePerKg: number;
};

type DispatchBatch = {
  id: string;
  batchNumber: string;
  weightKg: number;
  grade: 'A' | 'B' | 'C';
};

const PROCESSORS: Processor[] = [
  {
    id: 'proc-1',
    name: 'GreenCycle Pvt Ltd',
    location: 'Hosur Industrial Hub • 50 km',
    material: 'Grade A MLP',
    pricePerKg: 38,
  },
  {
    id: 'proc-2',
    name: 'EcoPoly Recyclers',
    location: 'Coimbatore • 62 km',
    material: 'MLP / Dry Mix',
    pricePerKg: 32,
  },
  {
    id: 'proc-3',
    name: 'ReNew Plastics',
    location: 'Chennai • 80 km',
    material: 'Mixed / Secondary',
    pricePerKg: 29,
  },
];

const DISPATCH_BATCHES: DispatchBatch[] = [
  { id: 'mrf-b-0140', batchNumber: 'MLP-2026-0140', weightKg: 24.5, grade: 'A' },
  { id: 'mrf-b-0139', batchNumber: 'MLP-2026-0139', weightKg: 14.5, grade: 'B' },
  { id: 'mrf-b-0141', batchNumber: 'MLP-2026-0141', weightKg: 18.6, grade: 'A' },
];

const VEHICLES = ['6 Ton Truck (TN-01-EA-9912)', '3.5 Ton Mini Tempo (TN-29-C-1044)'];

export default function MrfDispatchScreen() {
  const router = useRouter();

  const form = useForm<DispatchForm>({
    defaultValues: {
      processorId: '',
      batchId: '',
      quantityKg: 180,
      vehicleNumber: VEHICLES[0],
      driverName: '',
    },
  });

  const processorId = form.watch('processorId');
  const batchId = form.watch('batchId');
  const quantityKg = form.watch('quantityKg') ?? 0;

  const processor = PROCESSORS.find((p) => p.id === processorId);
  const batch = DISPATCH_BATCHES.find((b) => b.id === batchId);
  const pricePerKg = processor?.pricePerKg ?? 0;
  const estimatedValue = Math.round(quantityKg * pricePerKg);
  const canDispatch = batch ? quantityKg <= batch.weightKg : false;

  const onSubmit = (values: DispatchForm) => {
    const result = dispatchSchema.safeParse(values);
    if (!result.success) {
      Alert.alert('Validation Error', 'Please complete all required fields.');
      return;
    }
    if (!canDispatch) {
      Alert.alert(
        'Quantity Exceeds Stock',
        `Selected batch only has ${batch?.weightKg} kg available.`
      );
      return;
    }
    Alert.alert(
      'Dispatch Created',
      `Manifest for ${values.quantityKg} kg MLP to ${values.processorId}.\nEstimated Value: ₹${estimatedValue.toLocaleString()}`,
      [
        { text: 'View Handover', onPress: () => router.push('/(mrf)/inventory') },
        { text: 'Done', style: 'cancel' },
      ]
    );
  };

  const selectProcessor = (id: string) => form.setValue('processorId', id);
  const selectBatch = (id: string) => {
    form.setValue('batchId', id);
    const b = DISPATCH_BATCHES.find((x) => x.id === id);
    form.setValue('quantityKg', b ? b.weightKg : 0);
  };

  return (
    <Screen title="Dispatch to Processor" subtitle="Create Outbound Manifest" showBack>
      {/* Processor Selection */}
      <SectionHeader title="Select Processor" />
      <Card style={styles.processorsCard} padding={14}>
        <View style={styles.processorList}>
          {PROCESSORS.map((proc) => {
            const isSelected = processorId === proc.id;
            return (
              <TouchableOpacity
                key={proc.id}
                style={[styles.processorOption, isSelected && styles.processorSelected]}
                onPress={() => selectProcessor(proc.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.processorIcon, { backgroundColor: isSelected ? mrf.light : '#f1f5f9' }]}>
                  <Factory size={18} color={isSelected ? mrf.primary : colors.textSecondary} />
                </View>
                <View style={styles.processorMeta}>
                  <Text style={[styles.processorName, isSelected && { color: mrf.primary }]}>
                    {proc.name}
                  </Text>
                  <Text style={styles.processorLocation}>{proc.location}</Text>
                </View>
                <View style={styles.processorPrice}>
                  <Text style={styles.processorPriceText}>₹{proc.pricePerKg} / kg</Text>
                </View>
                {isSelected && <CheckCircle2 size={18} color={mrf.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Batch Selection */}
      <SectionHeader title="Select Batch for Dispatch" />
      <Card style={styles.batchesCard} padding={14}>
        <View style={styles.batchList}>
          {DISPATCH_BATCHES.map((b) => {
            const isSelected = batchId === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.batchOption, isSelected && styles.batchSelected]}
                onPress={() => selectBatch(b.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.batchIcon, { backgroundColor: isSelected ? mrf.light : '#fff7ed' }]}>
                  <Layers size={18} color={isSelected ? mrf.primary : colors.textSecondary} />
                </View>
                <View style={styles.batchMeta}>
                  <Text style={[styles.batchTitle, isSelected && { color: mrf.primary }]}>
                    {b.batchNumber}
                  </Text>
                  <Text style={styles.batchSub}>
                    Grade {b.grade} • {b.weightKg} kg available
                  </Text>
                </View>
                <View style={styles.batchKg}>
                  <Text style={styles.batchKgText}>{b.weightKg} kg</Text>
                </View>
                {isSelected && <CheckCircle2 size={18} color={mrf.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Dispatch Quantity */}
      <Input
        value={String(quantityKg)}
        onChangeText={(text) => {
          const n = Number(text);
          form.setValue('quantityKg', Number.isNaN(n) ? 0 : n);
        }}
        label="Dispatch Quantity (kg)"
        keyboardType="numeric"
        containerStyle={styles.inputContainer}
      />
      {processor && batch && (
        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Rate</Text>
          <Text style={styles.valueText}>₹{pricePerKg} / kg</Text>
          <Text style={styles.valueLabel}>Estimated Value</Text>
          <Text style={styles.valueTotal}>₹{estimatedValue.toLocaleString()}</Text>
        </View>
      )}

      {/* Vehicle & Driver */}
      <SectionHeader title="Vehicle & Driver" />
      <Card style={styles.transportCard} padding={16}>
        <View style={styles.transportRow}>
          <Input
            value={form.watch('vehicleNumber') ?? ''}
            onChangeText={(text) => form.setValue('vehicleNumber', text)}
            label="Vehicle Number"
            containerStyle={styles.transportInput}
          />
          <View style={styles.vehiclePicker}>
            <ChevronRight size={16} color={colors.textMuted} />
          </View>
        </View>
        <Input
          value={form.watch('driverName') ?? ''}
          onChangeText={(text) => form.setValue('driverName', text)}
          label="Driver Name"
          placeholder="e.g. Ramesh K"
          containerStyle={styles.inputContainer}
        />
      </Card>

      {/* Create Dispatch */}
      <Button
        title="Create Dispatch Order"
        variant="primary"
        leftIcon={<Send size={18} color="#ffffff" />}
        fullWidth
        disabled={!processorId || !batchId || !canDispatch || quantityKg <= 0}
        onPress={form.handleSubmit(onSubmit)}
      />

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  processorsCard: {
    marginBottom: 4,
  },
  processorList: {
    gap: 8,
  },
  processorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
  },
  processorSelected: {
    borderColor: mrf.primary,
    backgroundColor: mrf.light,
  },
  processorIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  processorMeta: {
    flex: 1,
  },
  processorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  processorLocation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  processorPrice: {
    alignItems: 'flex-end',
  },
  processorPriceText: {
    fontSize: 12,
    fontWeight: '800',
    color: mrf.primary,
  },
  batchesCard: {
    marginBottom: 4,
  },
  batchList: {
    gap: 8,
  },
  batchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
  },
  batchSelected: {
    borderColor: mrf.primary,
    backgroundColor: mrf.light,
  },
  batchIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  batchMeta: {
    flex: 1,
  },
  batchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  batchSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchKg: {
    alignItems: 'flex-end',
  },
  batchKgText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  inputContainer: {
    marginBottom: 10,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 4,
  },
  valueLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  valueText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  valueTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: mrf.primary,
  },
  transportCard: {
    marginBottom: 4,
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transportInput: {
    flex: 1,
    marginBottom: 10,
  },
  vehiclePicker: {
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});
