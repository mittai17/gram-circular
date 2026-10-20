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
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BUYER_PURCHASE_HISTORY } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import { Calendar, CloudDownload, FileText, Layers, MapPin } from 'lucide-react-native';

const PRIMARY = colors.roles.buyer.primary; // #7c3aed
const PRIMARY_LIGHT = colors.roles.buyer.light; // #f5f3ff

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning'> = {
  Verified: 'success',
  Received: 'info',
  Scheduled: 'warning',
};

export default function BuyerHistoryScreen() {
  const totalSpend = BUYER_PURCHASE_HISTORY.reduce((acc, h) => acc + h.priceTotal, 0);
  const totalWeight = BUYER_PURCHASE_HISTORY.reduce((acc, h) => acc + h.weightKg, 0);

  const handleDownloadInvoice = (poNumber: string) => {
    // eslint-disable-next-line no-alert
    alert(`Tax Invoice & EPR Credit Token for ${poNumber} downloaded.`);
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Purchase History" subtitle="Verified POs & EPR Credits" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cumulative Stats */}
        <View style={styles.statGrid}>
          <StatCard
            value={totalWeight.toLocaleString()}
            label="Total Procured"
            subtext="All time • kg"
            icon={<Layers size={18} color={PRIMARY} />}
            iconBg={PRIMARY_LIGHT}
            iconColor={PRIMARY}
            style={{ width: '48%' }}
          />
          <StatCard
            value={`₹${totalSpend.toLocaleString()}`}
            label="Total Spend"
            subtext="All time • verified POs"
            icon={<CloudDownload size={18} color="#15803d" />}
            iconBg="#ecfdf5"
            iconColor="#15803d"
            style={{ width: '48%' }}
          />
        </View>

        <SectionHeader
          title={`Purchase Orders (${BUYER_PURCHASE_HISTORY.length})`}
          subtitle="Download tax invoice & EPR credit certificate per order"
        />

        {BUYER_PURCHASE_HISTORY.map((po) => (
          <TouchableOpacity
            key={po.id}
            style={styles.poPressable}
            activeOpacity={0.8}
          >
            <Card style={styles.poCard}>
              <View style={styles.poHeader}>
                <View style={styles.poIdGroup}>
                  <View style={styles.poIcon}>
                    <FileText size={18} color={PRIMARY} />
                  </View>
                  <View>
                    <Text style={styles.poNumber}>{po.poNumber}</Text>
                    <Text style={styles.poBatch}>Batch {po.batchNumber}</Text>
                  </View>
                </View>
                <StatusBadge variant={STATUS_VARIANT[po.status]}>
                  {po.status}
                </StatusBadge>
              </View>

              <View style={styles.poDivider} />

              <View style={styles.poBody}>
                <View style={styles.metaRow}>
                  <MapPin size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{po.origin}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Layers size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>
                    {po.wasteType} Grade {po.grade} • {po.weightKg.toLocaleString()} kg
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Calendar size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{po.date}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Order Value</Text>
                  <Text style={styles.metaValue}>₹{po.priceTotal.toLocaleString()}</Text>
                </View>
              </View>

              <Button
                title="Download Invoice & EPR Certificate"
                variant="outline"
                onPress={() => handleDownloadInvoice(po.poNumber)}
                style={{
                  borderColor: PRIMARY,
                  backgroundColor: 'transparent',
                  marginTop: 8,
                }}
                textStyle={{ color: PRIMARY, fontSize: 11, fontWeight: '700' }}
                fullWidth
              />
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
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  poPressable: {
    width: '100%',
  },
  poCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  poHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  poIdGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  poIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  poBatch: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  poDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  poBody: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  metaLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});
