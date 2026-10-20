import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatCard } from '../../components/ui/StatCard';
import { MiniBarChart } from '../../components/charts/MiniBarChart';
import { colors } from '../../theme/colors';
import { ArrowUpRight, CloudDownload, Leaf } from 'lucide-react-native';

const PRIMARY = colors.roles.buyer.primary; // #7c3aed

const MONTHLY_SPEND = [
  { label: 'Aug', value: 38000, highlight: false },
  { label: 'Sep', value: 42000, highlight: false },
  { label: 'Oct', value: 48500, highlight: true },
];

const MONTHLY_VOLUME = [
  { label: 'Aug', value: 320, highlight: false },
  { label: 'Sep', value: 380, highlight: false },
  { label: 'Oct', value: 412, highlight: true },
];

interface SupplierBreakdown {
  name: string;
  material: string;
  kg: number;
  spend: number;
  share: number;
  color: string;
}

const SUPPLIERS: SupplierBreakdown[] = [
  { name: 'Kaveripattinam Block MRF', material: 'MLP', kg: 288, spend: 10944, share: 70, color: '#15803d' },
  { name: 'Tidel MRF Center', material: 'HDPE', kg: 74, spend: 3256, share: 18, color: '#2563eb' },
  { name: 'Shanti Nagar Aggregators', material: 'LDPE', kg: 50, spend: 1800, share: 12, color: '#0d9488' },
];

const totalSpend = MONTHLY_SPEND.reduce((acc, m) => acc + m.value, 0);
const totalVolume = MONTHLY_VOLUME.reduce((acc, m) => acc + m.value, 0);

export default function BuyerProcurementChartScreen() {
  const handleDownload = () => {
    // eslint-disable-next-line no-alert
    alert('Procurement & ESG Compliance Report (Oct 2026) saved to PDF.');
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Procurement Analytics" subtitle="Monthly Spend & Volume Trends" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Metrics */}
        <View style={styles.statGrid}>
          <StatCard
            value={`₹${totalSpend.toLocaleString()}`}
            label="Monthly Spend"
            subtext="+18% vs last month"
            icon={<ArrowUpRight size={18} color="#15803d" />}
            iconBg="#ecfdf5"
            iconColor="#15803d"
            trend="+18%"
            trendPositive
            style={{ width: '48%' }}
          />
          <StatCard
            value={`${totalVolume} kg`}
            label="Monthly Volume"
            subtext="Recycled material procured"
            icon={<Leaf size={18} color="#15803d" />}
            iconBg="#ecfdf5"
            iconColor="#15803d"
            style={{ width: '48%' }}
          />
        </View>

        {/* Monthly Spend Chart */}
        <SectionHeader title="Monthly Procurement Spend" subtitle="₹ spent per month" />
        <Card style={styles.chartCard}>
          <MiniBarChart
            data={MONTHLY_SPEND}
            height={140}
            barColor={PRIMARY}
            highlightColor="#6d28d9"
            unit="₹"
          />
        </Card>

        {/* Monthly Volume Chart */}
        <SectionHeader title="Volume Trends" subtitle="kg procured per month" />
        <Card style={styles.chartCard}>
          <MiniBarChart
            data={MONTHLY_VOLUME}
            height={140}
            barColor="#1a5c38"
            highlightColor="#0f3d24"
            unit="kg"
          />
        </Card>

        {/* Supplier Breakdown */}
        <SectionHeader title="Supplier Breakdown" subtitle="Share of monthly procurement" />
        <View style={styles.supplierList}>
          {SUPPLIERS.map((s) => (
            <TouchableOpacity
              key={s.name}
              style={styles.supplierRow}
              activeOpacity={0.8}
            >
              <View style={[styles.supplierDot, { backgroundColor: s.color }]} />
              <View style={styles.supplierInfo}>
                <Text style={styles.supplierName}>{s.name}</Text>
                <Text style={styles.supplierMeta}>
                  {s.material} • {s.kg.toLocaleString()} kg
                </Text>
              </View>
              <View style={styles.supplierValues}>
                <Text style={styles.supplierSpend}>₹{s.spend.toLocaleString()}</Text>
                <Text style={[styles.supplierShare, { color: s.color }]}>
                  {s.share}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Download */}
        <TouchableOpacity style={styles.downloadPressable} onPress={handleDownload} activeOpacity={0.85}>
          <Card style={{ ...styles.downloadCard, backgroundColor: PRIMARY }}>
            <View style={styles.downloadRow}>
              <View style={styles.downloadText}>
                <Text style={styles.downloadTitle}>Download Procurement Audit Report</Text>
                <Text style={styles.downloadSub}>
                  Monthly spend, volume trends & ESG compliance summary
                </Text>
              </View>
              <CloudDownload size={20} color="#ffffff" />
            </View>
          </Card>
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
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  supplierList: {
    marginBottom: 16,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  supplierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  supplierInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  supplierName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  supplierMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  supplierValues: {
    alignItems: 'flex-end',
  },
  supplierSpend: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  supplierShare: {
    fontSize: 11,
    fontWeight: '700',
  },
  downloadPressable: {
    width: '100%',
  },
  downloadCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 0,
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  downloadText: {
    flex: 1,
  },
  downloadTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  downloadSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 2,
  },
});
