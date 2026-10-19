'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  weight: string;
  distance: string;
  status: 'Completed' | 'Received' | 'Pending' | 'Cancelled';
  date: string;
}

const purchaseHistory: PurchaseOrder[] = [
  {
    id: 'PO-2026-015',
    weight: '162 kg',
    distance: '50 km',
    status: 'Completed',
    date: '10 Oct 2026',
  },
  {
    id: 'PO-2026-014',
    weight: '450 kg',
    distance: '72 km',
    status: 'Received',
    date: '05 Oct 2026',
  },
  {
    id: 'PO-2026-013',
    weight: '320 kg',
    distance: '60 km',
    status: 'Completed',
    date: '28 Sep 2026',
  },
  {
    id: 'PO-2026-012',
    weight: '290 kg',
    distance: '80 km',
    status: 'Received',
    date: '20 Sep 2026',
  },
];

export default function BuyerHistoryPage() {
  const [tab, setTab] = React.useState('all');

  const filtered = purchaseHistory.filter((po) => {
    if (tab === 'all') return true;
    return po.status.toLowerCase() === tab.toLowerCase();
  });

  return (
    <AppLayout
      headerProps={{
        title: 'Purchase History',
        subtitle: 'Historical MLP procurement ledger and CPCB co-processing certificates',
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Download EPR Invoices</span>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">PO #</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((po) => (
                    <tr key={po.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{po.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{po.weight}</td>
                      <td className="py-3 px-4 text-gray-500">{po.distance}</td>
                      <td className="py-3 px-4">
                        <Badge variant={po.status === 'Completed' ? 'success' : 'primary'}>
                          {po.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{po.date}</td>
                      <td className="py-3 px-4">
                        <button className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>EPR Cert</span>
                        </button>
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
