'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import DynamicCollectionPointsMap from '@/components/map/dynamic-map';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { CollectionPoint } from '@/types';
import { MOCK_COLLECTION_POINTS } from '@/lib/mock-data';
import { Plus, Search, Trash2, Battery, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function CollectionPointsPage() {
  const [points, setPoints] = React.useState<CollectionPoint[]>(MOCK_COLLECTION_POINTS);
  const [selectedPoint, setSelectedPoint] = React.useState<CollectionPoint>(MOCK_COLLECTION_POINTS[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [villageFilter, setVillageFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  // New point form
  const [newCode, setNewCode] = React.useState('');
  const [newName, setNewName] = React.useState('');
  const [newVillage, setNewVillage] = React.useState('Shanti Nagar');

  const filteredPoints = points.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVillage = villageFilter === 'all' || p.village === villageFilter;
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesVillage && matchesStatus;
  });

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;
    const newPt: CollectionPoint = {
      id: `cp-${Date.now()}`,
      code: newCode.toUpperCase(),
      name: newName,
      village: newVillage,
      lat: 13.145 + (Math.random() - 0.5) * 0.03,
      lng: 79.915 + (Math.random() - 0.5) * 0.03,
      fillLevel: 10,
      weight: 15.0,
      mlpWeight: 4.5,
      status: 'Active',
      wasteTypes: ['MLP', 'DRY'],
      lastCollection: 'Just added',
      batteryLevel: 100,
    };
    setPoints([newPt, ...points]);
    setSelectedPoint(newPt);
    setIsAddModalOpen(false);
    setNewCode('');
    setNewName('');
  };

  return (
    <AppLayout
      headerProps={{
        title: 'Collection Points',
        subtitle: 'View, manage and monitor all collection points',
      }}
    >
      <div className="space-y-4">
        {/* Filter Bar matching mockup */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200/80 shadow-sm">
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div className="w-40">
              <Select
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
              >
                <option value="all">All Villages</option>
                <option value="Shanti Nagar">Shanti Nagar</option>
                <option value="Gandhi Street Colony">Gandhi Street</option>
                <option value="Kovilpattu">Kovilpattu</option>
                <option value="Temple Road">Temple Road</option>
                <option value="Lake View">Lake View</option>
                <option value="Market Area">Market Area</option>
              </Select>
            </div>

            <div className="w-36">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="partial">Partial</option>
                <option value="full">Full</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </div>

            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search collection point..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 pr-3 w-full rounded-lg border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a5c38]"
              />
            </div>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="w-full lg:w-auto flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Collection Point</span>
          </Button>
        </div>

        {/* 2-Column Split View: Left List, Right Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-250px)] min-h-[550px]">
          {/* Left Column: Points List */}
          <div className="lg:col-span-5 flex flex-col gap-2 overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
              <span>{filteredPoints.length} Points Configured</span>
              <span>Fill / Weight</span>
            </div>

            {filteredPoints.map((cp) => {
              const isSelected = selectedPoint.id === cp.id;
              return (
                <div
                  key={cp.id}
                  onClick={() => setSelectedPoint(cp)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/60 border-[#1a5c38] shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        cp.status === 'Maintenance'
                          ? 'bg-gray-100 text-gray-600'
                          : cp.fillLevel >= 85
                          ? 'bg-red-50 text-red-700'
                          : 'bg-emerald-50 text-[#1a5c38]'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{cp.code}</span>
                        <span className="text-xs font-medium text-gray-700">{cp.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {cp.village} • {cp.wasteTypes.join(' • ')}
                      </p>
                      {cp.batteryLevel && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                          <Battery className="w-3 h-3 text-emerald-600" />
                          <span>Battery: {cp.batteryLevel}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-bold text-xs text-gray-900">{cp.weight} kg</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-semibold ${
                          cp.fillLevel >= 85
                            ? 'text-red-600'
                            : cp.fillLevel >= 50
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {cp.fillLevel}%
                      </span>
                      <Badge
                        variant={
                          cp.status === 'Active'
                            ? 'success'
                            : cp.status === 'Full'
                            ? 'destructive'
                            : cp.status === 'Maintenance'
                            ? 'default'
                            : 'warning'
                        }
                      >
                        {cp.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Leaflet Map + Detail Card Overlay */}
          <div className="lg:col-span-7 relative h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
            <DynamicCollectionPointsMap
              points={filteredPoints}
              selectedPointId={selectedPoint.id}
              onSelectPoint={(p) => setSelectedPoint(p)}
              className="h-full w-full"
            />

            {/* Selected Card Popup Overlay (as in mockup) */}
            <div className="absolute top-4 right-4 z-[500] w-72 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gray-200/90 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-bold text-sm text-gray-900">
                  {selectedPoint.code} - {selectedPoint.name}
                </span>
                <Badge
                  variant={
                    selectedPoint.status === 'Active'
                      ? 'success'
                      : selectedPoint.status === 'Full'
                      ? 'destructive'
                      : selectedPoint.status === 'Maintenance'
                      ? 'default'
                      : 'warning'
                  }
                >
                  {selectedPoint.status}
                </Badge>
              </div>

              <div className="space-y-1.5 py-2.5 text-gray-600">
                <div className="flex justify-between">
                  <span>Bin Fill Level:</span>
                  <span className="font-bold text-gray-900">{selectedPoint.fillLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Collection:</span>
                  <span className="font-medium text-gray-800">{selectedPoint.lastCollection}</span>
                </div>
                <div className="flex justify-between">
                  <span>MLP Collected:</span>
                  <span className="font-bold text-emerald-800">{selectedPoint.mlpWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Streams:</span>
                  <span className="font-medium text-gray-800">
                    {selectedPoint.wasteTypes.join(', ')}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsDetailModalOpen(true)}
                className="w-full mt-1 text-xs"
              >
                View Details
              </Button>
            </div>

            {/* Bottom Legend */}
            <div className="absolute bottom-4 right-4 z-[500] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-gray-200 flex items-center gap-3 text-[11px] text-gray-700">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a5c38]" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span>Partial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span>Full</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Collection Point Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Collection Point"
        description="Register a new IoT-enabled waste drop point in the Panchayat network"
      >
        <form onSubmit={handleAddPoint} className="space-y-3.5">
          <Input
            label="Point Code (e.g. CP-14)"
            placeholder="CP-14"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            required
          />
          <Input
            label="Point Name"
            placeholder="Community Hall Center"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Select
            label="Assigned Village"
            value={newVillage}
            onChange={(e) => setNewVillage(e.target.value)}
          >
            <option value="Shanti Nagar">Shanti Nagar</option>
            <option value="Gandhi Street Colony">Gandhi Street Colony</option>
            <option value="Kovilpattu">Kovilpattu</option>
            <option value="Temple Road">Temple Road</option>
            <option value="Lake View">Lake View</option>
          </Select>
          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Collection Point
            </Button>
          </div>
        </form>
      </Modal>

      {/* Point Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`${selectedPoint.code} - ${selectedPoint.name}`}
        description={`Village: ${selectedPoint.village}`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div>
              <p className="text-gray-500">Telemetry Status</p>
              <p className="font-bold text-gray-900 mt-0.5">{selectedPoint.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Fill Level</p>
              <p className="font-bold text-gray-900 mt-0.5">{selectedPoint.fillLevel}%</p>
            </div>
            <div>
              <p className="text-gray-500">Total Waste</p>
              <p className="font-bold text-gray-900 mt-0.5">{selectedPoint.weight} kg</p>
            </div>
            <div>
              <p className="text-gray-500">MLP Foil Fraction</p>
              <p className="font-bold text-emerald-700 mt-0.5">{selectedPoint.mlpWeight} kg</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Supported Waste Streams</h4>
            <div className="flex gap-2">
              {selectedPoint.wasteTypes.map((t) => (
                <Badge key={t} variant="primary">
                  {t} Waste
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
