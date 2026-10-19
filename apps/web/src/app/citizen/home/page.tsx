'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Calendar,
  Award,
  AlertCircle,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Recycle,
  Heart,
} from 'lucide-react';

export default function CitizenHomePage() {
  return (
    <AppLayout
      headerProps={{
        title: 'Village Citizen Portal',
        subtitle: 'A Cleaner Village Starts with You • Shanti Nagar Gram Panchayat',
      }}
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top 3 Cards Row matching mockup row 4 far right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Next Collection Card */}
          <Card className="p-4 bg-white flex items-center gap-3.5 border-l-4 border-l-emerald-600">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1a5c38] flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-gray-500 font-medium">Next Collection</span>
              <p className="text-base font-bold text-gray-900 mt-0.5">Tomorrow</p>
              <p className="text-xs text-emerald-700 font-semibold">16 Oct 2026 • Dry & MLP</p>
            </div>
          </Card>

          {/* My Points Card */}
          <Card className="p-4 bg-white flex items-center gap-3.5 border-l-4 border-l-amber-500">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-gray-500 font-medium">My Swachh Rewards</span>
              <p className="text-2xl font-black text-gray-900 mt-0.5">125 pts</p>
              <p className="text-xs text-amber-700 font-medium">Redeemable for Panchayat tax rebate</p>
            </div>
          </Card>

          {/* Village Progress Card */}
          <Card className="p-4 bg-white border-l-4 border-l-[#1a5c38]">
            <span className="text-[11px] text-gray-500 font-medium block">Village Progress</span>
            <div className="flex items-center justify-between mt-1">
              <div>
                <span className="text-lg font-bold text-gray-900">320.5 kg</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-1.5">+12%</span>
                <p className="text-[10px] text-gray-400">Total Collected</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#1a5c38]">86.4 kg</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-1.5">+18%</span>
                <p className="text-[10px] text-gray-400">MLP Foil Diverted</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Grid matching mockup row 4 far right */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/citizen/report"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-red-300 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Report Full Bin</h4>
              <p className="text-xs text-gray-500 mt-1">
                Upload photo to notify village collection team immediately
              </p>
            </Link>

            <Link
              href="/citizen/learn"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Learn Segregation</h4>
              <p className="text-xs text-gray-500 mt-1">
                Bilingual guide to snack wrappers, multilayer plastics & compost
              </p>
            </Link>

            <Link
              href="/citizen/schedule"
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">View Schedule</h4>
              <p className="text-xs text-gray-500 mt-1">
                Day-by-day waste collection calendar for your street
              </p>
            </Link>
          </div>
        </div>

        {/* Promotional Banner matching mockup row 4 bottom */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0f3d24] via-[#1a5c38] to-[#2d8653] text-white p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 z-10 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Swachh Bharat Rural Initiative</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Segregate Today For a Cleaner Tomorrow
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Every clean Kurkure, biscuit and milk pouch you keep separate avoids landfill dumping,
              prevents cattle ingestion, and earns redeemable Gram Panchayat credits.
            </p>
          </div>

          <div className="z-10 flex flex-col items-center sm:items-end gap-2 shrink-0">
            <Link href="/citizen/learn">
              <Button
                variant="accent"
                className="font-bold text-xs bg-white text-[#0f3d24] hover:bg-emerald-50 px-5 shadow-lg"
              >
                <span>Read 3-Bin Rules</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
              </Button>
            </Link>
            <span className="text-[10px] text-emerald-200">100% Panchayat Verified</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
