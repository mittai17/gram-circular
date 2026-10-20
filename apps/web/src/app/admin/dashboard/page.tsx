'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Trash2,
  Recycle,
  MapPin,
  ClipboardCheck,
  IndianRupee,
  Leaf,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { MOCK_COLLECTION_POINTS, MOCK_BATCHES } from '@/lib/mock-data';

const trendData = [
  { date: 'Oct 10', Wet: 140, Dry: 110, Sanitary: 60, MLP: 45 },
  { date: 'Oct 11', Wet: 155, Dry: 105, Sanitary: 55, MLP: 50 },
  { date: 'Oct 12', Wet: 160, Dry: 120, Sanitary: 65, MLP: 55 },
  { date: 'Oct 13', Wet: 175, Dry: 130, Sanitary: 70, MLP: 62 },
  { date: 'Oct 14', Wet: 190, Dry: 140, Sanitary: 75, MLP: 68 },
  { date: 'Oct 15', Wet: 180, Dry: 135, Sanitary: 80, MLP: 72 },
  { date: 'Oct 16', Wet: 210, Dry: 150, Sanitary: 85, MLP: 78 },
];

const distributionData = [
  { name: 'Wet', value: 35, color: '#22c55e' },
  { name: 'Dry', value: 28, color: '#3b82f6' },
  { name: 'Sanitary', value: 20, color: '#f97316' },
  { name: 'MLP', value: 17, color: '#1a5c38' },
];

const topVillages = [
  { name: 'Shanti Nagar', kg: 98.2, trend: '+14%' },
  { name: 'Gandhi Street', kg: 76.4, trend: '+9%' },
  { name: 'Kovilpattu', kg: 52.1, trend: '+4%' },
  { name: 'Temple Road', kg: 48.6, trend: '+11%' },
  { name: 'Lake View', kg: 35.0, trend: '+6%' },
];

export default function AdminDashboardPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppLayout
      headerProps={{
        title: 'Dashboard',
        subtitle: 'Overview of waste management across all villages',
      }}
    >
      <div className="space-y-6">
        {/* KPI Row - 6 Cards from Mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Waste Collected"
            value="1,248.6 kg"
            trend="+ 12%"
            trendPositive={true}
            icon={<Trash2 className="w-5 h-5 text-emerald-700" />}
            iconBgColor="bg-emerald-50"
          />
          <StatCard
            title="MLP Collected"
            value="328.4 kg"
            trend="+ 18%"
            trendPositive={true}
            icon={<Recycle className="w-5 h-5 text-blue-700" />}
            iconBgColor="bg-blue-50"
          />
          <StatCard
            title="Collection Points"
            value="24 / 28"
            trend="86% Active"
            trendPositive={true}
            icon={<MapPin className="w-5 h-5 text-amber-600" />}
            iconBgColor="bg-amber-50"
          />
          <StatCard
            title="Today's Collections"
            value="6 / 8"
            trend="75% Completed"
            trendPositive={true}
            icon={<ClipboardCheck className="w-5 h-5 text-purple-600" />}
            iconBgColor="bg-purple-50"
          />
          <StatCard
            title="Revenue Generated"
            value="₹18,450"
            trend="+ 22%"
            trendPositive={true}
            icon={<IndianRupee className="w-5 h-5 text-emerald-700" />}
            iconBgColor="bg-emerald-50"
          />
          <StatCard
            title="CO2 Avoided (Est.)"
            value="312.6 kg"
            trend="+ 15%"
            trendPositive={true}
            icon={<Leaf className="w-5 h-5 text-teal-600" />}
            iconBgColor="bg-teal-50"
          />
        </div>

        {/* Middle Row: Trend Stacked Bar + Donut Chart + Top Villages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stacked Bar Chart: 6 Cols */}
          <Card className="lg:col-span-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-semibold">Waste Collection Trend</CardTitle>
                <CardDescription>Daily aggregated stream weights in kg</CardDescription>
              </div>
              <span className="text-xs text-gray-400">Past 7 Days</span>
            </CardHeader>
            <CardContent>
              {mounted ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer
                    width="100%"
                    height={240}
                    minWidth={0}
                    minHeight={240}
                    initialDimension={{ width: 500, height: 240 }}
                  >
                    <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                        }}
                      />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="Wet" stackId="a" fill="#22c55e" />
                      <Bar dataKey="Dry" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="Sanitary" stackId="a" fill="#f97316" />
                      <Bar dataKey="MLP" stackId="a" fill="#1a5c38" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 w-full bg-gray-50 animate-pulse rounded-lg" />
              )}
            </CardContent>
          </Card>

          {/* Donut Chart: 3 Cols */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Waste Type Distribution</CardTitle>
              <CardDescription>Breakdown by volume percentage</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {mounted ? (
                <div className="h-48 w-full relative flex items-center justify-center">
                  <PieChart width={190} height={180}>
                    <Pie
                      data={distributionData}
                      cx={95}
                      cy={90}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-gray-900">1,248.6</span>
                    <span className="text-[10px] text-gray-500">Total kg</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 w-full bg-gray-50 animate-pulse rounded-lg" />
              )}
              <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
                {distributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600 truncate">{item.name}</span>
                    <span className="font-semibold text-gray-900 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Villages: 3 Cols */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Top Villages</CardTitle>
                <CardDescription>MLP Collected this month</CardDescription>
              </div>
              <TrendingUp className="w-4 h-4 text-[#1a5c38]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3.5">
                {topVillages.map((v, i) => (
                  <div key={v.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-[#1a5c38] font-bold text-[10px] flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-medium text-gray-800">{v.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{v.kg} kg</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">
                        {v.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Link
                  href="/admin/villages"
                  className="text-xs font-semibold text-[#1a5c38] hover:text-[#0f3d24] flex items-center justify-center gap-1"
                >
                  View All Village Profiles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: Collection Points Live Snapshot & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Collection Points Status</CardTitle>
                <CardDescription>Real-time fill levels and sensor status</CardDescription>
              </div>
              <Link href="/admin/collection-points">
                <Button variant="outline" size="sm" className="text-xs">
                  Open Interactive Map
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-y border-gray-100">
                    <tr>
                      <th className="py-2.5 px-3">Point Code</th>
                      <th className="py-2.5 px-3">Location / Village</th>
                      <th className="py-2.5 px-3">Fill Level</th>
                      <th className="py-2.5 px-3">Weight (MLP)</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MOCK_COLLECTION_POINTS.slice(0, 5).map((cp) => (
                      <tr key={cp.id} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{cp.code}</td>
                        <td className="py-2.5 px-3 text-gray-700">
                          {cp.name} <span className="text-gray-400">({cp.village})</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  cp.fillLevel >= 85
                                    ? 'bg-red-500'
                                    : cp.fillLevel >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${cp.fillLevel}%` }}
                              />
                            </div>
                            <span className="font-semibold text-gray-800">{cp.fillLevel}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-gray-900">{cp.weight} kg</span>{' '}
                          <span className="text-emerald-700">({cp.mlpWeight} kg MLP)</span>
                        </td>
                        <td className="py-2.5 px-3">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Shortcuts & Decision Support */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Optimization Shortcuts</CardTitle>
              <CardDescription>Decision Support Tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/admin/pooling"
                className="block p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900">
                    Multi-Village Waste Pooling
                  </span>
                  <Badge variant="primary">₹4,800 saved</Badge>
                </div>
                <p className="text-[11px] text-emerald-800/80 mt-1">
                  Evaluate aggregated 5-ton truck trips vs separate 1-ton village runs.
                </p>
              </Link>

              <Link
                href="/admin/routes"
                className="block p-3 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-900">
                    OR-Tools Route Optimization
                  </span>
                  <Badge variant="info">-36% km</Badge>
                </div>
                <p className="text-[11px] text-blue-800/80 mt-1">
                  Baseline 34.2 km reduced to 21.8 km with dynamic vehicle routing.
                </p>
              </Link>

              <Link
                href="/admin/simulations"
                className="block p-3 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-900">
                    What-If Scenarios
                  </span>
                  <Badge variant="outline">Simulate</Badge>
                </div>
                <p className="text-[11px] text-purple-800/80 mt-1">
                  Simulate vehicle breakdowns, holiday generation spikes & storage overflows.
                </p>
              </Link>

              <Link
                href="/admin/anomalies"
                className="block p-3 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-red-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Anomaly Review
                  </span>
                  <Badge variant="destructive">3 Flags</Badge>
                </div>
                <p className="text-[11px] text-red-800/80 mt-1">
                  Audit weight discrepancies and duplicate QR token attempts.
                </p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
