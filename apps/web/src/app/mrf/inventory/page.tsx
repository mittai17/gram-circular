'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Scan, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { MOCK_STORAGE_ZONES } from '@/lib/mock-data';

export default function MRFInventoryPage() {
  const totalStock = MOCK_STORAGE_ZONES.reduce((sum, z) => sum + z.currentWeightKg, 0);
  const totalCapacity = MOCK_STORAGE_ZONES.reduce((sum, z) => sum + z.capacityKg, 0);
  const utilization = Math.round((totalStock / totalCapacity) * 100);

  const recentMovements = [
    { id: 'mov-01', batch: 'MLP-2026-0140', zone: 'Zone A (MLP)', type: 'Inbound', weight: '25.0 kg', time: '16 Oct 10:40', status: 'Stored' },
    { id: 'mov-02', batch: 'MLP-2026-0138', zone: 'Zone A (MLP)', type: 'Inbound', weight: '25.0 kg', time: '16 Oct 09:20', status: 'Stored' },
    { id: 'mov-03', batch: 'MLP-2026-0135', zone: 'Zone A (MLP)', type: 'Inbound', weight: '25.0 kg', time: '15 Oct 18:30', status: 'Stored' },
    { id: 'mov-04', batch: 'MLP-2026-0139', zone: 'Zone B (Dry)', type: 'Inbound', weight: '16.4 kg', time: '15 Oct 17:45', status: 'Stored' },
    { id: 'mov-05', batch: 'MLP-2026-0141', zone: 'Rejected Area', type: 'Outbound', weight: '10.5 kg', time: '15 Oct 16:00', status: 'Rejected' },
  ];

  return (
    <AppLayout
      headerProps={{
        title: 'Inventory Ledger',
        subtitle: 'Storage zone stock, real-time movements, and reconciliation at Thiruvallur MRF',
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Stock On Hand"
            value={`${totalStock} kg`}
            trend={`${utilization}% utilized`}
            trendPositive={utilization < 80}
            icon={<Package className="w-5 h-5 text-amber-700" />}
            iconBgColor="bg-amber-50"
          />
          <StatCard
            title="Remaining Capacity"
            value={`${totalCapacity - totalStock} kg`}
            subtext="Across all zones"
            icon={<Scan className="w-5 h-5 text-blue-700" />}
            iconBgColor="bg-blue-50"
          />
          <StatCard
            title="Zone A (MLP)"
            value="120 kg"
            trend="24% of 500 kg"
            trendPositive={true}
            icon={<TrendingUp className="w-5 h-5 text-emerald-700" />}
            iconBgColor="bg-emerald-50"
          />
          <StatCard
            title="Zone B (Dry)"
            value="200 kg"
            trend="40% of 500 kg"
            trendPositive={true}
            icon={<Clock className="w-5 h-5 text-purple-700" />}
            iconBgColor="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storage Zones Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Storage Zones & Capacity</CardTitle>
              <CardDescription className="text-xs">
                Current weight vs capacity per zone. Overflow prediction uses recent collection rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {MOCK_STORAGE_ZONES.map((zone) => (
                  <div key={zone.id} className="p-4 flex items-center justify-between hover:bg-gray-50/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                        {zone.wasteType === 'MLP' ? (
                          <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center">
                            <Package className="w-3 h-3 text-white" />
                          </div>
                        ) : zone.wasteType === 'DRY' ? (
                          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                            <Package className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-amber-600 rounded flex items-center justify-center">
                            <Package className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{zone.name}</p>
                        <p className="text-xs text-gray-500">{zone.wasteType} storage</p>
                      </div>
                    </div>
                    <div className="flex-1 max-w-md mx-auto">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Capacity Utilization</span>
                        <span className="font-bold text-gray-900">{zone.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            zone.percentage >= 90 ? 'bg-red-500' : zone.percentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${zone.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">
                        {zone.currentWeightKg} / {zone.capacityKg} kg
                      </p>
                      <p className="text-[10px] text-gray-500">{zone.updatedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Movements Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent Movements</CardTitle>
                <CardDescription className="text-xs">Inbound, outbound, and adjustments</CardDescription>
              </div>
              <Link href="/mrf/storage">
                <Button variant="outline" size="sm" className="text-xs">
                  View All Zones
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentMovements.map((m) => (
                  <div key={m.id} className="p-3 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        m.type === 'Inbound' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {m.type === 'Inbound' ? '↓' : '↑'}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">{m.batch}</p>
                        <p className="text-[10px] text-gray-500">{m.zone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{m.weight}</p>
                      <p className="text-[10px] text-gray-500">{m.time}</p>
                      <Badge variant={m.status === 'Stored' ? 'success' : 'destructive'} className="text-[10px]">
                        {m.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reconciliation Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Stock Reconciliation</CardTitle>
            <CardDescription className="text-xs">
              Compare physical count vs ledger. Flag discrepancies for authorized resolution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500 uppercase text-[10px] font-semibold">Ledger Total</p>
                <p className="font-bold text-gray-900">{totalStock} kg</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500 uppercase text-[10px] font-semibold">Physical Count</p>
                <p className="font-bold text-gray-900">{totalStock} kg</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-emerald-700 uppercase text-[10px] font-semibold">Discrepancy</p>
                <p className="font-bold text-emerald-800">0 kg</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Reconciled</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Run Reconciliation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
