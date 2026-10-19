'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { MOCK_BATCHES } from '@/lib/mock-data';
import { QrCode, Printer, ExternalLink, Search, CheckCircle2 } from 'lucide-react';

export default function WorkerBatchesPage() {
  const [selectedBatch, setSelectedBatch] = React.useState(MOCK_BATCHES[0]);
  const [search, setSearch] = React.useState('');

  const filtered = MOCK_BATCHES.filter(
    (b) =>
      b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.collectionPointCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout
      headerProps={{
        title: 'Batch QR Passports',
        subtitle: 'Cryptographic digital provenance tags and verifiable chain of custody',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Batches List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <input
              type="text"
              placeholder="Search batch number or point code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2"
            />
          </div>

          <div className="space-y-2.5">
            {filtered.map((batch) => {
              const isSelected = selectedBatch.id === batch.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-emerald-50/60 border-[#1a5c38] shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1a5c38] flex items-center justify-center font-bold">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{batch.batchNumber}</span>
                        <Badge variant="primary">{batch.wasteType}</Badge>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {batch.collectionPointCode} • {batch.netWeight} kg • {batch.villageName}
                      </p>
                    </div>
                  </div>

                  <Badge variant={batch.status === 'IN_STORAGE' ? 'success' : 'warning'}>
                    {batch.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Batch QR Detail */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-bold text-gray-900">
                Digital Passport QR
              </CardTitle>
              <CardDescription className="text-xs">
                Scan with any standard smartphone camera or QR reader
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6 space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-md">
                <QRCodeSVG
                  value={`https://gram-circular.in/shared/batches/${selectedBatch.batchNumber}`}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-gray-900 font-mono">
                  {selectedBatch.batchNumber}
                </p>
                <p className="text-xs text-emerald-800 font-medium">
                  {selectedBatch.netWeight} kg • {selectedBatch.collectionPointCode}
                </p>
                <p className="text-[11px] text-gray-400">
                  Worker: {selectedBatch.workerName}
                </p>
              </div>

              <div className="w-full flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="flex-1 text-xs gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tag</span>
                </Button>
                <Link
                  href={`/shared/batches/${selectedBatch.batchNumber}`}
                  className="flex-1"
                >
                  <Button size="sm" className="w-full text-xs gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Public Passport</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
