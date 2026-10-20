"""
GRAM-CIRCULAR Optimization Microservice
FastAPI server exposing OR-Tools Route Optimizer & Multi-Village Pooling Evaluator
"""

import os
import sys
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from optimizer import (
    RouteOptimizationRequest,
    RouteOptimizationResponse,
    PoolingOptimizationRequest,
    PoolingOptimizationResponse,
    solve_ortools_vrp,
    evaluate_multi_village_pooling,
)

app = FastAPI(
    title="GRAM-CIRCULAR Route & Waste Pooling Optimizer",
    version="1.0.0",
    description="High-performance CVRP routing and multi-village MLP pooling engine powered by Google OR-Tools",
)

# CORS configuration for Web, Mobile and NestJS API clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
@app.get("/api/v1/health", tags=["System"])
def health_check():
    """Health check endpoint providing engine status and environment metadata."""
    try:
        from ortools.constraint_solver import pywrapcp
        ortools_available = True
    except ImportError:
        ortools_available = False

    return {
        "status": "ok",
        "service": "gram-circular-optimizer",
        "version": "1.0.0",
        "python_version": sys.version.split()[0],
        "ortools_available": ortools_available,
        "features": [
            "capacitated_vehicle_routing",
            "guided_local_search",
            "comparative_baseline_savings",
            "multi_village_waste_pooling",
            "rural_circuity_correction"
        ]
    }


@app.post(
    "/api/v1/optimize/route",
    response_model=RouteOptimizationResponse,
    status_code=status.HTTP_200_OK,
    tags=["Optimization"]
)
def optimize_collection_route(request: RouteOptimizationRequest):
    """
    Solve Capacitated Vehicle Routing Problem (CVRP) for rural collection points.
    Returns per-vehicle itineraries, distance savings vs greedy baseline, and carbon reduction.
    """
    try:
        response = solve_ortools_vrp(request)
        return response
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Optimization failed: {str(exc)}"
        ) from exc


@app.post(
    "/api/v1/optimize/pooling",
    response_model=PoolingOptimizationResponse,
    status_code=status.HTTP_200_OK,
    tags=["Optimization"]
)
def optimize_waste_pooling(request: PoolingOptimizationRequest):
    """
    Evaluate multi-village waste pooling to meet industrial processor minimum batch thresholds.
    Calculates value unlocked over informal distress sales and intra-cluster logistics costs.
    """
    try:
        response = evaluate_multi_village_pooling(request)
        return response
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        ) from val_err
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pooling evaluation failed: {str(exc)}"
        ) from exc


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
