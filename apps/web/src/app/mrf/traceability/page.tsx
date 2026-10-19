'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle2, ShieldCheck, ArrowRight, MapPin, Truck, Scale } from 'lucide-react';
import { MOCK_BATCHES } from '@/lib/mock-data';

export default function TraceabilityAuditPage() {
  const [query, setQuery] = React.useState('MLP-2026-0143');
  const [searchedBatch, setSearchedBatch] = React.useState(MOCK_BATCHES[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_BATCHES.find(
      (b) =>
        b.batchNumber.toLowerCase().includes(query.toLowerCase()) ||
        b.qrToken.toLowerCase().includes(query.toLowerCase())
    );
    if (found) setSearchedBatch(found);
  };

  const steps = [
    {
      title: 'Field Collection & Weighing',
      time: '16 Oct 2026, 10:24 AM',
      location: `${searchedBatch.collectionPointCode} (${searchedBatch.villageName})`,
      actor: `Worker: ${searchedBatch.workerName}`,
      weight: `${searchedBatch.netWeight} kg`,
      status: 'VERIFIED',
    },
    {
      title: 'Intake at Central MRF',
      time: '16 Oct 2026, 10:45 AM',
      location: 'MRF Weighbridge Intake Bay',
      actor: 'Operator: Selvam M',
      weight: `${searchedBatch.netWeight} kg (0.0 kg delta)`,
      status: 'VERIFIED',
    },
    {
      title: 'Sensory Quality Inspection',
      time: '16 Oct 2026, 11:15 AM',
      location: 'Quality Grading Table 2',
      actor: 'Inspector: Selvam M',
      weight: `Grade ${searchedBatch.qualityGrade ?? 'A'} (${searchedBatch.condition})`,
      status: 'VERIFIED',
    },
    {
      title: 'Baling & Warehouse Bay',
      time: '16 Oct 2026, 11:40 AM',
      location: searchedBatch.storedAtZone ?? 'Zone A (MLP)',
      actor: 'Baler Hydraulic Machine #1',
      weight: 'Baled 25 kg Standard Cube',
      status: 'VERIFIED',
    },
    {
      title: 'Dispatch Manifest & Handover',
      time: '18 Oct 2026 (Scheduled)',
      location: 'Transit to GreenCycle Pvt Ltd',
      actor: 'Driver: K. Ravichandran (TN-20-CZ-8104)',
      weight: 'Consignment PO-2026-015',
      status: 'PENDING_DELIVERY',
    },
  ];

  return (
    <AppLayout
      headerProps={{
        title: 'Batch Traceability & Digital Provenance',
        subtitle: 'End-to-end cryptographic custody timeline lookup',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2 bg-white p-3 rounded-xl border border-gray-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Batch ID (e.g. MLP-2026-0143) or QR token hash..."
              className="pl-9 text-xs"
            />
          </div>
          <Button type="submit" size="sm" className="text-xs">
            Search Traceability
          </Button>
        </form>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-gray-900">
                  {searchedBatch.batchNumber}
                </span>
                <Badge variant="primary">{searchedBatch.wasteType}</Badge>
              </div>
              <CardDescription className="text-xs font-mono mt-1 text-gray-400 truncate">
                Token: {searchedBatch.qrToken}
              </CardDescription>
            </div>
            <Badge variant="success">Integrity Verified</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="relative border-l-2 border-emerald-500 ml-4 space-y-6 my-2">
              {steps.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900">{step.title}</h4>
                      <span className="text-[10px] text-gray-400">{step.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">{step.location} • {step.actor}</p>
                    <p className="text-xs font-semibold text-emerald-800 mt-1">{step.weight}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
