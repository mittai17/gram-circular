'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_COLLECTION_POINTS } from '@/lib/mock-data';

export default function CitizenReportBinPage() {
  const [selectedPoint, setSelectedPoint] = React.useState('cp-07');
  const [issueType, setIssueType] = React.useState('Overflowing');
  const [binType, setBinType] = React.useState('MLP');
  const [notes, setNotes] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Report Full / Damaged Bin',
        subtitle: 'Alert your Ward sanitary inspector directly with photographic geotagged evidence',
      }}
    >
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <CardTitle className="text-base font-bold text-gray-900">
                Submit Bin Report
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Direct dispatch trigger for Ramesh K (Sector 3 Collection Vehicle)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-gray-900">
                  Report Ticket #REP-2026-904 Created
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you! Your report has been dispatched to Sector 3 collection vehicle.
                  ETA for pickup: 35 minutes. You earned +10 Swachh points!
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsSubmitted(false);
                      setNotes('');
                    }}
                    className="text-xs"
                  >
                    Submit Another Report
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Collection Bin Location
                  </label>
                  <Select
                    value={selectedPoint}
                    onChange={(e) => setSelectedPoint(e.target.value)}
                  >
                    {MOCK_COLLECTION_POINTS.map((cp) => (
                      <option key={cp.id} value={cp.id}>
                        {cp.code} - {cp.name} ({cp.village})
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Bin Stream</label>
                    <Select value={binType} onChange={(e) => setBinType(e.target.value)}>
                      <option value="MLP">MLP (Plastic Foil)</option>
                      <option value="DRY">Dry Waste</option>
                      <option value="WET">Wet Organic</option>
                      <option value="SANITARY">Sanitary Waste</option>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Observed Issue</label>
                    <Select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                      <option value="Overflowing">Bin Overflowing</option>
                      <option value="Damaged Bin">Damaged Lid / Body</option>
                      <option value="Foul Smell">Foul Smell / Stagnant</option>
                      <option value="Missed Collection">Missed Daily Pickup</option>
                    </Select>
                  </div>
                </div>

                {/* Upload Photo Proof */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Photo Proof (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#1a5c38] transition-colors cursor-pointer bg-gray-50/50">
                    <Camera className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600 font-medium">
                      Take photo of full bin or upload from gallery
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Geo-coordinates captured</p>
                  </div>
                </div>

                <Textarea
                  label="Additional Notes (Optional)"
                  placeholder="e.g. Stray animals gathered near bin..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#1a5c38] hover:bg-[#0f3d24] font-bold text-xs"
                >
                  Send Report to Collection Team
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
