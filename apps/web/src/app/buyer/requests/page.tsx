'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Truck, Calendar, CheckCircle2, Clock, ArrowRight, FileCheck } from 'lucide-react';
import Link from 'next/link';

interface PickupRequest {
  id: string;
  batchId: string;
  location: string;
  weight: string;
  quality: string;
  status: 'Pending' | 'Scheduled' | 'In Transit' | 'Delivered' | 'Cancelled';
  pickupDate: string;
  vehicle: string;
}

const pendingRequests: PickupRequest[] = [
  {
    id: 'PR-2026-010',
    batchId: 'MLP-2026-0143',
    location: 'Shanti Nagar (CP-03)',
    weight: '12.8 kg',
    quality: 'Grade A',
    status: 'Pending',
    pickupDate: '17 Oct 2026',
    vehicle: 'TN-20 AB 1234',
  },
  {
    id: 'PR-2026-011',
    batchId: 'MLP-2026-0142',
    location: 'Gandhi Street (CP-07)',
    weight: '16.2 kg',
    quality: 'Grade B',
    status: 'Scheduled',
    pickupDate: '18 Oct 2026',
    vehicle: 'TN-20 CD 5678',
  },
];

const scheduledRequests: PickupRequest[] = [
  {
    id: 'PR-2026-008',
    batchId: 'MLP-2026-0140',
    location: 'Temple Road (CP-05)',
    weight: '18.6 kg',
    quality: 'Grade A',
    status: 'In Transit',
    pickupDate: '16 Oct 2026',
    vehicle: 'TN-20 EF 9012',
  },
  {
    id: 'PR-2026-009',
    batchId: 'MLP-2026-0138',
    location: 'Kovilpattu (CP-04)',
    weight: '25.0 kg',
    quality: 'Grade B',
    status: 'Delivered',
    pickupDate: '15 Oct 2026',
    vehicle: 'TN-20 GH 3456',
  },
];

export default function BuyerRequestsPage() {
  return (
    <AppLayout
      headerProps={{
        title: 'Pickup Requests & Scheduling',
        subtitle: 'Request pickup for available batches, schedule vehicles, and track dispatch status',
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-gray-900">Pickup Requests</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Schedule vehicle pickup for procured MLP batches from rural collection points
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="text-xs gap-1.5 flex items-center"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>New Pickup Request</span>
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="pending" className="text-xs font-medium">
              <div className="flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending</span>
                <Badge variant="default" className="ml-auto text-[10px]">
                  {pendingRequests.length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs font-medium">
              <div className="flex items-center justify-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Scheduled</span>
                <Badge variant="default" className="ml-auto text-[10px]">
                  {scheduledRequests.length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs font-medium">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Delivered</span>
                <Badge variant="success" className="ml-auto text-[10px]">
                  3
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs font-medium">
              <div className="flex items-center justify-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Cancelled</span>
                <Badge variant="default" className="ml-auto text-[10px]">
                  0
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                      <tr>
                        <th className="py-3 px-4">Request ID</th>
                        <th className="py-3 px-4">Batch</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Weight</th>
                        <th className="py-3 px-4">Quality</th>
                        <th className="py-3 px-4">Pickup Date</th>
                        <th className="py-3 px-4">Vehicle</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pendingRequests.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50/60">
                          <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                            {r.id}
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-800">{r.batchId}</td>
                          <td className="py-3 px-4 text-gray-700">{r.location}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{r.weight}</td>
                          <td className="py-3 px-4">
                            <Badge variant="primary">{r.quality}</Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-mono">{r.pickupDate}</td>
                          <td className="py-3 px-4 text-gray-700">{r.vehicle}</td>
                          <td className="py-3 px-4">
                            <Badge variant="warning">{r.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="outline" className="text-[11px] h-7 px-3">
                              Schedule
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                      <tr>
                        <th className="py-3 px-4">Request ID</th>
                        <th className="py-3 px-4">Batch</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Weight</th>
                        <th className="py-3 px-4">Quality</th>
                        <th className="py-3 px-4">Pickup Date</th>
                        <th className="py-3 px-4">Vehicle</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {scheduledRequests.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50/60">
                          <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                            {r.id}
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-800">{r.batchId}</td>
                          <td className="py-3 px-4 text-gray-700">{r.location}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{r.weight}</td>
                          <td className="py-3 px-4">
                            <Badge variant="primary">{r.quality}</Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-mono">{r.pickupDate}</td>
                          <td className="py-3 px-4 text-gray-700">{r.vehicle}</td>
                          <td className="py-3 px-4">
                            <Badge variant={r.status === 'In Transit' ? 'warning' : 'success'}>
                              {r.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="outline" className="text-[11px] h-7 px-3">
                              Track
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivered" className="mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-xs text-blue-800">
                  All dispatched batches have been delivered and receipts confirmed. View{' '}
                  <Link href="/buyer/receipts" className="text-[#1a5c38] font-medium hover:underline">
                    Handover Receipts
                  </Link>
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="mt-4">
            <div className="text-center py-12 text-gray-400">
              <FileCheck className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-xs font-medium text-gray-600">No cancelled requests</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
