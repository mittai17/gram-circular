import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { MRF_STORAGE_ZONES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  BarChart2,
  ArrowUpRight,
  ArrowDownLeft,
  Archive,
  Layers,
  Send,
  Download,
} from 'lucide-react-native';

const MOVEMENTS = [
  { id: 'm-1', type: 'IN', title: 'Batch MLP-2026-0143 Intake', weight: '+12.8 kg', date: 'Today, 10:24 AM', zone: 'Zone A' },
  { id: 'm-2', type: 'IN', title: 'Batch MLP-2026-0142 Intake', weight: '+16.2 kg', date: 'Today, 09:15 AM', zone: 'Zone A' },
  { id: 'm-3', type: 'OUT', title: 'Dispatch to GreenCycle PO-89', weight: '-180.0 kg', date: 'Yesterday, 04:30 PM', zone: 'Zone A' },
  { id: 'm-4', type: 'IN', title: 'Batch MLP-2026-0140 Intake', weight: '+24.5 kg', date: '15 Oct, 04:00 PM', zone: 'Zone B' },
];

export default function MrfInventoryScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <HeaderBar title="MLP Inventory" subtitle="Stock Balance & Ledger" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Stock Summary Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Total MLP Stock</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroKg}>420</Text>
            <Text style={styles.heroUnit}>kg in facility</Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>42% Capacity</Text>
            </View>
          </View>

          {/* Breakdown Rows */}
          <View style={styles.breakdownList}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dot, { backgroundColor: '#1a5c38' }]} />
                <Text style={styles.breakdownName}>Zone A (MLP High Purity)</Text>
              </View>
              <Text style={styles.breakdownVal}>120 kg</Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dot, { backgroundColor: '#2563eb' }]} />
                <Text style={styles.breakdownName}>Zone B (Dry Recyclables)</Text>
              </View>
              <Text style={styles.breakdownVal}>200 kg</Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.breakdownName}>Zone C (Mixed / Secondary)</Text>
              </View>
              <Text style={styles.breakdownVal}>80 kg</Text>
            </View>

            <View style={[styles.breakdownRow, { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 8 }]}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dot, { backgroundColor: '#7c3aed' }]} />
                <Text style={[styles.breakdownName, { fontWeight: '700' }]}>Dispatched This Month</Text>
              </View>
              <Text style={[styles.breakdownVal, { color: '#7c3aed', fontWeight: '800' }]}>180 kg</Text>
            </View>
          </View>
        </View>

        {/* Quick Dispatch Link Card */}
        <TouchableOpacity
          style={styles.dispatchPromo}
          onPress={() => router.push('/(mrf)/dispatch')}
          activeOpacity={0.85}
        >
          <View style={styles.dispatchPromoLeft}>
            <Send size={20} color="#ffffff" />
            <View>
              <Text style={styles.promoTitle}>Ready to Dispatch Material</Text>
              <Text style={styles.promoSub}>GreenCycle Pvt Ltd minimum pickup reached</Text>
            </View>
          </View>
          <View style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>Create</Text>
          </View>
        </TouchableOpacity>

        {/* Stock Movements Ledger */}
        <Text style={styles.sectionTitle}>Stock Movements Ledger</Text>

        {MOVEMENTS.map((m) => {
          const isIncoming = m.type === 'IN';

          return (
            <View key={m.id} style={styles.moveCard}>
              <View style={[styles.moveIcon, isIncoming ? styles.moveIn : styles.moveOut]}>
                {isIncoming ? (
                  <ArrowDownLeft size={18} color="#15803d" />
                ) : (
                  <ArrowUpRight size={18} color="#7c3aed" />
                )}
              </View>

              <View style={styles.moveMeta}>
                <Text style={styles.moveTitle}>{m.title}</Text>
                <Text style={styles.moveSub}>{m.date} • {m.zone}</Text>
              </View>

              <Text style={[styles.moveWeight, isIncoming ? { color: '#15803d' } : { color: '#7c3aed' }]}>
                {m.weight}
              </Text>
            </View>
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
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 16,
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
  heroBadge: {
    marginLeft: 'auto',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  breakdownList: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownName: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dispatchPromo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a5c38',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  dispatchPromoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  promoTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  promoSub: {
    color: '#a7f3d0',
    fontSize: 10,
    marginTop: 2,
  },
  promoBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  promoBtnText: {
    color: '#1a5c38',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  moveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  moveIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  moveIn: {
    backgroundColor: '#ecfdf5',
  },
  moveOut: {
    backgroundColor: '#f5f3ff',
  },
  moveMeta: {
    flex: 1,
  },
  moveTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  moveSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  moveWeight: {
    fontSize: 13,
    fontWeight: '800',
  },
});
