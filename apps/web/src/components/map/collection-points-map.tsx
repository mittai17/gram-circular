'use client';

import * as React from 'react';
import { CollectionPoint } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CollectionPointsMapProps {
  points: CollectionPoint[];
  selectedPointId?: string;
  onSelectPoint?: (point: CollectionPoint) => void;
  showRoute?: boolean;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

// Fix Leaflet's default icon URLs if fallback markers are used
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ------------------------------------------------------------------
// Fetch real road geometry from OSRM public routing API
// Calls the OSRM Demo Server with the driving profile.
// Returns an array of [lat, lng] tuples representing the road path.
// ------------------------------------------------------------------
async function fetchOsrmRoute(
  waypoints: [number, number][]
): Promise<[number, number][]> {
  if (waypoints.length < 2) return waypoints;

  // OSRM expects coordinates as "lng,lat" pairs separated by semicolons
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const baseUrl = process.env.NEXT_PUBLIC_OSRM_ROUTING_URL || 'https://router.project-osrm.org';
  const url =
    `${baseUrl}/route/v1/driving/${coords}` +
    `?overview=full&geometries=geojson&steps=false`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No route');

    // GeoJSON geometry coordinates are [lng, lat] — flip to [lat, lng] for Leaflet
    const geoCoords: [number, number][] = data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
    );
    return geoCoords;
  } catch (err) {
    console.warn('OSRM route fetch failed, falling back to straight lines', err);
    return waypoints; // straight-line fallback
  }
}

// Draw arrowheads along a polyline to indicate travel direction
function addArrowDecorations(
  map: L.Map,
  latlngs: [number, number][],
  color: string
): L.Marker[] {
  const arrows: L.Marker[] = [];
  const step = Math.max(1, Math.floor(latlngs.length / 5)); // ~5 arrows per route

  for (let i = step; i < latlngs.length - 1; i += step) {
    const [lat1, lng1] = latlngs[i - 1];
    const [lat2, lng2] = latlngs[i];

    // Calculate bearing angle for arrow rotation
    const dLng = lng2 - lng1;
    const dLat = lat2 - lat1;
    const angleDeg = (Math.atan2(dLng, dLat) * 180) / Math.PI;

    const arrowIcon = L.divIcon({
      className: '',
      html: `<div style="
        width: 0; height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 13px solid ${color};
        transform: rotate(${angleDeg}deg);
        opacity: 0.9;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
      "></div>`,
      iconSize: [12, 13],
      iconAnchor: [6, 6],
    });

    const arrowMarker = L.marker([lat2, lng2], {
      icon: arrowIcon,
      interactive: false,
      zIndexOffset: -100,
    }).addTo(map);

    arrows.push(arrowMarker);
  }

  return arrows;
}

export default function CollectionPointsMap({
  points,
  selectedPointId,
  onSelectPoint,
  showRoute = false,
  center = [13.1438, 79.9132],
  zoom = 13,
  className = 'h-full min-h-[500px] w-full rounded-xl overflow-hidden',
}: CollectionPointsMapProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<L.Map | null>(null);
  const markersRef = React.useRef<L.Marker[]>([]);
  const routeLayersRef = React.useRef<(L.Polyline | L.Marker)[]>([]);
  const [routeLoading, setRouteLoading] = React.useState(false);

  // ---------------------------------------------------------------
  // Initialise map (run once)
  // ---------------------------------------------------------------
  React.useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    // Standard OpenStreetMap layer (or custom tile server)
    const tileUrl =
      process.env.NEXT_PUBLIC_OSM_TILE_URL ||
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19,
      crossOrigin: true,
    });

    // Fallback CartoDB Voyager
    const cartoLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
        crossOrigin: true,
      }
    );

    osmLayer.addTo(map);
    osmLayer.on('tileerror', () => {
      if (!map.hasLayer(cartoLayer)) cartoLayer.addTo(map);
    });

    mapInstanceRef.current = map;

    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 300);
    setTimeout(() => map.invalidateSize(), 800);

    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------
  // Update markers & route when `points` / `showRoute` change
  // ---------------------------------------------------------------
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.invalidateSize();

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Clear old route layers (polylines + arrow markers)
    routeLayersRef.current.forEach((l) => l.remove());
    routeLayersRef.current = [];

    const routeWaypoints: [number, number][] = [];

    // ---- Add numbered stop markers ----
    points.forEach((point, idx) => {
      const isSelected = point.id === selectedPointId;
      routeWaypoints.push([point.lat, point.lng]);

      const getBgColor = () => {
        if (point.status === 'Maintenance') return '#64748b';
        if (point.fillLevel >= 90 || point.status === 'Full') return '#ef4444';
        if (point.fillLevel >= 50 || point.status === 'Partial') return '#f59e0b';
        return '#1a5c38';
      };

      const bg = getBgColor();
      const size = isSelected ? 40 : 32;

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${bg};
            color: white;
            width: ${size}px;
            height: ${size}px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? 13 : 11}px;
            font-weight: 800;
            border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            cursor: pointer;
            position: relative;
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => onSelectPoint?.(point));

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px; min-width: 160px;">
          <strong style="color: #0f3d24; font-size: 13px;">${point.code} – ${point.name}</strong><br/>
          <span style="color: #666;">Village: ${point.village}</span><br/>
          <div style="margin-top: 6px; background:#f1f5f9; border-radius:6px; padding:4px 6px;">
            <span>Fill: <b>${point.fillLevel}%</b></span> &nbsp;|&nbsp;
            <span>Total: <b>${point.weight} kg</b></span>
          </div>
          <div style="margin-top: 4px; color: #1a5c38; font-weight: 600;">
            MLP: ${point.mlpWeight} kg
          </div>
        </div>
      `);

      markersRef.current.push(marker);
    });

    // ---- Draw real-road route ----
    if (showRoute && routeWaypoints.length > 1) {
      const routeColor = '#1a5c38';
      const outlineColor = '#ffffff';

      setRouteLoading(true);

      fetchOsrmRoute(routeWaypoints).then((roadCoords) => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // White outline/shadow polyline underneath for contrast
        const outlineLine = L.polyline(roadCoords, {
          color: outlineColor,
          weight: 9,
          opacity: 0.6,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // Main green route polyline on top
        const routeLine = L.polyline(roadCoords, {
          color: routeColor,
          weight: 6,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        routeLayersRef.current.push(outlineLine, routeLine);

        // Draw directional arrows along the route
        const arrows = addArrowDecorations(map, roadCoords, routeColor);
        routeLayersRef.current.push(...arrows);

        setRouteLoading(false);
      });
    }

    // Auto-focus selected point
    if (selectedPointId) {
      const sel = points.find((p) => p.id === selectedPointId);
      if (sel) {
        map.setView([sel.lat, sel.lng], Math.max(map.getZoom(), 14), { animate: true });
      }
    }
  }, [points, selectedPointId, onSelectPoint, showRoute]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div
        ref={mapContainerRef}
        className={className}
        style={{ minHeight: '500px', height: '100%', width: '100%', zIndex: 1 }}
      />
      {/* Loading indicator while OSRM route is being fetched */}
      {routeLoading && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 10,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            color: '#1a5c38',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            border: '1px solid #d1fae5',
          }}
        >
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#1a5c38', animation: 'pulse 1s infinite' }} />
          Computing road route…
        </div>
      )}
    </div>
  );
}
