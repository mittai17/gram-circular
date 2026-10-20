// apps/web/src/components/map/RouteMap.tsx
// Dynamic wrapper for RouteMapClient — ensures Leaflet only loads client-side.
import dynamic from 'next/dynamic';
import type { RouteStop } from './RouteMapClient';
import type { LatLng } from '@/lib/osmRouting';

interface RouteMapProps {
  stops: RouteStop[];
  depot?: LatLng;
  showRouting?: boolean;
  height?: number;
}

export const RouteMap = dynamic<RouteMapProps>(
  () => import('./RouteMapClient'),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-gray-100 animate-pulse rounded-xl border border-gray-200 flex items-center justify-center"
        style={{ height: 400 }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="w-8 h-8 rounded-full border-2 border-[#1a5c38] border-t-transparent animate-spin" />
          <span className="text-xs font-medium">Loading route map…</span>
        </div>
      </div>
    ),
  }
);

export type { RouteStop };
