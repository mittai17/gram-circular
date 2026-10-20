'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import {
  MOCK_EDGE_DEVICES,
  MOCK_OFFLINE_QUEUE,
  MockEdgeDevice,
  MockOfflineQueueItem,
} from '@/lib/mock-data';
import {
  Wifi,
  WifiOff,
  Signal,
  ArrowUpDown,
  Smartphone,
  HardDrive,
  Database,
  CheckCircle2,
  RefreshCw,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function EdgeSyncPage() {
  const [devices] = React.useState<MockEdgeDevice[]>(MOCK_EDGE_DEVICES);
  const [queue, setQueue] = React.useState<MockOfflineQueueItem[]>(MOCK_OFFLINE_QUEUE);
  const [syncing, setSyncing] = React.useState(false);
  const [syncComplete, setSyncComplete] = React.useState(false);

  const pendingCount = queue.filter(q => q.status === 'QUEUED').length;
  const syncedCount = queue.filter(q => q.status === 'SYNCED').length;
  const totalPendingBytes = queue
    .filter(q => q.status === 'QUEUED')
    .reduce((s, q) => s + q.payloadBytes, 0);

  const handleFlushQueue = () => {
    setSyncing(true);
    setSyncComplete(false);

    setTimeout(() => {
      setQueue(prev => prev.map(item => ({ ...item, status: 'SYNCED' })));
      setSyncing(false);
      setSyncComplete(true);
    }, 1200);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Low-Bandwidth Edge Sync Architecture',
        subtitle: 'Offline-First Field Data Aggregation for Remote 2G / Zero-Connectivity Rural Gram Panchayats',
      }}
    >
      <div className="space-y-6">
        {/* KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Local Pending Queue"
            value={pendingCount.toString()}
            subtext={`${(totalPendingBytes / 1024).toFixed(1)} KB waiting for signal`}
            icon={<HardDrive className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            title="Bandwidth Compression"
            value="82% Avg."
            subtext="CBOR + Delta state encoding"
            icon={<Zap className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Active Edge Devices"
            value={devices.length.toString()}
            subtext="Rugged Tabs & ESP32 Nodes"
            icon={<Cpu className="w-5 h-5 text-blue-600" />}
          />
          <StatCard
            title="Sync Reliability"
            value="100% Idempotent"
            subtext="Zero duplicate batch entries"
            icon={<ShieldCheck className="w-5 h-5 text-teal-600" />}
          />
        </div>

        {/* Offline-First Engine Banner */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <Signal className="w-3.5 h-3.5" />
                  IndexedDB Local Queue + Opportunistic Background Sync
                </div>
                <h3 className="text-xl font-bold">Never Block Field Workers in Dead Zones</h3>
                <p className="text-slate-300 text-sm max-w-2xl">
                  Village waste collectors can scan QR tokens, weigh bags, record citizen pickups, and log expenses 100% offline. Data is packed into lightweight micro-payloads and transmitted automatically whenever a 2G/GPRS signal ping is detected.
                </p>
              </div>
              <Button
                onClick={handleFlushQueue}
                disabled={syncing || pendingCount === 0}
                className="bg-white text-slate-950 hover:bg-slate-100 font-bold shrink-0 shadow-md py-6 px-5"
              >
                {syncing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compressing &amp; Syncing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-emerald-600" />
                    Flush Edge Queue ({pendingCount} pending)
                  </span>
                )}
              </Button>
            </div>

            {syncComplete && (
              <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-lg flex items-center gap-2 text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Edge sync successful! All {queue.length} offline operations verified against central ledger with zero packet loss.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Field Devices Status Grid */}
        <div>
          <div className="mb-3">
            <h3 className="text-lg font-bold text-foreground">Registered Rural Edge Nodes &amp; Handhelds</h3>
            <p className="text-xs text-muted-foreground">Monitors battery, cellular signal dBm, and queue lag across Gram Panchayats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {devices.map((d) => (
              <Card key={d.deviceId} className="border border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      {d.deviceName}
                    </div>
                    <Badge
                      className={
                        d.networkType === '2G'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : d.networkType === 'OFFLINE'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }
                    >
                      {d.networkType === 'OFFLINE' ? 'Offline' : `${d.networkType} (${d.signalDbm} dBm)`}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{d.operatorRole} • {d.assignedVillage}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs font-mono pt-1 pb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pending Local:</span>
                    <strong className={d.pendingQueueCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                      {d.pendingQueueCount} items
                    </strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Synced Lifetime:</span>
                    <span className="text-foreground">{d.totalSyncedPayloads} payloads</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Compression:</span>
                    <span className="text-emerald-700 font-semibold">{d.compressionRatio}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-[10px] pt-1 border-t border-border">
                    <span>Last Heartbeat:</span>
                    <span>{d.lastSyncAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Local Offline Queue Ledger */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Database className="w-4 h-4 text-foreground" /> Client-Side Offline Storage Queue (IndexedDB)
                </CardTitle>
                <CardDescription>
                  Idempotent operations queued with cryptographic client IDs to prevent double-counting.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {pendingCount} waiting / {syncedCount} flushed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Queue ID &amp; Device</th>
                    <th className="py-3 px-4">Operation Type</th>
                    <th className="py-3 px-4">Payload Summary</th>
                    <th className="py-3 px-4">Captured (Offline)</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {queue.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground font-mono">{item.id}</div>
                        <div className="text-[11px] text-muted-foreground">{item.deviceId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-mono text-[10px] bg-muted/40">
                          {item.operationType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-foreground font-medium">
                        {item.summary}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {item.capturedAt}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                        {item.payloadBytes} bytes
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            item.status === 'SYNCED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }
                        >
                          {item.status}
                        </Badge>
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
