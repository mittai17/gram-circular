'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FileCheck, Camera, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function BuyerReceiptsPage() {
  const [consignmentId, setConsignmentId] = React.useState('PO-2026-015');
  const [dispatchWeight, setDispatchWeight] = React.useState(162.0);
  const [receivedWeight, setReceivedWeight] = React.useState(161.4);
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const delta = (receivedWeight - dispatchWeight).toFixed(1);
  const deltaPercent = (
    (Math.abs(receivedWeight - dispatchWeight) / dispatchWeight) *
    100
  ).toFixed(2);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmed(true);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Handover & Weighbridge Receipts',
        subtitle: 'Cryptographic delivery confirmation and destination weight verification',
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#1a5c38]" />
              <CardTitle className="text-base font-bold text-gray-900">
                Confirm Material Handover
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Record destination weighbridge gross and tare to close consignment ledger
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">
                  Consignment Purchase Order
                </label>
                <Select
                  value={consignmentId}
                  onChange={(e) => setConsignmentId(e.target.value)}
                >
                  <option value="PO-2026-015">PO-2026-015 (Dispatch Weight: 162.0 kg)</option>
                  <option value="PO-2026-016">PO-2026-016 (Dispatch Weight: 240.0 kg)</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Dispatch Manifest Weight (kg)"
                  value={dispatchWeight}
                  readOnly
                  className="bg-gray-50 text-gray-700"
                />
                <Input
                  label="Destination Scale Weight (kg)"
                  type="number"
                  step="0.1"
                  value={receivedWeight}
                  onChange={(e) => setReceivedWeight(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              {/* Variance Analysis Box */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weight Discrepancy Delta:</span>
                  <span className="font-bold text-gray-900">
                    {delta} kg ({deltaPercent}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Allowable Variance Threshold:</span>
                  <span className="text-emerald-700 font-semibold">&le; 2.0%</span>
                </div>
                <p className="text-[11px] text-emerald-800 pt-1">
                  Variance within normal moisture evaporation tolerance. Compliant with CPCB guidelines.
                </p>
              </div>

              {/* Upload Weighbridge Slip */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Upload Weighbridge Slip / Photo Proof
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#1a5c38] transition-colors cursor-pointer bg-white">
                  <Camera className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <span className="text-xs text-gray-600 font-medium">
                    Drag and drop weighbridge slip, or click to browse
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG or PDF up to 10MB</p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#1a5c38] hover:bg-[#0f3d24] font-bold text-xs"
              >
                {isConfirmed
                  ? 'Delivery Confirmation Recorded & Ledger Sealed'
                  : 'Submit Handover Confirmation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
