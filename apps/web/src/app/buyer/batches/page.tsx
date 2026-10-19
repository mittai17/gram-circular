'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Package } from 'lucide-react';

const catalogBatches = [
  {
    id: 'MLP-2026-0143',
    location: 'Shanti Nagar Center',
    weight: '12.8 kg',
    quality: 'Grade A',
    distance: '50 km',
    moisture: 'Low',
    condition: 'Clean',
    status: 'Available',
  },
  {
    id: 'MLP-2026-0142',
    location: 'Gandhi Street Ward 4',
    weight: '16.2 kg',
    quality: 'Grade B',
    distance: '60 km',
    moisture: 'Medium',
    condition: 'Slightly Dirty',
    status: 'Available',
  },
  {
    id: 'MLP-2026-0140',
    location: 'Temple Road Circle',
    weight: '18.6 kg',
    quality: 'Grade A',
    distance: '80 km',
    moisture: 'Low',
    condition: 'Clean',
    status: 'Available',
  },
  {
    id: 'MLP-2026-0138',
    location: 'Kovilpattu North',
    weight: '25.0 kg',
    quality: 'Grade B',
    distance: '72 km',
    moisture: 'Low',
    condition: 'Clean',
    status: 'Available',
  },
  {
    id: 'MLP-2026-0135',
    location: 'Lake View Bund',
    weight: '25.0 kg',
    quality: 'Grade B',
    distance: '80 km',
    moisture: 'Low',
    condition: 'Clean',
    status: 'Available',
  },
];

export default function BuyerBatchesCatalogPage() {
  const [gradeFilter, setGradeFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const filtered = catalogBatches.filter((b) => {
    const matchesGrade = gradeFilter === 'all' || b.quality.toLowerCase().includes(gradeFilter.toLowerCase());
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  return (
    <AppLayout
      headerProps={{
        title: 'Available MLP Batches Catalog',
        subtitle: 'Baled, quality-inspected Multilayer Plastic lots available for procurement',
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search batches or locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="w-36">
              <Select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
                <option value="all">All Grades</option>
                <option value="Grade A">Grade A (Pure)</option>
                <option value="Grade B">Grade B (Standard)</option>
              </Select>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {filtered.length} Baled Batches Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <Card key={b.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-gray-900">{b.id}</span>
                  <CardDescription className="text-xs">{b.location}</CardDescription>
                </div>
                <Badge variant="primary">{b.quality}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-400">Net Weight</span>
                    <p className="font-bold text-gray-900">{b.weight}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Distance</span>
                    <p className="font-bold text-gray-900">{b.distance}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Moisture</span>
                    <p className="font-semibold text-gray-800">{b.moisture}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Condition</span>
                    <p className="font-semibold text-gray-800">{b.condition}</p>
                  </div>
                </div>

                <Link href={`/buyer/batches/${b.id}`}>
                  <Button variant="primary" size="sm" className="w-full text-xs gap-1">
                    <span>Inspect Batch Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
