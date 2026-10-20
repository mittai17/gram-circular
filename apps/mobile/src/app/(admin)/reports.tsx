import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { BottomNav } from '../../components/common/BottomNav';
import { Card, Button, StatusBadge, SectionHeader, EmptyState } from '../../components/ui';
import { colors } from '../../theme/colors';
import {
  Download,
  Calendar,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Truck,
  Leaf,
  Clock,
  TrendingUp,
} from 'lucide-react-native';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  frequency: string;
  lastGenerated: string;
  size: string;
  format: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'daily-collection',
    title: 'Daily Collection Report',
    description: 'Daily weight logs & collection point breakdown',
    icon: FileSpreadsheet,
    color: '#2563eb',
    frequency: 'Daily',
    lastGenerated: '19 Oct 2026, 6:00 AM',
    size: '1.2 MB',
    format: 'PDF / CSV',
  },
  {
    id: 'mass-balance',
    title: 'Mass-Balance Ledger',
    description: 'Waste inflow vs outflow reconciliation ledger',
    icon: Leaf,
    color: '#1a5c38',
    frequency: 'Weekly',
    lastGenerated: '18 Oct 2026, 9:30 AM',
    size: '860 KB',
    format: 'PDF',
  },
  {
    id: 'mrf-inventory',
    title: 'MRF Inventory Report',
    description: 'Material recovery facility stock & zone utilization',
    icon: ShieldCheck,
    color: '#ea580c',
    frequency: 'Weekly',
    lastGenerated: '17 Oct 2026, 4:15 PM',
    size: '2.4 MB',
    format: 'Signed PDF',
  },
  {
    id: 'route-efficiency',
    title: 'Route Efficiency Report',
    description: 'Vehicle kilometers, stops covered & turnaround times',
    icon: Truck,
    color: '#7c3aed',
    frequency: 'Weekly',
    lastGenerated: '16 Oct 2026, 11:00 AM',
    size: '640 KB',
    format: 'PDF',
  },
  {
    id: 'processor-handover',
    title: 'Processor Handover Report',
    description: 'Dispatch confirmations & processor receipt verification',
    icon: TrendingUp,
    color: '#d97706',
    frequency: 'Monthly',
    lastGenerated: '01 Oct 2026, 5:00 PM',
    size: '1.8 MB',
    format: 'PDF / Excel',
  },
  {
    id: 'anomaly-register',
    title: 'Anomaly Register',
    description: 'Flagged collections, contamination & irregularities',
    icon: Clock,
    color: '#ef4444',
    frequency: 'Daily',
    lastGenerated: '19 Oct 2026, 8:00 AM',
    size: '420 KB',
    format: 'PDF',
  },
];

export default function AdminReportsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<'7days' | 'month' | 'quarter'>('7days');

  const handleDownload = (report: ReportTemplate) => {
    Alert.alert(
      'Download Report',
      `${report.title} has been generated and saved to Downloads (${report.size}).`,
      [{ text: 'OK', style: 'default' }],
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Reports & Compliance" subtitle="Environmental & Economic Audits" showBack />
      <OfflineBanner />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.periodLabel}>Reporting Period:</Text>
          <View style={styles.periodPills}>
            <Button
              title="Last 7 Days"
              variant={period === '7days' ? 'primary' : 'outline'}
              onPress={() => setPeriod('7days')}
              style={{ paddingHorizontal: 10, paddingVertical: 6, minHeight: 34 }}
            />
            <Button
              title="This Month"
              variant={period === 'month' ? 'primary' : 'outline'}
              onPress={() => setPeriod('month')}
              style={{ paddingHorizontal: 10, paddingVertical: 6, minHeight: 34 }}
            />
            <Button
              title="Quarter"
              variant={period === 'quarter' ? 'primary' : 'outline'}
              onPress={() => setPeriod('quarter')}
              style={{ paddingHorizontal: 10, paddingVertical: 6, minHeight: 34 }}
            />
          </View>
        </View>

        <SectionHeader
          title="Compliance & Operational Reports"
          subtitle="Download certified reports for audit & compliance"
        />

        {REPORT_TEMPLATES.map((report) => {
          const IconComp = report.icon;
          return (
            <Card key={report.id} padding={14} shadow="md" style={{ marginBottom: 10 }}>
              <View style={styles.reportHeader}>
                <View style={[styles.reportIconBox, { backgroundColor: `${report.color}15` }]}>
                  <IconComp size={22} color={report.color} />
                </View>
                <View style={styles.reportMeta}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDesc}>{report.description}</Text>
                  <View style={styles.reportFooter}>
                    <StatusBadge variant="primary" small>
                      {report.frequency}
                    </StatusBadge>
                    <Text style={styles.reportLastGen}>
                      Last: {report.lastGenerated}
                    </Text>
                  </View>
                </View>
                <View style={styles.reportActions}>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileSize}>{report.size}</Text>
                    <Text style={styles.fileFormat}>{report.format}</Text>
                  </View>
                  <Button
                    title="Download"
                    variant="outline"
                    style={{ minHeight: 38, paddingHorizontal: 12 }}
                    onPress={() => handleDownload(report)}
                    leftIcon={<Download size={14} color={colors.primary} />}
                  />
                </View>
              </View>
            </Card>
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
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reportDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  reportLastGen: {
    fontSize: 10,
    color: colors.textMuted,
  },
  reportActions: {
    alignItems: 'flex-end',
    gap: 10,
  },
  fileInfo: {
    alignItems: 'flex-end',
  },
  fileSize: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  fileFormat: {
    fontSize: 10,
    color: colors.textMuted,
  },
});
