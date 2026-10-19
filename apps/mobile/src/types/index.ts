export type UserRole = 'admin' | 'worker' | 'mrf' | 'buyer' | 'citizen';

export type WasteCategory = 'MLP' | 'Dry' | 'Wet' | 'Sanitary' | 'HDPE' | 'LDPE' | 'PET';

export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

export interface OfflineBatch {
  id: string;
  batchNumber: string;
  clientOperationId: string;
  collectionPointId: string;
  collectionPointName: string;
  wasteType: WasteCategory;
  weightKg: number;
  condition?: 'Clean' | 'Slightly Dirty' | 'Contaminated';
  moisture?: 'Low' | 'Medium' | 'High';
  qualityGrade?: 'A' | 'B' | 'C';
  storageZone?: 'Zone A (MLP)' | 'Zone B (Dry)' | 'Zone C (Mixed)';
  photoUri?: string;
  qrPayload?: string;
  status: 'PENDING' | 'RECEIVED' | 'INSPECTION' | 'STORAGE' | 'READY_DISPATCH' | 'DISPATCHED' | 'ACCEPTED';
  syncStatus: SyncStatus;
  createdAt: string;
  syncedAt?: string;
  notes?: string;
}

export interface SyncQueueItem {
  id: string;
  clientOperationId: string;
  entityType: 'batch' | 'inspection' | 'bin_report' | 'dispatch' | 'pickup_schedule';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: string; // JSON string
  status: SyncStatus;
  retryCount: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CachedCollectionPoint {
  id: string;
  code: string;
  name: string;
  ward: string;
  village: string;
  latitude: number;
  longitude: number;
  targetWeightKg: number;
  collectedWeightKg: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  sequenceOrder: number;
  binTypes: string; // JSON array string
  lastUpdated: string;
}

export interface RouteStop {
  id: string;
  code: string;
  name: string;
  ward: string;
  weightKg: number;
  targetKg: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  distanceKm: number;
  binTypes: WasteCategory[];
}

export interface VehicleRoute {
  id: string;
  vehicleNumber: string;
  driverName: string;
  totalStops: number;
  completedStops: number;
  totalDistanceKm: number;
  stops: RouteStop[];
}

export interface VillageSummary {
  id: string;
  name: string;
  panchayat: string;
  wardCount: number;
  collectionPointsCount: number;
  monthlyTotalKg: number;
  monthlyMlpKg: number;
  growthPercentage: number;
  status: 'Active' | 'Pending' | 'Inactive';
}

export interface QualityInspectionRecord {
  batchNumber: string;
  inspectorName: string;
  condition: 'Clean' | 'Slightly Dirty' | 'Contaminated';
  moisture: 'Low' | 'Medium' | 'High';
  qualityGrade: 'A' | 'B' | 'C';
  gradeLabel: string;
  inspectedAt: string;
  notes?: string;
}

export interface StorageZone {
  id: string;
  name: string;
  type: string;
  currentKg: number;
  capacityKg: number;
  percentage: number;
  color: string;
}

export interface DispatchItem {
  id: string;
  dispatchId: string;
  processorName: string;
  distanceKm: number;
  materialType: WasteCategory;
  minQuantityKg: number;
  currentStockKg: number;
  dispatchQuantityKg: number;
  pricePerKg: number;
  estimatedValue: number;
  vehicleType: string;
  status: 'Draft' | 'Scheduled' | 'In Transit' | 'Completed';
  date: string;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  batchNumber: string;
  wasteType: WasteCategory;
  weightKg: number;
  grade: 'A' | 'B' | 'C';
  priceTotal: number;
  status: 'Scheduled' | 'Received' | 'Verified';
  date: string;
  origin: string;
}

export interface CitizenBinReport {
  id: string;
  stream: WasteCategory;
  status: 'Reported' | 'In Review' | 'Collected' | 'Acknowledged';
  village: string;
  locationName: string;
  notes?: string;
  photoUri?: string;
  pointsEarned: number;
  createdAt: string;
  date?: string;
  wasteType?: WasteCategory;
}

export interface CollectionScheduleItem {
  id: string;
  dayName: string;
  dateStr: string;
  wasteType: WasteCategory;
  status: 'Completed' | 'Upcoming';
  timing: string;
}

export interface UserContact {
  id: string;
  name: string;
  role: 'Collection Worker' | 'MRF Operator' | 'Buyer / Processor' | 'Village Citizen' | 'Panchayat Admin';
  phone: string;
  email: string;
  active: boolean;
  assignedArea: string;
}
