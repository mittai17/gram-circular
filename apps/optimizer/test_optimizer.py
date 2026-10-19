"""
Automated Test Suite for GRAM-CIRCULAR Optimizer
Verifies OR-Tools CVRP solver, baseline comparison, and multi-village pooling
"""

import unittest
from fastapi.testclient import TestClient

from optimizer import (
    Location,
    CollectionStop,
    FleetVehicle,
    RouteOptimizationRequest,
    solve_ortools_vrp,
    solve_greedy_baseline,
    build_distance_matrix,
    haversine_km,
    VillageStock,
    ProcessorOption,
    PoolingOptimizationRequest,
    evaluate_multi_village_pooling,
)
from main import app


class TestOptimizerCore(unittest.TestCase):
    def setUp(self):
        # Shanti Nagar MRF Depot in Coimbatore
        self.depot = Location(
            id="DEPOT-01",
            name="Shanti Nagar Central MRF",
            latitude=11.0168,
            longitude=76.9558
        )
        self.stops = [
            CollectionStop(
                id="CP-01",
                name="Main Market Junction",
                latitude=11.0170,
                longitude=76.9560,
                demandKg=80.0,
                priority=3
            ),
            CollectionStop(
                id="CP-02",
                name="Ward 4 Community Hall",
                latitude=11.0190,
                longitude=76.9580,
                demandKg=110.0,
                priority=2
            ),
            CollectionStop(
                id="CP-03",
                name="East Colony School Gate",
                latitude=11.0250,
                longitude=76.9640,
                demandKg=95.0,
                priority=1
            ),
            CollectionStop(
                id="CP-04",
                name="North Panchayat Office",
                latitude=11.0280,
                longitude=76.9600,
                demandKg=70.0,
                priority=2
            )
        ]
        self.vehicles = [
            FleetVehicle(
                id="VEH-01",
                registrationNumber="TN-38-XX-1234",
                capacityKg=200.0,
                type="AUTO_RICKSHAW"
            ),
            FleetVehicle(
                id="VEH-02",
                registrationNumber="TN-38-YY-5678",
                capacityKg=300.0,
                type="MINI_TRUCK"
            )
        ]

    def test_haversine_distance(self):
        # Distance between depot and CP-01 is small (< 1 km)
        d = haversine_km(
            self.depot.latitude, self.depot.longitude,
            self.stops[0].latitude, self.stops[0].longitude
        )
        self.assertGreater(d, 0.0)
        self.assertLess(d, 1.0)

    def test_distance_matrix_symmetry(self):
        locs = [self.depot] + self.stops
        matrix = build_distance_matrix(locs)
        n = len(locs)
        self.assertEqual(len(matrix), n)
        for i in range(n):
            self.assertEqual(matrix[i][i], 0.0)
            for j in range(n):
                self.assertEqual(matrix[i][j], matrix[j][i])

    def test_greedy_baseline(self):
        locs = [self.depot] + self.stops
        matrix = build_distance_matrix(locs)
        baseline_dist, assignments = solve_greedy_baseline(
            self.depot, self.stops, self.vehicles, matrix
        )
        self.assertGreater(baseline_dist, 0.0)
        self.assertIsInstance(assignments, dict)

    def test_ortools_cvrp_solution(self):
        req = RouteOptimizationRequest(
            depot=self.depot,
            stops=self.stops,
            vehicles=self.vehicles,
            circuityFactor=1.35,
            maxSearchSeconds=2
        )
        res = solve_ortools_vrp(req)
        self.assertIn(res.status, ["OPTIMAL", "FEASIBLE"])
        self.assertEqual(res.assignedStopsCount, 4)
        self.assertEqual(len(res.unassignedStops), 0)
        self.assertGreater(res.totalDistanceKm, 0.0)
        
        # Verify capacity constraints for each vehicle
        total_delivered = 0.0
        for route in res.routes:
            self.assertLessEqual(route.totalLoadKg, route.capacityKg + 1e-3)
            total_delivered += route.totalLoadKg
        self.assertAlmostEqual(total_delivered, sum(s.demandKg for s in self.stops), places=1)
        
        # Verify baseline comparison metrics
        self.assertGreaterEqual(res.baselineDistanceKm, res.totalDistanceKm)
        self.assertGreaterEqual(res.distanceSavedKm, 0.0)

    def test_multi_village_pooling(self):
        villages = [
            VillageStock(id="V-1", name="Shanti Nagar", latitude=11.0168, longitude=76.9558, mlpStockKg=280.0),
            VillageStock(id="V-2", name="Gandhi Street", latitude=11.0250, longitude=76.9640, mlpStockKg=180.0),
            VillageStock(id="V-3", name="Kovilpattu", latitude=10.6550, longitude=77.0140, mlpStockKg=160.0),
        ]
        processors = [
            ProcessorOption(
                id="P-1",
                name="GreenCycle Coimbatore",
                latitude=11.0018,
                longitude=76.9558,
                minQuantityKg=500.0,
                maxQuantityKg=5000.0,
                pricePerKg=8.50,
                acceptedMaterials=["MLP"]
            )
        ]
        req = PoolingOptimizationRequest(villages=villages, processors=processors)
        res = evaluate_multi_village_pooling(req)
        self.assertEqual(res.status, "SUCCESS_THRESHOLD_MET")
        self.assertEqual(res.totalPooledStockKg, 620.0)
        self.assertIsNotNone(res.selectedProcessor)
        self.assertGreater(res.grossPooledRevenueINR, res.standaloneRevenueINR)
        self.assertGreater(res.netValueUnlockedINR, 0.0)
        self.assertGreater(res.valueUpliftPercent, 50.0)


class TestFastAPIEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "ok")
        self.assertTrue(data["ortools_available"])

    def test_optimize_route_api(self):
        payload = {
            "depot": {"id": "D1", "name": "Depot", "latitude": 11.0168, "longitude": 76.9558},
            "stops": [
                {"id": "S1", "name": "Stop 1", "latitude": 11.0170, "longitude": 76.9560, "demandKg": 50.0},
                {"id": "S2", "name": "Stop 2", "latitude": 11.0190, "longitude": 76.9580, "demandKg": 60.0}
            ],
            "vehicles": [
                {"id": "V1", "registrationNumber": "TN-38-1234", "capacityKg": 200.0}
            ]
        }
        resp = self.client.post("/api/v1/optimize/route", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn(data["status"], ["OPTIMAL", "FEASIBLE"])
        self.assertEqual(len(data["routes"]), 1)


if __name__ == "__main__":
    unittest.main()
