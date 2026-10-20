// apps/mobile/src/components/map/OSMWebViewCollectionPoints.tsx
// Pure React Native OpenStreetMap tile renderer for collection points with fill level heatmaps.
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
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

export interface CollectionPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  fillPercent: number;
  wasteStreams: string[];
  isActive: boolean;
}

interface OSMWebViewCollectionPointsProps {
  points: CollectionPoint[];
  height?: number;
  onSelectPoint?: (id: string) => void;
}

function getFillColor(pct: number) {
  if (pct >= 90) return '#ef4444'; // Red (Overflow / Urgent)
  if (pct >= 70) return '#f97316'; // Orange (High)
  if (pct >= 40) return '#eab308'; // Yellow (Medium)
  return '#22c55e'; // Green (Low)
}

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

export default function OSMWebViewCollectionPoints({
  points = [],
  height = 240,
  onSelectPoint,
}: OSMWebViewCollectionPointsProps) {
  const [dimensions, setDimensions] = useState({ width: 340, height });
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    if (width > 0 && h > 0) {
      setDimensions({ width, height: h });
    }
  };

  const { bounds, centerTile } = useMemo(() => {
    const pts = points.length > 0 ? points : [{ lat: 9.1726, lng: 77.605, fillPercent: 50, id: 'def', name: 'Center', wasteStreams: [], isActive: true }];

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

    const latSpan = Math.max(maxLat - minLat, 0.015);
    const lngSpan = Math.max(maxLng - minLng, 0.015);
    const margin = 0.3;

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

    return { bounds: b, centerTile: { ...tile, zoom } };
  }, [points]);

  const project = (lat: number, lng: number) => {
    const padding = 24;
    const w = dimensions.width - padding * 2;
    const h = dimensions.height - padding * 2;

    const x =
      padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * w;
    const y =
      padding + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * h;

    return {
      x: Math.max(16, Math.min(dimensions.width - 16, x)),
      y: Math.max(16, Math.min(dimensions.height - 16, y)),
    };
  };

  const handlePointPress = (p: CollectionPoint) => {
    setSelectedPoint(p);
    onSelectPoint?.(p.id);
  };

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      {/* OpenStreetMap Tile Background (3x3 grid) */}
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

      {/* SVG Marker Layer */}
      <Svg style={StyleSheet.absoluteFill}>
        {points.map((p) => {
          const pos = project(p.lat, p.lng);
          const color = getFillColor(p.fillPercent);
          const isSelected = selectedPoint?.id === p.id;

          return (
            <G key={p.id} onPress={() => handlePointPress(p)}>
              {/* Outer beacon */}
              <Circle cx={pos.x} cy={pos.y} r={isSelected ? 18 : 13} fill={color} opacity={0.3} />
              {/* Main marker circle */}
              <Circle cx={pos.x} cy={pos.y} r={9} fill="#ffffff" stroke={color} strokeWidth={2.5} />
              <Circle cx={pos.x} cy={pos.y} r={5.5} fill={color} />
            </G>
          );
        })}
      </Svg>

      {/* Top Header Overlay */}
      <View style={styles.topBadgeRow}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveDot}>●</Text>
          <Text style={styles.liveBadgeText}>OpenStreetMap • Live Bin Telemetry</Text>
        </View>
        <View style={styles.osmAttribution}>
          <Text style={styles.osmAttributionText}>© OpenStreetMap</Text>
        </View>
      </View>

      {/* Fill Level Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.legendText}>&lt;40%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
          <Text style={styles.legendText}>40-70%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
          <Text style={styles.legendText}>70-90%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>&gt;90% Urgent</Text>
        </View>
      </View>

      {/* Selected Point Popover */}
      {selectedPoint && (
        <View style={styles.popoverCard}>
          <View style={styles.popoverHeader}>
            <View
              style={[
                styles.popoverDot,
                { backgroundColor: getFillColor(selectedPoint.fillPercent) },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.popoverTitle}>{selectedPoint.name}</Text>
              <Text style={styles.popoverSub}>
                Fill: {selectedPoint.fillPercent}% • {selectedPoint.wasteStreams.join(', ')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedPoint(null)}>
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
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 61, 36, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    color: '#4ade80',
    fontSize: 10,
  },
  liveBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
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
  legendRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    zIndex: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#334155',
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
  popoverDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
