'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Scale,
  Truck,
  Printer,
  Share2,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { MOCK_BATCHES } from '@/lib/mock-data';

export default function SharedDigitalPassportPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = React.use(params);

  const batch =
    MOCK_BATCHES.find((b) => b.batchNumber === batchId) || MOCK_BATCHES[0];

  const timeline = [
    {
      title: 'Origin Collection & Sensor Weigh-in',
      timestamp: '16 Oct 2026, 10:24 AM IST',
      location: `${batch.collectionPointCode} - ${batch.villageName}`,
      detail: `Weighed on calibrated field scale. Net weight: ${batch.netWeight} kg. Worker: ${batch.workerName}`,
      icon: Scale,
      status: 'VERIFIED',
    },
    {
      title: 'MRF Intake & Optical Scan',
      timestamp: '16 Oct 2026, 10:45 AM IST',
      location: 'Thiruvallur Central MRF Receiving Dock',
      detail: 'Bag unloaded and QR scanned. Zero weight loss in transit.',
      icon: Building2,
      status: 'VERIFIED',
    },
    {
      title: 'Quality Sensory Grading & Chemical Check',
      timestamp: '16 Oct 2026, 11:15 AM IST',
      location: 'MRF Grading Table #2',
      detail: `Assessed condition: ${batch.condition ?? 'Clean'}, Moisture: ${batch.moisture ?? 'Low'}. Awarded Grade ${batch.qualityGrade ?? 'A'}.`,
      icon: ShieldCheck,
      status: 'VERIFIED',
    },
    {
      title: 'Hydraulic Baling & Storage Tagging',
      timestamp: '16 Oct 2026, 11:40 AM IST',
      location: 'Warehouse Zone A (MLP Storage Bay 3)',
      detail: 'Compacted into 25 kg baled density cube for safe freight.',
      icon: CheckCircle2,
      status: 'VERIFIED',
    },
    {
      title: 'Processor Consignment Handover',
      timestamp: '18 Oct 2026, 09:30 AM IST (Scheduled)',
      location: 'GreenCycle Pvt Ltd Co-processing Plant',
      detail: 'Dispatched under manifest PO-2026-015 for cement kiln co-processing.',
      icon: Truck,
      status: 'SCHEDULED',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-900 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-0.5 shadow-md border border-emerald-100 shrink-0">
            <Image
              src="/logo.png"
              width={36}
              height={36}
              alt="ECOZA"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-gray-900 uppercase">
              ECOZA
            </h1>
            <p className="text-[11px] text-emerald-800 font-semibold">
              Public Digital Waste Provenance Passport
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Passport</span>
          </Button>
          <Link href="/admin/dashboard">
            <Button size="sm" className="text-xs">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Passport Certificate Body */}
      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        <Card className="bg-white shadow-lg border-2 border-emerald-900/10 rounded-2xl overflow-hidden">
          {/* Passport Banner */}
          <div className="bg-gradient-to-r from-[#0f3d24] via-[#1a5c38] to-[#2d8653] text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 text-emerald-200 px-2 py-0.5 rounded-full inline-block">
                CPCB EPR COMPLIANT PASSPORT
              </span>
              <h2 className="text-2xl font-black font-mono tracking-tight">
                {batch.batchNumber}
              </h2>
              <p className="text-xs text-emerald-100">
                Origin: {batch.villageName} • Gram Panchayat Rural Sector 3
              </p>
            </div>

            <div className="p-2 bg-white rounded-xl shadow-md shrink-0">
              <QRCodeSVG
                value={`https://gram-circular.in/shared/batches/${batch.batchNumber}`}
                size={85}
                level="M"
              />
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Key Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/80 p-4 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block">Waste Stream</span>
                <span className="font-bold text-gray-900">{batch.wasteType} (Plastic Foil)</span>
              </div>
              <div>
                <span className="text-gray-400 block">Verified Net Weight</span>
                <span className="font-extrabold text-base text-[#1a5c38]">{batch.netWeight} kg</span>
              </div>
              <div>
                <span className="text-gray-400 block">Quality Grade</span>
                <span className="font-bold text-gray-900">Grade {batch.qualityGrade ?? 'A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">End Recycler</span>
                <span className="font-bold text-gray-900">GreenCycle Pvt Ltd</span>
              </div>
            </div>

            {/* Verifiable Custody Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                Custody Chain & Transformation Timeline
              </h3>

              <div className="relative border-l-2 border-emerald-500 ml-4 space-y-6 my-2">
                {timeline.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="relative pl-6">
                      <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-emerald-700" />
                            {step.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                          {step.location}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cryptographic Hash Seal */}
            <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-mono text-[10px] text-gray-400 truncate max-w-sm">
                  SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                </span>
              </div>
              <span className="font-medium text-emerald-800">
                Panchayat Blockchain Certified
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
