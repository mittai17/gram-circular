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
import { colors } from '../../theme/colors';
import {
  Factory,
  Truck,
  IndianRupee,
  Layers,
  Calendar,
  CheckCircle2,
  Send,
  MapPin,
} from 'lucide-react-native';

export default function MrfDispatchScreen() {
  const router = useRouter();

  const [quantity, setQuantity] = useState(180);
  const minQty = 100;
  const pricePerKg = 34.5;
  const estimatedValue = Math.round(quantity * pricePerKg);
  const [vehicle, setVehicle] = useState('6 Ton Truck (TN-01-EA-9912)');

  const handleCreateDispatch = () => {
    Alert.alert(
      'Dispatch Manifest Created',
      `PO-2026-092 scheduled for GreenCycle Pvt Ltd.\nQuantity: ${quantity} kg MLP\nEstimated Value: ₹${estimatedValue.toLocaleString()}`,
      [
        {
          text: 'View in Inventory',
          onPress: () => router.push('/(mrf)/inventory'),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <HeaderBar title="Dispatch to Processor" subtitle="Create Outbound Manifest" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Recycler Profile Card */}
        <View style={styles.buyerCard}>
          <View style={styles.buyerHeader}>
            <View style={styles.buyerIcon}>
              <Factory size={24} color="#7c3aed" />
            </View>
            <View style={styles.buyerMeta}>
              <Text style={styles.buyerName}>GreenCycle Pvt Ltd</Text>
              <Text style={styles.buyerDistance}>
                <MapPin size={10} color={colors.textSecondary} /> 50 km • Hosur Industrial Hub
              </Text>
            </View>
            <View style={styles.buyerBadge}>
              <Text style={styles.buyerBadgeText}>Authorized EPR</Text>
            </View>
          </View>
        </View>

        {/* Dispatch Parameters Card */}
        <View style={styles.paramsCard}>
          <Text style={styles.sectionTitle}>Material & Valuation</Text>

          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Material Stream</Text>
            <Text style={styles.paramVal}>Grade A Multi-Layer Plastic (MLP)</Text>
          </View>

          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Minimum Procurement Qty</Text>
            <Text style={styles.paramVal}>{minQty} kg</Text>
          </View>

          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Available Stock in Zone A</Text>
            <Text style={[styles.paramVal, { color: '#15803d', fontWeight: '800' }]}>
              {quantity} kg
            </Text>
          </View>

          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Rate per Kg</Text>
            <Text style={styles.paramVal}>₹{pricePerKg.toFixed(1)} / kg</Text>
          </View>

          <View style={[styles.paramRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Estimated Value</Text>
            <Text style={styles.totalVal}>₹{estimatedValue.toLocaleString()}</Text>
          </View>
        </View>

        {/* Transport Vehicle Selector */}
        <View style={styles.transportCard}>
          <Text style={styles.sectionTitle}>Assigned Logistics Vehicle</Text>

          {['6 Ton Truck (TN-01-EA-9912)', '3.5 Ton Mini Tempo (TN-29-C-1044)'].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.vehicleOption, vehicle === v && styles.vehicleSelected]}
              onPress={() => setVehicle(v)}
              activeOpacity={0.8}
            >
              <Truck size={18} color={vehicle === v ? '#1a5c38' : colors.textSecondary} />
              <Text style={[styles.vehicleText, vehicle === v && styles.vehicleTextActive]}>
                {v}
              </Text>
              {vehicle === v && (
                <CheckCircle2 size={16} color="#1a5c38" style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Dispatch Button */}
        <TouchableOpacity
          style={styles.dispatchBtn}
          onPress={handleCreateDispatch}
          activeOpacity={0.85}
        >
          <Send size={18} color="#ffffff" />
          <Text style={styles.dispatchBtnText}>Create Dispatch Order</Text>
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
  buyerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  buyerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  buyerMeta: {
    flex: 1,
  },
  buyerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  buyerDistance: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  buyerBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  buyerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  paramsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  paramLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  paramVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1a5c38',
  },
  transportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  vehicleSelected: {
    borderColor: '#1a5c38',
    backgroundColor: '#f8fdf9',
  },
  vehicleText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  vehicleTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a5c38',
    borderRadius: 14,
    paddingVertical: 16,
  },
  dispatchBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
