import { BatchStatus, BinFillLevel, DispatchStatus, InspectionOutcome, MaterialSubtype, QualityGrade, RouteStatus, SyncState, UserRole, WasteStream, WeightSource } from './enums';

export interface Village {
  id: string;
  name: string;
  district: string;
  taluk: string;
  pincode: string;
  latitude: number;
  longitude: number;
  population: number;
  wardCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionPoint {
  id: string;
  villageId: string;
  village?: Village;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  wasteStreams: WasteStream[];
  isActive: boolean;
  lastCollectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bin {
  id: string;
  collectionPointId: string;
  collectionPoint?: CollectionPoint;
  serialNumber: string;
  wasteStream: WasteStream;
  capacityLitres: number;
  fillLevel: BinFillLevel;
  fillPercent: number;
  lastReadingAt?: string;
  sensorDeviceId?: string;
  isActive: boolean;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: string;
  capacityKg: number;
  currentLoadKg: number;
  driverName: string;
  driverPhone: string;
  isAvailable: boolean;
  depotVillageId?: string;
}

export interface WasteBatch {
  id: string;
  batchCode: string;
  qrToken: string;
  collectionPointId: string;
  collectionPoint?: CollectionPoint;
  wasteStream: WasteStream;
  materialSubtype?: MaterialSubtype;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  weightSource: WeightSource;
  status: BatchStatus;
  workerName: string;
  collectedAt: string;
  notes?: string;
  photoUrl?: string;
  deviceId?: string;
  calibrationStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchEvent {
  id: string;
  batchId: string;
  eventType: string;
  fromStatus?: BatchStatus;
  toStatus: BatchStatus;
  performedBy: string;
  role: UserRole;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface QualityInspection {
  id: string;
  batchId: string;
  batch?: WasteBatch;
  inspectorName: string;
  contaminationLevel: 'CLEAN' | 'SLIGHTLY_DIRTY' | 'CONTAMINATED';
  moistureLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  packagingCondition: 'INTACT' | 'DAMAGED' | 'TORN';
  foreignMaterials: boolean;
  outcome: InspectionOutcome;
  grade: QualityGrade;
  notes?: string;
  inspectedAt: string;
}

export interface StorageZone {
  id: string;
  mrfId: string;
  name: string;
  wasteStream: WasteStream;
  capacityKg: number;
  currentStockKg: number;
  location: string;
  isActive: boolean;
}

export interface Processor {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  address: string;
  latitude: number;
  longitude: number;
  acceptedMaterials: MaterialSubtype[];
  minQuantityKg: number;
  maxQuantityKg: number;
  distanceKm?: number;
  indicativePricePerKg?: number;
  isDemo: boolean;
  isVerified: boolean;
}

export interface Dispatch {
  id: string;
  dispatchCode: string;
  status: DispatchStatus;
  processorId: string;
  processor?: Processor;
  totalWeightKg: number;
  scheduledDate: string;
  vehicleId?: string;
  createdBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CitizenReport {
  id: string;
  villageId: string;
  collectionPointId?: string;
  reportType: 'OVERFLOW_BIN' | 'WASTE_ACCUMULATION' | 'OTHER';
  description: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
  reportedBy: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SyncOperation {
  id: string;
  clientOperationId: string;
  operationType: string;
  payload: Record<string, unknown>;
  state: SyncState;
  retryCount: number;
  lastError?: string;
  createdAt: string;
  syncedAt?: string;
}

export interface RoutePlan {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  status: RouteStatus;
  plannedDate: string;
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  optimized: boolean;
  stops: RouteStop[];
  createdAt: string;
}

export interface RouteStop {
  id: string;
  routePlanId: string;
  collectionPointId: string;
  collectionPoint?: CollectionPoint;
  sequence: number;
  estimatedArrival?: string;
  actualArrival?: string;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  collectedWeightKg?: number;
}

export interface DashboardMetrics {
  totalCollectedKg: number;
  mlpCollectedKg: number;
  activeCollectionPoints: number;
  completedRoutesToday: number;
  storedMlpKg: number;
  dispatchedMlpKg: number;
  verifiedProcessedKg: number;
  estimatedRevenueINR: number;
  collectionTrend: TrendPoint[];
  wasteTypeDistribution: WasteTypeData[];
  topVillages: VillageCollectionData[];
}

export interface TrendPoint {
  date: string;
  wet: number;
  dry: number;
  sanitary: number;
  mlp: number;
}

export interface WasteTypeData {
  type: string;
  value: number;
  percent: number;
}

export interface VillageCollectionData {
  villageName: string;
  totalKg: number;
  mlpKg: number;
}
