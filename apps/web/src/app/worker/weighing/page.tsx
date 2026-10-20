'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import {
  Scale,
  Camera,
  RefreshCw,
  Printer,
  CheckCircle2,
  ExternalLink,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { WasteType } from '@/types';

export default function WorkerWeighingPage() {
  const [wasteType, setWasteType] = React.useState<WasteType>('MLP');
  const [selectedCp, setSelectedCp] = React.useState('CP-03');
  const [weight, setWeight] = React.useState(12.8);
  const [isStable, setIsStable] = React.useState(true);
  const [hardwareMode, setHardwareMode] = React.useState<'simulated' | 'ble'>('simulated');
  const [generatedBatch, setGeneratedBatch] = React.useState<{
    batchId: string;
    weight: number;
    cpCode: string;
    date: string;
    wasteType: WasteType;
  } | null>({
    batchId: 'MLP-2026-0143',
    weight: 12.8,
    cpCode: 'CP-03',
    date: '16 Oct 2026, 10:24 AM',
    wasteType: 'MLP',
  });

  const photoThumbnails = [
    'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=200&q=80',
    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=200&q=80',
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=200&q=80',
  ];

  const handleTare = () => {
    setWeight(0.0);
    setIsStable(false);
    setTimeout(() => {
      setIsStable(true);
    }, 400);
  };

  const handleSimulateScale = () => {
    setIsStable(false);
    const newWeight = +(10 + Math.random() * 8).toFixed(1);
    setWeight(newWeight);
    setTimeout(() => {
      setIsStable(true);
    }, 700);
  };

  const handleSaveAndGenerate = () => {
    const randomId = `MLP-2026-0${Math.floor(140 + Math.random() * 50)}`;
    const now = new Date();
    const formatted = `${now.getDate()} Oct 2026, ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    setGeneratedBatch({
      batchId: randomId,
      weight: weight || 12.8,
      cpCode: selectedCp,
      date: formatted,
      wasteType,
    });
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Weighing Station',
        subtitle: 'Calibrated field weighing and tamper-proof digital batch passport creation',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        {/* Left Weighing Panel matching mockup */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#1a5c38]" />
                <CardTitle className="text-sm font-bold text-gray-900">
                  Load Cell Telemetry
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500">Source:</span>
                <select
                  aria-label="Weighing Telemetry Source"
                  value={hardwareMode}
                  onChange={(e) => setHardwareMode(e.target.value as any)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1 font-medium text-gray-700"
                >
                  <option value="simulated">Simulated ESP32 Scale</option>
                  <option value="ble">BLE Hardware Scale (HX711)</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Big Scale Display matching mockup */}
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200/90 text-center relative">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={isStable ? 'success' : 'warning'}>
                    {isStable ? '● Stable Reading' : 'Reading Sensor...'}
                  </Badge>
                  <span className="text-[11px] text-gray-400">Tare: 1.2 kg net zero</span>
                </div>

                <div className="flex items-baseline justify-center gap-2 my-2">
                  <span className="text-6xl font-black tracking-tight text-gray-900 font-mono">
                    {weight.toFixed(1)}
                  </span>
                  <span className="text-2xl font-bold text-gray-500">kg</span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTare}
                    className="text-xs"
                  >
                    Tare / Zero
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSimulateScale}
                    className="text-xs gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-measure</span>
                  </Button>
                </div>
              </div>

              {/* Select Waste Type (matching mockup buttons: Wet, Dry, Sanitary, MLP) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Select Waste Stream Type
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {(['WET', 'DRY', 'SANITARY', 'MLP'] as WasteType[]).map((type) => {
                    const isSelected = wasteType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setWasteType(type)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#1a5c38] text-white border-[#1a5c38] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold opacity-75">
                          Stream
                        </span>
                        <span>{type === 'MLP' ? 'MLP (Foil)' : type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collection Point Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">
                  Collection Point Source
                </label>
                <Select
                  value={selectedCp}
                  onChange={(e) => setSelectedCp(e.target.value)}
                >
                  <option value="CP-01">CP-01 - Shanti Nagar Center</option>
                  <option value="CP-02">CP-02 - Bus Stand Junction</option>
                  <option value="CP-03">CP-03 - Gandhi Street Ward 4</option>
                  <option value="CP-05">CP-05 - Temple Road Circle</option>
                  <option value="CP-07">CP-07 - Panchayat Union School</option>
                  <option value="CP-09">CP-09 - Lake View Bund Road</option>
                </Select>
              </div>

              {/* Add Photo (Optional) - matching mockup thumbnails */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Add Waste Photos (Proof of Segregation)
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {photoThumbnails.map((url, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 relative group shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="waste proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#1a5c38] flex flex-col items-center justify-center text-gray-400 hover:text-[#1a5c38] shrink-0 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] font-medium mt-0.5">+ Add</span>
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <Button
                size="lg"
                onClick={handleSaveAndGenerate}
                className="w-full font-bold text-sm bg-[#1a5c38] hover:bg-[#0f3d24]"
              >
                Save & Generate QR Passport
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Generated QR Code Card matching mockup */}
        <div className="lg:col-span-5">
          <Card className="bg-white sticky top-24">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-base font-bold text-gray-900">
                Generated Digital Passport
              </CardTitle>
              <CardDescription>
                Tamper-proof encrypted QR label for baled consignment
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6 space-y-4">
              {generatedBatch ? (
                <>
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-md">
                    <QRCodeSVG
                      value={`https://ecoza.in/shared/batches/${generatedBatch.batchId}`}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-lg font-black tracking-tight text-gray-900 font-mono">
                      {generatedBatch.batchId}
                    </p>
                    <p className="text-xs font-semibold text-emerald-800">
                      {generatedBatch.weight} kg • {generatedBatch.cpCode} ({generatedBatch.wasteType})
                    </p>
                    <p className="text-[11px] text-gray-400">{generatedBatch.date}</p>
                  </div>

                  <div className="w-full pt-3 border-t border-gray-100 flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="text-xs gap-1.5 flex-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Label</span>
                    </Button>
                    <Link
                      href={`/shared/batches/${generatedBatch.batchId}`}
                      className="flex-1"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs gap-1.5 w-full"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Passport</span>
                      </Button>
                    </Link>
                  </div>

                  <div className="w-full bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3 text-[11px] text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      Batch metadata hashed & stored offline in IndexedDB. Will sync
                      to central cloud automatically when network is detected.
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <Scale className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No active batch weighed yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
