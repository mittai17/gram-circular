import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { colors } from '../../theme/colors';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  BarChart2,
  Plus,
  Minus,
  ChevronRight,
  Leaf,
  Zap,
} from 'lucide-react-native';

const EXPENSE_CATEGORIES = [
  { label: 'Labor', amountINR: 45000, pct: 39, color: '#2563eb' },
  { label: 'Power', amountINR: 18000, pct: 15, color: '#f59e0b' },
  { label: 'Fuel', amountINR: 22000, pct: 19, color: '#ea580c' },
  { label: 'Maintenance', amountINR: 20000, pct: 17, color: '#7c3aed' },
  { label: 'Consumables', amountINR: 12000, pct: 10, color: '#64748b' },
];

const REVENUE_CATEGORIES = [
  { label: 'Upcycled Products', amountINR: 58000, pct: 40, color: '#16a34a' },
  { label: 'Recycler Dispatches', amountINR: 42000, pct: 29, color: '#0ea5e9' },
  { label: 'EPR Credits', amountINR: 28000, pct: 19, color: '#d97706' },
  { label: 'GP Fees', amountINR: 17000, pct: 12, color: '#7c3aed' },
];

const LEDGER_ENTRIES = [
  { id: 'E-001', type: 'EXPENSE', category: 'Labor', desc: 'Field worker wages Oct', amountINR: 45000, date: 'Oct 15' },
  { id: 'R-001', type: 'REVENUE', category: 'Upcycled Products', desc: 'EcoPave blocks — 200 units', amountINR: 58000, date: 'Oct 16' },
  { id: 'E-002', type: 'EXPENSE', category: 'Fuel', desc: 'Diesel — 6 vehicle runs', amountINR: 22000, date: 'Oct 17' },
  { id: 'R-002', type: 'REVENUE', category: 'EPR Credits', desc: 'Brand audit credit — Oct', amountINR: 28000, date: 'Oct 18' },
  { id: 'E-003', type: 'EXPENSE', category: 'Power', desc: 'MRF machinery power bill', amountINR: 18000, date: 'Oct 19' },
  { id: 'R-003', type: 'REVENUE', category: 'Recycler Dispatches', desc: 'GreenCycle Pvt Ltd batch', amountINR: 42000, date: 'Oct 20' },
];

export default function SustainabilityScreen() {
  const [tab, setTab] = useState<'expense' | 'revenue'>('expense');

  const totalExpense = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amountINR, 0);
  const totalRevenue = REVENUE_CATEGORIES.reduce((s, c) => s + c.amountINR, 0);
  const recoveryPct = Math.round((totalRevenue / totalExpense) * 100);
  const surplusPct = recoveryPct - 100;
  const totalWeightKg = 11900; // monthly
  const costPerKg = (totalExpense / totalWeightKg).toFixed(2);
  const revenuePerKg = (totalRevenue / totalWeightKg).toFixed(2);

  const categories = tab === 'expense' ? EXPENSE_CATEGORIES : REVENUE_CATEGORIES;

  return (
    <Screen title="O&M Ledger" subtitle="PWMU Financial Sustainability">
      {/* Self-sustaining Surplus Banner */}
      <View style={styles.surplusBanner}>
        <View style={styles.surplusLeft}>
          <Leaf size={22} color="#16a34a" />
          <View>
            <Text style={styles.surplusTitle}>{recoveryPct}% Self-Sustaining</Text>
            <Text style={styles.surplusSub}>+{surplusPct}% surplus above break-even</Text>
          </View>
        </View>
        <View style={styles.surplusBadge}>
          <TrendingUp size={14} color="#16a34a" />
          <Text style={styles.surplusBadgeText}>Surplus</Text>
        </View>
      </View>

      {/* KPI Stats */}
      <View style={styles.statRow}>
        <StatCard
          value={`₹${totalRevenue.toLocaleString()}`}
          label="Total Revenue"
          subtext="October 2026"
          trend={`+${surplusPct}%`}
          trendPositive
          icon={<TrendingUp size={18} color="#16a34a" />}
          iconBg="#dcfce7"
          iconColor="#16a34a"
          style={{ flex: 1 }}
        />
        <StatCard
          value={`₹${totalExpense.toLocaleString()}`}
          label="Total Expense"
          subtext="October 2026"
          icon={<TrendingDown size={18} color="#ea580c" />}
          iconBg="#fff7ed"
          iconColor="#ea580c"
          style={{ flex: 1 }}
        />
      </View>
      <View style={styles.statRow}>
        <StatCard
          value={`₹${revenuePerKg}/kg`}
          label="Revenue/kg"
          subtext="Unit economics"
          icon={<Coins size={18} color="#d97706" />}
          iconBg="#fef3c7"
          iconColor="#d97706"
          style={{ flex: 1 }}
        />
        <StatCard
          value={`₹${costPerKg}/kg`}
          label="Cost/kg"
          subtext="Operational cost"
          icon={<BarChart2 size={18} color="#2563eb" />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
          style={{ flex: 1 }}
        />
      </View>

      {/* Unit Economics Visual */}
      <Card padding={14} style={styles.unitCard}>
        <Text style={styles.unitTitle}>Unit Economics Comparison</Text>
        <View style={styles.unitRow}>
          <View style={styles.unitItem}>
            <View style={[styles.unitBar, { height: 60, backgroundColor: '#16a34a' }]} />
            <Text style={styles.unitValue}>₹{revenuePerKg}</Text>
            <Text style={styles.unitLabel}>Revenue/kg</Text>
          </View>
          <View style={styles.unitVs}>
            <Text style={styles.unitVsText}>vs</Text>
          </View>
          <View style={styles.unitItem}>
            <View style={[styles.unitBar, { height: 46, backgroundColor: '#ea580c' }]} />
            <Text style={styles.unitValue}>₹{costPerKg}</Text>
            <Text style={styles.unitLabel}>Cost/kg</Text>
          </View>
          <View style={styles.unitSurplusCol}>
            <Text style={styles.unitSurplusVal}>
              +₹{(Number(revenuePerKg) - Number(costPerKg)).toFixed(2)}
            </Text>
            <Text style={styles.unitSurplusLabel}>Net margin/kg</Text>
          </View>
        </View>
      </Card>

      {/* Category Breakdown */}
      <SectionHeader title="Category Breakdown" />
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'expense' && styles.tabActive]}
          onPress={() => setTab('expense')}
        >
          <Minus size={12} color={tab === 'expense' ? '#ffffff' : colors.textMuted} />
          <Text style={[styles.tabText, tab === 'expense' && styles.tabTextActive]}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'revenue' && styles.tabActiveRevenue]}
          onPress={() => setTab('revenue')}
        >
          <Plus size={12} color={tab === 'revenue' ? '#ffffff' : colors.textMuted} />
          <Text style={[styles.tabText, tab === 'revenue' && styles.tabTextActive]}>Revenue</Text>
        </TouchableOpacity>
      </View>
      <Card padding={14}>
        {categories.map((cat, i) => (
          <View
            key={cat.label}
            style={[styles.catRow, i < categories.length - 1 && styles.catBorder]}
          >
            <View style={[styles.catDot, { backgroundColor: cat.color }]} />
            <Text style={styles.catLabel}>{cat.label}</Text>
            <View style={styles.catRight}>
              <Text style={[styles.catAmt, { color: cat.color }]}>
                ₹{cat.amountINR.toLocaleString()}
              </Text>
              <Text style={styles.catPct}>{cat.pct}%</Text>
            </View>
          </View>
        ))}
      </Card>

      {/* Double-entry Ledger */}
      <SectionHeader title="Line-item Transaction Ledger" subtitle="Double-entry format" />
      <Card padding={0}>
        {LEDGER_ENTRIES.map((entry, i) => (
          <View
            key={entry.id}
            style={[styles.ledgerRow, i < LEDGER_ENTRIES.length - 1 && styles.ledgerBorder]}
          >
            <View
              style={[
                styles.ledgerType,
                { backgroundColor: entry.type === 'REVENUE' ? '#dcfce7' : '#fee2e2' },
              ]}
            >
              {entry.type === 'REVENUE' ? (
                <Plus size={12} color="#16a34a" />
              ) : (
                <Minus size={12} color="#dc2626" />
              )}
            </View>
            <View style={styles.ledgerMeta}>
              <Text style={styles.ledgerDesc}>{entry.desc}</Text>
              <Text style={styles.ledgerCat}>{entry.category} • {entry.date}</Text>
            </View>
            <Text
              style={[
                styles.ledgerAmt,
                { color: entry.type === 'REVENUE' ? '#16a34a' : '#dc2626' },
              ]}
            >
              {entry.type === 'REVENUE' ? '+' : '-'}₹{entry.amountINR.toLocaleString()}
            </Text>
          </View>
        ))}
      </Card>

      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  surplusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  surplusLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  surplusTitle: { fontSize: 15, fontWeight: '800', color: '#166534' },
  surplusSub: { fontSize: 11, color: '#15803d', marginTop: 1 },
  surplusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  surplusBadgeText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  unitCard: { marginBottom: 4 },
  unitTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  unitRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  unitItem: { alignItems: 'center', flex: 1 },
  unitBar: { width: '100%', borderRadius: 6, marginBottom: 6 },
  unitValue: { fontSize: 14, fontWeight: '900', color: colors.textPrimary },
  unitLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  unitVs: { paddingBottom: 24 },
  unitVsText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  unitSurplusCol: { flex: 1, alignItems: 'center', paddingBottom: 20 },
  unitSurplusVal: { fontSize: 14, fontWeight: '900', color: '#16a34a' },
  unitSurplusLabel: { fontSize: 10, color: '#15803d', marginTop: 2, textAlign: 'center' },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: '#ea580c', borderColor: '#ea580c' },
  tabActiveRevenue: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: '#ffffff' },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  catBorder: { borderBottomWidth: 0.8, borderBottomColor: colors.borderLight },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  catRight: { alignItems: 'flex-end' },
  catAmt: { fontSize: 14, fontWeight: '800' },
  catPct: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  ledgerBorder: { borderBottomWidth: 0.8, borderBottomColor: colors.borderLight },
  ledgerType: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledgerMeta: { flex: 1 },
  ledgerDesc: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  ledgerCat: { fontSize: 10, color: colors.textSecondary, marginTop: 1 },
  ledgerAmt: { fontSize: 13, fontWeight: '800' },
});
