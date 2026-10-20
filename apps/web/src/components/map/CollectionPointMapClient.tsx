'use client';
// apps/web/src/components/map/CollectionPointMapClient.tsx
// Leaflet map showing collection points as fill-level colour-coded circle markers.
// MUST be loaded via next/dynamic with ssr: false — see CollectionPointMap.tsx.

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface CollectionPointMapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  fillPercent: number;
  stream: string;
  isActive: boolean;
}

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [40, 40] });
    }
  // Run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function fillColor(pct: number): string {
  if (pct >= 90) return '#ef4444';
  if (pct >= 70) return '#f97316';
  if (pct >= 40) return '#eab308';
  return '#22c55e';
}

interface Props {
  points: CollectionPointMapPoint[];
  height?: number;
}

export default function CollectionPointMapClient({ points, height = 350 }: Props) {
  const center: [number, number] = points[0]
    ? [points[0].lat, points[0].lng]
    : [11.12, 78.65];

  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FitBounds coords={points.map((p) => [p.lat, p.lng])} />

        {points.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={12}
            pathOptions={{
              color: 'white',
              fillColor: fillColor(p.fillPercent),
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Tooltip>
              <span className="font-semibold">{p.name}</span>
              <br />
              Fill: {p.fillPercent}% &bull; {p.stream}
              <br />
              {p.isActive ? '● Active' : '○ Inactive'}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
