import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { colors } from '../../theme/colors';
import {
  ShoppingCart,
  Package,
  Award,
  CheckCircle,
  Plus,
  X,
  ChevronRight,
  Shield,
  Truck,
} from 'lucide-react-native';

const PRODUCTS = [
  {
    id: 'P-001',
    name: 'EcoPave MLP Blocks',
    category: 'Paving',
    spec: 'IS 15658 Grade M30',
    pricePerUnit: 48,
    unitLabel: 'per block',
    stockUnits: 1240,
    certifications: ['IS 15658', 'BIS'],
    color: '#1a5c38',
    lightColor: '#e8f5e9',
    desc: 'Interlocking paver blocks, 30% MLP + 60% M-Sand + 10% Binder',
  },
  {
    id: 'P-002',
    name: 'Agrishield Fencing Posts',
    category: 'Agriculture',
    spec: 'IRC:SP:98 Compliant',
    pricePerUnit: 120,
    unitLabel: 'per post',
    stockUnits: 380,
    certifications: ['IRC:SP:98', 'SBM-G'],
    color: '#2563eb',
    lightColor: '#eff6ff',
    desc: 'Durable MLP composite fencing posts for farmland boundary use',
  },
  {
    id: 'P-003',
    name: 'Bitumen Modifier Flakes',
    category: 'Road',
    spec: 'IRC:SP:98 Grade A',
    pricePerUnit: 85,
    unitLabel: 'per kg',
    stockUnits: 2100,
    certifications: ['IRC:SP:98', 'MoRTH'],
    color: '#ea580c',
    lightColor: '#fff7ed',
    desc: 'MLP-derived bitumen modifier for hot-mix asphalt road laying',
  },
  {
    id: 'P-004',
    name: 'MLP Roofing Sheets',
    category: 'Construction',
    spec: 'SBM-G Approved',
    pricePerUnit: 220,
    unitLabel: 'per sheet',
    stockUnits: 156,
    certifications: ['SBM-G', 'BIS'],
    color: '#7c3aed',
    lightColor: '#f5f3ff',
    desc: 'Weather-resistant corrugated roofing sheets from recycled MLP',
  },
];

export default function MarketplaceScreen() {
  const [selected, setSelected] = useState<typeof PRODUCTS[0] | null>(null);
  const [qty, setQty] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const totalProducts = PRODUCTS.length;
  const totalStock = PRODUCTS.reduce((s, p) => s + p.stockUnits, 0);

  const handleOrder = () => {
    if (!qty || Number(qty) <= 0) {
      Alert.alert('Invalid Quantity', 'Enter a valid order quantity.');
      return;
    }
    setModalVisible(false);
    setQty('');
    Alert.alert(
      'Order Placed!',
      `Requisition submitted for ${qty} ${selected?.unitLabel?.replace('per ', '')}(s) of ${selected?.name}`
    );
    setSelected(null);
  };

  return (
    <Screen title="PWD Marketplace" subtitle="Forward Linkage — Certified Product Catalog">
      {/* Compliance Banner */}
      <View style={styles.complianceBanner}>
        <Shield size={16} color="#1a5c38" />
        <View style={styles.complianceMeta}>
          <Text style={styles.complianceTitle}>MoRTH & SBM-G Compliant Products</Text>
          <Text style={styles.complianceSub}>
            All products certified under IS 15658, IRC:SP:98, BIS & SBM-G guidelines
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statRow}>
        <StatCard
          value={String(totalProducts)}
          label="Products"
          subtext="Certified SKUs"
          icon={<Package size={18} color="#1a5c38" />}
          iconBg="#e8f5e9"
          iconColor="#1a5c38"
          style={{ flex: 1 }}
        />
        <StatCard
          value={totalStock.toLocaleString()}
          label="In Stock"
          subtext="Units available"
          icon={<ShoppingCart size={18} color="#2563eb" />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
          style={{ flex: 1 }}
        />
      </View>

      {/* Product Catalog */}
      <SectionHeader title="Certified Product Catalog" subtitle="Tap to place requisition order" />
      {PRODUCTS.map((product) => (
        <Card key={product.id} padding={14} style={styles.productCard}>
          {/* Header */}
          <View style={styles.productHeader}>
            <View style={[styles.productIcon, { backgroundColor: product.lightColor }]}>
              <Package size={22} color={product.color} />
            </View>
            <View style={styles.productMeta}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSpec}>{product.spec}</Text>
            </View>
            <View style={styles.productPrice}>
              <Text style={[styles.priceValue, { color: product.color }]}>₹{product.pricePerUnit}</Text>
              <Text style={styles.priceUnit}>{product.unitLabel}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.productDesc}>{product.desc}</Text>

          {/* Certs + Stock */}
          <View style={styles.productFooter}>
            <View style={styles.certRow}>
              {product.certifications.map((cert) => (
                <View key={cert} style={styles.certTag}>
                  <Award size={9} color="#1a5c38" />
                  <Text style={styles.certTagText}>{cert}</Text>
                </View>
              ))}
            </View>
            <View style={styles.stockInfo}>
              <CheckCircle size={12} color="#16a34a" />
              <Text style={styles.stockText}>{product.stockUnits.toLocaleString()} in stock</Text>
            </View>
          </View>

          {/* Order Button */}
          <TouchableOpacity
            style={[styles.orderBtn, { backgroundColor: product.color }]}
            onPress={() => {
              setSelected(product);
              setModalVisible(true);
            }}
            activeOpacity={0.85}
          >
            <ShoppingCart size={14} color="#ffffff" />
            <Text style={styles.orderBtnText}>Place Requisition Order</Text>
            <ChevronRight size={14} color="#ffffff" />
          </TouchableOpacity>
        </Card>
      ))}

      {/* Order Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Requisition Order</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            {selected && (
              <>
                <View style={styles.selectedProduct}>
                  <View style={[styles.selectedIcon, { backgroundColor: selected.lightColor }]}>
                    <Package size={20} color={selected.color} />
                  </View>
                  <View>
                    <Text style={styles.selectedName}>{selected.name}</Text>
                    <Text style={styles.selectedSpec}>{selected.spec}</Text>
                    <Text style={styles.selectedPrice}>
                      ₹{selected.pricePerUnit} {selected.unitLabel}
                    </Text>
                  </View>
                </View>

                <Text style={styles.inputLabel}>Quantity ({selected.unitLabel.replace('per ', '')}s)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter quantity"
                  value={qty}
                  onChangeText={setQty}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textMuted}
                />

                {!!qty && Number(qty) > 0 && (
                  <View style={styles.orderSummary}>
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    <View style={styles.orderSummaryRow}>
                      <Text style={styles.orderSummaryLabel}>Unit Price:</Text>
                      <Text style={styles.orderSummaryVal}>₹{selected.pricePerUnit}</Text>
                    </View>
                    <View style={styles.orderSummaryRow}>
                      <Text style={styles.orderSummaryLabel}>Quantity:</Text>
                      <Text style={styles.orderSummaryVal}>{qty}</Text>
                    </View>
                    <View style={[styles.orderSummaryRow, styles.orderSummaryTotal]}>
                      <Text style={styles.orderSummaryLabel}>Total:</Text>
                      <Text style={[styles.orderSummaryVal, { color: '#1a5c38', fontSize: 16 }]}>
                        ₹{(Number(qty) * selected.pricePerUnit).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.confirmBtn, { backgroundColor: selected.color }]}
                  onPress={handleOrder}
                  activeOpacity={0.85}
                >
                  <Truck size={16} color="#ffffff" />
                  <Text style={styles.confirmBtnText}>Submit Requisition</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  complianceBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  complianceMeta: { flex: 1 },
  complianceTitle: { fontSize: 13, fontWeight: '700', color: '#166534' },
  complianceSub: { fontSize: 10, color: '#15803d', marginTop: 2 },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  productCard: { marginBottom: 12 },
  productHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  productIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  productMeta: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  productSpec: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  productPrice: { alignItems: 'flex-end' },
  priceValue: { fontSize: 18, fontWeight: '900' },
  priceUnit: { fontSize: 10, color: colors.textMuted },
  productDesc: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginBottom: 10 },
  productFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  certRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  certTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  certTagText: { fontSize: 9, fontWeight: '700', color: '#1a5c38' },
  stockInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stockText: { fontSize: 10, fontWeight: '700', color: '#16a34a' },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
  },
  orderBtnText: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '700', color: '#ffffff' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  selectedProduct: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12 },
  selectedIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  selectedName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  selectedSpec: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  selectedPrice: { fontSize: 12, fontWeight: '700', color: '#1a5c38', marginTop: 2 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    fontSize: 13,
    color: colors.textPrimary,
  },
  orderSummary: { marginTop: 14, backgroundColor: '#f0fdf4', borderRadius: 10, padding: 12 },
  orderSummaryTitle: { fontSize: 11, fontWeight: '700', color: '#1a5c38', marginBottom: 8 },
  orderSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  orderSummaryTotal: { borderTopWidth: 1, borderTopColor: '#bbf7d0', marginTop: 6, paddingTop: 8 },
  orderSummaryLabel: { fontSize: 12, color: colors.textSecondary },
  orderSummaryVal: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  confirmBtnText: { fontSize: 14, fontWeight: '800', color: '#ffffff' },
});
