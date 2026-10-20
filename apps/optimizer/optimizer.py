"""
GRAM-CIRCULAR Route and Multi-Village Pooling Optimization Engine

Core capabilities:
1. Capacitated Vehicle Routing Problem (CVRP) solver via Google OR-Tools
2. Rural road network distance estimation with circuity index disclaimer
3. Comparative baseline engine (Greedy Nearest Neighbor vs Guided Local Search)
4. Waste consolidation & multi-village pooling evaluator for EPR industrial dispatch
"""

from __future__ import annotations

import math
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field

# Constants for rural Indian logistics modeling
EARTH_RADIUS_KM = 6371.0
RURAL_CIRCUITY_FACTOR = 1.35  # Detour factor for winding village/panchayat roads
AVG_RURAL_SPEED_KMPH = 30.0   # Avg speed for light commercial vehicles / tractors
STOP_SERVICE_TIME_MIN = 12.0  # Loading, verification & weighing duration per stop
DIESEL_PRICE_PER_LITRE = 94.50  # INR / Litre (Tamil Nadu standard)
AVG_VEHICLE_EFFICIENCY_KMPL = 9.5  # km per litre diesel
MAINTENANCE_COST_PER_KM = 3.50  # INR wear and tear
CO2_KG_PER_LITRE_DIESEL = 2.68  # kg CO2 emitted per litre diesel
INFORMAL_SCRAP_RATE_PER_KG = 2.50  # Distress sale price without aggregation (INR/kg)


# -----------------------------------------------------------------------------
# Data Models for Route Optimization
# -----------------------------------------------------------------------------

class Location(BaseModel):
    id: str
    name: str
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)


class CollectionStop(Location):
    demandKg: float = Field(..., ge=0.0, description="Weight of waste to be collected in kilograms")
    priority: int = Field(1, ge=1, le=5, description="1 (routine) to 5 (critical/overflowing)")
    wasteStream: Optional[str] = "MLP"
    timeWindowMin: Optional[Tuple[int, int]] = None  # (start_min, end_min) from depot departure


class FleetVehicle(BaseModel):
    id: str
    registrationNumber: str
    capacityKg: float = Field(..., gt=0.0, description="Payload capacity in kilograms")
    type: Optional[str] = "MINI_TRUCK"
    costPerKm: Optional[float] = None
    maxStops: Optional[int] = None


class RouteOptimizationRequest(BaseModel):
    depot: Location
    stops: List[CollectionStop]
    vehicles: List[FleetVehicle]
    circuityFactor: Optional[float] = Field(
        RURAL_CIRCUITY_FACTOR,
        description="Multiplier for geodesic distance to account for winding rural roads (default 1.35x)"
    )
    maxSearchSeconds: Optional[int] = Field(3, ge=1, le=30)


class RouteLeg(BaseModel):
    stopId: str
    stopName: str
    latitude: float
    longitude: float
    sequence: int
    demandKg: float
    cumulativeLoadKg: float
    legDistanceKm: float
    cumulativeDistanceKm: float
    estimatedDurationMin: float


class VehicleRoute(BaseModel):
    vehicleId: str
    registrationNumber: str
    capacityKg: float
    totalLoadKg: float
    utilizationPercent: float
    totalDistanceKm: float
    totalDurationMin: float
    stopsCount: int
    legs: List[RouteLeg]


class RouteOptimizationResponse(BaseModel):
    status: str  # OPTIMAL | FEASIBLE | NO_SOLUTION
    solver: str
    totalStops: int
    assignedStopsCount: int
    unassignedStops: List[str]
    totalFleetCapacityKg: float
    totalCollectedKg: float
    fleetUtilizationPercent: float
    totalDistanceKm: float
    totalDurationMin: float
    routes: List[VehicleRoute]
    
    # Comparative Baseline Metrics
    baselineDistanceKm: float
    distanceSavedKm: float
    distanceSavedPercent: float
    fuelSavedLitres: float
    costSavingsINR: float
    co2SavedKg: float

    # Engineering Disclaimer
    disclaimer: str


# -----------------------------------------------------------------------------
# Data Models for Multi-Village Pooling Optimization
# -----------------------------------------------------------------------------

class VillageStock(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    mlpStockKg: float = Field(..., ge=0.0)
    dryStockKg: Optional[float] = 0.0
    storageCapacityKg: Optional[float] = 1000.0
    daysAccumulating: Optional[int] = 7


class ProcessorOption(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    minQuantityKg: float
    maxQuantityKg: float
    pricePerKg: float
    acceptedMaterials: List[str] = ["MLP", "RIGID_PLASTIC"]


class PoolingOptimizationRequest(BaseModel):
    villages: List[VillageStock]
    processors: List[ProcessorOption]
    mrfHub: Optional[Location] = None
    intraClusterCostPerKmKg: Optional[float] = 0.015  # INR per kg-km haulage


class VillageContribution(BaseModel):
    villageId: str
    villageName: str
    contributedKg: float
    distanceToHubKm: float
    shareOfNetRevenueINR: float


class PoolingOptimizationResponse(BaseModel):
    status: str
    totalPooledStockKg: float
    participatingVillagesCount: int
    selectedProcessor: Optional[ProcessorOption]
    hubLocation: Location
    
    # Standalone vs Pooled Financials
    standaloneRevenueINR: float  # Distress informal sales
    grossPooledRevenueINR: float # High-value recycler contract
    consolidationTransportCostINR: float
    netPooledRevenueINR: float
    netValueUnlockedINR: float
    valueUpliftPercent: float
    
    # Environmental impact
    divertedFromLandfillKg: float
    
    villageBreakdown: List[VillageContribution]
    recommendationSummary: str


# -----------------------------------------------------------------------------
# Distance & Geometry Helpers
# -----------------------------------------------------------------------------

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points on Earth in km."""
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_KM * c


def build_distance_matrix(locations: List[Location], circuity: float = RURAL_CIRCUITY_FACTOR) -> List[List[float]]:
    """
    Build symmetric distance matrix in kilometers scaled by rural road circuity.
    Index 0 is always the depot.
    """
    n = len(locations)
    matrix = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1, n):
            dist = haversine_km(
                locations[i].latitude, locations[i].longitude,
                locations[j].latitude, locations[j].longitude
            ) * circuity
            matrix[i][j] = round(dist, 2)
            matrix[j][i] = round(dist, 2)
    return matrix


# -----------------------------------------------------------------------------
# Comparative Baseline Solver: Greedy Nearest Neighbor Heuristic
# -----------------------------------------------------------------------------

def solve_greedy_baseline(
    depot: Location,
    stops: List[CollectionStop],
    vehicles: List[FleetVehicle],
    distance_matrix: List[List[float]]
) -> Tuple[float, Dict[str, Any]]:
    """
    Simulate standard heuristic dispatch: each vehicle greedily takes the
    closest unvisited stop until capacity is saturated, then returns to depot.
    """
    unvisited = set(range(1, len(stops) + 1))
    total_baseline_dist = 0.0
    vehicle_assignments: Dict[str, List[int]] = {}

    for v in vehicles:
        current_loc = 0
        current_load = 0.0
        route = [0]
        v_dist = 0.0

        while unvisited:
            best_next = None
            best_dist = float('inf')

            for candidate in unvisited:
                stop_demand = stops[candidate - 1].demandKg
                if current_load + stop_demand <= v.capacityKg:
                    d = distance_matrix[current_loc][candidate]
                    if d < best_dist:
                        best_dist = d
                        best_next = candidate

            if best_next is None:
                # Vehicle cannot take any more stops
                break

            unvisited.remove(best_next)
            current_load += stops[best_next - 1].demandKg
            v_dist += best_dist
            current_loc = best_next
            route.append(best_next)

        # Return to depot if visited any stop
        if len(route) > 1:
            return_dist = distance_matrix[current_loc][0]
            v_dist += return_dist
            route.append(0)
            total_baseline_dist += v_dist
            vehicle_assignments[v.id] = route

    # If any stops remain unserviced, append direct out-and-back distance
    for remaining in unvisited:
        direct_dist = 2 * distance_matrix[0][remaining]
        total_baseline_dist += direct_dist

    return round(total_baseline_dist, 2), vehicle_assignments


# -----------------------------------------------------------------------------
# Google OR-Tools CVRP Solver
# -----------------------------------------------------------------------------

def solve_ortools_vrp(request: RouteOptimizationRequest) -> RouteOptimizationResponse:
    """
    Solve the Capacitated Vehicle Routing Problem using Google OR-Tools pywrapcp.
    Includes capacity constraints, load scaling, and penalty drop for unfeasible nodes.
    """
    try:
        from ortools.constraint_solver import routing_enums_pb2
        from ortools.constraint_solver import pywrapcp
    except ImportError as e:
        raise RuntimeError("OR-Tools is not installed in the python environment.") from e

    locations: List[Location] = [request.depot] + request.stops
    circuity = request.circuityFactor or RURAL_CIRCUITY_FACTOR
    dist_matrix = build_distance_matrix(locations, circuity)

    num_locations = len(locations)
    num_vehicles = len(request.vehicles)

    # Baseline calculation for comparison
    baseline_dist_km, _ = solve_greedy_baseline(
        request.depot, request.stops, request.vehicles, dist_matrix
    )

    if num_locations <= 1 or num_vehicles == 0:
        return RouteOptimizationResponse(
            status="NO_STOPS_OR_FLEET",
            solver="OR-Tools pywrapcp",
            totalStops=0,
            assignedStopsCount=0,
            unassignedStops=[],
            totalFleetCapacityKg=sum(v.capacityKg for v in request.vehicles),
            totalCollectedKg=0.0,
            fleetUtilizationPercent=0.0,
            totalDistanceKm=0.0,
            totalDurationMin=0.0,
            routes=[],
            baselineDistanceKm=0.0,
            distanceSavedKm=0.0,
            distanceSavedPercent=0.0,
            fuelSavedLitres=0.0,
            costSavingsINR=0.0,
            co2SavedKg=0.0,
            disclaimer="No collection stops or vehicles supplied."
        )

    # OR-Tools operates on integer distances (meters) and integer capacities (grams or kg*10)
    # Scale: distance in meters, demand in integer hectograms (0.1 kg)
    DISTANCE_SCALE = 1000  # km to meters
    DEMAND_SCALE = 10      # kg to 0.1 kg

    int_distance_matrix = [
        [int(round(d * DISTANCE_SCALE)) for d in row]
        for row in dist_matrix
    ]

    demands = [0] + [int(round(s.demandKg * DEMAND_SCALE)) for s in request.stops]
    vehicle_capacities = [int(round(v.capacityKg * DEMAND_SCALE)) for v in request.vehicles]

    # Create Routing Index Manager: depot is index 0
    manager = pywrapcp.RoutingIndexManager(
        num_locations,
        num_vehicles,
        0  # depot
    )

    routing = pywrapcp.RoutingModel(manager)

    # Define transit distance callback
    def distance_callback(from_index: int, to_index: int) -> int:
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return int_distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Define demand & capacity constraint
    def demand_callback(from_index: int) -> int:
        from_node = manager.IndexToNode(from_index)
        return demands[from_node]

    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,  # null capacity slack
        vehicle_capacities,  # vehicle maximum capacities
        True,  # start cumul to zero
        "Capacity"
    )

    # Allow dropping nodes with penalty if capacity is exceeded
    # Penalty is set higher than any maximum detour distance to prioritize visiting all
    PENALTY = 500_000  # meters equivalent penalty
    for node in range(1, num_locations):
        routing.AddDisjunction([manager.NodeToIndex(node)], PENALTY)

    # Search parameters
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.seconds = request.maxSearchSeconds or 3

    # Solve the problem
    solution = routing.SolveWithParameters(search_parameters)

    routes_result: List[VehicleRoute] = []
    total_opt_distance_km = 0.0
    total_opt_duration_min = 0.0
    total_opt_load_kg = 0.0
    assigned_stop_ids = set()

    if solution:
        status_str = "OPTIMAL" if routing.status() == 1 else "FEASIBLE"
        
        for vehicle_idx, vehicle in enumerate(request.vehicles):
            index = routing.Start(vehicle_idx)
            legs: List[RouteLeg] = []
            cumul_dist_km = 0.0
            cumul_load_kg = 0.0
            cumul_time_min = 0.0
            seq = 1

            while not routing.IsEnd(index):
                node = manager.IndexToNode(index)
                next_index = solution.Value(routing.NextVar(index))
                next_node = manager.IndexToNode(next_index)

                if node != 0:
                    stop_obj = request.stops[node - 1]
                    assigned_stop_ids.add(stop_obj.id)

                if not routing.IsEnd(next_index):
                    # Next is another collection stop
                    next_stop = request.stops[next_node - 1]
                    leg_dist = dist_matrix[node][next_node]
                    cumul_dist_km += leg_dist
                    cumul_load_kg += next_stop.demandKg
                    travel_time = (leg_dist / AVG_RURAL_SPEED_KMPH) * 60.0
                    cumul_time_min += travel_time + STOP_SERVICE_TIME_MIN

                    legs.append(RouteLeg(
                        stopId=next_stop.id,
                        stopName=next_stop.name,
                        latitude=next_stop.latitude,
                        longitude=next_stop.longitude,
                        sequence=seq,
                        demandKg=next_stop.demandKg,
                        cumulativeLoadKg=round(cumul_load_kg, 2),
                        legDistanceKm=round(leg_dist, 2),
                        cumulativeDistanceKm=round(cumul_dist_km, 2),
                        estimatedDurationMin=round(cumul_time_min, 1)
                    ))
                    seq += 1
                else:
                    # Returning to depot
                    return_dist = dist_matrix[node][0]
                    cumul_dist_km += return_dist
                    travel_time = (return_dist / AVG_RURAL_SPEED_KMPH) * 60.0
                    cumul_time_min += travel_time

                index = next_index

            if legs:
                util_pct = (cumul_load_kg / vehicle.capacityKg) * 100.0 if vehicle.capacityKg > 0 else 0.0
                v_route = VehicleRoute(
                    vehicleId=vehicle.id,
                    registrationNumber=vehicle.registrationNumber,
                    capacityKg=vehicle.capacityKg,
                    totalLoadKg=round(cumul_load_kg, 2),
                    utilizationPercent=round(min(util_pct, 100.0), 1),
                    totalDistanceKm=round(cumul_dist_km, 2),
                    totalDurationMin=round(cumul_time_min, 1),
                    stopsCount=len(legs),
                    legs=legs
                )
                routes_result.append(v_route)
                total_opt_distance_km += cumul_dist_km
                total_opt_duration_min += cumul_time_min
                total_opt_load_kg += cumul_load_kg
    else:
        status_str = "NO_SOLUTION"

    # Identify unassigned stops
    all_stop_ids = [s.id for s in request.stops]
    unassigned_stops = [sid for sid in all_stop_ids if sid not in assigned_stop_ids]

    # Calculate savings compared to baseline
    total_opt_distance_km = round(total_opt_distance_km, 2)
    saved_distance_km = max(0.0, round(baseline_dist_km - total_opt_distance_km, 2))
    saved_distance_pct = round((saved_distance_km / baseline_dist_km) * 100.0, 1) if baseline_dist_km > 0 else 0.0
    
    saved_fuel_litres = round(saved_distance_km / AVG_VEHICLE_EFFICIENCY_KMPL, 2)
    fuel_cost_savings = saved_fuel_litres * DIESEL_PRICE_PER_LITRE
    maintenance_savings = saved_distance_km * MAINTENANCE_COST_PER_KM
    total_cost_savings = round(fuel_cost_savings + maintenance_savings, 2)
    co2_saved_kg = round(saved_fuel_litres * CO2_KG_PER_LITRE_DIESEL, 2)

    total_fleet_cap = sum(v.capacityKg for v in request.vehicles)
    fleet_util = round((total_opt_load_kg / total_fleet_cap) * 100.0, 1) if total_fleet_cap > 0 else 0.0

    return RouteOptimizationResponse(
        status=status_str,
        solver="Google OR-Tools CVRP (Guided Local Search)",
        totalStops=len(request.stops),
        assignedStopsCount=len(assigned_stop_ids),
        unassignedStops=unassigned_stops,
        totalFleetCapacityKg=round(total_fleet_cap, 2),
        totalCollectedKg=round(total_opt_load_kg, 2),
        fleetUtilizationPercent=fleet_util,
        totalDistanceKm=total_opt_distance_km,
        totalDurationMin=round(total_opt_duration_min, 1),
        routes=routes_result,
        baselineDistanceKm=baseline_dist_km,
        distanceSavedKm=saved_distance_km,
        distanceSavedPercent=saved_distance_pct,
        fuelSavedLitres=saved_fuel_litres,
        costSavingsINR=total_cost_savings,
        co2SavedKg=co2_saved_kg,
        disclaimer=(
            f"Distance matrix computed via Haversine geodesic projection scaled by {circuity}x "
            "rural circuity factor to reflect panchayat road topography. For live road turn-by-turn navigation, "
            "production deployment links to OpenRouteService / OSRM."
        )
    )


# -----------------------------------------------------------------------------
# Multi-Village Waste Pooling Evaluator
# -----------------------------------------------------------------------------

def evaluate_multi_village_pooling(
    request: PoolingOptimizationRequest
) -> PoolingOptimizationResponse:
    """
    Evaluates multi-village waste aggregation (pooling) to unlock industrial EPR recycling contracts.
    Compares solitary unaggregated distress sales with centralized MRF pooling.
    """
    if not request.villages or not request.processors:
        raise ValueError("Must provide at least one village and one processor option.")

    # 1. Compute total pooled stock
    total_pooled_kg = sum(v.mlpStockKg for v in request.villages)

    # 2. Determine Hub / Consolidation Point (Provided MRF or population-weighted centroid)
    if request.mrfHub:
        hub = request.mrfHub
    else:
        avg_lat = sum(v.latitude for v in request.villages) / len(request.villages)
        avg_lon = sum(v.longitude for v in request.villages) / len(request.villages)
        hub = Location(
            id="CENTRAL_MRF_HUB",
            name="Gram-Panchayat Cluster MRF Hub",
            latitude=round(avg_lat, 6),
            longitude=round(avg_lon, 6)
        )

    # 3. Find best matching industrial processor
    # Must accept MLP and pooled quantity must satisfy minimum batch
    eligible_processors: List[Tuple[ProcessorOption, float, float]] = []
    
    for proc in request.processors:
        if "MLP" in proc.acceptedMaterials and total_pooled_kg >= proc.minQuantityKg:
            haulage_dist = haversine_km(
                hub.latitude, hub.longitude, proc.latitude, proc.longitude
            ) * RURAL_CIRCUITY_FACTOR
            gross_payout = total_pooled_kg * proc.pricePerKg
            haulage_cost = haulage_dist * (request.intraClusterCostPerKmKg or 0.015) * total_pooled_kg
            net_payout = gross_payout - haulage_cost
            eligible_processors.append((proc, net_payout, haulage_dist))

    # Sort eligible by maximum net payout
    eligible_processors.sort(key=lambda x: x[1], reverse=True)
    selected_proc: Optional[ProcessorOption] = eligible_processors[0][0] if eligible_processors else None

    # 4. Solitary Baseline Calculation (Unpooled informal distress sale)
    # Individual villages selling sub-threshold stock (<500kg) to scrap dealers
    standalone_revenue = 0.0
    for v in request.villages:
        standalone_revenue += v.mlpStockKg * INFORMAL_SCRAP_RATE_PER_KG
    standalone_revenue = round(standalone_revenue, 2)

    # 5. Pooled Financials
    if selected_proc:
        gross_pooled_revenue = round(total_pooled_kg * selected_proc.pricePerKg, 2)
        status_msg = "SUCCESS_THRESHOLD_MET"
    else:
        # Fallback to highest paying sub-threshold processor or local aggregated rate
        fallback_rate = 5.00  # Aggregated semi-formal rate
        gross_pooled_revenue = round(total_pooled_kg * fallback_rate, 2)
        status_msg = "PARTIAL_THRESHOLD_PENDING"

    # Intra-cluster milk run collection cost to hub
    total_consolidation_cost = 0.0
    village_breakdown: List[VillageContribution] = []

    for v in request.villages:
        dist_to_hub = haversine_km(v.latitude, v.longitude, hub.latitude, hub.longitude) * RURAL_CIRCUITY_FACTOR
        # Haulage cost = distance * unit rate * weight
        trans_cost = dist_to_hub * (request.intraClusterCostPerKmKg or 0.015) * v.mlpStockKg
        total_consolidation_cost += trans_cost

        # Village share of revenue is proportional to weight contributed minus local transport
        effective_rate = (gross_pooled_revenue / total_pooled_kg) if total_pooled_kg > 0 else 0
        village_net = max(0.0, (v.mlpStockKg * effective_rate) - trans_cost)

        village_breakdown.append(VillageContribution(
            villageId=v.id,
            villageName=v.name,
            contributedKg=v.mlpStockKg,
            distanceToHubKm=round(dist_to_hub, 2),
            shareOfNetRevenueINR=round(village_net, 2)
        ))

    total_consolidation_cost = round(total_consolidation_cost, 2)
    net_pooled_revenue = round(max(0.0, gross_pooled_revenue - total_consolidation_cost), 2)
    net_value_unlocked = round(net_pooled_revenue - standalone_revenue, 2)
    uplift_pct = round((net_value_unlocked / standalone_revenue) * 100.0, 1) if standalone_revenue > 0 else 0.0

    summary = (
        f"By pooling {total_pooled_kg:.1f} kg of MLP across {len(request.villages)} Gram Panchayats, "
        f"the cluster satisfies the {selected_proc.minQuantityKg:.0f} kg industrial minimum threshold "
        f"for {selected_proc.name if selected_proc else 'formal recyclers'}. Net community payout increases from "
        f"₹{standalone_revenue:,.2f} (informal distress scrap) to ₹{net_pooled_revenue:,.2f} "
        f"(+{uplift_pct:.1f}% value uplift), diverting 100% of MLP from open burning or rural landfills."
    )

    return PoolingOptimizationResponse(
        status=status_msg,
        totalPooledStockKg=round(total_pooled_kg, 2),
        participatingVillagesCount=len(request.villages),
        selectedProcessor=selected_proc,
        hubLocation=hub,
        standaloneRevenueINR=standalone_revenue,
        grossPooledRevenueINR=gross_pooled_revenue,
        consolidationTransportCostINR=total_consolidation_cost,
        netPooledRevenueINR=net_pooled_revenue,
        netValueUnlockedINR=net_value_unlocked,
        valueUpliftPercent=uplift_pct,
        divertedFromLandfillKg=round(total_pooled_kg, 2),
        villageBreakdown=village_breakdown,
        recommendationSummary=summary
    )
