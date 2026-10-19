'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, TrendingUp, Users, Leaf, ArrowUpRight } from 'lucide-react';
import { MOCK_VILLAGES } from '@/lib/mock-data';

export default function CitizenProgressPage() {
  const sortedVillages = [...MOCK_VILLAGES].sort(
    (a, b) => b.segregationRate - a.segregationRate
  );

  return (
    <AppLayout
      headerProps={{
        title: 'Village Cleanliness Leaderboard',
        subtitle: 'Community impact metrics, segregation rankings & Swachh Gram awards',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Milestone Card */}
        <div className="bg-gradient-to-r from-emerald-700 to-[#1a5c38] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white">
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Karthik S • Level 3 Green Citizen</h3>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full">
                  125 Points
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                You diverted 14.2 kg of snack wrappers this quarter! You are ranked #4 in Ward 2.
              </p>
            </div>
          </div>
        </div>

        {/* Panchayat Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-900">
              Panchayat Cleanliness Ranking
            </CardTitle>
            <CardDescription className="text-xs">
              Ranked by household segregation compliance and MLP foil diversion rate
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Village Name</th>
                    <th className="py-3 px-4">Panchayat Union</th>
                    <th className="py-3 px-4">Segregation %</th>
                    <th className="py-3 px-4">MLP Diverted</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedVillages.map((v, idx) => (
                    <tr
                      key={v.id}
                      className={`hover:bg-gray-50/60 ${
                        v.name === 'Shanti Nagar' ? 'bg-emerald-50/30 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                            idx === 0
                              ? 'bg-amber-100 text-amber-800'
                              : idx === 1
                              ? 'bg-gray-200 text-gray-800'
                              : idx === 2
                              ? 'bg-amber-50 text-amber-900'
                              : 'text-gray-500'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {v.name}
                        {v.name === 'Shanti Nagar' && (
                          <span className="text-[10px] text-emerald-700 ml-2">(Your Village)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{v.panchayat}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-800">{v.segregationRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{v.dailyMlpKg * 30} kg / mo</td>
                      <td className="py-3 px-4">
                        <Badge variant={idx < 2 ? 'success' : 'primary'}>
                          {idx === 0 ? 'Gold Star' : idx === 1 ? 'Silver Star' : 'Active'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
