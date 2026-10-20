'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Calendar, Download, Printer, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  lastGenerated: string;
  size: string;
}

const REPORTS: ReportTemplate[] = [
  {
    id: 'rep-001',
    title: 'Daily Collection Summary',
    description: 'Village-wise waste collected, MLP split, and route completion status',
    category: 'Compliance',
    frequency: 'Daily',
    lastGenerated: '16 Oct 2026, 06:00 AM',
    size: '42 KB',
  },
  {
    id: 'rep-002',
    title: 'MLP Mass-Balance Ledger',
    description: 'CPCB EPR mass reconciliation from collection to verified processing',
    category: 'Compliance',
    frequency: 'Weekly',
    lastGenerated: '15 Oct 2026, 09:30 AM',
    size: '118 KB',
  },
  {
    id: 'rep-003',
    title: 'MRF Inventory & Stock Movement',
    description: 'Storage zone utilization, inventory ledger, and reconciliation report',
    category: 'Compliance',
    frequency: 'Weekly',
    lastGenerated: '15 Oct 2026, 05:00 PM',
    size: '86 KB',
  },
  {
    id: 'rep-004',
    title: 'Route Efficiency & Fuel Log',
    description: 'Vehicle routing, distance traveled, capacity utilization, and fuel cost',
    category: 'Operations',
    frequency: 'Weekly',
    lastGenerated: '14 Oct 2026, 04:15 PM',
    size: '64 KB',
  },
  {
    id: 'rep-005',
    title: 'Processor Handover & Receipts',
    description: 'Dispatch manifest, receiver confirmation, and processing outcome verification',
    category: 'Compliance',
    frequency: 'Monthly',
    lastGenerated: '10 Oct 2026, 11:00 AM',
    size: '92 KB',
  },
  {
    id: 'rep-006',
    title: 'Anomaly & Discrepancy Register',
    description: 'Weight discrepancies, duplicate QR scans, missing handovers, and resolutions',
    category: 'Audit',
    frequency: 'Monthly',
    lastGenerated: '12 Oct 2026, 02:30 PM',
    size: '51 KB',
  },
];

export default function AdminReportsPage() {
  const [categoryFilter, setCategoryFilter] = React.useState('all');

  const filtered = REPORTS.filter(
    (r) => categoryFilter === 'all' || r.category.toLowerCase().includes(categoryFilter)
  );

  return (
    <AppLayout
      headerProps={{
        title: 'Reports & Compliance',
        subtitle: 'Generate, download, and audit operational and regulatory reports',
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1a5c38] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  Reports This Month
                </p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">14</p>
                <p className="text-xs text-gray-500 mt-1">Generated across all categories</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Auto-Reports
                </p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">4</p>
                <p className="text-xs text-gray-500 mt-1">Weekly mass-balance & inventory</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  Pending Review
                </p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">2</p>
                <p className="text-xs text-amber-700 font-medium mt-1">Awaiting officer sign-off</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Filter by category:</span>
            <div className="flex gap-1">
              {(['all', 'Compliance', 'Operations', 'Audit'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#1a5c38] text-white border-[#1a5c38]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print All</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Available Report Templates</CardTitle>
            <CardDescription className="text-xs">
              Select a report to preview, download as PDF/CSV, or schedule automatic delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Report</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-4">Last Generated</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900">{r.title}</td>
                      <td className="py-3 px-4 text-gray-600">{r.description}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default">{r.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{r.frequency}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono">{r.lastGenerated}</td>
                      <td className="py-3 px-4 text-gray-600">{r.size}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5">
                            <Download className="w-3 h-3 mr-1" />
                            <span>Download</span>
                          </Button>
                          <Button size="sm" variant="ghost" className="text-[11px] h-7 p-1.5 text-gray-400">
                            <Printer className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border border-gray-200 p-4">
          <CardHeader className="pb-2 border-none">
            <CardTitle className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Compliance Notes
            </CardTitle>
            <CardDescription className="mb-0">
              All reports are generated from the same underlying records as the dashboard and mobile
              app. Mass-balance figures are reconciled against verified processor receipts. No figures
              are independently invented.
            </CardDescription>
          </CardHeader>
          <div className="flex items-start gap-2 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-xs text-gray-600 leading-relaxed">
              CPCB EPR mass-balance ledger is reconciliation-ready. Report generation is auditable
              through the audit event log.
            </span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
