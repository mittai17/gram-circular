import React, { useState } from 'react';
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
import { ADMIN_STATS } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  ArrowUpRight,
  Download,
  Calendar,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Truck,
  Leaf,
  IndianRupee,
} from 'lucide-react-native';

const REPORT_SECTIONS = [
  {
    id: 'rep-col',
    title: 'Collection Report',
    desc: 'Daily weight logs & collection point breakdown',
    size: '1.2 MB',
    format: 'PDF / CSV',
    icon: FileSpreadsheet,
    color: '#2563eb',
  },
  {
    id: 'rep-mlp',
    title: 'MLP Waste Report',
    desc: 'Multi-layer plastic traceability & segregation purity',
    size: '860 KB',
    format: 'PDF',
    icon: Leaf,
    color: '#1a5c38',
  },
  {
    id: 'rep-route',
    title: 'Route & Fuel Efficiency',
    desc: 'Vehicle kilometers, stops covered & turnaround times',
    size: '640 KB',
    format: 'PDF',
    icon: Truck,
    color: '#ea580c',
  },
  {
    id: 'rep-comp',
    title: 'Compliance & Audit Report',
    desc: 'CPCB EPR guidelines & Gram Panchayat audit certificate',
    size: '2.4 MB',
    format: 'Signed PDF',
    icon: ShieldCheck,
    color: '#7c3aed',
  },
];

export default function AdminReportsScreen() {
  const [period, setPeriod] = useState<'7days' | 'month' | 'quarter'>('7days');

  const handleDownload = (name: string) => {
    Alert.alert('Download Report', `${name} generated successfully. Saved to downloads.`);
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Reports & Analytics" subtitle="Environmental & Economic Audits" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.periodLabel}>Reporting Period:</Text>
          <View style={styles.periodPills}>
            <TouchableOpacity
              style={[styles.periodPill, period === '7days' && styles.activePill]}
              onPress={() => setPeriod('7days')}
            >
              <Text style={[styles.periodText, period === '7days' && styles.activePeriodText]}>
                Last 7 Days
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodPill, period === 'month' && styles.activePill]}
              onPress={() => setPeriod('month')}
            >
              <Text style={[styles.periodText, period === 'month' && styles.activePeriodText]}>
                This Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 KPI Cards Grid */}
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={styles.cardTitle}>Total Waste</Text>
            <Text style={styles.cardValue}>{ADMIN_STATS.totalWasteKg.toLocaleString()} kg</Text>
            <View style={styles.trendRow}>
              <ArrowUpRight size={12} color="#15803d" />
              <Text style={styles.trendText}>+{ADMIN_STATS.totalWasteGrowth}%</Text>
            </View>
          </View>

          <View style={[styles.gridCard, { backgroundColor: '#f0fdf4' }]}>
            <Text style={[styles.cardTitle, { color: '#166534' }]}>MLP Waste</Text>
            <Text style={[styles.cardValue, { color: '#14532d' }]}>{ADMIN_STATS.mlpWasteKg} kg</Text>
            <View style={styles.trendRow}>
              <ArrowUpRight size={12} color="#15803d" />
              <Text style={styles.trendText}>+{ADMIN_STATS.mlpWasteGrowth}%</Text>
            </View>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.cardTitle}>Revenue Generated</Text>
            <Text style={styles.cardValue}>₹{ADMIN_STATS.revenueInr.toLocaleString()}</Text>
            <View style={styles.trendRow}>
              <ArrowUpRight size={12} color="#15803d" />
              <Text style={styles.trendText}>+{ADMIN_STATS.revenueGrowth}%</Text>
            </View>
          </View>

          <View style={[styles.gridCard, { backgroundColor: '#f0fdfa' }]}>
            <Text style={[styles.cardTitle, { color: '#115e59' }]}>CO₂ Avoided</Text>
            <Text style={[styles.cardValue, { color: '#134e4a' }]}>{ADMIN_STATS.co2AvoidedKg} kg</Text>
            <View style={styles.trendRow}>
              <ArrowUpRight size={12} color="#15803d" />
              <Text style={styles.trendText}>+{ADMIN_STATS.co2AvoidedGrowth}%</Text>
            </View>
          </View>
        </View>

        {/* Available Reports List */}
        <Text style={styles.sectionTitle}>Compliance & Operational Reports</Text>

        {REPORT_SECTIONS.map((item) => {
          const IconComp = item.icon;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.reportCard}
              onPress={() => handleDownload(item.title)}
              activeOpacity={0.8}
            >
              <View style={[styles.reportIconBox, { backgroundColor: `${item.color}15` }]}>
                <IconComp size={22} color={item.color} />
              </View>

              <View style={styles.reportMeta}>
                <Text style={styles.reportTitle}>{item.title}</Text>
                <Text style={styles.reportDesc}>{item.desc}</Text>
                <View style={styles.reportSubRow}>
                  <Text style={styles.reportFormat}>{item.format}</Text>
                  <Text style={styles.reportSize}>• {item.size}</Text>
                </View>
              </View>

              <View style={styles.downloadCircle}>
                <Download size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          );
        })}

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
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  periodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  periodPills: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 6,
  },
  periodPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  activePill: {
    backgroundColor: '#1a5c38',
  },
  periodText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activePeriodText: {
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  trendText: {
    fontSize: 10,
    color: '#15803d',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  reportIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportMeta: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reportDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reportSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  reportFormat: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  reportSize: {
    fontSize: 10,
    color: colors.textMuted,
  },
  downloadCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
