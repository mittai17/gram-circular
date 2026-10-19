'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import DynamicCollectionPointsMap from '@/components/map/dynamic-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_BATCHES, MOCK_COLLECTION_POINTS } from '@/lib/mock-data';
import { Package, MapPin, Calendar, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BuyerBatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const batch = MOCK_BATCHES.find((b) => b.batchNumber === id) || MOCK_BATCHES[0];

  const [requested, setRequested] = React.useState(false);
  const [scheduled, setScheduled] = React.useState(false);

  const photos = [
    'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400&q=80',
    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&q=80',
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=80',
    'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80',
  ];

  return (
    <AppLayout
      headerProps={{
        title: 'Batch Details',
        subtitle: `Procurement inspection for consignment ${batch.batchNumber}`,
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/buyer/batches"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Available Batches</span>
        </Link>

        {/* Mockup Row 4 Center Layout: Left Details + Photos, Right Map & Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Photos & Sensory Details */}
          <Card className="lg:col-span-7 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg text-gray-900">
                    {batch.batchNumber}
                  </span>
                  <Badge variant="success">Available</Badge>
                </div>
                <CardDescription className="text-xs">
                  Collected On 16 Oct 2026, 10:24 AM
                </CardDescription>
              </div>
              <Badge variant="primary">Grade A (Strict)</Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Photo thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {photos.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="batch sample"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Specs Table matching mockup */}
              <div className="space-y-2.5 text-xs border border-gray-100 rounded-xl p-4 bg-gray-50/70">
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Net Weight:</span>
                  <span className="font-bold text-gray-900">{batch.netWeight} kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Source:</span>
                  <span className="font-semibold text-gray-800">
                    {batch.collectionPointCode} - {batch.villageName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Quality Grade:</span>
                  <span className="font-bold text-emerald-800">Grade A (Strict Standard)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Condition:</span>
                  <span className="font-semibold text-gray-800">Clean metallized film</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Moisture:</span>
                  <span className="font-semibold text-gray-800">Low (&lt; 2%)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-bold text-gray-900">50 km from SIPCOT facility</span>
                </div>
              </div>

              {/* Action Buttons matching mockup */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => setRequested(true)}
                  className="flex-1 bg-[#1a5c38] hover:bg-[#0f3d24] text-xs font-bold"
                >
                  {requested ? 'Purchase Requested' : 'Request Purchase'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setScheduled(true)}
                  className="flex-1 text-xs font-semibold"
                >
                  {scheduled ? 'Pickup Scheduled' : 'Schedule Pickup'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Map to Buyer Facility */}
          <div className="lg:col-span-5 h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
            <DynamicCollectionPointsMap
              points={MOCK_COLLECTION_POINTS.slice(0, 4)}
              showRoute={true}
              className="h-full w-full"
            />
            <div className="absolute top-4 left-4 right-4 z-[500] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-md border border-gray-200 text-xs">
              <span className="font-bold text-gray-900 block">Transport Route</span>
              <span className="text-gray-500 text-[11px]">
                Central MRF Thiruvallur ➔ GreenCycle SIPCOT Plant (50 km)
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
