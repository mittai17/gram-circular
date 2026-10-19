'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Truck } from 'lucide-react';

const scheduleDays = [
  {
    day: 'Monday',
    stream: 'Wet Organic Waste',
    streamBadge: 'success',
    color: 'border-l-emerald-500',
    time: '07:30 AM - 10:30 AM',
    desc: 'Kitchen waste, vegetable scraps, food leftovers, fallen leaves for community composting.',
  },
  {
    day: 'Tuesday',
    stream: 'Sanitary Waste',
    streamBadge: 'warning',
    color: 'border-l-amber-500',
    time: '08:00 AM - 10:00 AM',
    desc: 'Diapers, sanitary pads wrapped in paper with red mark for high-temp incinerator.',
  },
  {
    day: 'Wednesday',
    stream: 'Dry Recyclables',
    streamBadge: 'info',
    color: 'border-l-blue-500',
    time: '07:30 AM - 11:00 AM',
    desc: 'Cardboard boxes, PET bottles, glass containers, clean tin cans.',
  },
  {
    day: 'Thursday',
    stream: 'Wet Organic Waste',
    streamBadge: 'success',
    color: 'border-l-emerald-500',
    time: '07:30 AM - 10:30 AM',
    desc: 'Mid-week bio-waste collection for biogas digestion pit.',
  },
  {
    day: 'Friday',
    stream: 'Multilayer Plastics (MLP)',
    streamBadge: 'primary',
    color: 'border-l-[#1a5c38]',
    time: '07:30 AM - 12:00 PM',
    desc: 'Snack packaging, Kurkure wrappers, biscuit pouches, shampoo sachets, metallized films.',
  },
  {
    day: 'Saturday',
    stream: 'Hazardous & E-Waste',
    streamBadge: 'destructive',
    color: 'border-l-red-500',
    time: '09:00 AM - 01:00 PM',
    desc: 'Tube lights, pesticide bottles, paint cans, old cell phone batteries.',
  },
];

export default function CitizenSchedulePage() {
  return (
    <AppLayout
      headerProps={{
        title: 'Weekly Collection Schedule',
        subtitle: 'Shanti Nagar Gram Panchayat • Ward 1 to 4 Door-to-Door Timetable',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#1a5c38]" />
            <div>
              <p className="font-bold text-gray-900">Tata Ace Vehicle Sector 3 on Duty</p>
              <p className="text-gray-600">Bell rings 5 minutes prior to vehicle entering lane.</p>
            </div>
          </div>
          <Badge variant="primary">Regular Schedule</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduleDays.map((item) => (
            <Card key={item.day} className={`border-l-4 ${item.color} bg-white shadow-sm`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{item.day}</span>
                  <Badge variant={item.streamBadge as any}>{item.stream}</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
