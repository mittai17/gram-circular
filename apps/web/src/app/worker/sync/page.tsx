'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface QueuedItem {
  id: string;
  operation: 'WEIGH_IN' | 'BATCH_CREATE' | 'TAG_SCAN';
  payloadSummary: string;
  timestamp: string;
  retryCount: number;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

export default function OfflineSyncPage() {
  const [isOnline, setIsOnline] = React.useState(true);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [queue, setQueue] = React.useState<QueuedItem[]>([
    {
      id: 'q-101',
      operation: 'WEIGH_IN',
      payloadSummary: 'Batch MLP-2026-0142: 18.6 kg at CP-03',
      timestamp: '16 Oct 2026, 09:15 AM',
      retryCount: 1,
      status: 'PENDING',
    },
    {
      id: 'q-102',
      operation: 'TAG_SCAN',
      payloadSummary: 'Bin Sensor Ping CP-07 Battery 82%',
      timestamp: '16 Oct 2026, 08:50 AM',
      retryCount: 0,
      status: 'SYNCED',
    },
    {
      id: 'q-103',
      operation: 'BATCH_CREATE',
      payloadSummary: 'Batch MLP-2026-0141: 10.5 kg at CP-01',
      timestamp: '16 Oct 2026, 08:45 AM',
      retryCount: 0,
      status: 'SYNCED',
    },
  ]);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setQueue((prev) =>
        prev.map((item) => ({ ...item, status: 'SYNCED' as const }))
      );
      setIsSyncing(false);
    }, 800);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Offline Sync Queue Manager',
        subtitle: 'IndexedDB-backed offline store with automatic reconciliation upon cellular reconnection',
      }}
    >
      <div className="space-y-6">
        {/* Connectivity Status Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900">
                  {isOnline ? 'Cellular Connection Active (4G/LTE)' : 'Offline Mode (Local Storage)'}
                </h4>
                <Badge variant={isOnline ? 'success' : 'destructive'}>
                  {isOnline ? 'Connected' : 'Offline'}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Local SQLite / IndexedDB cache holds 1 pending transaction.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOnline(!isOnline)}
              className="text-xs flex-1 sm:flex-none"
            >
              Simulate {isOnline ? 'Network Drop' : 'Network Reconnect'}
            </Button>
            <Button
              size="sm"
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="text-xs gap-1.5 flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Reconciling...' : 'Sync Pending Items'}</span>
            </Button>
          </div>
        </div>

        {/* Sync Queue Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">IndexedDB Queue Entries</CardTitle>
            <CardDescription>
              Local-first transactions waiting for cryptographic signature confirmation from central server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Tx ID</th>
                    <th className="py-3 px-4">Operation</th>
                    <th className="py-3 px-4">Payload Summary</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Retries</th>
                    <th className="py-3 px-4">Sync Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {queue.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{item.id}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{item.operation}</td>
                      <td className="py-3 px-4 text-gray-700">{item.payloadSummary}</td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{item.timestamp}</td>
                      <td className="py-3 px-4 text-gray-700">{item.retryCount}</td>
                      <td className="py-3 px-4">
                        <Badge variant={item.status === 'SYNCED' ? 'success' : 'warning'}>
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
