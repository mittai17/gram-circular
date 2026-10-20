'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { MOCK_OPERATIONAL_FINANCES, MockFinancialEntry } from '@/lib/mock-data';
import {
  IndianRupee,
  TrendingUp,
  Receipt,
  Scale,
  DollarSign,
  PiggyBank,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Plus,
  Coins,
} from 'lucide-react';

export default function SustainabilityLedgerPage() {
  const data = MOCK_OPERATIONAL_FINANCES;
  const [activeTab, setActiveTab] = React.useState<'ALL' | 'EXPENSE' | 'REVENUE'>('ALL');
  const [entries, setEntries] = React.useState<MockFinancialEntry[]>([
    ...data.revenues,
    ...data.expenses,
  ]);

  const summary = data.monthlySummary;
  const isSelfSustaining = summary.recoveryRatioPercent >= 100;

  const filteredEntries = activeTab === 'ALL'
    ? entries
    : entries.filter(e => e.type === activeTab);

  return (
    <AppLayout
      headerProps={{
        title: 'PWMU O&M Financial Sustainability Ledger',
        subtitle: 'Audited Operating Cost vs. Revenue Engine for Rural Plastic Waste Management Units (SBM-G)',
      }}
    >
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Monthly Revenue"
            value={`₹${summary.totalRevenueINR.toLocaleString()}`}
            subtext="Upcycled goods + Recycler + EPR + GP fees"
            icon={<Coins className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Total Monthly O&M Cost"
            value={`₹${summary.totalExpenseINR.toLocaleString()}`}
            subtext="SHG honoraria, power, diesel & repairs"
            icon={<Receipt className="w-5 h-5 text-red-600" />}
          />
          <StatCard
            title="Cost Recovery Ratio"
            value={`${summary.recoveryRatioPercent}%`}
            subtext={isSelfSustaining ? 'Self-Sustaining Surplus (No Subsidies Needed)' : 'Deficit (Subsidy Required)'}
            icon={<Scale className={`w-5 h-5 ${isSelfSustaining ? 'text-emerald-700' : 'text-amber-600'}`} />}
          />
          <StatCard
            title="Net Operating Surplus"
            value={`+₹${summary.netBalanceINR.toLocaleString()}`}
            subtext="Reinvested into SHG worker bonus"
            icon={<PiggyBank className="w-5 h-5 text-purple-700" />}
          />
        </div>

        {/* Viability Status Banner */}
        <Card className={`border-0 shadow-lg text-white ${isSelfSustaining ? 'bg-gradient-to-r from-emerald-900 to-green-950' : 'bg-gradient-to-r from-amber-900 to-orange-950'}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SBM(G) Financial Viability Standard Met: Revenue Exceeds O&amp;M Cost
                </div>
                <h3 className="text-xl font-bold">
                  Unit Economics: ₹{summary.revenuePerKgProcessedINR.toFixed(2)} Revenue / kg vs. ₹{summary.costPerKgProcessedINR.toFixed(2)} Cost / kg
                </h3>
                <p className="text-emerald-100 text-sm max-w-2xl">
                  By shifting from raw baling (only ₹11/kg recycler sale) to manufacturing high-margin certified construction products (₹24/kg equivalent), the PWMU achieves lasting rural self-sustainability without continuous government capital injections.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 text-xs">
                  <Download className="w-4 h-4 mr-1.5" /> Export Audit CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Expense Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Breakdown */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" /> Revenue Stream Composition
              </CardTitle>
              <CardDescription>
                Diversified cash flows protecting against private recycler price fluctuations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { name: 'Upcycled Construction Products (Pavers, Posts)', amount: 96000, pct: 52, color: 'bg-emerald-600' },
                { name: 'Rigid Plastics Recycler Dispatches (HDPE/PP)', amount: 46200, pct: 25, color: 'bg-blue-600' },
                { name: 'CPCB EPR Certificate Monetization', amount: 27000, pct: 15, color: 'bg-teal-600' },
                { name: 'Gram Panchayat SWM User Fee Contribution', amount: 15300, pct: 8, color: 'bg-purple-600' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground">{item.name}</span>
                    <span className="font-mono font-bold text-emerald-700">₹{item.amount.toLocaleString()} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Receipt className="w-4 h-4 text-red-600" /> Operational Expense (O&amp;M) Cost Centers
              </CardTitle>
              <CardDescription>
                Rigorous cost tracking to benchmark efficiency across rural cluster units.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { name: 'SHG Machine Operators & Sorters (Labor)', amount: 72000, pct: 51, color: 'bg-amber-600' },
                { name: 'PWMU Grid Industrial Electricity', amount: 28400, pct: 20, color: 'bg-orange-600' },
                { name: 'Collection Vehicle Fuel (Diesel)', amount: 22800, pct: 16, color: 'bg-blue-600' },
                { name: 'Machine Maintenance & Sharpening', amount: 14000, pct: 10, color: 'bg-red-600' },
                { name: 'Consumables, QR Tags & PPE', amount: 5000, pct: 3, color: 'bg-slate-600' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground">{item.name}</span>
                    <span className="font-mono font-bold text-red-700">₹{item.amount.toLocaleString()} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Ledger Transaction History */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-foreground" /> Line-Item Transaction Ledger
                </CardTitle>
                <CardDescription>
                  Double-entry recorded transactions cross-referenced with weighbridge slips and invoices.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={activeTab === 'ALL' ? 'primary' : 'outline'}
                  onClick={() => setActiveTab('ALL')}
                >
                  All Entries
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'REVENUE' ? 'primary' : 'outline'}
                  onClick={() => setActiveTab('REVENUE')}
                  className={activeTab === 'REVENUE' ? 'bg-emerald-700' : ''}
                >
                  Revenues Only
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'EXPENSE' ? 'primary' : 'outline'}
                  onClick={() => setActiveTab('EXPENSE')}
                  className={activeTab === 'EXPENSE' ? 'bg-red-700' : ''}
                >
                  Expenses Only
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Category / Source</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount (INR)</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEntries.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            e.type === 'REVENUE'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }
                        >
                          {e.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-foreground font-semibold">
                        {e.categoryOrSource}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {e.description}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sm">
                        <span className={e.type === 'REVENUE' ? 'text-emerald-700' : 'text-red-700'}>
                          {e.type === 'REVENUE' ? '+' : '-'}₹{e.amountINR.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {e.periodDate}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {e.recordedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
