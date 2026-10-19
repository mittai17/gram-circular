'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_BATCHES } from '@/lib/mock-data';

export default function QualityInspectionPage() {
  const [selectedBatchIndex, setSelectedBatchIndex] = React.useState(0);
  const currentBatch = MOCK_BATCHES[selectedBatchIndex] || MOCK_BATCHES[0];

  const [condition, setCondition] = React.useState<'Clean' | 'Slightly Dirty' | 'Contaminated'>(
    'Clean'
  );
  const [moisture, setMoisture] = React.useState<'Low' | 'Medium' | 'High'>('Low');
  const [grade, setGrade] = React.useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [remarks, setRemarks] = React.useState(
    'Foil wrappers in good condition. Uniform density suitable for shredding.'
  );
  const [isSaved, setIsSaved] = React.useState(false);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400&q=80',
    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&q=80',
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=80',
    'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleNextBatch = () => {
    setSelectedBatchIndex((prev) => (prev + 1) % MOCK_BATCHES.length);
    setIsSaved(false);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Quality Inspection',
        subtitle: 'Inspect and grade incoming MLP batches',
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Selected Batch Header Card matching mockup */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900 font-mono">
                  {currentBatch.batchNumber}
                </h3>
                <Badge variant="warning">Inspection Pending</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {currentBatch.netWeight} kg • From {currentBatch.collectionPointCode} (
                {currentBatch.villageName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Batch {selectedBatchIndex + 1} of {MOCK_BATCHES.length}</span>
            <Button variant="outline" size="sm" onClick={handleNextBatch} className="text-xs">
              Next Batch
            </Button>
          </div>
        </div>

        {/* 2-Column: Left Photo Grid, Right Inspection Form matching mockup row 3 center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Waste Photos Grid */}
          <Card className="lg:col-span-6 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Field Waste Inspection Photos</CardTitle>
              <CardDescription className="text-xs">
                High-resolution proof captured by field worker at collection point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2.5">
                {samplePhotos.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="waste sample"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                      Sample #{i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right: Inspection Details Form */}
          <Card className="lg:col-span-6 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Inspection Details</CardTitle>
              <CardDescription className="text-xs">
                Record sensory parameters to calculate automated grade recommendation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Condition */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Condition</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Clean', 'Slightly Dirty', 'Contaminated'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCondition(item)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        condition === item
                          ? 'bg-[#1a5c38] text-white border-[#1a5c38] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Moisture */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Moisture</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMoisture(item)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        moisture === item
                          ? 'bg-[#1a5c38] text-white border-[#1a5c38] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Grade */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Quality Grade</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Grade A', 'Grade B', 'Grade C'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setGrade(item)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        grade === item
                          ? 'bg-[#1a5c38] text-white border-[#1a5c38] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <Textarea
                  label="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks..."
                  rows={3}
                />
              </div>

              {/* Buttons matching mockup */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[#1a5c38] hover:bg-[#0f3d24] text-xs font-bold"
                >
                  {isSaved ? 'Saved Successfully!' : 'Save Inspection'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextBatch}
                  className="flex-1 text-xs font-semibold"
                >
                  Next Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
