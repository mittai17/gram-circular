import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Input } from '../../components/ui/Input';
import { colors } from '../../theme/colors';
import { WasteCategory } from '../../types';
import { CITIZEN_REPORTS } from '../../lib/mock-data';
import {
  AlertTriangle,
  Layers,
  Leaf,
  Trash2,
  ShieldAlert,
  Camera,
  CheckCircle2,
  Award,
} from 'lucide-react-native';

const CITIZEN_PRIMARY = colors.roles.citizen.primary; // #d97706
const CITIZEN_LIGHT = colors.roles.citizen.light; // #fef3c7

const STREAM_VALUES = ['Wet', 'Dry', 'Sanitary', 'MLP'] as const;
type StreamKey = typeof STREAM_VALUES[number];

const ISSUE_VALUES = ['overflowing', 'damaged', 'foul smell', 'missed collection'] as const;

const reportSchema = z.object({
  stream: z.enum(STREAM_VALUES),
  issueType: z.enum(ISSUE_VALUES),
  location: z.string().min(1, 'Please enter a bin location'),
  notes: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

const STREAMS: { id: StreamKey; name: string; color: string; light: string; icon: any }[] = [
  { id: 'Wet', name: 'Wet Waste', color: '#10b981', light: '#ecfdf5', icon: Leaf },
  { id: 'Dry', name: 'Dry Waste', color: '#2563eb', light: '#eff6ff', icon: Trash2 },
  { id: 'Sanitary', name: 'Sanitary', color: '#ef4444', light: '#fef2f2', icon: ShieldAlert },
  { id: 'MLP', name: 'MLP Plastic', color: '#1a5c38', light: '#e8f5e9', icon: Layers },
];

const ISSUES: { id: string; name: string }[] = [
  { id: 'overflowing', name: 'Overflowing' },
  { id: 'damaged', name: 'Damaged Bin' },
  { id: 'foul smell', name: 'Foul Smell' },
  { id: 'missed collection', name: 'Missed Collection' },
];

export default function CitizenReportBinScreen() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [photoAttached, setPhotoAttached] = useState(false);
  const [selectedStream, setSelectedStream] = useState<StreamKey>('MLP');
  const [selectedIssue, setSelectedIssue] = useState<string>('overflowing');

  const form = useForm<ReportFormData>({
    defaultValues: {
      stream: 'MLP',
      issueType: 'overflowing',
      location: '',
      notes: '',
    },
  });

  const onSubmit = (data: ReportFormData) => {
    const result = reportSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (typeof field === 'string') {
          form.setError(field as keyof ReportFormData, { message: err.message });
        }
      });
      return;
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    form.reset({
      stream: 'MLP',
      issueType: 'overflowing',
      location: '',
      notes: '',
    });
    setSubmitted(false);
    setSelectedStream('MLP');
    setSelectedIssue('overflowing');
    setPhotoAttached(false);
  };

  if (submitted) {
    return (
      <Screen title="Report Submitted" subtitle="Community Cleanliness Watch" showBack>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle2 size={44} color="#15803d" />
          </View>
          <Text style={styles.successTitle}>Report Submitted!</Text>
          <Text style={styles.successSub}>
            Thank you for keeping Shanti Nagar clean. +25 Green Points awarded to your eco-wallet.
          </Text>
          <StatusBadge variant="success" small>Status: Reported</StatusBadge>
          <View style={styles.actionsRow}>
            <Button
              title="Report Another Bin"
              variant="primary"
              style={{ backgroundColor: CITIZEN_PRIMARY, borderColor: CITIZEN_PRIMARY }}
              fullWidth
              onPress={resetForm}
            />
            <Button
              title="Back Home"
              variant="ghost"
              textStyle={{ color: CITIZEN_PRIMARY }}
              fullWidth
              onPress={() => router.push('/(citizen)/home')}
            />
          </View>
          <View style={styles.recentReports}>
            <Text style={styles.recentLabel}>Your Recent Reports</Text>
            {CITIZEN_REPORTS.slice(0, 2).map((r) => (
              <View key={r.id} style={styles.reportItem}>
                <Text style={styles.reportLoc}>{r.locationName}</Text>
                <Text style={styles.reportStatus}>
                  <StatusBadge variant="success" small>{r.status}</StatusBadge>
                </Text>
                <Text style={styles.reportPts}>+{r.pointsEarned} pts</Text>
              </View>
            ))}
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Report Full Bin" subtitle="Community Cleanliness Watch" showBack>
      <View style={styles.content}>
        <SectionHeader
          title="What needs attention?"
          subtitle="Select the waste stream and issue type"
        />

        {/* Stream Selector */}
        <View style={styles.selectGrid}>
          {STREAMS.map((s) => {
            const IconComp = s.icon;
            const isSelected = selectedStream === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.optionCard,
                  isSelected
                    ? { borderColor: s.color, borderWidth: 2, backgroundColor: s.light }
                    : {},
                ]}
                onPress={() => {
                  setSelectedStream(s.id);
                  form.setValue('stream', s.id);
                }}
                activeOpacity={0.85}
              >
                <View style={[styles.iconBox, { backgroundColor: s.light }]}>
                  <IconComp size={20} color={s.color} />
                </View>
                <Text style={[styles.optionTitle, isSelected && { color: s.color, fontWeight: '800' }]}>
                  {s.name}
                </Text>
                {isSelected && <CheckCircle2 size={16} color={s.color} style={styles.checkMark} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Issue Type */}
        <SectionHeader title="Issue Type" subtitle="What is the problem with the bin?" />
        <View style={styles.selectGrid}>
          {ISSUES.map((issue) => {
            const isSelected = selectedIssue === issue.id;
            return (
              <TouchableOpacity
                key={issue.id}
                style={[
                  styles.optionCard,
                  isSelected
                    ? { borderColor: CITIZEN_PRIMARY, borderWidth: 2, backgroundColor: CITIZEN_LIGHT }
                    : {},
                ]}
                onPress={() => {
                  setSelectedIssue(issue.id);
                  form.setValue('issueType', issue.id as ReportFormData['issueType']);
                }}
                activeOpacity={0.85}
              >
                <Text style={[styles.optionTitle, isSelected && { color: CITIZEN_PRIMARY, fontWeight: '800' }]}>
                  {issue.name}
                </Text>
                {isSelected && <CheckCircle2 size={16} color={CITIZEN_PRIMARY} style={styles.checkMark} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Location */}
        <SectionHeader title="Bin Location" subtitle="Where is the bin located?" />
        <Input
          label="Location"
          placeholder="e.g., Gandhi Street Corner, near Post Office"
          value={form.watch('location')}
          onChangeText={(t) => form.setValue('location', t)}
          error={form.getErrors('location')?.message}
        />

        {/* Photo */}
        <SectionHeader title="Photo of Bin" subtitle="A photo helps the crew plan vehicle space" />
        <TouchableOpacity
          style={[styles.photoBtn, photoAttached && styles.photoBtnActive]}
          onPress={() => setPhotoAttached(!photoAttached)}
          activeOpacity={0.85}
        >
          <Camera size={22} color={photoAttached ? '#15803d' : '#64748b'} />
          <Text style={[styles.photoText, photoAttached && { color: '#15803d', fontWeight: '700' }]}>
            {photoAttached ? 'Photo Attached (bin_overflow_cp03.jpg)' : 'Take Photo of Bin'}
          </Text>
        </TouchableOpacity>

        {/* Notes */}
        <SectionHeader title="Notes (optional)" subtitle="Add any extra details for the crew" />
        <Input
          label="Notes"
          placeholder="e.g., Bin near the school gate has been overflowing since morning"
          value={form.watch('notes')}
          onChangeText={(t) => form.setValue('notes', t)}
          error={form.getErrors('notes')?.message}
        />

        {/* Reward banner */}
        <View style={styles.rewardBanner}>
          <Award size={20} color={CITIZEN_PRIMARY} />
          <View style={styles.rewardMeta}>
            <Text style={styles.rewardTitle}>Earn 25 Eco-Points</Text>
            <Text style={styles.rewardSub}>Credited upon driver pickup confirmation.</Text>
          </View>
        </View>

        <Button
          title="Submit Bin Report"
          variant="primary"
          style={{ backgroundColor: CITIZEN_PRIMARY, borderColor: CITIZEN_PRIMARY }}
          fullWidth
          leftIcon={<AlertTriangle size={18} color="#ffffff" />}
          onPress={() => form.handleSubmit(onSubmit)()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {},
  selectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  optionCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checkMark: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    zIndex: 1,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: '#f8faf9',
  },
  photoBtnActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
    borderStyle: 'solid',
  },
  photoText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: CITIZEN_LIGHT,
    borderWidth: 1,
    borderColor: colors.roles.citizen.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
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
  actionsRow: {
    gap: 10,
    marginTop: 14,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  successSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 14,
  },
  recentReports: {
    alignItems: 'flex-start',
    marginTop: 16,
  },
  recentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    width: '100%',
  },
  reportLoc: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportPts: {
    fontSize: 12,
    fontWeight: '800',
    color: CITIZEN_PRIMARY,
  },
});
