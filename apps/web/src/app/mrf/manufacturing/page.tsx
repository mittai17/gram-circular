'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { MOCK_PRODUCTION_RUNS, MockProductionRun } from '@/lib/mock-data';
import {
  Hammer,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Boxes,
} from 'lucide-react';

export default function ManufacturingPage() {
  const [runs, setRuns] = React.useState<MockProductionRun[]>(MOCK_PRODUCTION_RUNS);
  const [filterType, setFilterType] = React.useState<string>('ALL');
  const [showModal, setShowModal] = React.useState(false);

  // Form state
  const [productType, setProductType] = React.useState<'PAVER_BLOCK' | 'FENCING_POST' | 'ROOF_SHEET' | 'ROAD_ADDITIVE'>('PAVER_BLOCK');
  const [mlpInputKg, setMlpInputKg] = React.useState('300');
  const [sandInputKg, setSandInputKg] = React.useState('600');
  const [binderInputKg, setBinderInputKg] = React.useState('100');
  const [operatorName, setOperatorName] = React.useState('K. Murugan (Shift Lead)');
  const [machineId, setMachineId] = React.useState('HYD-PRESS-02');

  const filteredRuns = filterType === 'ALL'
    ? runs
    : runs.filter(r => r.productType === filterType);

  const totalMlpConverted = runs.reduce((s, r) => s + r.mlpInputKg, 0);
  const totalUnits = runs.filter(r => r.status === 'COMPLETED').reduce((s, r) => s + r.outputQuantity, 0);
  const avgYield = Math.round(runs.filter(r => r.yieldRatioPercent > 0).reduce((s, r) => s + r.yieldRatioPercent, 0) / (runs.filter(r => r.yieldRatioPercent > 0).length || 1));

  const handleStartRun = (e: React.FormEvent) => {
    e.preventDefault();
    const newRun: MockProductionRun = {
      id: `PRD-${Date.now()}`,
      runCode: `RUN-2026-PV-0${runs.length + 80}`,
      mrfName: 'Thiruvallur Central PWMU',
      productType,
      productName: productType === 'PAVER_BLOCK'
        ? 'EcoPave M30 Interlocking Paver (MLP 30%)'
        : productType === 'FENCING_POST'
        ? 'Agrishield 6ft Recycled Composite Post'
        : productType === 'ROAD_ADDITIVE'
        ? 'IRC:SP:98 Shredded MLP Bitumen Modifier'
        : 'Corrugated Thermal Insulated Roofing Sheet (8ft)',
      status: 'IN_PROGRESS',
      mlpInputKg: Number(mlpInputKg) || 100,
      sandInputKg: Number(sandInputKg) || 0,
      binderInputKg: Number(binderInputKg) || 0,
      outputQuantity: 0,
      outputUnit: productType === 'ROAD_ADDITIVE' ? 'kg' : productType === 'PAVER_BLOCK' ? 'Blocks' : 'Units',
      yieldRatioPercent: 0,
      grade: 'A',
      compressiveStrengthMpa: 0,
      waterAbsorptionPercent: 0,
      energyKwh: 12.5,
      operatorName,
      machineId,
      sourceBatches: ['BAT-2026-10-008'],
      createdAt: 'Just now',
    };
    setRuns([newRun, ...runs]);
    setShowModal(false);
  };

  return (
    <AppLayout
      headerProps={{
        title: 'MLP Construction Upcycling Engine',
        subtitle: 'Conversion of Non-Recyclable Mixed MLP into High-Value Certified Construction Products',
      }}
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total MLP Upcycled"
            value={`${totalMlpConverted.toLocaleString()} kg`}
            subtext="Diverted from Landfill & Open Burning"
            icon={<Hammer className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Total Products Produced"
            value={`${totalUnits.toLocaleString()}+`}
            subtext="Paver blocks, fencing posts & road flakes"
            icon={<Boxes className="w-5 h-5 text-blue-700" />}
          />
          <StatCard
            title="Average Process Yield"
            value={`${avgYield}%`}
            subtext="Target standard: > 92%"
            icon={<TrendingUp className="w-5 h-5 text-purple-700" />}
          />
          <StatCard
            title="Quality Compliance"
            value="100% IS 15658"
            subtext="IS 15658 & IRC:SP:98 Certified"
            icon={<ShieldCheck className="w-5 h-5 text-teal-700" />}
          />
        </div>

        {/* Process Flow & Ratio Architecture Banner */}
        <Card className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <Sparkles className="w-3.5 h-3.5" /> High-Pressure Thermal Extrusion & Hydraulic Compaction
                </div>
                <h3 className="text-xl font-bold">Standard Mix Matrix: 30% MLP + 60% M-Sand + 10% Binder</h3>
                <p className="text-emerald-100 text-sm max-w-2xl">
                  Replaces traditional high-carbon concrete mix while achieving &gt; 30 MPa compressive strength.
                  Zero washing chemicals needed; low-shear shredding prevents microplastic contamination.
                </p>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold shrink-0 shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" /> Start Production Batch
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Products' },
              { id: 'PAVER_BLOCK', label: 'EcoPave Blocks' },
              { id: 'FENCING_POST', label: 'Agrishield Posts' },
              { id: 'ROAD_ADDITIVE', label: 'IRC:SP:98 Road Flakes' },
              { id: 'ROOF_SHEET', label: 'Roofing Sheets' },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={filterType === tab.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType(tab.id)}
                className={filterType === tab.id ? 'bg-emerald-700 hover:bg-emerald-800' : ''}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Showing {filteredRuns.length} production runs
          </span>
        </div>

        {/* Production Runs Table */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" /> PWMU Manufacturing Log & Quality Testing Records
            </CardTitle>
            <CardDescription>
              Each run maps input MLP waste batch QR tokens directly to manufactured serial batches for forward traceability.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Run Code & Product</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Raw Inputs (MLP / Sand / Binder)</th>
                    <th className="py-3 px-4">Output Produced</th>
                    <th className="py-3 px-4">Quality Grade</th>
                    <th className="py-3 px-4">Compressive Strength</th>
                    <th className="py-3 px-4">Machine & Energy</th>
                    <th className="py-3 px-4">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRuns.map((run) => (
                    <tr key={run.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{run.runCode}</div>
                        <div className="text-xs text-muted-foreground">{run.productName}</div>
                        <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
                          Sources: {run.sourceBatches.join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            run.status === 'COMPLETED'
                              ? 'default'
                              : run.status === 'IN_PROGRESS'
                              ? 'warning'
                              : 'destructive'
                          }
                          className={
                            run.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : run.status === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : ''
                          }
                        >
                          {run.status === 'COMPLETED' ? 'Completed' : 'Running'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        <div><strong className="text-emerald-700">{run.mlpInputKg} kg</strong> MLP</div>
                        <div className="text-muted-foreground">{run.sandInputKg} kg Sand • {run.binderInputKg} kg Binder</div>
                      </td>
                      <td className="py-3 px-4">
                        {run.status === 'COMPLETED' ? (
                          <div>
                            <span className="font-bold text-foreground text-base">{run.outputQuantity.toLocaleString()}</span>{' '}
                            <span className="text-xs text-muted-foreground">{run.outputUnit}</span>
                            <div className="text-[11px] text-emerald-600 font-medium">Yield: {run.yieldRatioPercent}%</div>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-700 italic">Processing cycle...</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {run.grade ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            Grade {run.grade}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {run.compressiveStrengthMpa > 0 ? (
                          <div className="font-semibold text-emerald-700">
                            {run.compressiveStrengthMpa} MPa
                            <div className="text-[11px] text-muted-foreground">Absorp: {run.waterAbsorptionPercent}%</div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Flake test / In cure</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="font-mono text-foreground">{run.machineId}</div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" /> {run.energyKwh} kWh
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <div>{run.operatorName}</div>
                        <div className="text-[10px]">{run.createdAt}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal: New Production Batch */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-emerald-700" /> Launch New Upcycling Production Run
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleStartRun} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Product To Manufacture</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as any)}
                    className="w-full text-sm rounded-lg border border-border bg-background p-2.5 focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="PAVER_BLOCK">EcoPave M30 Interlocking Paver (IS 15658)</option>
                    <option value="FENCING_POST">Agrishield 6ft Recycled Composite Fencing Post</option>
                    <option value="ROAD_ADDITIVE">IRC:SP:98 Shredded MLP Bitumen Modifier Flakes</option>
                    <option value="ROOF_SHEET">Corrugated Thermal Insulated Roofing Sheet (8ft)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">MLP Input (kg)</label>
                    <input
                      type="number"
                      value={mlpInputKg}
                      onChange={(e) => setMlpInputKg(e.target.value)}
                      className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Sand/Agg (kg)</label>
                    <input
                      type="number"
                      value={sandInputKg}
                      onChange={(e) => setSandInputKg(e.target.value)}
                      className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Binder (kg)</label>
                    <input
                      type="number"
                      value={binderInputKg}
                      onChange={(e) => setBinderInputKg(e.target.value)}
                      className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Target Machine</label>
                    <input
                      type="text"
                      value={machineId}
                      onChange={(e) => setMachineId(e.target.value)}
                      className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Operator Name</label>
                    <input
                      type="text"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      className="w-full text-sm rounded-lg border border-border bg-background p-2 focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs">
                  <strong>Traceability Note:</strong> This run automatically allocates stock from sorted Grade-A &amp; Grade-B MLP bales in storage bay 3.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                    Submit &amp; Start Press Line
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
