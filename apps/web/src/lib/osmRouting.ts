// apps/web/src/lib/osmRouting.ts
// OSRM (Open Source Routing Machine) routing utility for the Next.js web app.
// Uses the public OSRM demo server; swap OSRM_BASE for a self-hosted India instance if needed.

export interface LatLng {
  lat: number;
  lng: number;
}

export interface OSRMRouteResult {
  /** Total route distance in metres */
  distance: number;
  /** Total route duration in seconds */
  duration: number;
  /** Decoded GeoJSON polyline waypoints */
  geometry: LatLng[];
  legs: Array<{ distance: number; duration: number; summary: string }>;
}

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Fetch an OSRM driving route through the given waypoints.
 * Returns null on network failure or when OSRM cannot find a route.
 */
export async function fetchOSRMRoute(waypoints: LatLng[]): Promise<OSRMRouteResult | null> {
  if (waypoints.length < 2) return null;

  const coords = waypoints.map((p) => `${p.lng},${p.lat}`).join(';');
  const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.code !== 'Ok' || !data.routes?.[0]) return null;

    const route = data.routes[0];
    return {
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng })),
      legs: route.legs as Array<{ distance: number; duration: number; summary: string }>,
    };
  } catch {
    return null;
  }
}

/** Format metres → human-readable string */
export function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

/** Format seconds → human-readable string */
export function formatDuration(s: number): string {
  const mins = Math.round(s / 60);
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}min`;
}
