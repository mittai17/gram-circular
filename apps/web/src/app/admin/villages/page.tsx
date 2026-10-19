'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_VILLAGES } from '@/lib/mock-data';
import { VillageProfile } from '@/types';
import { Building2, Users, Trash2, Award, Phone, Plus, Search } from 'lucide-react';

export default function VillagesPage() {
  const [villages] = React.useState<VillageProfile[]>(MOCK_VILLAGES);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredVillages = villages.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.panchayat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      headerProps={{
        title: 'Villages & Panchayats',
        subtitle: 'Village demographics, waste generation profiles and field coordinators',
      }}
    >
      <div className="space-y-6">
        {/* Top summary row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search villages or panchayats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">
              Total Monitored Panchayats: <b className="text-gray-900">{villages.length}</b>
            </span>
          </div>
        </div>

        {/* Villages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredVillages.map((village) => (
            <Card key={village.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#1a5c38]" />
                    <CardTitle className="text-base font-bold text-gray-900">
                      {village.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">{village.panchayat}</CardDescription>
                </div>
                <Badge variant={village.segregationRate >= 80 ? 'success' : 'warning'}>
                  {village.segregationRate}% Segregated
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-500">Population</span>
                    <p className="font-bold text-gray-900 mt-0.5">
                      {village.population.toLocaleString()} ({village.households} HH)
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Collection Points</span>
                    <p className="font-bold text-gray-900 mt-0.5">
                      {village.collectionPointsCount} Points
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Daily Waste</span>
                    <p className="font-bold text-gray-900 mt-0.5">{village.dailyWasteKg} kg/day</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Daily MLP Foil</span>
                    <p className="font-bold text-emerald-800 mt-0.5">{village.dailyMlpKg} kg/day</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-gray-500 text-[10px]">Panchayat Coordinator</p>
                    <p className="font-semibold text-gray-800">{village.coordinatorName}</p>
                  </div>
                  <a
                    href={`tel:${village.coordinatorContact}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-[#1a5c38] font-medium text-xs hover:bg-emerald-100 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
