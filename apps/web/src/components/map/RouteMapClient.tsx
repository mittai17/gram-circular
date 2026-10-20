'use client';
// apps/web/src/components/map/RouteMapClient.tsx
// Leaflet-based route map with OSRM routing polyline.
// MUST be loaded via next/dynamic with ssr: false — see RouteMap.tsx.

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOSRMRoute, formatDistance, formatDuration, LatLng } from '@/lib/osmRouting';

// Fix Leaflet default icon path resolution when bundled by webpack/Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f97316',
  COMPLETED: '#22c55e',
  SKIPPED: '#9ca3af',
  CURRENT: '#1a5c38',
};

export interface RouteStop {
  id: string;
  name: string;
  coordinate: LatLng;
  status: string;
  sequence: number;
  fillPercent?: number;
}

function createColoredIcon(color: string) {
  return L.divIcon({
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 1) {
      map.fitBounds(coords, { padding: [40, 40] });
    }
  // Run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

interface RouteMapClientProps {
  stops: RouteStop[];
  depot?: LatLng;
  showRouting?: boolean;
  height?: number;
}

export default function RouteMapClient({
  stops,
  depot,
  showRouting = true,
  height = 400,
}: RouteMapClientProps) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const allPoints: LatLng[] = depot
    ? [depot, ...stops.map((s) => s.coordinate)]
    : stops.map((s) => s.coordinate);

  useEffect(() => {
    if (!showRouting || allPoints.length < 2) return;

    setLoading(true);
    fetchOSRMRoute(allPoints).then((r) => {
      if (r) {
        setRouteCoords(r.geometry.map((p) => [p.lat, p.lng]));
        setRouteInfo({
          distance: formatDistance(r.distance),
          duration: formatDuration(r.duration),
        });
      }
      setLoading(false);
    });
  // Run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const center: [number, number] = allPoints[0]
    ? [allPoints[0].lat, allPoints[0].lng]
    : [11.1271, 78.6569];
  const allCoords: [number, number][] = allPoints.map((p) => [p.lat, p.lng]);

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-gray-200"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FitBounds coords={allCoords} />

        {/* OSRM route polyline */}
        {routeCoords.length > 1 && (
          <Polyline
            positions={routeCoords}
            color="#1a5c38"
            weight={4}
            opacity={0.9}
          />
        )}

        {/* Depot / MRF marker */}
        {depot && (
          <Marker
            position={[depot.lat, depot.lng]}
            icon={createColoredIcon('#1a5c38')}
          >
            <Popup>
              <strong>Depot / MRF</strong>
            </Popup>
          </Marker>
        )}

        {/* Collection stop markers */}
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.coordinate.lat, stop.coordinate.lng]}
            icon={createColoredIcon(STATUS_COLORS[stop.status] ?? '#f97316')}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-gray-900">
                  {stop.sequence}. {stop.name}
                </p>
                <p className="text-gray-500 capitalize">
                  {stop.status.toLowerCase()}
                </p>
                {stop.fillPercent !== undefined && (
                  <p className="text-orange-500">Fill: {stop.fillPercent}%</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Route info badge */}
      {routeInfo && (
        <div className="absolute bottom-3 left-3 z-[999] bg-white/95 backdrop-blur rounded-lg px-3 py-2 shadow-md text-xs font-semibold text-[#1a5c38]">
          🛣 {routeInfo.distance}&nbsp;&nbsp;⏱ {routeInfo.duration}
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="absolute top-3 left-3 z-[999] bg-white/95 rounded-lg px-3 py-2 text-xs text-[#1a5c38] flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-[#1a5c38] border-t-transparent rounded-full animate-spin" />
          Calculating OSRM route…
        </div>
      )}
    </div>
  );
}
