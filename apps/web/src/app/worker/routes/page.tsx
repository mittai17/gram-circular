'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import DynamicCollectionPointsMap from '@/components/map/dynamic-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_COLLECTION_POINTS, MOCK_ROUTE_STOPS } from '@/lib/mock-data';
import { RouteStop } from '@/types';
import { Navigation, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function WorkerRoutesPage() {
  const [stops, setStops] = React.useState<RouteStop[]>(MOCK_ROUTE_STOPS);

  const handleMarkComplete = (stopId: string) => {
    setStops((prev) =>
      prev.map((s) =>
        s.id === stopId ? { ...s, status: 'Completed', completedAt: 'Just now' } : s
      )
    );
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Today Collection Route',
        subtitle: 'Optimized rural stop sequence and navigation for Tata Ace vehicle',
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            {stops.map((stop) => (
              <Card
                key={stop.id}
                className={`transition-all ${
                  stop.status === 'In Progress'
                    ? 'border-amber-400 bg-amber-50/20 shadow-sm'
                    : stop.status === 'Completed'
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        stop.status === 'Completed'
                          ? 'bg-emerald-600 text-white'
                          : stop.status === 'In Progress'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {stop.sequence}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">
                          {stop.collectionPointCode}
                        </span>
                        <span className="text-xs font-semibold text-gray-800">{stop.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Est: {stop.weightEst > 0 ? `${stop.weightEst} kg` : 'Check bin'} • Distance:{' '}
                        {stop.distanceKm} km • ETA: {stop.timeEstimate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
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
                    {stop.status !== 'Completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkComplete(stop.id)}
                        className="text-xs h-8"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-6 h-[550px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <DynamicCollectionPointsMap
              points={MOCK_COLLECTION_POINTS.slice(0, 6)}
              showRoute={true}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
