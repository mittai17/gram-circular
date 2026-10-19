'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Truck, CheckCircle2, ArrowRight } from 'lucide-react';

interface SelectableBatch {
  id: string;
  weight: number;
  grade: string;
  date: string;
}

const availableBatches: SelectableBatch[] = [
  { id: 'MLP-2026-0143', weight: 12.8, grade: 'Grade A', date: '16 Oct' },
  { id: 'MLP-2026-0141', weight: 10.5, grade: 'Grade B', date: '16 Oct' },
  { id: 'MLP-2025-0140', weight: 18.6, grade: 'Grade A', date: '15 Oct' },
  { id: 'MLP-2025-0138', weight: 25.0, grade: 'Grade B', date: '14 Oct' },
];

export default function MRFDispatchPage() {
  const [selectedBuyer, setSelectedBuyer] = React.useState('GreenCycle Pvt Ltd (50 km)');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([
    'MLP-2026-0143',
    'MLP-2026-0141',
  ]);
  const [isCreated, setIsCreated] = React.useState(false);

  const toggleBatch = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalWeight = selectedIds
    .map((id) => availableBatches.find((b) => b.id === id)?.weight || 0)
    .reduce((a, b) => a + b, 0);

  const handleCreateDispatch = () => {
    setIsCreated(true);
    setTimeout(() => {
      setIsCreated(false);
    }, 2500);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Dispatch to Processor',
        subtitle: 'Create and manage dispatches',
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#1a5c38]" />
              <CardTitle className="text-base font-bold text-gray-900">
                Consignment Details
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Aggregate inspected batches for authorized recycler handover
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Buyer Select matching mockup */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Select Buyer / Processor
              </label>
              <Select
                value={selectedBuyer}
                onChange={(e) => setSelectedBuyer(e.target.value)}
              >
                <option value="GreenCycle Pvt Ltd (50 km)">
                  GreenCycle Pvt Ltd (50 km • Cement Co-processing)
                </option>
                <option value="EcoPlast Recyclers (72 km)">
                  EcoPlast Recyclers (72 km • Pyrolysis Fuel Oil)
                </option>
                <option value="TamilNadu Polymer Hub (85 km)">
                  TamilNadu Polymer Hub (85 km • Paving Blocks)
                </option>
              </Select>
            </div>

            {/* Select Batches matching mockup */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700">Select Batches</label>
                <span className="text-[11px] text-gray-500">
                  {selectedIds.length} batches selected
                </span>
              </div>

              <div className="space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                {availableBatches.map((b) => {
                  const isChecked = selectedIds.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => toggleBatch(b.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer text-xs ${
                        isChecked
                          ? 'bg-emerald-50/80 border-[#1a5c38] font-medium'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded text-[#1a5c38] focus:ring-[#1a5c38]"
                        />
                        <span className="font-mono font-bold text-gray-900">{b.id}</span>
                        <Badge variant="primary">{b.grade}</Badge>
                      </div>
                      <span className="font-bold text-gray-900">{b.weight} kg</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total and Expected Date matching mockup */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Consignment Weight:</span>
                <span className="text-lg font-black text-[#1a5c38]">
                  {totalWeight.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Expected Delivery Date:</span>
                <span className="font-bold text-gray-900">18 Oct 2026</span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleCreateDispatch}
              className="w-full bg-[#1a5c38] hover:bg-[#0f3d24] font-bold text-xs"
            >
              {isCreated ? 'Dispatch Consignment Manifest Created!' : 'Create Dispatch'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
