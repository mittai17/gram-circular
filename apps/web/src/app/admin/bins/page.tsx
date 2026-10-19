'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { MOCK_COLLECTION_POINTS } from '@/lib/mock-data';
import { Trash2, Battery, Wifi, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function LiveBinsPage() {
  const [filter, setFilter] = React.useState('all');
  const [bins, setBins] = React.useState(MOCK_COLLECTION_POINTS);

  const filteredBins = bins.filter((bin) => {
    if (filter === 'critical') return bin.fillLevel >= 80;
    if (filter === 'warning') return bin.fillLevel >= 50 && bin.fillLevel < 80;
    if (filter === 'normal') return bin.fillLevel < 50;
    return true;
  });

  const simulateFill = () => {
    setBins((prev) =>
      prev.map((b) => ({
        ...b,
        fillLevel: Math.min(100, b.fillLevel + Math.floor(Math.random() * 8)),
      }))
    );
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Live Bins Monitoring',
        subtitle: 'IoT ultrasonic fill-level telemetry and sensor health',
        actions: (
          <Button
            size="sm"
            variant="outline"
            onClick={simulateFill}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1a5c38]" />
            <span>Simulate Sensor Tick</span>
          </Button>
        ),
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Filter Urgency:</span>
            <div className="w-48">
              <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Bins ({bins.length})</option>
                <option value="critical">Critical (&gt; 80% Fill)</option>
                <option value="warning">Warning (50 - 80% Fill)</option>
                <option value="normal">Normal (&lt; 50% Fill)</option>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-red-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical: 2
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning: 2
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal: 4
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Sensor Telemetry Table</CardTitle>
            <CardDescription>
              Telemetry received via LoRaWAN / GSM gateway at 5-minute heartbeat intervals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Bin ID</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Fill Level</th>
                    <th className="py-3 px-4">Total Weight</th>
                    <th className="py-3 px-4">MLP Foil</th>
                    <th className="py-3 px-4">Battery</th>
                    <th className="py-3 px-4">Sensor Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBins.map((bin) => (
                    <tr key={bin.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900">{bin.code}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {bin.name} <span className="text-gray-400">({bin.village})</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                bin.fillLevel >= 80
                                  ? 'bg-red-500'
                                  : bin.fillLevel >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${bin.fillLevel}%` }}
                            />
                          </div>
                          <span
                            className={`font-bold ${
                              bin.fillLevel >= 80
                                ? 'text-red-600'
                                : bin.fillLevel >= 50
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {bin.fillLevel}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{bin.weight} kg</td>
                      <td className="py-3 px-4 font-semibold text-emerald-800">
                        {bin.mlpWeight} kg
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <Battery className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{bin.batteryLevel ?? 90}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Wifi className="w-3.5 h-3.5" />
                          <span className="font-medium text-[11px]">Online</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {bin.fillLevel >= 80 ? (
                          <Button size="sm" variant="danger" className="text-[11px] h-7 px-2">
                            Dispatch Truck
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="text-[11px] h-7 px-2">
                            Ping Sensor
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
