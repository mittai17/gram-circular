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
  const polylineRef = React.useRef<L.Polyline | null>(null);
  const [activeTileLayer, setActiveTileLayer] = React.useState<'osm' | 'carto'>('osm');

  React.useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true,
      });

      // Standard Official OpenStreetMap Layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        crossOrigin: true,
      });

      // Fallback CartoDB Voyager Layer
      const cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
        crossOrigin: true,
      });

      // Add default tile layer
      osmLayer.addTo(map);

      // Add layer error fallback
      osmLayer.on('tileerror', () => {
        console.warn('OpenStreetMap tile error, falling back to Carto Voyager');
        if (!map.hasLayer(cartoLayer)) {
          cartoLayer.addTo(map);
        }
      });

      mapInstanceRef.current = map;

      // Invalidate size across multiple render frames to guarantee tiles populate
      setTimeout(() => map.invalidateSize(), 100);
      setTimeout(() => map.invalidateSize(), 300);
      setTimeout(() => map.invalidateSize(), 800);

      const handleResize = () => map.invalidateSize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    const map = mapInstanceRef.current;
    if (map) {
      map.invalidateSize();
    }

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const routeCoords: [number, number][] = [];

    // Add markers for points
    points.forEach((point) => {
      const isSelected = point.id === selectedPointId;
      routeCoords.push([point.lat, point.lng]);

      const getBgColor = () => {
        if (point.status === 'Maintenance') return '#64748b';
        if (point.fillLevel >= 90 || point.status === 'Full') return '#ef4444';
        if (point.fillLevel >= 50 || point.status === 'Partial') return '#f59e0b';
        return '#1a5c38';
      };

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${getBgColor()};
            color: white;
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${point.code.replace('CP-', '')}
          </div>
        `,
        iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 18 : 15],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectPoint?.(point);
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px; min-width: 140px;">
          <strong style="color: #0f3d24; font-size: 13px;">${point.code} - ${point.name}</strong><br/>
          <span style="color: #666;">Village: ${point.village}</span><br/>
          <div style="margin-top: 4px; display: flex; justify-content: space-between;">
            <span>Fill: <b>${point.fillLevel}%</b></span>
            <span>Total: <b>${point.weight} kg</b></span>
          </div>
          <div style="margin-top: 2px; color: #1a5c38; font-weight: 600;">
            MLP: ${point.mlpWeight} kg
          </div>
        </div>
      `);

      markersRef.current.push(marker);
    });

    // Draw route if requested
    if (showRoute && routeCoords.length > 1) {
      polylineRef.current = L.polyline(routeCoords, {
        color: '#1a5c38',
        weight: 3.5,
        opacity: 0.8,
        dashArray: '6, 8',
      }).addTo(map);
    }

    // Auto-focus selected point if present
    if (selectedPointId) {
      const selected = points.find((p) => p.id === selectedPointId);
      if (selected) {
        map.setView([selected.lat, selected.lng], Math.max(map.getZoom(), 14), {
          animate: true,
        });
      }
    }
  }, [points, selectedPointId, onSelectPoint, showRoute, center, zoom]);

  React.useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div
        ref={mapContainerRef}
        className={className}
        style={{ minHeight: '500px', height: '100%', width: '100%', zIndex: 1 }}
      />
    </div>
  );
}
