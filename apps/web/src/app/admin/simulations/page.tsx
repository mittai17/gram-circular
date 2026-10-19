'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Activity, AlertTriangle, Truck, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WhatIfSimulationsPage() {
  const [selectedScenario, setSelectedScenario] = React.useState('breakdown');
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [hasRun, setHasRun] = React.useState(true);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 600);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'What-If Resilience Simulator',
        subtitle: 'Test rural logistics contingency policies against operational shocks',
      }}
    >
      <div className="space-y-6">
        {/* Scenario Selector & Controls */}
        <Card className="bg-gradient-to-r from-emerald-50/50 to-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Select Shock Scenario</CardTitle>
            <CardDescription>
              Simulate disruptions to verify automated failovers and rerouting protocols
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedScenario('breakdown')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedScenario === 'breakdown'
                    ? 'border-[#1a5c38] bg-white ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">Vehicle Breakdown</span>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Primary vehicle TN-20-CZ-8104 engine stall mid-route at CP-03.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedScenario('spike')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedScenario === 'spike'
                    ? 'border-[#1a5c38] bg-white ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">Festival Generation Spike</span>
                  <Badge variant="warning">High Load</Badge>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  +40% MLP snack wrappers surge at Weekly Market & Temple Road.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedScenario('overflow')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedScenario === 'overflow'
                    ? 'border-[#1a5c38] bg-white ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">MRF Storage Overflow</span>
                  <Badge variant="info">Capacity</Badge>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Zone A (MLP) exceeds 92% capacity due to delayed buyer transport.
                </p>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={runSimulation} disabled={isSimulating} className="gap-2">
                <Zap className="w-4 h-4" />
                <span>{isSimulating ? 'Computing Contingency Model...' : 'Execute What-If Simulation'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Presentation */}
        {hasRun && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              Contingency Execution Plan & Recommended Response
            </h3>

            {selectedScenario === 'breakdown' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Action 1: Dynamic Handover
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">Deploy Backup E-Rickshaw #2</p>
                    <p className="text-gray-600">
                      Located at Shanti Nagar hub (1.2 km away). ETA to CP-03 is 9 minutes.
                    </p>
                    <Badge variant="success">Dispatched Automatically</Badge>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Action 2: Route Partition
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">Split Stops CP-05, CP-07, CP-09</p>
                    <p className="text-gray-600">
                      Remaining stops assigned to Tata Ace #2 returning from Kovilpattu sector.
                    </p>
                    <Badge variant="info">Zero Missed Pickups</Badge>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Outcome Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">Max Delay: 24 mins</p>
                    <p className="text-gray-600">
                      100% of collected MLP reaches MRF before 17:00 intake lock.
                    </p>
                    <Badge variant="primary">Resilience Guaranteed</Badge>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedScenario === 'spike' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Load Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">+180 kg Excess MLP Anticipated</p>
                    <p className="text-gray-600">
                      CP-12 (Market Area) will exceed 100% capacity by 14:00.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Automated Trigger
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">Add Mid-Day Evacuation Loop</p>
                    <p className="text-gray-600">
                      Schedule intermediate pickup at 12:30 PM before festival evening rush.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Baling Requirement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">Pre-start Hydraulic Baler 2</p>
                    <p className="text-gray-600">
                      Compacts high-volume foil into 25 kg dense cubes immediately upon arrival.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedScenario === 'overflow' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Threshold Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">Zone A at 460 / 500 kg (92%)</p>
                    <p className="text-gray-600">
                      Risk of blocking incoming afternoon field trucks.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Instant Procurement Dispatch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">Trigger Early Buyer Pickup</p>
                    <p className="text-gray-600">
                      GreenCycle Pvt Ltd dispatched with 380 kg baled MLP consignment.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-teal-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-gray-500 uppercase">
                      Buffer Clearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <p className="font-bold text-gray-900">Zone A Restored to 16%</p>
                    <p className="text-gray-600">
                      Capacity cleared before next morning collection cycle begins.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
