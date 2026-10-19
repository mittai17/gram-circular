'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { MOCK_STORAGE_ZONES } from '@/lib/mock-data';

interface StorageUpdate {
  batchId: string;
  zone: string;
  weight: string;
  date: string;
  status: 'Stored' | 'Dispatched';
}

const mockUpdates: StorageUpdate[] = [
  {
    batchId: 'MLP-2026-0143',
    zone: 'Zone A',
    weight: '12.8 kg',
    date: '16 Oct 10:40',
    status: 'Stored',
  },
  {
    batchId: 'MLP-2026-0142',
    zone: 'Zone B',
    weight: '16.2 kg',
    date: '16 Oct 09:30',
    status: 'Stored',
  },
  {
    batchId: 'MLP-2026-0140',
    zone: 'Zone A',
    weight: '18.6 kg',
    date: '15 Oct 18:20',
    status: 'Stored',
  },
];

export default function MRFStoragePage() {
  const zones = MOCK_STORAGE_ZONES;

  return (
    <AppLayout
      headerProps={{
        title: 'Storage & Inventory',
        subtitle: 'Manage MLP stock and storage zones',
      }}
    >
      <div className="space-y-6">
        {/* Zones Progress Cards matching mockup */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Storage Zones Capacity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <Card key={zone.id} className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1a5c38] flex items-center justify-center font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-gray-900">{zone.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#1a5c38]">{zone.percentage}%</span>
                </div>

                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${zone.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                  <span>
                    {zone.currentWeightKg} / {zone.capacityKg} kg
                  </span>
                  <span>Updated {zone.updatedAt}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Storage Updates Table matching mockup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold text-gray-900">
              Recent Storage Updates
            </CardTitle>
            <CardDescription className="text-xs">
              Audit log of baled material stacked into physical warehouse bays
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Batch ID</th>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockUpdates.map((u) => (
                    <tr key={u.batchId} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{u.batchId}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{u.zone}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{u.weight}</td>
                      <td className="py-3 px-4 text-gray-500">{u.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant="success">{u.status}</Badge>
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
