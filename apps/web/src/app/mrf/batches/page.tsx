'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { MOCK_BATCHES } from '@/lib/mock-data';
import { WasteBatch } from '@/types';
import { QrCode, CheckCircle2, ArrowRight, Camera } from 'lucide-react';

export default function MRFBatchesPage() {
  const [batches, setBatches] = React.useState<WasteBatch[]>(MOCK_BATCHES);
  const [isScanModalOpen, setIsScanModalOpen] = React.useState(false);
  const [scannedBatchId, setScannedBatchId] = React.useState('');

  const handleSimulateScan = () => {
    const target = batches.find((b) => b.status === 'INSPECTION_PENDING') || batches[0];
    setBatches((prev) =>
      prev.map((b) =>
        b.id === target.id ? { ...b, status: 'RECEIVED_AT_MRF' as const } : b
      )
    );
    setScannedBatchId(target.batchNumber);
    setTimeout(() => {
      setIsScanModalOpen(false);
    }, 1200);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Incoming Batches Queue',
        subtitle: 'Intake dock receiving & optical QR scan check-in',
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Intake Dock Scanning</h3>
            <p className="text-xs text-gray-500">Scan QR codes on bags unloaded from collection vehicles</p>
          </div>
          <Button
            onClick={() => {
              setIsScanModalOpen(true);
              setScannedBatchId('');
            }}
            className="text-xs gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR to Receive</span>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Batch ID</th>
                    <th className="py-3 px-4">Origin Point</th>
                    <th className="py-3 px-4">Village</th>
                    <th className="py-3 px-4">Stream</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {batches.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{b.batchNumber}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{b.collectionPointCode}</td>
                      <td className="py-3 px-4 text-gray-600">{b.villageName}</td>
                      <td className="py-3 px-4">
                        <Badge variant="primary">{b.wasteType}</Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{b.netWeight} kg</td>
                      <td className="py-3 px-4">
                        <Badge variant={b.status === 'IN_STORAGE' ? 'success' : 'warning'}>
                          {b.status}
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

      <Modal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        title="Simulated QR Scanner"
        description="Point optical scanner or phone camera at batch barcode"
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-[#1a5c38] bg-emerald-50/40 flex flex-col items-center justify-center relative overflow-hidden">
            <Camera className="w-12 h-12 text-[#1a5c38] mb-2 opacity-60" />
            <div className="w-full h-0.5 bg-emerald-500 animate-pulse absolute top-1/2" />
            <span className="text-xs text-gray-500 font-medium">Align QR code inside box</span>
          </div>

          {scannedBatchId ? (
            <div className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified: {scannedBatchId} checked in!</span>
            </div>
          ) : (
            <Button size="sm" onClick={handleSimulateScan} className="text-xs">
              Simulate Scan: MLP-2026-0143
            </Button>
          )}
        </div>
      </Modal>
    </AppLayout>
  );
}
