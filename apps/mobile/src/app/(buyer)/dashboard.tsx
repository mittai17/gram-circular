import React, { useEffect, useState } from 'react';
import {
  Dimensions,
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
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatCard } from '../../components/ui/StatCard';
import { BUYER_AVAILABLE_BATCHES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Calendar,
  ChevronRight,
  FileCheck2,
  IndianRupee,
  Layers,
  ShoppingBag,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRIMARY = colors.roles.buyer.primary; // #7c3aed
const PRIMARY_LIGHT = colors.roles.buyer.light; // #f5f3ff
const BORDER = colors.roles.buyer.border; // #ddd6fe

interface KpiConfig {
  value: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  route: string;
  trend?: string;
}

const KPIS: KpiConfig[] = [
  {
    value: '12',
    label: 'Available Batches',
    sub: '2.1 tons ready',
    icon: <ShoppingBag size={18} color={PRIMARY} />,
    iconBg: PRIMARY_LIGHT,
    route: '/(buyer)/available-batches',
  },
  {
    value: '2',
    label: 'Scheduled Pickups',
    sub: 'Next: Tomorrow',
    icon: <Calendar size={18} color="#2563eb" />,
    iconBg: '#eff6ff',
    route: '/(buyer)/batch-detail',
  },
  {
    value: '412 kg',
    label: 'Total Received',
    sub: 'Oct 2026',
    icon: <Layers size={18} color="#15803d" />,
    iconBg: '#ecfdf5',
    route: '/(buyer)/receipt-confirm',
  },
  {
    value: '₹48.5k',
    label: 'Monthly Spend',
    sub: '+18% vs last month',
    icon: <IndianRupee size={18} color="#b45309" />,
    iconBg: '#fef3c7',
    route: '/(buyer)/procurement-chart',
    trend: '+18%',
  },
];

export default function BuyerDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const cardWidth = (SCREEN_WIDTH - 42) / 2;
  const featured = BUYER_AVAILABLE_BATCHES.slice(0, 3);

  const gradeVariant = (grade: 'A' | 'B' | 'C') => {
    if (grade === 'A') return 'success';
    if (grade === 'B') return 'warning';
    return 'error';
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="GreenCycle Pvt Ltd" subtitle="Recycler Portal • Hosur Industrial Area" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* KPI Grid (skeleton while loading) */}
        {isLoading ? (
          <View style={styles.skeletonGrid}>
            {KPIS.map((_, i) => (
              <Skeleton key={i} width={cardWidth} height={150} />
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            {KPIS.map((kpi) => (
              <TouchableOpacity
                key={kpi.label}
                style={styles.statWrap}
                onPress={() => router.push(kpi.route)}
                activeOpacity={0.8}
              >
                <StatCard
                  value={kpi.value}
                  label={kpi.label}
                  subtext={kpi.sub}
                  icon={kpi.icon}
                  iconBg={kpi.iconBg}
                  iconColor={PRIMARY}
                  trend={kpi.trend}
                  trendPositive
                  style={{ width: cardWidth }}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action Banners */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.bannerPressable}
            onPress={() => router.push('/(buyer)/available-batches')}
            activeOpacity={0.8}
          >
            <Card style={{ ...styles.banner, backgroundColor: PRIMARY }}>
              <View style={styles.bannerRow}>
                <View style={styles.bannerIcon}>
                  <ShoppingBag size={22} color="#ffffff" />
                </View>
                <View style={styles.bannerText}>
                  <Text style={styles.bannerTitle}>Browse MLP & Polymer Batches</Text>
                  <Text style={styles.bannerSub}>
                    Filter by Grade A purity &amp; block locations
                  </Text>
                </View>
                <ChevronRight size={18} color="#ffffff" />
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bannerPressable}
            onPress={() => router.push('/(buyer)/receipt-confirm')}
            activeOpacity={0.8}
          >
            <Card style={{ ...styles.banner, backgroundColor: '#1a5c38' }}>
              <View style={styles.bannerRow}>
                <View style={styles.bannerIcon}>
                  <FileCheck2 size={22} color="#ffffff" />
                </View>
                <View style={styles.bannerText}>
                  <Text style={styles.bannerTitle}>Confirm Truck Delivery Receipt</Text>
                  <Text style={styles.bannerSub}>
                    Weighbridge verification &amp; proof upload
                  </Text>
                </View>
                <ChevronRight size={18} color="#ffffff" />
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Featured MLP Batches */}
        <SectionHeader
          title="Featured MLP Batches"
          onViewAll={() => router.push('/(buyer)/available-batches')}
          viewAllLabel="See All (12)"
        />
        {featured.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.batchPressable}
            onPress={() => router.push('/(buyer)/batch-detail')}
            activeOpacity={0.8}
          >
            <Card style={styles.batchCard}>
              <View style={styles.batchRow}>
                <View style={styles.batchLeft}>
                  <View
                    style={[
                      styles.materialPill,
                      { backgroundColor: PRIMARY_LIGHT, borderColor: BORDER },
                    ]}
                  >
                    <Text style={styles.materialText}>{item.wasteType}</Text>
                  </View>
                  <View style={styles.batchMeta}>
                    <Text style={styles.batchId}>{item.batchNumber}</Text>
                    <Text style={styles.batchOrigin}>{item.origin}</Text>
                  </View>
                </View>
                <View style={styles.batchRight}>
                  <Text style={styles.batchWeight}>{item.weightKg} kg</Text>
                  <StatusBadge
                    variant={gradeVariant(item.grade as 'A' | 'B' | 'C')}
                    style={styles.gradeBadge}
                    small
                  >
                    {`Grade ${item.grade}`}
                  </StatusBadge>
                  <Button
                    title="Request"
                    variant="outline"
                    onPress={() => router.push('/(buyer)/receipt-confirm')}
                    style={{
                      marginTop: 8,
                      borderColor: PRIMARY,
                      backgroundColor: 'transparent',
                    }}
                    textStyle={{ color: PRIMARY, fontSize: 11, fontWeight: '700' }}
                  />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

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
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statWrap: {
    // width is set inline via style prop on StatCard
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  bannerPressable: {
    flex: 1,
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 0,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  batchPressable: {
    width: '100%',
  },
  batchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  batchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  materialPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  materialText: {
    fontSize: 10,
    fontWeight: '800',
    color: PRIMARY,
  },
  batchMeta: {
    flex: 1,
  },
  batchId: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchOrigin: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  batchRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  batchWeight: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  gradeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
