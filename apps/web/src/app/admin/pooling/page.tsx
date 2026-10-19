'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, ArrowRight, CheckCircle2, TrendingDown, DollarSign, Leaf } from 'lucide-react';

export default function WastePoolingPage() {
  const [selectedVillages, setSelectedVillages] = React.useState<string[]>([
    'Shanti Nagar',
    'Gandhi Street Colony',
    'Kovilpattu',
    'Temple Road',
  ]);

  const villageWeights: Record<string, number> = {
    'Shanti Nagar': 320,
    'Gandhi Street Colony': 240,
    Kovilpattu: 180,
    'Temple Road': 160,
    'Lake View': 110,
    'Market Area': 210,
  };

  const toggleVillage = (name: string) => {
    setSelectedVillages((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]
    );
  };

  const totalAggregatedKg = selectedVillages.reduce(
    (sum, v) => sum + (villageWeights[v] || 0),
    0
  );

  // Calculations
  const separateTripsCount = selectedVillages.length;
  const separateDistanceKm = separateTripsCount * 52; // avg round-trip 52 km
  const separateCost = separateTripsCount * 2300; // ₹2,300 per small trip
  const separateCO2 = Math.round(separateDistanceKm * 0.65);

  const pooledDistanceKm = 88; // optimized circular pickup + processor delivery
  const pooledCost = 4400; // single 5-ton aggregated vehicle
  const pooledCO2 = Math.round(pooledDistanceKm * 0.61);

  const costSavings = Math.max(0, separateCost - pooledCost);
  const co2Savings = Math.max(0, separateCO2 - pooledCO2);
  const costSavingsPercent =
    separateCost > 0 ? Math.round((costSavings / separateCost) * 100) : 0;

  return (
    <AppLayout
      headerProps={{
        title: 'Multi-Village Waste Pooling Evaluator',
        subtitle: 'Economic & ecological optimization by aggregating rural MLP batches',
      }}
    >
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-[#1a5c38] bg-emerald-50/30">
            <CardContent className="p-4">
              <span className="text-xs font-semibold text-[#1a5c38]">Cost Reduction</span>
              <p className="text-2xl font-bold text-emerald-950 mt-1">
                ₹{costSavings.toLocaleString('en-IN')}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{costSavingsPercent}% transport savings</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-600 bg-teal-50/30">
            <CardContent className="p-4">
              <span className="text-xs font-semibold text-teal-800">CO2 Emissions Avoided</span>
              <p className="text-2xl font-bold text-teal-950 mt-1">{co2Savings} kg CO2</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-teal-700 font-medium">
                <Leaf className="w-3.5 h-3.5" />
                <span>61% emissions reduction</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-xs text-gray-500 font-medium">Aggregated Payload</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalAggregatedKg.toLocaleString()} kg
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Across {selectedVillages.length} participating villages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <span className="text-xs text-gray-500 font-medium">Optimal Vehicle Spec</span>
              <p className="text-xl font-bold text-gray-900 mt-1">5-Ton Eicher Pro</p>
              <p className="text-xs text-emerald-700 font-medium mt-1">High-cube closed body</p>
            </CardContent>
          </Card>
        </div>

        {/* Participative Village Selector & Comparison Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Participating Panchayats</CardTitle>
              <CardDescription>
                Select villages to include in this weekly aggregation dispatch cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {Object.entries(villageWeights).map(([name, weight]) => {
                const isSelected = selectedVillages.includes(name);
                return (
                  <div
                    key={name}
                    onClick={() => toggleVillage(name)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-emerald-50/70 border-[#1a5c38] text-emerald-950 font-medium'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected
                            ? 'bg-[#1a5c38] border-[#1a5c38] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="font-semibold">{name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{weight} kg available</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Model Comparison Table */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Logistical Model Evaluation</CardTitle>
              <CardDescription>
                Direct economic comparison: Uncoordinated Small Trips vs Coordinated Pooling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                    <tr>
                      <th className="py-2.5 px-3">Metric</th>
                      <th className="py-2.5 px-3 text-red-700">Separate Trips (Status Quo)</th>
                      <th className="py-2.5 px-3 text-[#1a5c38]">Pooled Aggregation (Ours)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-3 font-medium text-gray-700">Number of Dispatches</td>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {separateTripsCount} small vehicles
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-800">
                        1 consolidated truck
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-medium text-gray-700">Total Travel Distance</td>
                      <td className="py-3 px-3 text-gray-900">{separateDistanceKm} km</td>
                      <td className="py-3 px-3 font-bold text-emerald-800">{pooledDistanceKm} km</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-medium text-gray-700">Total Transport Cost</td>
                      <td className="py-3 px-3 font-semibold text-red-600">
                        ₹{separateCost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-800">
                        ₹{pooledCost.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-medium text-gray-700">Carbon Footprint</td>
                      <td className="py-3 px-3 text-red-600">{separateCO2} kg CO2</td>
                      <td className="py-3 px-3 font-bold text-emerald-800">{pooledCO2} kg CO2</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-medium text-gray-700">Panchayat Cost Per kg</td>
                      <td className="py-3 px-3 text-gray-600">
                        ₹{totalAggregatedKg > 0 ? (separateCost / totalAggregatedKg).toFixed(2) : 0} / kg
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-800">
                        ₹{totalAggregatedKg > 0 ? (pooledCost / totalAggregatedKg).toFixed(2) : 0} / kg
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1a5c38]">
                    Recommendation: Ready to Pool
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Aggregated volume ({totalAggregatedKg} kg) achieves minimum commercial threshold for cement co-processing.
                  </p>
                </div>
                <Button size="sm" className="text-xs">
                  Schedule Joint Dispatch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
