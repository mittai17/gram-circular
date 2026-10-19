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
import { BUYER_PURCHASE_HISTORY } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react-native';

export default function BuyerHistoryScreen() {
  const totalSpend = BUYER_PURCHASE_HISTORY.reduce((acc, h) => acc + h.priceTotal, 0);
  const totalWeight = BUYER_PURCHASE_HISTORY.reduce((acc, h) => acc + h.weightKg, 0);

  const handleDownloadInvoice = (po: string) => {
    Alert.alert('Download Tax Invoice', `Tax Invoice & EPR Credit Token for ${po} downloaded.`);
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Purchase History" subtitle="Verified POs & EPR Credits" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cumulative Card */}
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalTitle}>Cumulative Procurement</Text>
            <Text style={styles.totalWeight}>{totalWeight.toLocaleString()} kg</Text>
          </View>
          <View style={styles.totalRight}>
            <Text style={styles.totalSpend}>₹{totalSpend.toLocaleString()}</Text>
            <Text style={styles.totalSub}>4 Orders Completed</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Purchase Orders ({BUYER_PURCHASE_HISTORY.length})</Text>

        {BUYER_PURCHASE_HISTORY.map((po) => (
          <View key={po.id} style={styles.poCard}>
            <View style={styles.poCardHeader}>
              <View style={styles.poLeft}>
                <View style={styles.poIcon}>
                  <FileText size={18} color="#7c3aed" />
                </View>
                <View>
                  <Text style={styles.poNumber}>{po.poNumber}</Text>
                  <Text style={styles.batchSub}>Batch: {po.batchNumber}</Text>
                </View>
              </View>

              <View style={styles.poRight}>
                <Text style={styles.poPrice}>₹{po.priceTotal.toLocaleString()}</Text>
                <View style={styles.verifiedTag}>
                  <CheckCircle2 size={10} color="#15803d" />
                  <Text style={styles.verifiedText}>{po.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.poCardBody}>
              <View style={styles.metaRow}>
                <Layers size={12} color={colors.textSecondary} />
                <Text style={styles.metaText}>{po.wasteType} Grade {po.grade} • {po.weightKg} kg</Text>
              </View>
              <View style={styles.metaRow}>
                <MapPin size={12} color={colors.textSecondary} />
                <Text style={styles.metaText}>{po.origin}</Text>
              </View>
              <View style={styles.metaRow}>
                <Calendar size={12} color={colors.textSecondary} />
                <Text style={styles.metaText}>{po.date}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.invoiceBtn}
              onPress={() => handleDownloadInvoice(po.poNumber)}
              activeOpacity={0.8}
            >
              <Download size={14} color="#7c3aed" />
              <Text style={styles.invoiceBtnText}>Download Invoice & EPR Certificate</Text>
            </TouchableOpacity>
          </View>
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
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  totalTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  totalWeight: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  totalRight: {
    alignItems: 'flex-end',
  },
  totalSpend: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7c3aed',
  },
  totalSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  poCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  poCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  poIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  poRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  poPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  poCardBody: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
    gap: 4,
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
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#faf5ff',
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  invoiceBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7c3aed',
  },
});
