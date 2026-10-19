import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { MiniBarChart } from '../../components/charts/MiniBarChart';
import { colors } from '../../theme/colors';
import {
  BarChart2,
  ArrowUpRight,
  Download,
  Leaf,
  Layers,
  Sparkles,
} from 'lucide-react-native';

const MONTHLY_DATA = [
  { label: 'Aug', value: 280 },
  { label: 'Sep', value: 340 },
  { label: 'Oct', value: 412, highlight: true },
];

export default function BuyerProcurementChartScreen() {
  const handleDownload = () => {
    Alert.alert('Download Analytics', 'Procurement & ESG Compliance Report (Oct 2026) saved to PDF.');
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Procurement Analytics" subtitle="GreenCycle Monthly Metrics" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Monthly Recycled Procurement</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroKg}>412</Text>
            <Text style={styles.heroUnit}>kg total</Text>
            <View style={styles.trendBadge}>
              <ArrowUpRight size={14} color="#15803d" />
              <Text style={styles.trendText}>+18% MoM</Text>
            </View>
          </View>

          {/* Bar Chart */}
          <MiniBarChart
            data={MONTHLY_DATA}
            height={130}
            barColor="#7c3aed"
            highlightColor="#6d28d9"
            unit="kg"
          />
        </View>

        {/* Polymer Breakdown Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Material Stream Distribution</Text>

          <View style={styles.streamRow}>
            <View style={styles.streamLeft}>
              <View style={[styles.streamDot, { backgroundColor: '#1a5c38' }]} />
              <Text style={styles.streamName}>Multi-Layer Plastic (MLP)</Text>
            </View>
            <Text style={styles.streamVal}>288 kg (70%)</Text>
          </View>

          <View style={styles.streamRow}>
            <View style={styles.streamLeft}>
              <View style={[styles.streamDot, { backgroundColor: '#0284c7' }]} />
              <Text style={styles.streamName}>Rigid HDPE</Text>
            </View>
            <Text style={styles.streamVal}>74 kg (18%)</Text>
          </View>

          <View style={styles.streamRow}>
            <View style={styles.streamLeft}>
              <View style={[styles.streamDot, { backgroundColor: '#0d9488' }]} />
              <Text style={styles.streamName}>Film LDPE</Text>
            </View>
            <Text style={styles.streamVal}>50 kg (12%)</Text>
          </View>
        </View>

        {/* Environmental Impact Summary */}
        <View style={styles.impactCard}>
          <View style={styles.impactIcon}>
            <Leaf size={22} color="#15803d" />
          </View>
          <View style={styles.impactMeta}>
            <Text style={styles.impactTitle}>103 kg CO₂ Offset Equivalent</Text>
            <Text style={styles.impactSub}>
              Direct virgin plastic substitution verified via blockchain-ready traceability records.
            </Text>
          </View>
        </View>

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} activeOpacity={0.85}>
          <Download size={18} color="#ffffff" />
          <Text style={styles.downloadBtnText}>Download Procurement Audit Report</Text>
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
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    marginBottom: 10,
  },
  heroKg: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  heroUnit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  streamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  streamLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streamDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  streamName: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  streamVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  impactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactMeta: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
  },
  impactSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
    lineHeight: 15,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 16,
  },
  downloadBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
