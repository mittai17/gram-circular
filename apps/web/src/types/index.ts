export type DemoRole = 'admin' | 'worker' | 'mrf' | 'buyer' | 'citizen';

export type WasteType = 'WET' | 'DRY' | 'SANITARY' | 'MLP';

export type QualityGrade = 'A' | 'B' | 'C' | 'REJECTED';

export type BatchStatus =
  | 'CREATED'
  | 'WEIGHED'
  | 'IN_TRANSIT'
  | 'RECEIVED_AT_MRF'
  | 'INSPECTION_PENDING'
  | 'INSPECTED'
  | 'IN_STORAGE'
  | 'RESERVED'
  | 'DISPATCHED'
  | 'RECEIVED_BY_PROCESSOR'
  | 'PROCESSING_CONFIRMED'
  | 'REJECTED';

export interface UserProfile {
  name: string;
  roleTitle: string;
  avatarUrl?: string;
  online?: boolean;
  district?: string;
  village?: string;
  points?: number;
}

export interface CollectionPoint {
  id: string;
  code: string;
  name: string;
  village: string;
  lat: number;
  lng: number;
  fillLevel: number; // percentage 0-100
  weight: number; // kg
  mlpWeight: number; // kg
  status: 'Active' | 'Partial' | 'Full' | 'Maintenance';
  wasteTypes: WasteType[];
  lastCollection: string;
  batteryLevel?: number;
}

export interface VillageProfile {
  id: string;
  name: string;
  panchayat: string;
  population: number;
  households: number;
  collectionPointsCount: number;
  dailyWasteKg: number;
  dailyMlpKg: number;
  segregationRate: number; // percentage
  coordinatorName: string;
  coordinatorContact: string;
}

export interface WasteBatch {
  id: string;
  batchNumber: string;
  collectionPointId: string;
  collectionPointCode: string;
  collectionPointName: string;
  villageName: string;
  workerId: string;
  workerName: string;
  wasteType: WasteType;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  qualityGrade?: QualityGrade;
  condition?: 'Clean' | 'Slightly Dirty' | 'Contaminated';
  moisture?: 'Low' | 'Medium' | 'High';
  status: BatchStatus;
  createdAt: string;
  weighedAt?: string;
  inspectedAt?: string;
  storedAtZone?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  buyerName?: string;
  qrToken: string;
  remarks?: string;
  photos: string[];
}

export interface RouteStop {
  id: string;
  sequence: number;
  collectionPointCode: string;
  name: string;
  lat: number;
  lng: number;
  weightEst: number;
  distanceKm: number;
  timeEstimate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  completedAt?: string;
}

export interface StorageZone {
  id: string;
  name: string;
  wasteType: WasteType | 'Mixed';
  currentWeightKg: number;
  capacityKg: number;
  percentage: number;
  updatedAt: string;
}

export interface DispatchOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerDistanceKm: number;
  batches: WasteBatch[];
  totalWeightKg: number;
  vehicleNumber: string;
  driverName: string;
  dispatchDate: string;
  expectedDelivery: string;
  status: 'Draft' | 'Dispatched' | 'Delivered' | 'Confirmed';
}

export interface CitizenReport {
  id: string;
  citizenName: string;
  phone: string;
  collectionPointId: string;
  collectionPointName: string;
  binType: WasteType;
  reportedIssue: 'Overflowing' | 'Damaged Bin' | 'Foul Smell' | 'Missed Collection';
  photoUrl?: string;
  timestamp: string;
  status: 'Open' | 'Assigned' | 'Resolved';
}

export interface AnomalyRecord {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'Weight Discrepancy' | 'Duplicate QR Scan' | 'Missing Handover' | 'Sensor Drift';
  batchId?: string;
  description: string;
  detectedAt: string;
  status: 'Under Review' | 'Resolved' | 'Flagged';
  location: string;
}
