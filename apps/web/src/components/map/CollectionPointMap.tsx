// apps/web/src/components/map/CollectionPointMap.tsx
// Dynamic wrapper for CollectionPointMapClient — ensures Leaflet only loads client-side.
import dynamic from 'next/dynamic';
import type { CollectionPointMapPoint } from './CollectionPointMapClient';

interface CollectionPointMapProps {
  points: CollectionPointMapPoint[];
  height?: number;
}

export const CollectionPointMap = dynamic<CollectionPointMapProps>(
  () => import('./CollectionPointMapClient'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 animate-pulse rounded-xl h-80 border border-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="w-8 h-8 rounded-full border-2 border-[#1a5c38] border-t-transparent animate-spin" />
          <span className="text-xs font-medium">Loading collection point map…</span>
        </div>
      </div>
    ),
  }
);

export type { CollectionPointMapPoint };
