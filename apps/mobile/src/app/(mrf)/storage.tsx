import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { MRF_STORAGE_ZONES, MRF_BATCHES } from '../../lib/mock-data';
import { colors } from '../../theme/colors';
import {
  Archive,
  AlertTriangle,
  ChevronRight,
  Layers,
  CheckCircle2,
} from 'lucide-react-native';

const mrf = colors.roles.mrf;

type Zone = (typeof MRF_STORAGE_ZONES)[number];

const BATCH_TO_PLACE = MRF_BATCHES[0];

export default function MrfStorageScreen() {
  const router = useRouter();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>('zone-a');

  const selectedZone = MRF_STORAGE_ZONES.find((z) => z.id === selectedZoneId);
  const isZoneNearFull = selectedZone ? selectedZone.percentage > 85 : false;

  const handleAssignBatch = () => {
    if (!selectedZone) {
      Alert.alert('Select a zone', 'Please select a storage zone before assigning.');
      return;
    }
    Alert.alert(
      'Batch Assigned',
      `Batch ${BATCH_TO_PLACE.batchNumber} (${BATCH_TO_PLACE.weightKg} kg) assigned to ${selectedZone.name}.`,
      [
        { text: 'View Inventory', onPress: () => router.push('/(mrf)/inventory') },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  const handleZonePress = (zone: Zone) => () => setSelectedZoneId(zone.id);

  return (
    <Screen title="Storage Zone Allocation" subtitle="Assign batches to storage zones" showBack>
      {/* Batch to place banner */}
      <Card style={styles.bannerCard} padding={14}>
        <View style={styles.bannerRow}>
          <View style={[styles.bannerIcon, { backgroundColor: '#fff7ed' }]}>
            <Layers size={18} color={mrf.primary} />
          </View>
          <View style={styles.bannerMeta}>
            <Text style={styles.bannerTitle}>Batch to Place</Text>
            <Text style={styles.bannerSub}>
              {BATCH_TO_PLACE.batchNumber} • {BATCH_TO_PLACE.weightKg} kg • Grade {BATCH_TO_PLACE.qualityGrade || 'A'}
            </Text>
          </View>
        </View>
      </Card>

      <SectionHeader title="Storage Zones" />

      {MRF_STORAGE_ZONES.map((zone) => {
        const isSelected = selectedZoneId === zone.id;
        const nearFull = zone.percentage > 85;
        return (
          <Card
            key={zone.id}
            style={{ ...styles.zoneCard, ...(isSelected ? styles.zoneCardSelected : {}) }}
            padding={16}
          >
            <TouchableOpacity
              style={styles.zoneTouch}
              onPress={handleZonePress(zone)}
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
                    <Text style={[styles.zoneName, isSelected && { color: mrf.primary }]}>
                      {zone.name}
                    </Text>
                    <Text style={styles.zoneType}>{zone.type}</Text>
                  </View>
                </View>
                <View style={styles.zoneRight}>
                  <Text style={styles.zoneKg}>
                    {zone.currentKg} / {zone.capacityKg} kg
                  </Text>
                  <Text style={styles.zonePercent}>{zone.percentage}% capacity</Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.barRow}>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${zone.percentage}%`,
                        backgroundColor: nearFull ? '#dc2626' : zone.color,
                      },
                    ]}
                  />
                </View>
                {nearFull && (
                  <View style={styles.warningRow}>
                    <AlertTriangle size={12} color="#dc2626" />
                    <Text style={styles.warningText}>
                      Near full capacity ({zone.percentage}%) • Consider dispatching
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {isSelected && (
              <View style={styles.assignRow}>
                <StatusBadge
                  variant={nearFull ? 'warning' : 'success'}
                  children={`Ready to assign ${BATCH_TO_PLACE.weightKg} kg`}
                />
              </View>
            )}
          </Card>
        );
      })}

      {/* Assign Action */}
      <Button
        title="Assign Batch to Selected Zone"
        variant="primary"
        leftIcon={<Archive size={18} color="#ffffff" />}
        fullWidth
        onPress={handleAssignBatch}
      />

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    marginBottom: 4,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bannerMeta: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bannerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  zoneCard: {
    marginBottom: 12,
  },
  zoneCardSelected: {
    borderColor: mrf.primary,
    borderWidth: 1,
  },
  zoneTouch: {
    minHeight: 44,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: mrf.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: mrf.primary,
  },
  zoneName: {
    fontSize: 15,
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
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  zonePercent: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    color: colors.textSecondary,
  },
  barRow: {
    gap: 8,
  },
  barBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
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
  },
  warningText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#b91c1c',
  },
  assignRow: {
    marginTop: 6,
  },
  bottomSpacer: {
    height: 20,
  },
});
