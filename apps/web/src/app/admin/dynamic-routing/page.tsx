'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import {
  MOCK_PICKUP_REQUESTS,
  MOCK_OPTIMIZATION_LOGS,
  MockPickupRequest,
  MockOptimizationLog,
} from '@/lib/mock-data';
import {
  Route,
  Truck,
  Fuel,
  Leaf,
  Clock,
  Radio,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  RotateCcw,
} from 'lucide-react';

export default function DynamicRoutingPage() {
  const [requests, setRequests] = React.useState<MockPickupRequest[]>(MOCK_PICKUP_REQUESTS);
  const [logs, setLogs] = React.useState<MockOptimizationLog[]>(MOCK_OPTIMIZATION_LOGS);
  const [optimizing, setOptimizing] = React.useState(false);
  const [optSuccess, setOptSuccess] = React.useState(false);

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const criticalCount = requests.filter(r => r.urgency === 'CRITICAL').length;
  const totalKmSaved = logs.reduce((s, l) => s + l.distanceSavedKm, 0);
  const totalFuelSavedINR = logs.reduce((s, l) => s + l.fuelSavedINR, 0);
  const totalCo2SavedKg = logs.reduce((s, l) => s + l.co2SavedKg, 0);

  const handleRunOptimization = () => {
    setOptimizing(true);
    setOptSuccess(false);

    setTimeout(() => {
      // Mark pending as assigned
      setRequests(prev => prev.map(r => ({ ...r, status: 'ASSIGNED', assignedVehicle: 'TN-20-CZ-4412 (E-Tipper #1)' })));

      const newLog: MockOptimizationLog = {
        id: `OPT-${Date.now()}`,
        planName: 'Real-time Demand Re-Route (All Urgencies Cleared)',
        triggerType: 'Manual Admin Trigger',
        stopsCount: pendingRequests.length + 3,
        baselineDistanceKm: 52.4,
        optimizedDistanceKm: 34.2,
        distanceSavedKm: 18.2,
        fuelSavedLitres: 2.27,
        fuelSavedINR: 209.30,
        co2SavedKg: 6.09,
        solverDurationMs: 460,
        algorithm: 'Google OR-Tools Guided Local Search (CVRP)',
        timestamp: 'Just now',
      };

      setLogs([newLog, ...logs]);
      setOptimizing(false);
      setOptSuccess(true);
    }, 1200);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Demand-Driven Dynamic Routing Engine',
        subtitle: 'Dynamic Aggregation Optimization Eliminating Fixed-Schedule Empty Truck Mileage in Rural Clusters',
      }}
    >
      <div className="space-y-6">
        {/* KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Overflow Pickups"
            value={pendingRequests.length.toString()}
            subtext={`${criticalCount} Critical (>90% full)`}
            icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            title="Total Mileage Saved"
            value={`${totalKmSaved.toFixed(1)} km`}
            subtext="Vs. static fixed rural routes"
            icon={<Route className="w-5 h-5 text-blue-600" />}
          />
          <StatCard
            title="Fuel Expense Saved"
            value={`₹${totalFuelSavedINR.toFixed(0)}`}
            subtext="Direct transport cost reduction"
            icon={<Fuel className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="CO₂ Emissions Avoided"
            value={`${totalCo2SavedKg.toFixed(1)} kg`}
            subtext="Clean rural logistics footprint"
            icon={<Leaf className="w-5 h-5 text-teal-600" />}
          />
        </div>

        {/* Optimizer Control Strip */}
        <Card className="border border-border bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  Live IoT Sensor &amp; Gram Panchayat Demand Listener Active
                </div>
                <h3 className="text-xl font-bold">Guided Local Search Capacitated Vehicle Routing (CVRP)</h3>
                <p className="text-blue-100 text-sm max-w-2xl">
                  Re-solves vehicle schedules only when bins reach &gt; 80% fill capacity or GPs request bulk pickups. Avoids costly fuel waste visiting half-empty rural bins.
                </p>
              </div>
              <Button
                onClick={handleRunOptimization}
                disabled={optimizing || pendingRequests.length === 0}
                className="bg-white text-blue-950 hover:bg-blue-50 font-bold shrink-0 shadow-md py-6 px-5"
              >
                {optimizing ? (
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" /> Solving CVRP...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Re-Optimize Current Dispatches ({pendingRequests.length})
                  </span>
                )}
              </Button>
            </div>

            {optSuccess && (
              <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-lg flex items-center gap-2 text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Dynamic re-route solved! All {pendingRequests.length} pending pickup points clustered into E-Tipper #1 itinerary with 18.2 km saved.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incoming Demand Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-600" /> Active Pickup Demand Feed
                    </CardTitle>
                    <CardDescription>
                      Real-time triggers generated by ultrasonic bin telemetry and Panchayat Secretary requests.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {pendingRequests.length} unassigned
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {requests.map((req) => (
                    <div key={req.id} className="p-4 hover:bg-muted/20 transition-colors flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{req.villageName}</span>
                          <span className="text-xs text-muted-foreground">• {req.collectionPointName}</span>
                          <Badge
                            className={
                              req.urgency === 'CRITICAL'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : req.urgency === 'HIGH'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-800'
                            }
                          >
                            {req.urgency}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3">
                          <span>Est. Weight: <strong className="text-foreground">{req.estimatedWeightKg} kg</strong></span>
                          <span>Fill Level: <strong className={req.fillLevelPercent >= 90 ? 'text-red-600 font-bold' : 'text-foreground'}>{req.fillLevelPercent}%</strong></span>
                          <span>Trigger: {req.requestType}</span>
                        </div>
                        {req.assignedVehicle && (
                          <div className="text-xs text-blue-700 flex items-center gap-1 font-medium">
                            <Truck className="w-3.5 h-3.5" /> Assigned: {req.assignedVehicle}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 text-right">
                        <Badge
                          variant={req.status === 'ASSIGNED' ? 'default' : 'warning'}
                          className={req.status === 'ASSIGNED' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'}
                        >
                          {req.status}
                        </Badge>
                        <div className="text-[11px] text-muted-foreground mt-1">{req.createdAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Savings Log */}
          <div className="space-y-4">
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" /> Solver History &amp; Savings
                </CardTitle>
                <CardDescription>
                  Empirical fuel &amp; distance audits from dynamic solver dispatches.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-muted/40 rounded-lg border border-border text-xs space-y-2">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>{log.planName}</span>
                      <span className="text-[10px] text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Trigger: <span className="font-medium text-foreground">{log.triggerType}</span> • Stops: {log.stopsCount}
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border font-mono text-[11px]">
                      <div>
                        <div className="text-muted-foreground text-[10px]">Saved Km</div>
                        <div className="font-bold text-blue-600">+{log.distanceSavedKm} km</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-[10px]">Saved ₹</div>
                        <div className="font-bold text-emerald-600">₹{log.fuelSavedINR.toFixed(0)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-[10px]">Avoided CO₂</div>
                        <div className="font-bold text-teal-600">-{log.co2SavedKg} kg</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
