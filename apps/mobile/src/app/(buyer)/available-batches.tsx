import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { BUYER_AVAILABLE_BATCHES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  ShoppingBag,
  Layers,
  MapPin,
  ChevronRight,
  Sparkles,
  Droplets,
  IndianRupee,
} from 'lucide-react-native';

const POLYMER_TABS = ['All', 'MLP', 'HDPE', 'LDPE', 'PET'];

export default function BuyerAvailableBatchesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const filteredBatches = BUYER_AVAILABLE_BATCHES.filter((b) => {
    if (activeTab === 'All') return true;
    return b.wasteType === activeTab;
  });

  return (
    <View style={styles.screen}>
      <HeaderBar title="Available Batches" subtitle="B2B Marketplace & EPR Verified" showBack />

      <View style={styles.content}>
        {/* Filter Pills */}
        <View style={styles.tabsRow}>
          {POLYMER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Batches List */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filteredBatches.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.batchCard}
              onPress={() => router.push('/(buyer)/batch-detail')}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badgeLeft}>
                  <View style={styles.polymerPill}>
                    <Text style={styles.polymerText}>{item.wasteType}</Text>
                  </View>
                  <View>
                    <Text style={styles.batchId}>{item.batchNumber}</Text>
                    <Text style={styles.gradeSubtitle}>{item.gradeLabel}</Text>
                  </View>
                </View>

                <View style={styles.badgeRight}>
                  <Text style={styles.weightValue}>{item.weightKg} kg</Text>
                  <Text style={styles.priceValue}>₹{item.pricePerKg}/kg</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.originRow}>
                  <MapPin size={12} color={colors.textSecondary} />
                  <Text style={styles.originText}>{item.origin}</Text>
                </View>

                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleText}>Schedule Pickup</Text>
                  <ChevronRight size={14} color="#7c3aed" />
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  batchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  polymerPill: {
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  polymerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7c3aed',
  },
  batchId: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  gradeSubtitle: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
    marginTop: 1,
  },
  badgeRight: {
    alignItems: 'flex-end',
  },
  weightValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  priceValue: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
  },
  originRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  originText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  scheduleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7c3aed',
  },
});
