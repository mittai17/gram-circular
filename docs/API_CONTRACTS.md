# GRAM-CIRCULAR: Complete API Contracts & OpenAPI Specifications

**Version**: `1.0.0`  
**Base URLs**:
- Core REST API Gateway (NestJS): `http://localhost:4000/api/v1`
- Route & Pooling Optimizer Service (FastAPI): `http://localhost:8000/api/v1`
- Interactive Swagger UI: `http://localhost:4000/api/docs`
- Interactive FastAPI Docs: `http://localhost:8000/docs`

---

## Standard Error Response Format

All error responses adhere to RFC 7807 problem details:

```json
{
  "statusCode": 400,
  "timestamp": "2026-10-19T16:30:00.000Z",
  "path": "/api/v1/batches",
  "error": "Bad Request",
  "message": [
    "netWeightKg must be a positive number",
    "wasteStream must be one of: WET, DRY, SANITARY, SPECIAL_CARE"
  ]
}
```

---

## 1. System & Health

### `GET /health` or `GET /api/v1/health`
Checks service connectivity, database responsiveness, and OR-Tools status.

**Response `200 OK`**:
```json
{
  "status": "ok",
  "service": "gram-circular-api",
  "version": "1.0.0",
  "timestamp": "2026-10-19T16:30:00.000Z",
  "database": "connected",
  "optimizer": "available"
}
```

---

## 2. Villages & Collection Points

### `GET /api/v1/villages`
Retrieves list of Gram Panchayats with ward counts, geographic coordinates, and collection summaries.

**Query Parameters**:
- `district` (string, optional) — Filter by district name (e.g., `"Coimbatore"`)
- `search` (string, optional) — Name or pincode substring

**Response `200 OK`**:
```json
[
  {
    "id": "c8f943a1-43ef-4f18-bc12-c9a9bb87c101",
    "name": "Shanti Nagar",
    "district": "Coimbatore",
    "taluk": "Coimbatore South",
    "pincode": "641001",
    "latitude": 11.0168,
    "longitude": 76.9558,
    "population": 3200,
    "wardCount": 8,
    "isActive": true,
    "_count": {
      "collectionPoints": 4,
      "citizenReports": 1
    }
  }
]
```

---

### `GET /api/v1/villages/:id/collection-points`
Lists all active collection points and bins for a specific Gram Panchayat.

**Response `200 OK`**:
```json
[
  {
    "id": "cp-01-guid",
    "villageId": "c8f943a1-43ef-4f18-bc12-c9a9bb87c101",
    "name": "CP-01 Main Market Junction",
    "address": "Near Bus Stand, Main Road",
    "latitude": 11.0170,
    "longitude": 76.9560,
    "wasteStreams": ["MLP", "DRY", "WET"],
    "lastCollectedAt": "2026-10-19T14:30:00.000Z",
    "bins": [
      {
        "id": "bin-001",
        "serialNumber": "BIN-SN-002-MLP",
        "wasteStream": "MLP",
        "capacityLitres": 240,
        "fillLevel": "FULL",
        "fillPercent": 95,
        "lastReadingAt": "2026-10-19T16:15:00.000Z"
      }
    ]
  }
]
```

---

## 3. Bins & IoT Smart Scales

### `PATCH /api/v1/bins/:id/reading`
Updates bin fill percentage from ultrasonic edge nodes or simulation.

**Request Body**:
```json
{
  "fillPercent": 85,
  "fillLevel": "HIGH"
}
```

**Response `200 OK`**:
```json
{
  "id": "bin-001",
  "fillPercent": 85,
  "fillLevel": "HIGH",
  "updatedAt": "2026-10-19T16:32:00.000Z"
}
```

---

### `POST /api/v1/devices/reading`
High-frequency telemetry endpoint called directly by the ESP32 firmware.

**Request Body**:
```json
{
  "deviceId": "ESP32-SCALE-001",
  "weightKg": 14.850,
  "isStable": true,
  "source": "SENSOR",
  "fillPercent": 72
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "readingId": "read-9428-uuid",
  "recordedAt": "2026-10-19T16:32:15.000Z"
}
```

---

## 4. Waste Batches & Quality Grading

### `POST /api/v1/batches`
Creates a weighed batch of segregated waste at a village collection point.

**Request Body**:
```json
{
  "collectionPointId": "cp-01-guid",
  "wasteStream": "DRY",
  "materialSubtype": "MLP",
  "grossWeightKg": 15.200,
  "tareWeightKg": 0.350,
  "netWeightKg": 14.850,
  "weightSource": "SENSOR",
  "workerName": "Murugan S",
  "deviceId": "ESP32-SCALE-001",
  "calibrationStatus": "VERIFIED_20261019",
  "clientOperationId": "c9281a80-0a2b-42f0-9ff1-163e75e18f21",
  "notes": "Collected from Ward 2 morning sweep"
}
```

**Response `201 Created`**:
```json
{
  "id": "batch-1829-guid",
  "batchCode": "MLP-2026-0042",
  "qrToken": "7bfa192ce90858f793b8d1b111624c9d",
  "status": "WEIGHED",
  "netWeightKg": 14.850,
  "collectedAt": "2026-10-19T16:33:00.000Z"
}
```

---

### `GET /api/v1/batches/qr/:token`
Instant lookup of a batch via mobile camera QR scan during MRF intake.

**Response `200 OK`**:
```json
{
  "id": "batch-1829-guid",
  "batchCode": "MLP-2026-0042",
  "qrToken": "7bfa192ce90858f793b8d1b111624c9d",
  "status": "IN_TRANSIT",
  "wasteStream": "DRY",
  "materialSubtype": "MLP",
  "netWeightKg": 14.850,
  "collectionPoint": {
    "name": "CP-01 Main Market Junction",
    "village": { "name": "Shanti Nagar" }
  },
  "workerName": "Murugan S",
  "collectedAt": "2026-10-19T16:33:00.000Z"
}
```

---

### `POST /api/v1/batches/:id/inspection`
Submits MRF quality inspection and assigns batch to designated storage bay.

**Request Body**:
```json
{
  "inspectorName": "Kavitha R",
  "contaminationLevel": "SLIGHTLY_DIRTY",
  "moistureLevel": "LOW",
  "packagingCondition": "INTACT",
  "foreignMaterials": false,
  "outcome": "PASSED",
  "grade": "A",
  "storageZoneId": "zone-mrf-a-guid",
  "notes": "Clean multi-layered snack packaging; moisture < 5%"
}
```

**Response `201 Created`**:
```json
{
  "id": "insp-901-guid",
  "batchId": "batch-1829-guid",
  "outcome": "PASSED",
  "grade": "A",
  "batchStatus": "IN_STORAGE",
  "allocatedZone": "Zone A - Baled Clean MLP"
}
```

---

## 5. Route & Multi-Village Pooling Optimization

### `POST /api/v1/optimize/route`
Solves Capacitated Vehicle Routing Problem (CVRP) via Google OR-Tools.

**Request Body**:
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

**Response `200 OK`**:
```json
{
  "status": "OPTIMAL",
  "solver": "Google OR-Tools CVRP (Guided Local Search)",
  "totalStops": 2,
  "assignedStopsCount": 2,
  "unassignedStops": [],
  "totalFleetCapacityKg": 300.0,
  "totalCollectedKg": 205.0,
  "fleetUtilizationPercent": 68.3,
  "totalDistanceKm": 2.84,
  "totalDurationMin": 29.5,
  "routes": [
    {
      "vehicleId": "VEH-01",
      "registrationNumber": "TN-38-XX-1234",
      "capacityKg": 300.0,
      "totalLoadKg": 205.0,
      "utilizationPercent": 68.3,
      "totalDistanceKm": 2.84,
      "totalDurationMin": 29.5,
      "stopsCount": 2,
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
        },
        {
          "stopId": "CP-02",
          "stopName": "Ward 4 Community Hall",
          "latitude": 11.019,
          "longitude": 76.958,
          "sequence": 2,
          "demandKg": 120.0,
          "cumulativeLoadKg": 205.0,
          "legDistanceKm": 0.35,
          "cumulativeDistanceKm": 0.39,
          "estimatedDurationMin": 25.2
        }
      ]
    }
  ],
  "baselineDistanceKm": 3.75,
  "distanceSavedKm": 0.91,
  "distanceSavedPercent": 24.3,
  "fuelSavedLitres": 0.10,
  "costSavingsINR": 12.45,
  "co2SavedKg": 0.27,
  "disclaimer": "Distance matrix computed via Haversine geodesic projection scaled by 1.35x rural circuity factor."
}
```

---

### `POST /api/v1/optimize/pooling`
Evaluates multi-panchayat waste aggregation to satisfy industrial processor minimum orders.

**Request Body**:
```json
{
  "villages": [
    { "id": "V-01", "name": "Shanti Nagar", "latitude": 11.0168, "longitude": 76.9558, "mlpStockKg": 280.0 },
    { "id": "V-02", "name": "Gandhi Street", "latitude": 11.0250, "longitude": 76.9640, "mlpStockKg": 180.0 },
    { "id": "V-03", "name": "Kovilpattu", "latitude": 10.6550, "longitude": 77.0140, "mlpStockKg": 160.0 }
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
      "acceptedMaterials": ["MLP"]
    }
  ],
  "intraClusterCostPerKmKg": 0.015
}
```

**Response `200 OK`**:
```json
{
  "status": "SUCCESS_THRESHOLD_MET",
  "totalPooledStockKg": 620.0,
  "participatingVillagesCount": 3,
  "selectedProcessor": {
    "id": "PROC-01",
    "name": "GreenCycle Coimbatore Pvt Ltd",
    "pricePerKg": 8.50
  },
  "standaloneRevenueINR": 1550.00,
  "grossPooledRevenueINR": 5270.00,
  "consolidationTransportCostINR": 307.50,
  "netPooledRevenueINR": 4962.50,
  "netValueUnlockedINR": 3412.50,
  "valueUpliftPercent": 220.2,
  "divertedFromLandfillKg": 620.0,
  "recommendationSummary": "By pooling 620.0 kg of MLP across 3 Gram Panchayats..."
}
```

---

## 6. Dispatches & Industrial Processors

### `POST /api/v1/dispatches`
Creates an outward consignment to an authorized recycling partner.

**Request Body**:
```json
{
  "processorId": "proc-01-guid",
  "vehicleId": "veh-02-guid",
  "batchIds": ["batch-1829-guid", "batch-1830-guid"],
  "scheduledDate": "2026-10-20T09:00:00.000Z",
  "notes": "500kg consolidated MLP for cement coprocessing"
}
```

**Response `201 Created`**:
```json
{
  "id": "disp-0042-guid",
  "dispatchCode": "DSP-2026-0012",
  "status": "CONFIRMED",
  "totalWeightKg": 520.450,
  "scheduledDate": "2026-10-20T09:00:00.000Z"
}
```

---

### `POST /api/v1/dispatches/:id/receipt`
Industrial weighbridge receipt verification submitted by processor.

**Request Body**:
```json
{
  "receivedBy": "Arjun Nair (GreenCycle Weighbridge)",
  "receivedWeightKg": 518.200,
  "notes": "Tare discrepancy within permissible moisture tolerance (-0.43%)",
  "evidenceUrl": "https://s3.ap-south-1.amazonaws.com/gram-circular/weighbridge_slip_0012.jpg"
}
```

**Response `201 Created`**:
```json
{
  "id": "rcpt-101-guid",
  "dispatchId": "disp-0042-guid",
  "receivedWeightKg": 518.200,
  "discrepancyKg": -2.250,
  "discrepancyPercent": -0.43,
  "isWithinTolerance": true
}
```

---

## 7. Analytics & Continuous Mass Balance Audit

### `GET /api/v1/analytics/mass-balance`
Live audit reconciliation verifying physical conservation of mass.

**Response `200 OK`**:
```json
{
  "period": "LAST_30_DAYS",
  "totalCollectedKg": 14250.800,
  "currentStorageKg": 3410.500,
  "totalDispatchedKg": 10520.000,
  "recordedLossKg": 285.300,
  "unreconciledDiscrepancyKg": 35.000,
  "reconciliationAccuracyPercent": 99.75,
  "auditStatus": "VERIFIED_CPCB_COMPLIANT",
  "openAnomaliesCount": 0
}
```
