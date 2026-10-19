'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, ShieldCheck, ArrowRight, AlertTriangle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function MassBalanceAnalyticsPage() {
  const ledgerSteps = [
    {
      stage: '1. Field Collection',
      weight: '1,248.6 kg',
      sub: 'Weighed across 8 rural points',
      status: 'Verified',
      badge: 'success',
    },
    {
      stage: '2. MRF Sorting Loss',
      weight: '42.0 kg',
      sub: 'Heavily contaminated / organic mix',
      status: 'Rejected',
      badge: 'destructive',
    },
    {
      stage: '3. Accepted at MRF',
      weight: '1,206.6 kg',
      sub: 'Graded A, B, C into storage bays',
      status: 'Stocked',
      badge: 'primary',
    },
    {
      stage: '4. In MRF Storage',
      weight: '418.1 kg',
      sub: 'Baled and tagged with QR tokens',
      status: 'Available',
      badge: 'info',
    },
    {
      stage: '5. Dispatched to Buyer',
      weight: '788.5 kg',
      sub: 'GreenCycle Pvt Ltd consignment',
      status: 'In Transit',
      badge: 'warning',
    },
    {
      stage: '6. Buyer Weighbridge Receipt',
      weight: '783.2 kg',
      sub: 'Variance: -5.3 kg (0.67% allowable moisture loss)',
      status: 'Audited',
      badge: 'success',
    },
  ];

  return (
    <AppLayout
      headerProps={{
        title: 'Mass-Balance Ledger & Traceability Audit',
        subtitle: 'Cryptographically accountable end-to-end material flow ledger for EPR compliance',
      }}
    >
      <div className="space-y-6">
        {/* Top EPR Compliance Status Card */}
        <div className="bg-gradient-to-r from-[#0f3d24] to-[#1a5c38] text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">EPR Mass Balance Compliance Score: 98.8%</h3>
                <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  CPCB Certified
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Zero untracked leakage detected across Thiruvallur rural cluster in current billing cycle.
              </p>
            </div>
          </div>
          <Button variant="accent" size="sm" className="text-xs font-semibold gap-1.5 whitespace-nowrap">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export EPR Ledger (CSV)</span>
          </Button>
        </div>

        {/* Ledger Pipeline Visual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Material Flow Chain (kg)</CardTitle>
            <CardDescription>
              Each custody transfer checkpoint requires verified weight telemetry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {ledgerSteps.map((step, idx) => (
                <div
                  key={step.stage}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between space-y-2 hover:border-[#1a5c38] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500">{step.stage}</span>
                    <Badge variant={step.badge as any}>{step.status}</Badge>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">{step.weight}</span>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Discrepancy Reconciliation Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Consignment Ledger Entries</CardTitle>
              <CardDescription>
                Comparison of field origin weight, MRF dispatch weight, and recycler received weight
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-2.5 px-3">Batch / PO #</th>
                    <th className="py-2.5 px-3">Origin Village</th>
                    <th className="py-2.5 px-3">Field Weight</th>
                    <th className="py-2.5 px-3">MRF Dispatch</th>
                    <th className="py-2.5 px-3">Buyer Received</th>
                    <th className="py-2.5 px-3">Variance</th>
                    <th className="py-2.5 px-3">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">PO-2026-015</td>
                    <td className="py-2.5 px-3 text-gray-700">Shanti Nagar Cluster</td>
                    <td className="py-2.5 px-3">164.0 kg</td>
                    <td className="py-2.5 px-3">162.0 kg</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">162.0 kg</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">0.0 kg (0%)</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="success">Fully Reconciled</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">PO-2026-014</td>
                    <td className="py-2.5 px-3 text-gray-700">Gandhi Street & Kovilpattu</td>
                    <td className="py-2.5 px-3">455.0 kg</td>
                    <td className="py-2.5 px-3">450.0 kg</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">446.8 kg</td>
                    <td className="py-2.5 px-3 text-amber-600 font-semibold">-3.2 kg (0.7%)</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="warning">Moisture Evap Allowed</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">PO-2026-013</td>
                    <td className="py-2.5 px-3 text-gray-700">Temple Road</td>
                    <td className="py-2.5 px-3">322.0 kg</td>
                    <td className="py-2.5 px-3">320.0 kg</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">320.0 kg</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">0.0 kg (0%)</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="success">Fully Reconciled</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
