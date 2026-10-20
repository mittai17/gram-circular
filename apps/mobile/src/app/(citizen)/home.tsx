import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { colors } from '../../theme/colors';
import { VILLAGES_DATA } from '../../lib/mock-data';
import {
  Award,
  AlertTriangle,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

const CITIZEN_PRIMARY = colors.roles.citizen.primary; // #d97706
const CITIZEN_LIGHT = colors.roles.citizen.light; // #fef3c7

const village = VILLAGES_DATA[0];

export default function CitizenHomeScreen() {
  const router = useRouter();

  return (
    <Screen title="Hello, Karthik!" subtitle="Resident • Shanti Nagar Ward 3">
      {/* Counters */}
      <View style={styles.countersRow}>
        <StatCard
          value="125 pts"
          label="My Green Rewards"
          subtext="Redeem for eco-vouchers"
          icon={<Award size={20} color={CITIZEN_PRIMARY} />}
          iconBg={CITIZEN_LIGHT}
          iconColor={CITIZEN_PRIMARY}
        />
        <StatCard
          value="4"
          label="My Reports Logged"
          subtext="2 collected • 2 pending"
          icon={<AlertTriangle size={20} color="#2563eb" />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />
      </View>

      {/* Quick Actions */}
      <SectionHeader
        title="Quick Actions"
        subtitle="Start a report or check today's pickup"
      />
      <View style={styles.actionsRow}>
        <Button
          title="Report Full Bin"
          variant="primary"
          style={{
            width: '48%',
            backgroundColor: CITIZEN_PRIMARY,
            borderColor: CITIZEN_PRIMARY,
          }}
          leftIcon={<AlertTriangle size={18} color="#ffffff" />}
          onPress={() => router.push('/(citizen)/report-bin')}
        />
        <Button
          title="Collection Schedule"
          variant="outline"
          style={{ width: '48%', borderColor: '#1a5c38' }}
          leftIcon={<Calendar size={18} color="#1a5c38" />}
          textStyle={{ color: '#1a5c38' }}
          onPress={() => router.push('/(citizen)/schedule')}
        />
      </View>

      {/* Segregation Guide Promo Card */}
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.push('/(citizen)/learn')}
        activeOpacity={0.85}
      >
        <Card padding={14} style={styles.promoCard}>
          <View style={styles.promoHeader}>
            <View style={[styles.promoBadge, { backgroundColor: '#ecfdf5' }]}>
              <Sparkles size={12} color="#15803d" />
              <Text style={styles.promoBadgeText}>Tip of the Day</Text>
            </View>
            <Text style={styles.promoTitle}>How to Segregate MLP?</Text>
            <Text style={styles.promoSub}>
              Rinse chips & biscuit packets, keep them dry, and place in Friday's MLP bin.
            </Text>
          </View>
          <View style={styles.promoFooter}>
            <View style={styles.promoLinkRow}>
              <Text style={styles.promoLink}>Read Interactive Guide</Text>
              <Text style={styles.promoLinkTamil}>English & தமிழ்</Text>
            </View>
            <ChevronRight size={16} color={CITIZEN_PRIMARY} />
          </View>
        </Card>
      </TouchableOpacity>

      {/* Village Progress Card */}
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.push('/(citizen)/village-progress')}
        activeOpacity={0.85}
      >
        <Card padding={14} style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Shanti Nagar Progress</Text>
              <Text style={styles.progressSub}>Clean Village Initiative</Text>
            </View>
            <StatusBadge variant="success" small>+12% Growth</StatusBadge>
          </View>
          <View style={styles.progressMetricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricValue}>320.5 kg</Text>
              <Text style={styles.metricLabel}>Total Segregated</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.metricCol}>
              <Text style={[styles.metricValue, { color: CITIZEN_PRIMARY }]}>86.4 kg</Text>
              <Text style={styles.metricLabel}>MLP Collected</Text>
            </View>
          </View>
          <View style={styles.progressGrowthRow}>
            <TrendingUp size={12} color="#15803d" />
            <Text style={styles.progressGrowthText}>
              {village.monthlyTotalKg} kg collected this month • {village.monthlyMlpKg} kg MLP diverted
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  countersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  cardWrapper: {
    marginBottom: 14,
  },
  promoCard: {},
  promoHeader: {
    gap: 8,
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  promoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  promoSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  promoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  promoLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promoLink: {
    fontSize: 12,
    fontWeight: '700',
    color: CITIZEN_PRIMARY,
  },
  promoLinkTamil: {
    fontSize: 10,
    color: colors.textMuted,
  },
  progressCard: {},
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  progressSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  progressMetricsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8faf9',
    borderRadius: 10,
    padding: 10,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  progressDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  progressGrowthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  progressGrowthText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
