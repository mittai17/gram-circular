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
import { MRF_BATCHES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Layers,
  SearchCheck,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';

const STATUS_TABS = ['All', 'Received', 'Inspection', 'Storage'];

export default function MrfBatchesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const filteredBatches = MRF_BATCHES.filter((b) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Received') return b.status === 'RECEIVED';
    if (activeTab === 'Inspection') return b.status === 'INSPECTION';
    if (activeTab === 'Storage') return b.status === 'STORAGE';
    return true;
  });

  return (
    <View style={styles.screen}>
      <HeaderBar title="Inbound Batches" subtitle="Traceability & Intake Ledger" showBack />

      <View style={styles.content}>
        {/* Status Tabs */}
        <View style={styles.tabsRow}>
          {STATUS_TABS.map((tab) => (
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
          {filteredBatches.map((batch) => (
            <TouchableOpacity
              key={batch.id}
              style={styles.batchCard}
              onPress={() => router.push('/(mrf)/inspection')}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <View style={styles.batchIcon}>
                  <Layers size={22} color="#ea580c" />
                </View>
                <View style={styles.batchMeta}>
                  <Text style={styles.batchTitle}>{batch.batchNumber}</Text>
                  <Text style={styles.batchOrigin}>From {batch.collectionPointName}</Text>
                </View>

                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeText}>Grade {batch.qualityGrade || 'A'}</Text>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.weightPill}>
                  <Text style={styles.weightText}>{batch.weightKg} kg</Text>
                </View>

                <View style={styles.statusPill}>
                  <Clock size={12} color="#ea580c" />
                  <Text style={styles.statusText}>{batch.status}</Text>
                </View>

                <View style={styles.inspectBtn}>
                  <Text style={styles.inspectBtnText}>Inspect</Text>
                  <ChevronRight size={14} color="#ea580c" />
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
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#ea580c',
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batchIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  batchMeta: {
    flex: 1,
  },
  batchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  batchOrigin: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gradeBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.8,
    borderTopColor: colors.borderLight,
  },
  weightPill: {
    backgroundColor: '#f8faf9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: colors.border,
  },
  weightText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c2410c',
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
  },
});
