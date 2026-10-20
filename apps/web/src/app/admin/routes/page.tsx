'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { RouteMap, RouteStop } from '@/components/map/RouteMap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_ROUTE_STOPS } from '@/lib/mock-data';
import { Truck, Zap, MapPin } from 'lucide-react';

// ---------------------------------------------------------------------------
// Demo data — Tirunelveli / Kovilpatti region, Tamil Nadu
// ---------------------------------------------------------------------------
const DEMO_DEPOT = { lat: 9.1726, lng: 77.6050 };

const DEMO_MAP_STOPS: RouteStop[] = [
  { id: 'cp1', name: 'Shanti Nagar CP-01', coordinate: { lat: 9.1850, lng: 77.5980 }, status: 'COMPLETED', sequence: 1, fillPercent: 20 },
  { id: 'cp2', name: 'Gandhi St CP-02',    coordinate: { lat: 9.1780, lng: 77.6120 }, status: 'COMPLETED', sequence: 2, fillPercent: 45 },
  { id: 'cp3', name: 'Kovilpattu CP-03',   coordinate: { lat: 9.1650, lng: 77.6180 }, status: 'CURRENT',   sequence: 3, fillPercent: 72 },
  { id: 'cp4', name: 'Murugan Nagar CP-04',coordinate: { lat: 9.1580, lng: 77.6050 }, status: 'PENDING',   sequence: 4, fillPercent: 88 },
  { id: 'cp5', name: 'Anna Colony CP-05',  coordinate: { lat: 9.1620, lng: 77.5920 }, status: 'PENDING',   sequence: 5, fillPercent: 60 },
  { id: 'cp6', name: 'Perumalpuram CP-06', coordinate: { lat: 9.1700, lng: 77.5850 }, status: 'PENDING',   sequence: 6, fillPercent: 95 },
];

const STATUS_LEGEND = [
  { color: '#22c55e', label: 'Completed' },
  { color: '#1a5c38', label: 'Current' },
  { color: '#f97316', label: 'Pending' },
  { color: '#9ca3af', label: 'Skipped' },
];

export default function RouteOptimizationPage() {
  const [optimized, setOptimized] = React.useState(true);

  return (
    <AppLayout
      headerProps={{
        title: 'Route Optimization Engine',
        subtitle: 'OR-Tools VRP + OSRM quantum routing — OpenStreetMap live navigation',
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

        {/* OSRM Route Map — full width */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">
                OSRM Live Route — Vehicle TN-29-BA-4821
              </CardTitle>
              <CardDescription>
                OpenStreetMap tiles • OSRM driving route • {DEMO_MAP_STOPS.length} collection points
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Status legend */}
              <div className="hidden sm:flex items-center gap-3 mr-2">
                {STATUS_LEGEND.map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </div>
                ))}
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
            </div>
          </CardHeader>
          <CardContent>
            <RouteMap
              stops={DEMO_MAP_STOPS}
              depot={DEMO_DEPOT}
              showRouting
              height={420}
            />
          </CardContent>
        </Card>

        {/* 2-Column: Left Stops Sequence, Right Vehicle Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Scheduled Stop Sequence</CardTitle>
                <CardDescription>Target: 6 Collection Points in Sector 3</CardDescription>
              </div>
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

          <Card className="lg:col-span-5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Vehicle Status</CardTitle>
              <CardDescription>TN-29-BA-4821 • Driver: Ramesh K</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {[
                { label: 'Route Status', value: 'Active — 2/6 Stops Done', accent: true },
                { label: 'Optimized Distance', value: '21.8 km (OSRM)' },
                { label: 'Baseline Distance', value: '34.2 km' },
                { label: 'Savings', value: '12.4 km (-36.3%)', accent: true },
                { label: 'Capacity Used', value: '420 / 500 kg (84%)' },
                { label: 'Fuel Saved (est.)', value: '2.9 L diesel' },
                { label: 'CO2 Avoided', value: '7.8 kg CO2e', accent: true },
                { label: 'ETA to Depot', value: '~2.6 hours' },
              ].map(({ label, value, accent }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-semibold ${accent ? 'text-[#1a5c38]' : 'text-gray-800'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

