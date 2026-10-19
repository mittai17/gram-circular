'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import DynamicCollectionPointsMap from '@/components/map/dynamic-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_COLLECTION_POINTS, MOCK_ROUTE_STOPS } from '@/lib/mock-data';
import { Truck, Navigation, CheckCircle2, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RouteOptimizationPage() {
  const [optimized, setOptimized] = React.useState(true);

  return (
    <AppLayout
      headerProps={{
        title: 'Route Optimization Engine',
        subtitle: 'OR-Tools Vehicle Routing Problem (VRP) solver with capacity constraints',
      }}
    >
      <div className="space-y-6">
        {/* Comparison Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-red-400">
            <CardContent className="p-4">
              <span className="text-xs text-gray-500 font-medium">Unoptimized Baseline</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">34.2 km</p>
              <p className="text-xs text-gray-400 mt-1">4.2 hours • 7.8 L diesel</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#1a5c38] bg-emerald-50/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a5c38] font-bold">OR-Tools Optimized</span>
                <Badge variant="success">-36.3%</Badge>
              </div>
              <p className="text-2xl font-bold text-emerald-900 mt-1">21.8 km</p>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                2.6 hours • 4.9 L diesel
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-xs text-gray-500 font-medium">Vehicle Capacity Util</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">84%</p>
              <p className="text-xs text-gray-500 mt-1">420 kg of 500 kg max payload</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-xs text-gray-500 font-medium">Daily CO2 Offset</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">7.8 kg CO2e</p>
              <p className="text-xs text-gray-500 mt-1">Based on 2.9 L diesel reduction</p>
            </CardContent>
          </Card>
        </div>

        {/* 2-Column: Left Stops Sequence, Right Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Scheduled Stop Sequence</CardTitle>
                <CardDescription>Target: 6 Collection Points in Sector 3</CardDescription>
              </div>
              <Button
                size="sm"
                variant={optimized ? 'primary' : 'outline'}
                onClick={() => setOptimized(!optimized)}
                className="text-xs gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{optimized ? 'Re-run Solver' : 'Optimize'}</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_ROUTE_STOPS.map((stop, idx) => (
                  <div
                    key={stop.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#1a5c38] text-white font-bold flex items-center justify-center text-xs">
                        {stop.sequence}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900">{stop.collectionPointCode}</span>
                          <span className="text-gray-700">{stop.name}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          ETA: {stop.timeEstimate} • +{stop.distanceKm} km
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-semibold text-gray-800">{stop.weightEst} kg</span>
                      <div className="mt-0.5">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-7 h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
            <DynamicCollectionPointsMap
              points={MOCK_COLLECTION_POINTS.slice(0, 6)}
              showRoute={true}
              className="h-full w-full"
            />
            <div className="absolute top-4 left-4 z-[500] bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md border border-gray-200 text-xs">
              <span className="font-bold text-gray-900">Vehicle: TN-20-CZ-8104 (Tata Ace)</span>
              <p className="text-[11px] text-gray-500">Driver: Ramesh K • 6 Stops</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
