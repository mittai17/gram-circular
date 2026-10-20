// apps/mobile/src/lib/osmRouting.ts
// OSRM (Open Source Routing Machine) routing utility for mobile
// Uses the public OSRM demo server; swap OSRM_BASE for a self-hosted India instance if needed.

export interface LatLng {
  lat: number;
  lng: number;
}

export interface OSRMRoute {
  /** Total route distance in metres */
  distance: number;
  /** Total route duration in seconds */
  duration: number;
  /** Decoded GeoJSON polyline waypoints */
  geometry: LatLng[];
  legs: OSRMLeg[];
}

export interface OSRMLeg {
  distance: number;
  duration: number;
  summary: string;
  steps: OSRMStep[];
}

export interface OSRMStep {
  distance: number;
  duration: number;
  name: string;
  maneuver: {
    type: string;
    modifier?: string;
    /** [lng, lat] */
    location: [number, number];
  };
}

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Fetch an OSRM driving route through the given waypoints.
 * Returns null on network failure or when OSRM cannot find a route.
 */
export async function fetchOSRMRoute(waypoints: LatLng[]): Promise<OSRMRoute | null> {
  if (waypoints.length < 2) return null;

  const coords = waypoints.map((p) => `${p.lng},${p.lat}`).join(';');
  const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    const data = await res.json();

    if (data.code !== 'Ok' || !data.routes?.[0]) return null;

    const route = data.routes[0];
    const geometry: LatLng[] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({ lat, lng })
    );

    return {
      distance: route.distance,
      duration: route.duration,
      geometry,
      legs: route.legs as OSRMLeg[],
    };
  } catch {
    return null;
  }
}

/** Format metres → human-readable string */
export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}

/** Format seconds → human-readable string */
export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}min`;
}
