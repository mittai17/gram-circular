# GRAM-CIRCULAR Route & Waste Pooling Optimizer

High-performance logistics and waste consolidation microservice for **GRAM-CIRCULAR**, powered by **FastAPI** and **Google OR-Tools**.

---

## 🎯 Purpose & Capabilities

In rural Indian waste management (Panchayat level), collection routes face two critical bottlenecks:
1. **Unorganized vehicle routing**: Informal municipal tractors and auto-rickshaws follow ad-hoc paths, wasting diesel and failing to service overflow bins before shift end.
2. **Sub-threshold lot sizes**: Individual villages generate small quantities of dry waste / Multi-Layered Plastic (MLP) (e.g. 30–80 kg/week). Formal industrial coprocessors and cement plants (e.g., Dalmia, ACC, UltraTech) reject shipments below 500–1000 kg. Villages are forced into distress sales to informal middlemen at ₹2.50/kg, or waste is burned in open pits.

This service provides:
- **Capacitated Vehicle Routing Problem (CVRP)** solver using Google OR-Tools.
- **Comparative Baseline Engine**: Computes naive nearest-neighbor baseline vs Guided Local Search to show judges live diesel, INR, and CO₂ savings.
- **Multi-Village Waste Pooling Evaluator**: Evaluates cluster-level aggregation across Panchayats to meet industrial minimum contract sizes and boost net Gram Panchayat revenue.
- **Rural Road Circuity Correction**: Accounts for winding rural terrain topography.

---

## 🚀 Quickstart

### 1. Requirements
- Python 3.10+
- Virtual environment (`venv`)

### 2. Setup & Installation
```bash
# Navigate to optimizer directory
cd apps/optimizer

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Running the Server
```bash
# Development mode with hot reload (Port 8000)
venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or via npm/pnpm workspace script from repo root
pnpm --filter @gram-circular/optimizer dev
```

Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

---

## 📡 API Endpoints

### 1. Health Check
`GET /health` or `GET /api/v1/health`

**Response:**
```json
{
  "status": "ok",
  "service": "gram-circular-optimizer",
  "version": "1.0.0",
  "python_version": "3.14.8",
  "ortools_available": true,
  "features": [
    "capacitated_vehicle_routing",
    "guided_local_search",
    "comparative_baseline_savings",
    "multi_village_waste_pooling",
    "rural_circuity_correction"
  ]
}
```

---

### 2. Capacitated Route Optimization
`POST /api/v1/optimize/route`

Solves CVRP with fleet capacity constraints and guided local search metaheuristics.

**Request Payload:**
```json
{
  "depot": {
    "id": "DEPOT-01",
    "name": "Shanti Nagar Central MRF",
    "latitude": 11.0168,
    "longitude": 76.9558
  },
  "stops": [
    {
      "id": "CP-01",
      "name": "Main Market Junction",
      "latitude": 11.0170,
      "longitude": 76.9560,
      "demandKg": 85.0,
      "priority": 3
    },
    {
      "id": "CP-02",
      "name": "Ward 4 Community Hall",
      "latitude": 11.0190,
      "longitude": 76.9580,
      "demandKg": 120.0,
      "priority": 2
    },
    {
      "id": "CP-03",
      "name": "East Colony School Gate",
      "latitude": 11.0250,
      "longitude": 76.9640,
      "demandKg": 90.0,
      "priority": 1
    }
  ],
  "vehicles": [
    {
      "id": "VEH-01",
      "registrationNumber": "TN-38-XX-1234",
      "capacityKg": 300.0,
      "type": "AUTO_RICKSHAW"
    }
  ],
  "circuityFactor": 1.35,
  "maxSearchSeconds": 3
}
```

**Response Payload:**
```json
{
  "status": "OPTIMAL",
  "solver": "Google OR-Tools CVRP (Guided Local Search)",
  "totalStops": 3,
  "assignedStopsCount": 3,
  "unassignedStops": [],
  "totalFleetCapacityKg": 300.0,
  "totalCollectedKg": 295.0,
  "fleetUtilizationPercent": 98.3,
  "totalDistanceKm": 4.12,
  "totalDurationMin": 44.2,
  "routes": [
    {
      "vehicleId": "VEH-01",
      "registrationNumber": "TN-38-XX-1234",
      "capacityKg": 300.0,
      "totalLoadKg": 295.0,
      "utilizationPercent": 98.3,
      "totalDistanceKm": 4.12,
      "totalDurationMin": 44.2,
      "stopsCount": 3,
      "legs": [
        {
          "stopId": "CP-01",
          "stopName": "Main Market Junction",
          "latitude": 11.017,
          "longitude": 76.956,
          "sequence": 1,
          "demandKg": 85.0,
          "cumulativeLoadKg": 85.0,
          "legDistanceKm": 0.04,
          "cumulativeDistanceKm": 0.04,
          "estimatedDurationMin": 12.1
        }
      ]
    }
  ],
  "baselineDistanceKm": 5.48,
  "distanceSavedKm": 1.36,
  "distanceSavedPercent": 24.8,
  "fuelSavedLitres": 0.14,
  "costSavingsINR": 18.23,
  "co2SavedKg": 0.38,
  "disclaimer": "Distance matrix computed via Haversine geodesic projection scaled by 1.35x rural circuity factor to reflect panchayat road topography."
}
```

---

### 3. Multi-Village Waste Pooling Evaluator
`POST /api/v1/optimize/pooling`

Calculates the economic viability of pooling MLP across multiple Panchayats to reach minimum purchase thresholds (e.g. 500 kg) of authorized recyclers.

**Request Payload:**
```json
{
  "villages": [
    {
      "id": "VIL-01",
      "name": "Shanti Nagar",
      "latitude": 11.0168,
      "longitude": 76.9558,
      "mlpStockKg": 280.0
    },
    {
      "id": "VIL-02",
      "name": "Gandhi Street Colony",
      "latitude": 11.0250,
      "longitude": 76.9640,
      "mlpStockKg": 180.0
    },
    {
      "id": "VIL-03",
      "name": "Kovilpattu",
      "latitude": 10.6550,
      "longitude": 77.0140,
      "mlpStockKg": 160.0
    }
  ],
  "processors": [
    {
      "id": "PROC-01",
      "name": "GreenCycle Coimbatore Pvt Ltd",
      "latitude": 11.0018,
      "longitude": 76.9558,
      "minQuantityKg": 500.0,
      "maxQuantityKg": 5000.0,
      "pricePerKg": 8.50,
      "acceptedMaterials": ["MLP", "RIGID_PLASTIC"]
    }
  ],
  "intraClusterCostPerKmKg": 0.015
}
```

**Response Highlights:**
- `totalPooledStockKg`: 620.0 kg (crosses the 500 kg threshold)
- `standaloneRevenueINR`: ₹1,550.00 (at ₹2.50/kg distress scrap rate)
- `grossPooledRevenueINR`: ₹5,270.00 (at ₹8.50/kg recycler rate)
- `netValueUnlockedINR`: ₹3,412.50 (+220.2% value uplift)
- `divertedFromLandfillKg`: 620.0 kg

---

## 🧮 Mathematical & Algorithmic Formulation

### 1. Distance Metric with Rural Circuity Correction
Geodesic distance between $(\phi_1, \lambda_1)$ and $(\phi_2, \lambda_2)$ is calculated via Haversine:
$$d_{\text{hav}} = 2 R \arcsin \left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1 \cos\phi_2 \sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
In rural India, village dirt tracks and panchayat roads wind around farmland and water channels. A scaling factor $C_{\text{rural}} = 1.35$ is applied:
$$d_{\text{road}} \approx d_{\text{hav}} \times C_{\text{rural}}$$

### 2. Google OR-Tools CVRP Formulation
Let $V = \{0, 1, \dots, n\}$ be the set of locations where $0$ is the depot and $\{1, \dots, n\}$ are collection points with demands $q_i$. Fleet $K$ has vehicle capacities $Q_k$.
- **Objective**: Minimize total network traversal distance $\sum_{i,j,k} c_{ij} x_{ijk}$.
- **Constraints**:
  1. Each collection point visited exactly once: $\sum_{k} \sum_{j} x_{ijk} = 1$.
  2. Flow conservation at every node: $\sum_{i} x_{ipk} - \sum_{j} x_{pjk} = 0$.
  3. Capacity dimension: $\sum_{i \in \text{route}(k)} q_i \le Q_k$.
- **Search Strategy**: `PATH_CHEAPEST_ARC` for initial constructive heuristic, refined via `GUIDED_LOCAL_SEARCH` metaheuristic within a 3-second bounded budget.
