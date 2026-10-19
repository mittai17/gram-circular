'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import Link from 'next/link';
import { Package, Layers, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_BATCHES } from '@/lib/mock-data';

export default function MRFDashboardPage() {
  const batches = MOCK_BATCHES;

  return (
    <AppLayout
      headerProps={{
        title: 'MRF Operator Dashboard',
        subtitle: 'Thiruvallur Central Material Recovery Facility • Intake, Grading & Storage',
      }}
    >
      <div className="space-y-6">
        {/* KPI Cards Row matching mockup row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total MLP Stock"
            value="420 kg"
            subtext="42% Capacity"
            icon={<Package className="w-5 h-5 text-amber-700" />}
            iconBgColor="bg-amber-50"
          />
          <StatCard
            title="New Batches Today"
            value="12"
            subtext="From 6 rural routes"
            icon={<Layers className="w-5 h-5 text-blue-700" />}
            iconBgColor="bg-blue-50"
          />
          <StatCard
            title="Inspection Pending"
            value="8"
            subtext="Requires quality grade"
            icon={<ShieldCheck className="w-5 h-5 text-purple-700" />}
            iconBgColor="bg-purple-50"
          />
          <StatCard
            title="Dispatch Ready"
            value="3"
            subtext="Baled & reserved"
            icon={<Truck className="w-5 h-5 text-emerald-700" />}
            iconBgColor="bg-emerald-50"
          />
        </div>

        {/* Recent Batches Table matching mockup row 3 left */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">Recent Batches</CardTitle>
              <CardDescription className="text-xs">
                Batches unloaded at MRF intake bay awaiting grading or baling
              </CardDescription>
            </div>
            <Link href="/mrf/batches">
              <Button variant="outline" size="sm" className="text-xs">
                View All Incoming
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Batch ID</th>
                    <th className="py-3 px-4">From</th>
                    <th className="py-3 px-4">Collected On</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Quality</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                        {batch.batchNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {batch.collectionPointCode}
                      </td>
                      <td className="py-3 px-4 text-gray-500">16 Oct 10:24</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{batch.netWeight} kg</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full ${
                            batch.qualityGrade === 'A'
                              ? 'bg-emerald-50 text-emerald-800'
                              : batch.qualityGrade === 'B'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          Grade {batch.qualityGrade ?? 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            batch.status === 'IN_STORAGE'
                              ? 'success'
                              : batch.status === 'INSPECTION_PENDING'
                              ? 'warning'
                              : 'primary'
                          }
                        >
                          {batch.status === 'IN_STORAGE' ? 'In Storage' : 'Inspection'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Link href="/mrf/inspection">
                          <Button size="sm" variant="outline" className="text-[11px] h-7 px-2">
                            Inspect
                          </Button>
                        </Link>
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
