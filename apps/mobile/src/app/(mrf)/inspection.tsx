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
  CheckCircle2,
  Droplets,
  Sparkles,
  ShieldAlert,
  Award,
  Layers,
  Save,
} from 'lucide-react-native';

export default function MrfInspectionScreen() {
  const router = useRouter();

  const [condition, setCondition] = useState<'Clean' | 'Slightly Dirty' | 'Contaminated'>('Clean');
  const [moisture, setMoisture] = useState<'Low' | 'Medium' | 'High'>('Low');

  // Compute grade based on criteria
  const getComputedGrade = (): { grade: 'A' | 'B' | 'C'; label: string; color: string; bg: string } => {
    if (condition === 'Clean' && moisture === 'Low') {
      return { grade: 'A', label: 'Good Quality • High Purity', color: '#15803d', bg: '#ecfdf5' };
    }
    if (condition === 'Contaminated' || moisture === 'High') {
      return { grade: 'C', label: 'Needs Pre-Washing & Drying', color: '#dc2626', bg: '#fef2f2' };
    }
    return { grade: 'B', label: 'Standard Recyclable Grade', color: '#b45309', bg: '#fffbeb' };
  };

  const gradeInfo = getComputedGrade();

  const handleSaveInspection = () => {
    Alert.alert(
      'Inspection Saved',
      `Batch MLP-2026-0143 evaluated as Grade ${gradeInfo.grade}. Ready for storage assignment.`,
      [
        {
          text: 'Assign Storage Zone',
          onPress: () => router.push('/(mrf)/storage'),
        },
        {
          text: 'Back to Dashboard',
          onPress: () => router.push('/(mrf)/dashboard'),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Quality Inspection" subtitle="Batch MLP-2026-0143 • 12.8 kg" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Batch Info Header */}
        <View style={styles.batchCard}>
          <View style={styles.batchLeft}>
            <View style={styles.batchIcon}>
              <Layers size={22} color="#1a5c38" />
            </View>
            <View>
              <Text style={styles.batchTitle}>Batch: MLP-2026-0143</Text>
              <Text style={styles.batchSubtitle}>Origin: CP-03 Gandhi Street • Ramesh K</Text>
            </View>
          </View>
          <Text style={styles.batchWeight}>12.8 kg</Text>
        </View>

        {/* 1. Condition Selector */}
        <Text style={styles.sectionHeader}>Surface Condition</Text>
        <View style={styles.optionsRow}>
          {(['Clean', 'Slightly Dirty', 'Contaminated'] as const).map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionBtn,
                condition === opt && styles.optionBtnActive,
              ]}
              onPress={() => setCondition(opt)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  condition === opt && styles.optionTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. Moisture Selector */}
        <Text style={styles.sectionHeader}>Moisture Level</Text>
        <View style={styles.optionsRow}>
          {(['Low', 'Medium', 'High'] as const).map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionBtn,
                moisture === opt && styles.optionBtnActive,
              ]}
              onPress={() => setMoisture(opt)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  moisture === opt && styles.optionTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Computed Quality Grade Display */}
        <Text style={styles.sectionHeader}>Quality Grade Output</Text>
        <View style={[styles.gradeCard, { backgroundColor: gradeInfo.bg, borderColor: gradeInfo.color }]}>
          <View style={[styles.gradeBadgeCircle, { backgroundColor: gradeInfo.color }]}>
            <Text style={styles.gradeBadgeLetter}>{gradeInfo.grade}</Text>
          </View>
          <View style={styles.gradeMeta}>
            <Text style={[styles.gradeTitle, { color: gradeInfo.color }]}>
              Grade {gradeInfo.grade}
            </Text>
            <Text style={styles.gradeSub}>{gradeInfo.label}</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveInspection}
          activeOpacity={0.85}
        >
          <Save size={18} color="#ffffff" />
          <Text style={styles.saveBtnText}>Save Inspection & Update Status</Text>
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
  batchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  batchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  batchIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  optionBtnActive: {
    backgroundColor: '#1a5c38',
    borderColor: '#1a5c38',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  gradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 20,
    marginTop: 2,
  },
  gradeBadgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  gradeBadgeLetter: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  gradeMeta: {
    flex: 1,
  },
  gradeTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  gradeSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ea580c',
    borderRadius: 14,
    paddingVertical: 16,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
