import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../../components/common/HeaderBar';
import { BottomNav } from '../../components/common/BottomNav';
import { MRF_STORAGE_ZONES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Archive,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
} from 'lucide-react-native';

export default function MrfStorageScreen() {
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState('zone-a');

  const handleUpdate = () => {
    const zone = MRF_STORAGE_ZONES.find((z) => z.id === selectedZone);
    Alert.alert(
      'Storage Updated',
      `Batch MLP-2026-0143 (12.8 kg) assigned to ${zone?.name}. Inventory records updated.`,
      [{ text: 'View Inventory', onPress: () => router.push('/(mrf)/inventory') }]
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Storage Update" subtitle="Assign Batch to Storage Zone" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <Layers size={18} color="#1a5c38" />
          <View style={styles.bannerMeta}>
            <Text style={styles.bannerTitle}>Batch: MLP-2026-0143 (12.8 kg)</Text>
            <Text style={styles.bannerSub}>Grade A • Ready for pallet stacking</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Select Storage Zone</Text>

        {MRF_STORAGE_ZONES.map((zone) => {
          const isSelected = selectedZone === zone.id;
          const isHighCapacity = zone.percentage > 80;

          return (
            <TouchableOpacity
              key={zone.id}
              style={[
                styles.zoneCard,
                isSelected && styles.zoneCardSelected,
              ]}
              onPress={() => setSelectedZone(zone.id)}
              activeOpacity={0.8}
            >
              <View style={styles.zoneHeader}>
                <View style={styles.zoneLeft}>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <View>
                    <Text style={[styles.zoneName, isSelected && { color: colors.primary }]}>
                      {zone.name}
                    </Text>
                    <Text style={styles.zoneType}>{zone.type}</Text>
                  </View>
                </View>

                <View style={styles.zoneRight}>
                  <Text style={styles.zoneKg}>
                    {zone.currentKg} / {zone.capacityKg} kg
                  </Text>
                  <Text
                    style={[
                      styles.zonePercent,
                      isHighCapacity ? { color: '#dc2626' } : { color: '#15803d' },
                    ]}
                  >
                    {zone.percentage}% capacity
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${zone.percentage}%`,
                      backgroundColor: isHighCapacity ? '#ef4444' : zone.color,
                    },
                  ]}
                />
              </View>

              {isHighCapacity && (
                <View style={styles.warningRow}>
                  <AlertTriangle size={12} color="#dc2626" />
                  <Text style={styles.warningText}>Near full capacity • Consider dispatching</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} activeOpacity={0.85}>
          <Text style={styles.updateBtnText}>Confirm Zone Placement</Text>
          <ArrowRight size={16} color="#ffffff" />
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  bannerMeta: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bannerSub: {
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
  zoneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
  },
  zoneCardSelected: {
    borderColor: '#1a5c38',
    backgroundColor: '#f8fdf9',
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#1a5c38',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1a5c38',
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  zoneType: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  zoneRight: {
    alignItems: 'flex-end',
  },
  zoneKg: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  zonePercent: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  barBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  warningText: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '600',
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a5c38',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  updateBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
