'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_ANOMALIES } from '@/lib/mock-data';
import { AnomalyRecord } from '@/types';
import { AlertTriangle, CheckCircle2, ShieldAlert, Eye, Filter } from 'lucide-react';

export default function AnomaliesReviewPage() {
  const [anomalies, setAnomalies] = React.useState<AnomalyRecord[]>(MOCK_ANOMALIES);
  const [severityFilter, setSeverityFilter] = React.useState('all');

  const filtered = anomalies.filter((a) => {
    if (severityFilter === 'all') return true;
    return a.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  const handleResolve = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a))
    );
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Anomaly Detection & Audit Review',
        subtitle: 'Automated integrity checks across weighing scales, QR scans and custodian handovers',
      }}
    >
      <div className="space-y-6">
        {/* KPI Alert Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-red-500 bg-red-50/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-red-700">High Severity Flags</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">1 Open</p>
                <p className="text-xs text-red-600/80 mt-0.5">Weight discrepancy &gt; 20%</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 bg-amber-50/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-700">Medium Severity</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">1 Resolved</p>
                <p className="text-xs text-amber-600/80 mt-0.5">Duplicate QR token scan</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800">Resolution Rate</span>
                <p className="text-2xl font-bold text-emerald-950 mt-1">94.2%</p>
                <p className="text-xs text-emerald-700 mt-0.5">Avg resolution time: 38 mins</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </CardContent>
          </Card>
        </div>

        {/* Anomalies Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Security & Telemetry Audit Log</CardTitle>
              <CardDescription>
                Real-time alerts triggered by statistical outlier models and chain of custody rules
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Filter Severity:</span>
              <select
                aria-label="Filter Severity"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="text-xs rounded-lg border border-gray-200 px-2 py-1 bg-white"
              >
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-3">Alert ID</th>
                    <th className="py-3 px-3">Severity</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Location / Node</th>
                    <th className="py-3 px-3">Description</th>
                    <th className="py-3 px-3">Detected At</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-bold text-gray-900">{item.id}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            item.severity === 'HIGH'
                              ? 'destructive'
                              : item.severity === 'MEDIUM'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {item.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-800">{item.category}</td>
                      <td className="py-3 px-3 text-gray-600">{item.location}</td>
                      <td className="py-3 px-3 text-gray-700 max-w-xs">{item.description}</td>
                      <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{item.detectedAt}</td>
                      <td className="py-3 px-3">
                        <Badge variant={item.status === 'Resolved' ? 'success' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        {item.status !== 'Resolved' ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleResolve(item.id)}
                            className="text-[11px] h-7 px-2.5"
                          >
                            Mark Resolved
                          </Button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Closed
                          </span>
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
