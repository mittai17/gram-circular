'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import Link from 'next/link';
import { Search, Filter, MapPin, Building2, Truck, Leaf, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Processor {
  id: string;
  name: string;
  type: string;
  location: string;
  distanceKm: number;
  acceptedMaterials: string[];
  minQtyKg: number;
  capacityKg: number;
  status: 'Verified' | 'Demo' | 'Pending';
  ratePerKg?: number;
}

const PROCESSORS: Processor[] = [
  {
    id: 'proc-01',
    name: 'GreenCycle Pvt Ltd',
    type: 'Cement Co-Processor',
    location: 'SIPCOT Industrial Area',
    distanceKm: 50,
    acceptedMaterials: ['MLP', 'DRY'],
    minQtyKg: 500,
    capacityKg: 5000,
    status: 'Demo',
    ratePerKg: 12,
  },
  {
    id: 'proc-02',
    name: 'EcoPoly Recyclers',
    type: 'Mechanical Recycler',
    location: 'Oragadam, Chennai',
    distanceKm: 65,
    acceptedMaterials: ['MLP', 'DRY', 'PET'],
    minQtyKg: 1000,
    capacityKg: 8000,
    status: 'Demo',
    ratePerKg: 15,
  },
  {
    id: 'proc-03',
    name: 'PolyFuel Energy',
    type: 'Waste-to-Energy Plant',
    location: 'Sriperumbudur',
    distanceKm: 45,
    acceptedMaterials: ['MLP'],
    minQtyKg: 2000,
    capacityKg: 12000,
    status: 'Pending',
    ratePerKg: 8,
  },
  {
    id: 'proc-04',
    name: 'CleanLoop Polymers',
    type: 'Pelletizer',
    location: 'Gummidipoondi',
    distanceKm: 72,
    acceptedMaterials: ['DRY', 'PET'],
    minQtyKg: 750,
    capacityKg: 4000,
    status: 'Demo',
  },
];

export default function AdminProcessorsPage() {
  const [search, setSearch] = React.useState('');
  const [materialFilter, setMaterialFilter] = React.useState('all');

  const filtered = PROCESSORS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesMaterial =
      materialFilter === 'all' || p.acceptedMaterials.includes(materialFilter as any);
    return matchesSearch && matchesMaterial;
  });

  const totalCapacity = PROCESSORS.reduce((sum, p) => sum + p.capacityKg, 0);

  return (
    <AppLayout
      headerProps={{
        title: 'Buyer & Processor Directory',
        subtitle: 'Authorized downstream processors and buyers for collected MLP and dry waste',
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-l-4 border-l-[#1a5c38]">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Total Processors
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{PROCESSORS.length}</p>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                {PROCESSORS.filter((p) => p.status === 'Demo').length} Demo •{' '}
                {PROCESSORS.filter((p) => p.status === 'Pending').length} Pending
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1a5c38] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Combined Capacity
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {totalCapacity.toLocaleString()} kg
              </p>
              <p className="text-xs text-gray-500 mt-1">Per collection cycle</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Avg Distance
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {Math.round(
                  PROCESSORS.reduce((sum, p) => sum + p.distanceKm, 0) / PROCESSORS.length
                )} km
              </p>
              <p className="text-xs text-gray-500 mt-1">From central MRF</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Verified Partners
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {PROCESSORS.filter((p) => p.status !== 'Pending').length}
              </p>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                CPCB / Panchayat listed
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search processor name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="w-48">
              <Select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value as any)}
              >
                <option value="all">All Materials</option>
                <option value="MLP">MLP Accepted</option>
                <option value="DRY">Dry Waste</option>
                <option value="PET">PET / Plastic</option>
              </Select>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {filtered.length} of {PROCESSORS.length} processors
          </span>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Processor Listings</CardTitle>
            <CardDescription className="text-xs">
              Demo records are clearly marked. Verification status is not an authorization guarantee.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Processor</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Accepts</th>
                    <th className="py-3 px-4">Min Qty</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{p.type}</td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{p.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {p.distanceKm} km
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.acceptedMaterials.map((m) => (
                            <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {p.minQtyKg.toLocaleString()} kg
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {p.capacityKg.toLocaleString()} kg
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            p.status === 'Verified'
                              ? 'success'
                              : p.status === 'Demo'
                              ? 'default'
                              : 'warning'
                          }
                        >
                          {p.status === 'Demo' ? 'Demo Record' : p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px] h-7 px-3"
                          disabled={p.status === 'Pending'}
                        >
                          {p.status === 'Pending' ? 'Awaiting Verification' : 'Request Handover'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-4 text-[11px] text-gray-500">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>
                <strong>Demo Mode:</strong> Processor records are sample data for SIH evaluation.
                Real authorization requires CPCB/PWMU verification before dispatch.
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
