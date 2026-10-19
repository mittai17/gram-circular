'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import DynamicCollectionPointsMap from '@/components/map/dynamic-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MOCK_COLLECTION_POINTS, MOCK_ROUTE_STOPS } from '@/lib/mock-data';
import {
  Truck,
  Scale,
  Navigation,
  CheckCircle2,
  Clock,
  QrCode,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function WorkerDashboardPage() {
  const stops = MOCK_ROUTE_STOPS;
  const collectedToday = 70;
  const targetToday = 120;
  const progressPercent = Math.round((collectedToday / targetToday) * 100);

  return (
    <AppLayout
      headerProps={{
        title: 'Collection Worker Dashboard',
        subtitle: "Today's collection route and field weighing workstation",
      }}
    >
      <div className="space-y-6">
        {/* Top Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-white">
            <span className="text-xs text-gray-500 font-medium">Collected Today</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-gray-900">{collectedToday}</span>
              <span className="text-sm font-semibold text-gray-500">kg</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              +18 kg MLP metallized film
            </p>
          </Card>

          <Card className="p-4 bg-white">
            <span className="text-xs text-gray-500 font-medium">Daily Target</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-gray-900">{targetToday}</span>
              <span className="text-sm font-semibold text-gray-500">kg</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">6 assigned rural collection points</p>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Progress</span>
              <span className="text-sm font-bold text-[#1a5c38]">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-[#1a5c38] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-2">50 kg remaining to complete quota</p>
          </Card>
        </div>

        {/* Mockup Row 2 Exact Layout: Left Route Stops, Right Map Preview with Navigate Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Today's Route Stops List */}
          <Card className="lg:col-span-5">
            <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-gray-900">Today&apos;s Route</CardTitle>
                <CardDescription className="text-xs">
                  6 Collection Points • 18.4 km • 16 Oct 2026
                </CardDescription>
              </div>
              <Link href="/worker/routes">
                <Button variant="ghost" size="sm" className="text-xs text-[#1a5c38]">
                  All Stops
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {stops.map((stop) => (
                <div
                  key={stop.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    stop.status === 'In Progress'
                      ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/30'
                      : stop.status === 'Completed'
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        stop.status === 'Completed'
                          ? 'bg-emerald-600 text-white'
                          : stop.status === 'In Progress'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {stop.collectionPointCode.replace('CP-', '')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900">{stop.collectionPointCode}</span>
                        <span className="text-gray-700">{stop.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {stop.weightEst > 0 ? `${stop.weightEst} kg` : '00 kg'}
                        {stop.completedAt && ` • ${stop.completedAt}`}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Badge
                      variant={
                        stop.status === 'Completed'
                          ? 'success'
                          : stop.status === 'In Progress'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {stop.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right: Map with Route & Next Stop Navigation Callout */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100">
              <DynamicCollectionPointsMap
                points={MOCK_COLLECTION_POINTS.slice(0, 6)}
                showRoute={true}
                className="h-full w-full"
              />

              {/* Callout box over map: Next Stop */}
              <div className="absolute bottom-4 left-4 right-4 z-[500] bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-gray-200/90 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1a5c38] flex items-center justify-center font-bold">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Next Stop
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      CP-05 Temple Road Circle
                    </h4>
                    <span className="text-xs text-gray-500">2.4 km remaining • ETA 10 mins</span>
                  </div>
                </div>

                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#1a5c38] hover:bg-[#0f3d24] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <span>Navigate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/worker/weighing"
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#1a5c38] shadow-sm hover:shadow transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1a5c38] flex items-center justify-center group-hover:bg-[#1a5c38] group-hover:text-white transition-colors">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Open Weighing Station</h4>
                    <p className="text-[11px] text-gray-500">
                      Bluetooth ESP32 live scale + QR generator
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#1a5c38] transition-colors" />
              </Link>

              <Link
                href="/worker/sync"
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#1a5c38] shadow-sm hover:shadow transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Offline Sync Queue</h4>
                    <p className="text-[11px] text-gray-500">
                      IndexedDB zero-data-loss field sync (0 pending)
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
