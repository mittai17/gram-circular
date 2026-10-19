'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import Link from 'next/link';
import { Package, Clock, CheckCircle2, TrendingUp, ArrowRight, Truck } from 'lucide-react';

interface AvailableBatch {
  id: string;
  location: string;
  weight: string;
  quality: string;
  distance: string;
  status: string;
}

const batches: AvailableBatch[] = [
  {
    id: 'MLP-2026-0143',
    location: 'Shanti Nagar',
    weight: '12.8 kg',
    quality: 'Grade A',
    distance: '50 km',
    status: 'Available',
  },
  {
    id: 'MLP-2026-0142',
    location: 'Gandhi Street',
    weight: '16.2 kg',
    quality: 'Grade B',
    distance: '60 km',
    status: 'Available',
  },
  {
    id: 'MLP-2026-0138',
    location: 'Kovilpattu',
    weight: '18.4 kg',
    quality: 'Grade A',
    distance: '72 km',
    status: 'Available',
  },
  {
    id: 'MLP-2026-0135',
    location: 'Temple Road',
    weight: '25.0 kg',
    quality: 'Grade B',
    distance: '80 km',
    status: 'Available',
  },
];

export default function BuyerDashboardPage() {
  const [requested, setRequested] = React.useState<Record<string, boolean>>({});

  const handleRequest = (id: string) => {
    setRequested((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Procurement Dashboard',
        subtitle: 'GreenCycle Pvt Ltd • Authorized Cement Co-processing & Recycling Facility',
      }}
    >
      <div className="space-y-6">
        {/* KPI Row matching mockup row 4 left */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Available Batches"
            value="12"
            subtext="(328.4 kg ready)"
            icon={<Package className="w-5 h-5 text-blue-700" />}
            iconBgColor="bg-blue-50"
          />
          <StatCard
            title="Pending Requests"
            value="3"
            subtext="Awaiting dispatch approval"
            icon={<Clock className="w-5 h-5 text-amber-700" />}
            iconBgColor="bg-amber-50"
          />
          <StatCard
            title="Received This Month"
            value="412 kg"
            trend="+ 16%"
            trendPositive={true}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />}
            iconBgColor="bg-emerald-50"
          />
          <StatCard
            title="Total Purchased"
            value="2,450 kg"
            subtext="Lifetime certified procurement"
            icon={<TrendingUp className="w-5 h-5 text-purple-700" />}
            iconBgColor="bg-purple-50"
          />
        </div>

        {/* Available MLP Batches Table matching mockup row 4 left */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">
                Available MLP Batches
              </CardTitle>
              <CardDescription className="text-xs">
                Verified rural MLP baled lots ready for procurement purchase orders
              </CardDescription>
            </div>
            <Link href="/buyer/batches">
              <Button variant="outline" size="sm" className="text-xs">
                View Full Catalog
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Batch ID</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Quality</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {batches.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                        <Link
                          href={`/buyer/batches/${b.id}`}
                          className="hover:underline text-[#1a5c38]"
                        >
                          {b.id}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{b.location}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{b.weight}</td>
                      <td className="py-3 px-4">
                        <Badge variant="primary">{b.quality}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{b.distance}</td>
                      <td className="py-3 px-4">
                        <Badge variant="success">{b.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {requested[b.id] ? (
                          <Badge variant="default">Requested</Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRequest(b.id)}
                            className="bg-[#1a5c38] hover:bg-[#0f3d24] text-[11px] h-7 px-3"
                          >
                            Request
                          </Button>
                        )}
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
