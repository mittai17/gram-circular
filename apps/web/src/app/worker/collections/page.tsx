'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Search, CheckCircle2, Clock } from 'lucide-react';

interface CollectionRecord {
  batchId: string;
  dateTime: string;
  location: string;
  type: string;
  weight: string;
  status: 'Synced' | 'Pending';
}

const mockCollections: CollectionRecord[] = [
  {
    batchId: 'MLP-2026-0143',
    dateTime: '16 Oct, 10:24',
    location: 'CP-03',
    type: 'MLP',
    weight: '12.8 kg',
    status: 'Synced',
  },
  {
    batchId: 'MLP-2026-0142',
    dateTime: '16 Oct, 09:15',
    location: 'CP-03',
    type: 'Dry',
    weight: '18.6 kg',
    status: 'Pending',
  },
  {
    batchId: 'MLP-2026-0141',
    dateTime: '16 Oct, 08:45',
    location: 'CP-01',
    type: 'MLP',
    weight: '10.5 kg',
    status: 'Synced',
  },
  {
    batchId: 'MLP-2026-0140',
    dateTime: '15 Oct, 04:20',
    location: 'CP-07',
    type: 'Sanitary',
    weight: '8.2 kg',
    status: 'Synced',
  },
  {
    batchId: 'MLP-2026-0139',
    dateTime: '15 Oct, 03:10',
    location: 'CP-05',
    type: 'Dry',
    weight: '16.4 kg',
    status: 'Synced',
  },
];

export default function WorkerCollectionsPage() {
  const [tab, setTab] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const filtered = mockCollections.filter((c) => {
    const matchesSearch =
      c.batchId.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <AppLayout
      headerProps={{
        title: 'My Collections',
        subtitle: 'View and audit all collected waste records and local field logs',
      }}
    >
      <div className="space-y-4">
        {/* Controls Bar matching mockup */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search batches..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a5c38]"
              />
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1.5 whitespace-nowrap">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Table matching mockup row 2 right */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Batch ID</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.batchId} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                        {item.batchId}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.dateTime}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{item.location}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            item.type === 'MLP'
                              ? 'primary'
                              : item.type === 'Dry'
                              ? 'info'
                              : 'warning'
                          }
                        >
                          {item.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{item.weight}</td>
                      <td className="py-3 px-4">
                        <Badge variant={item.status === 'Synced' ? 'success' : 'destructive'}>
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
