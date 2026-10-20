'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileCheck, Truck, Clock, Scale, AlertTriangle, ArrowRight } from 'lucide-react';

interface Receipt {
  id: string;
  batchId: string;
  processor: string;
  dispatchedWeight: string;
  receivedWeight: string;
  discrepancy: string;
  status: 'Confirmed' | 'Pending' | 'Discrepancy';
  date: string;
  evidence: string;
}

const RECEIPTS: Receipt[] = [
  {
    id: 'RCPT-2026-015',
    batchId: 'MLP-2026-0138',
    processor: 'GreenCycle Pvt Ltd',
    dispatchedWeight: '25.0 kg',
    receivedWeight: '24.8 kg',
    discrepancy: '-0.2 kg',
    status: 'Confirmed',
    date: '16 Oct 2026, 09:45 AM',
    evidence: 'Weighbridge receipt + photos',
  },
  {
    id: 'RCPT-2026-014',
    batchId: 'MLP-2026-0140',
    processor: 'EcoPoly Recyclers',
    dispatchedWeight: '18.6 kg',
    receivedWeight: '18.6 kg',
    discrepancy: '0.0 kg',
    status: 'Confirmed',
    date: '16 Oct 2026, 08:30 AM',
    evidence: 'Weighbridge receipt',
  },
  {
    id: 'RCPT-2026-013',
    batchId: 'MLP-2026-0142',
    processor: 'PolyFuel Energy',
    dispatchedWeight: '16.2 kg',
    receivedWeight: '15.1 kg',
    discrepancy: '-1.1 kg',
    status: 'Discrepancy',
    date: '15 Oct 2026, 04:15 PM',
    evidence: 'Partial receipt - under review',
  },
];

export default function BuyerReceiptsPage() {
  const confirmed = RECEIPTS.filter((r) => r.status === 'Confirmed').length;
  const pending = RECEIPTS.filter((r) => r.status === 'Pending').length;
  const discrepancies = RECEIPTS.filter((r) => r.status === 'Discrepancy').length;

  return (
    <AppLayout
      headerProps={{
        title: 'Handover Receipts',
        subtitle: 'Processor dispatch receipts, received-vs-dispatched weight verification, and evidence',
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Confirmed Receipts
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{confirmed}</p>
              <p className="text-xs text-emerald-700 font-medium mt-1">Weight verified</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </Card>
          <Card className="p-4 bg-white border-l-4 border-l-blue-500">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Pending Confirmation
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{pending}</p>
              <p className="text-xs text-blue-700 font-medium mt-1">Awaiting processor receipt</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </Card>
          <Card className="p-4 bg-white border-l-4 border-l-amber-500">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Discrepancies
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{discrepancies}</p>
              <p className="text-xs text-amber-700 font-medium mt-1">Requires resolution</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Processor Handover Receipts</CardTitle>
              <CardDescription className="text-xs">
                Expected vs received weight with supporting evidence for each dispatch.
              </CardDescription>
            </div>
            <Link href="/buyer/requests">
              <Button variant="outline" size="sm" className="text-xs">
                Back to Requests
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Receipt ID</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Processor</th>
                    <th className="py-3 px-4">Dispatched</th>
                    <th className="py-3 px-4">Received</th>
                    <th className="py-3 px-4">Discrepancy</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Evidence</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {RECEIPTS.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                        {r.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{r.batchId}</td>
                      <td className="py-3 px-4 text-gray-700">{r.processor}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{r.dispatchedWeight}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{r.receivedWeight}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold text-[11px] ${
                            r.discrepancy === '0.0 kg' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {r.discrepancy}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            r.status === 'Confirmed'
                              ? 'success'
                              : r.status === 'Discrepancy'
                              ? 'destructive'
                              : 'warning'
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono">{r.date}</td>
                      <td className="py-3 px-4 text-gray-600 text-[10px]">{r.evidence}</td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px] h-7 px-2.5"
                        >
                          <ArrowRight className="w-3 h-3 mr-1" />
                          <span>View</span>
                        </Button>
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
              Mass-Balance Note
            </CardTitle>
            <CardDescription className="mb-0">
              Received quantity is compared against dispatched quantity. Any discrepancy above the
              configured tolerance (5%) is flagged for authorized resolution through the anomaly
              review workflow.
            </CardDescription>
          </CardHeader>
          <div className="flex items-start gap-2 mt-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-xs text-gray-600 leading-relaxed">
              RCPT-2026-013 shows a 1.1 kg discrepancy (6.8% of dispatched weight) and is under
              review with PolyFuel Energy.
            </span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
