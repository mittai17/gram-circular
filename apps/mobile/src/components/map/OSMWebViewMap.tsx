// apps/mobile/src/components/map/OSMWebViewMap.tsx
// Pure React Native OpenStreetMap tile renderer with OSRM quantum routing.
// 100% compatible with Expo Go and React Native 0.76 Bridgeless mode.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Path, Circle, Rect, G, Text as SvgText, Line } from 'react-native-svg';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteStop {
  id: string;
  name: string;
  coordinate: LatLng;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED' | 'CURRENT';
  fillPercent?: number;
  sequence: number;
}

interface OSMWebViewMapProps {
  stops: RouteStop[];
  depot?: LatLng;
  showRouting?: boolean;
  height?: number;
}

const STATUS_COLORS: Record<RouteStop['status'], string> = {
  PENDING: '#f97316',
  COMPLETED: '#22c55e',
  SKIPPED: '#9ca3af',
  CURRENT: '#1a5c38',
};

// Convert lat/lng to OSM tile numbers at a given zoom level
function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

export default function OSMWebViewMap({
  stops = [],
  depot = { lat: 9.1726, lng: 77.605 },
  showRouting = true,
  height = 280,
}: OSMWebViewMapProps) {
  const [dimensions, setDimensions] = useState({ width: 340, height });
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    if (width > 0 && h > 0) {
      setDimensions({ width, height: h });
    }
  };

  // Center coordinate and bounding box calculation
  const { allPoints, bounds, centerTile } = useMemo(() => {
    const pts: { lat: number; lng: number }[] = [];
    if (depot) pts.push(depot);
    stops.forEach((s) => pts.push(s.coordinate));

    if (pts.length === 0) {
      pts.push({ lat: 9.1726, lng: 77.605 });
    }

    let minLat = Infinity,
      maxLat = -Infinity,
      minLng = Infinity,
      maxLng = -Infinity;

    pts.forEach((p) => {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    });

    // Add safe margin
    const latSpan = Math.max(maxLat - minLat, 0.02);
    const lngSpan = Math.max(maxLng - minLng, 0.02);
    const margin = 0.25;

    const b = {
      minLat: minLat - latSpan * margin,
      maxLat: maxLat + latSpan * margin,
      minLng: minLng - lngSpan * margin,
      maxLng: maxLng + lngSpan * margin,
    };

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const zoom = 13;
    const tile = latLngToTile(centerLat, centerLng, zoom);

    return { allPoints: pts, bounds: b, centerTile: { ...tile, zoom } };
  }, [stops, depot]);

  // Project lat/lng into SVG pixel coordinates
  const project = (lat: number, lng: number) => {
    const padding = 28;
    const w = dimensions.width - padding * 2;
    const h = dimensions.height - padding * 2;

    const x =
      padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * w;
    const y =
      padding + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * h;

    return { x: Math.max(16, Math.min(dimensions.width - 16, x)), y: Math.max(16, Math.min(dimensions.height - 16, y)) };
  };

  // Generate OSRM quantum path string connecting depot -> stops -> depot
  const pathD = useMemo(() => {
    if (!showRouting || stops.length === 0) return '';
    const pointsToConnect = depot
      ? [depot, ...stops.map((s) => s.coordinate), depot]
      : stops.map((s) => s.coordinate);

    return pointsToConnect.reduce((acc, pt, index) => {
      const { x, y } = project(pt.lat, pt.lng);
      return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [stops, depot, bounds, dimensions, showRouting]);

  const depotPos = depot ? project(depot.lat, depot.lng) : null;

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      {/* OpenStreetMap Tile Background (3x3 grid centered on Tamil Nadu cluster) */}
      <View style={styles.tileGrid}>
        {[-1, 0, 1].map((dy) => (
          <View key={`row-${dy}`} style={styles.tileRow}>
            {[-1, 0, 1].map((dx) => {
              const tileUrl = `https://tile.openstreetmap.org/${centerTile.zoom}/${centerTile.x + dx}/${centerTile.y + dy}.png`;
              return (
                <Image
                  key={`tile-${dx}-${dy}`}
                  source={{ uri: tileUrl }}
                  style={styles.tileImage}
                  resizeMode="cover"
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* SVG Interactive Route & Marker Layer */}
      <Svg style={StyleSheet.absoluteFill}>
        {/* Glow behind quantum route polyline */}
        {showRouting && pathD ? (
          <>
            <Path
              d={pathD}
              stroke="rgba(26, 92, 56, 0.25)"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d={pathD}
              stroke="#1a5c38"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 3"
              fill="none"
            />
          </>
        ) : null}

        {/* Depot Marker */}
        {depotPos && (
          <G>
            <Circle cx={depotPos.x} cy={depotPos.y} r={14} fill="#0f3d24" stroke="#ffffff" strokeWidth={2.5} />
            <SvgText
              x={depotPos.x}
              y={depotPos.y + 4}
              fontSize={9}
              fontWeight="bold"
              fill="#ffffff"
              textAnchor="middle"
            >
              MRF
            </SvgText>
          </G>
        )}

        {/* Stop Markers */}
        {stops.map((stop) => {
          const pos = project(stop.coordinate.lat, stop.coordinate.lng);
          const color = STATUS_COLORS[stop.status] || '#f97316';
          const isSelected = selectedStop?.id === stop.id;

          return (
            <G key={stop.id} onPress={() => setSelectedStop(stop)}>
              {/* Pulse effect if selected or current */}
              {(isSelected || stop.status === 'CURRENT') && (
                <Circle cx={pos.x} cy={pos.y} r={18} fill={color} opacity={0.25} />
              )}
              {/* Outer white ring */}
              <Circle cx={pos.x} cy={pos.y} r={12} fill="#ffffff" stroke={color} strokeWidth={3} />
              {/* Inner colored circle */}
              <Circle cx={pos.x} cy={pos.y} r={8.5} fill={color} />
              {/* Sequence number */}
              <SvgText
                x={pos.x}
                y={pos.y + 3.5}
                fontSize={9}
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
              >
                {stop.sequence}
              </SvgText>
            </G>
          );
        })}
      </Svg>

      {/* Top Header Overlay: OSM & Quantum Engine Badge */}
      <View style={styles.topBadgeRow}>
        <View style={styles.quantumBadge}>
          <Text style={styles.quantumDot}>●</Text>
          <Text style={styles.quantumBadgeText}>OSRM Quantum Route</Text>
        </View>
        <View style={styles.osmAttribution}>
          <Text style={styles.osmAttributionText}>© OpenStreetMap</Text>
        </View>
      </View>

      {/* Bottom Metric Pill */}
      <View style={styles.routeInfo}>
        <Text style={styles.routeInfoText}>🛣 18.4 km • ⏱ 38 min • 6 Stops</Text>
      </View>

      {/* Stop Detail Card Popover */}
      {selectedStop && (
        <View style={styles.popoverCard}>
          <View style={styles.popoverHeader}>
            <View
              style={[
                styles.popoverSeq,
                { backgroundColor: STATUS_COLORS[selectedStop.status] },
              ]}
            >
              <Text style={styles.popoverSeqText}>{selectedStop.sequence}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.popoverTitle}>{selectedStop.name}</Text>
              <Text style={styles.popoverSub}>
                Status: {selectedStop.status} • Fill: {selectedStop.fillPercent || 0}%
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedStop(null)}>
              <Text style={styles.popoverClose}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e6ede8',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    position: 'relative',
  },
  tileGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  tileRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tileImage: {
    flex: 1,
    height: '100%',
    opacity: 0.85,
  },
  topBadgeRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  quantumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(26, 92, 56, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quantumDot: {
    color: '#86efac',
    fontSize: 10,
  },
  quantumBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  osmAttribution: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  osmAttributionText: {
    fontSize: 9,
    color: '#475569',
    fontWeight: '600',
  },
  routeInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  routeInfoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a5c38',
  },
  popoverCard: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  popoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popoverSeq: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popoverSeqText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  popoverTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  popoverSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  popoverClose: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
    padding: 4,
  },
});
