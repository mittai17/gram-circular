'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRoleStore, ROLE_LANDING_PAGES } from '@/stores/role-store';
import { DemoRole } from '@/types';
import {
  Shield,
  ArrowRight,
  Cpu,
  QrCode,
  Route,
  Scale,
  Building2,
  Truck,
  Factory,
  Recycle,
  Users,
  CheckCircle2,
  Sparkles,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface RoleCardData {
  id: DemoRole;
  emoji: string;
  title: string;
  persona: string;
  targetHref: string;
  badge: string;
  description: string;
  highlights: string[];
  colorTheme: {
    badgeBg: string;
    badgeText: string;
    borderHover: string;
    accentBg: string;
    btnBg: string;
  };
}

const ROLE_CARDS: RoleCardData[] = [
  {
    id: 'admin',
    emoji: '🏛️',
    title: 'Admin / Panchayat',
    persona: 'Block Development Officer & Panchayat Secretary',
    targetHref: '/admin/dashboard',
    badge: 'Executive Oversight',
    description:
      'High-level governance dashboard tracking district-wide waste metrics, live IoT bin telemetry, route efficiency, multi-village pooling, and CPCB mass-balance auditing.',
    highlights: [
      'Overview KPI Dashboard & stream distribution',
      'Interactive GIS map with live bin fill telemetry',
      'OR-Tools CVRP route & waste pooling optimizer',
      'CPCB EPR mass-balance ledger & anomaly audit',
    ],
    colorTheme: {
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-[#0f3d24]',
      borderHover: 'hover:border-[#1a5c38]',
      accentBg: 'bg-emerald-50/70',
      btnBg: 'bg-[#1a5c38] hover:bg-[#0f3d24]',
    },
  },
  {
    id: 'worker',
    emoji: '🚛',
    title: 'Collection Worker',
    persona: 'Sanitation Worker & Vehicle Driver (Field Staff)',
    targetHref: '/worker/dashboard',
    badge: 'Field IoT & Weighing',
    description:
      'Mobile-first operations console for daily collection rounds, digital weighing with ESP32 stability check, 4-stream segregation, photo tagging, and instant QR generation.',
    highlights: [
      'Daily sequenced route stops & GPS turn guidance',
      'Smart Weighing Station with ESP32 HX711 lock',
      '4-Stream segregation (Wet, Dry, Sanitary, MLP)',
      'Digital batch QR generator & offline sync outbox',
    ],
    colorTheme: {
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-900',
      borderHover: 'hover:border-blue-600',
      accentBg: 'bg-blue-50/70',
      btnBg: 'bg-blue-700 hover:bg-blue-800',
    },
  },
  {
    id: 'mrf',
    emoji: '🏭',
    title: 'MRF / PWMU Operator',
    persona: 'Facility Manager & Quality Inspector',
    targetHref: '/mrf/dashboard',
    badge: 'Sorting & Baling',
    description:
      'Central Material Recovery Facility hub for checking in incoming village batches, grading contamination and moisture levels, zone binning, and baling for recycler dispatch.',
    highlights: [
      'Inbound QR check-in & origin verification',
      'Visual moisture & contamination grading (A/B/C)',
      'Storage zone capacity monitoring (Zones A, B, C)',
      'Consignment creation & processor dispatch dispatching',
    ],
    colorTheme: {
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      borderHover: 'hover:border-amber-600',
      accentBg: 'bg-amber-50/70',
      btnBg: 'bg-amber-700 hover:bg-amber-800',
    },
  },
  {
    id: 'buyer',
    emoji: '♻️',
    title: 'Buyer / Authorized Recycler',
    persona: 'Industrial Recycler & Cement Co-Processor',
    targetHref: '/buyer/dashboard',
    badge: 'Circular Procurement',
    description:
      'Marketplace interface for browsing certified rural MLP baled stock, inspecting origin-to-gate traceability passports, scheduling logistics, and confirming weighbridge receipts.',
    highlights: [
      'Available baled MLP catalog with moisture grades',
      'Complete end-to-end provenance timeline',
      'Pickup truck scheduling & dispatch tracking',
      'Weighbridge discrepancy audit & digital receipts',
    ],
    colorTheme: {
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-900',
      borderHover: 'hover:border-purple-600',
      accentBg: 'bg-purple-50/70',
      btnBg: 'bg-purple-700 hover:bg-purple-800',
    },
  },
  {
    id: 'citizen',
    emoji: '🌿',
    title: 'Village Citizen',
    persona: 'Rural Resident & Community Champion',
    targetHref: '/citizen/home',
    badge: 'Citizen Engagement',
    description:
      'Hyper-local citizen portal providing transparent collection schedules, instant full-bin reporting with photo uploads, bilingual segregation tutorials, and Swachh reward points.',
    highlights: [
      'Live village collection timetable & next arrival',
      'One-tap overflowing bin reporting with photos',
      'Bilingual segregation guide (English & தமிழ்)',
      'Swachh Points wallet (125 pts) & village leaderboard',
    ],
    colorTheme: {
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-900',
      borderHover: 'hover:border-teal-600',
      accentBg: 'bg-teal-50/70',
      btnBg: 'bg-teal-700 hover:bg-teal-800',
    },
  },
];

const INNOVATIONS = [
  {
    icon: Scale,
    title: 'Smart ESP32 Weighing Node',
    badge: 'Hardware Node',
    description:
      'HX711 24-bit ADC with automated digital tare, dynamic anti-jitter weight stabilization, and real-time Bluetooth BLE / Wi-Fi telemetry to the cloud backend.',
  },
  {
    icon: QrCode,
    title: 'MLP Digital Product Passport',
    badge: 'End-to-End Audit',
    description:
      'Every collection bag generates an immutable cryptographic batch token containing village origin, GPS coordinates, tare-verified weight, and photo proof.',
  },
  {
    icon: Route,
    title: 'Google OR-Tools CVRP Pooling',
    badge: 'Logistics AI',
    description:
      'Capacitated Vehicle Routing Problem (CVRP) solver reducing rural collection mileage by 36% through intelligent multi-village waste aggregation.',
  },
  {
    icon: BarChart3,
    title: 'Closed-Loop Mass-Balance Ledger',
    badge: 'CPCB EPR Compliance',
    description:
      'Continuous mass reconciliation tracing village pickup weights through MRF sorting and shredding to recycler weighbridge receipts, flagging shrinkage >5%.',
  },
];

export default function RootHomePage() {
  const router = useRouter();
  const { setRole } = useRoleStore();

  const handleSelectRole = (role: DemoRole, targetHref: string) => {
    setRole(role);
    router.push(targetHref);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col text-gray-900 selection:bg-emerald-200">
      {/* Top Government & SIH Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-md ring-2 ring-emerald-500/20 overflow-hidden p-0.5 shrink-0">
              <Image
                src="/logo.png"
                width={44}
                height={44}
                alt="GRAM-CIRCULAR"
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#0f3d24] tracking-tight uppercase">
                  GRAM-CIRCULAR
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0f3d24] border border-emerald-300/60">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Clean Villages · Circular India · Rural MLP Value Chain
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Problem Statement ID: 26259</span>
            </div>
            <button
              onClick={() => handleSelectRole('admin', '/admin/dashboard')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a5c38] hover:bg-[#0f3d24] text-white text-xs font-bold transition-all shadow hover:shadow-md cursor-pointer"
            >
              <span>Launch Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-emerald-50/30 to-[#f8faf9] border-b border-gray-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-md opacity-20 group-hover:opacity-35 transition duration-300" />
              <div className="relative bg-white p-3 rounded-full shadow-lg border border-emerald-100 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  width={112}
                  height={112}
                  alt="GRAM-CIRCULAR Official Emblem"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain hover:scale-105 transition-transform"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#0f3d24] text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Smart India Hackathon 2026 — Ministry Evaluation Prototype
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            End-to-End Rural Waste Management & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a5c38] via-[#2d8653] to-[#4caf50]">
              Multilayer Plastic (MLP) Circularity
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bridging rural Gram Panchayats with industrial recyclers. Featuring IoT smart digital
            scales, automated 4-stream segregation, verifiable QR batch passports, OR-Tools route
            optimization, and CPCB EPR mass-balance reconciliation.
          </p>

          {/* Interactive Role Selector Notice */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs text-[#0f3d24] font-medium shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>Evaluation Mode:</strong> Select any of the 5 stakeholder personas below to
                experience their customized, live operational interface.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Interactive Role Cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Select Stakeholder Persona</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Every role reflects a distinct tier in the rural waste value chain
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              5 Dedicated Portals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROLE_CARDS.map((role) => (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role.id, role.targetHref)}
                className={`group relative bg-white rounded-2xl border border-gray-200/90 p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer ${role.colorTheme.borderHover}`}
              >
                <div>
                  {/* Top Bar with Emoji & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-3xl p-2 rounded-xl bg-gray-50 border border-gray-100 group-hover:scale-110 transition-transform">
                      {role.emoji}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${role.colorTheme.badgeBg} ${role.colorTheme.badgeText}`}
                    >
                      {role.badge}
                    </span>
                  </div>

                  {/* Title & Persona */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1a5c38] transition-colors flex items-center justify-between">
                    <span>{role.title}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#1a5c38] group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
                    {role.persona}
                  </p>

                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Highlight checklist */}
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                    {role.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${role.colorTheme.btnBg}`}
                  >
                    <span>Enter {role.title.split('/')[0].trim()} Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Quick Demo Help & Architecture Overview Card */}
            <div className="bg-gradient-to-br from-[#0f3d24] to-[#1a5c38] text-white rounded-2xl p-6 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluation Quick Guide</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Full Value Chain Demo Flow</h3>
                <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
                  To experience the complete circular lifecycle from source to recycling:
                </p>
                <ol className="mt-4 space-y-2 text-xs text-emerald-50">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 font-bold text-[10px] flex items-center justify-center">1</span>
                    <span><strong>Worker:</strong> Weigh batch on digital scale & generate QR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 font-bold text-[10px] flex items-center justify-center">2</span>
                    <span><strong>MRF:</strong> Inspect batch, grade quality, allocate to Zone A</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 font-bold text-[10px] flex items-center justify-center">3</span>
                    <span><strong>Buyer:</strong> Browse certified stock & issue pickup order</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 font-bold text-[10px] flex items-center justify-center">4</span>
                    <span><strong>Admin:</strong> Audit EPR ledger & check mass reconciliation</span>
                  </li>
                </ol>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-800/60">
                <button
                  type="button"
                  onClick={() => handleSelectRole('worker', '/worker/weighing')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-[#0f3d24] text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Scale className="w-4 h-4 text-[#1a5c38]" />
                  <span>Start with Worker Weighing Node</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Innovation Highlights Grid */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Core Technical Architecture
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              SIH 2026 Core Innovations
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Engineering breakthroughs delivering traceability, operational efficiency, and financial circularity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {INNOVATIONS.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1a5c38] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {tech.badge}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{tech.title}</h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              width={24}
              height={24}
              alt="GRAM-CIRCULAR"
              className="w-6 h-6 object-contain"
            />
            <span>
              <strong>GRAM-CIRCULAR</strong> — Rural Multilayer Plastic (MLP) Waste Value Chain
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <span>SIH 2026 Problem ID: 26259</span>
            <span>•</span>
            <span>Swachh Bharat Mission (Grameen)</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Ready for Evaluation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
