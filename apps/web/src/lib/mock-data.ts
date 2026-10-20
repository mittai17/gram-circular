import {
  CollectionPoint,
  VillageProfile,
  WasteBatch,
  RouteStop,
  StorageZone,
  CitizenReport,
  AnomalyRecord,
} from '@/types';

export const MOCK_COLLECTION_POINTS: CollectionPoint[] = [
  {
    id: 'cp-01',
    code: 'CP-01',
    name: 'Shanti Nagar Center',
    village: 'Shanti Nagar',
    lat: 13.1438,
    lng: 79.9132,
    fillLevel: 70,
    weight: 42.0,
    mlpWeight: 14.5,
    status: 'Active',
    wasteTypes: ['MLP', 'DRY', 'WET'],
    lastCollection: '16 Oct 2026, 08:15',
    batteryLevel: 94,
  },
  {
    id: 'cp-02',
    code: 'CP-02',
    name: 'Bus Stand Junction',
    village: 'Gandhi Street Colony',
    lat: 13.1512,
    lng: 79.9045,
    fillLevel: 36,
    weight: 42.0,
    mlpWeight: 12.0,
    status: 'Active',
    wasteTypes: ['MLP', 'DRY'],
    lastCollection: '16 Oct 2026, 09:00',
    batteryLevel: 88,
  },
  {
    id: 'cp-03',
    code: 'CP-03',
    name: 'Gandhi Street Ward 4',
    village: 'Gandhi Street Colony',
    lat: 13.1389,
    lng: 79.921,
    fillLevel: 85,
    weight: 85.0,
    mlpWeight: 28.0,
    status: 'Active',
    wasteTypes: ['MLP', 'DRY', 'WET', 'SANITARY'],
    lastCollection: '15 Oct 2026, 17:30',
    batteryLevel: 76,
  },
  {
    id: 'cp-04',
    code: 'CP-04',
    name: 'Kovilpattu North Entrance',
    village: 'Kovilpattu',
    lat: 13.131,
    lng: 79.898,
    fillLevel: 0,
    weight: 0.0,
    mlpWeight: 0.0,
    status: 'Maintenance',
    wasteTypes: ['MLP', 'DRY'],
    lastCollection: '14 Oct 2026, 14:10',
    batteryLevel: 12,
  },
  {
    id: 'cp-05',
    code: 'CP-05',
    name: 'Temple Road Circle',
    village: 'Temple Road',
    lat: 13.159,
    lng: 79.9195,
    fillLevel: 60,
    weight: 25.0,
    mlpWeight: 9.8,
    status: 'Active',
    wasteTypes: ['MLP', 'DRY'],
    lastCollection: '16 Oct 2026, 11:45',
    batteryLevel: 91,
  },
  {
    id: 'cp-07',
    code: 'CP-07',
    name: 'Panchayat Union School',
    village: 'Shanti Nagar',
    lat: 13.148,
    lng: 79.932,
    fillLevel: 92,
    weight: 65.0,
    mlpWeight: 21.0,
    status: 'Full',
    wasteTypes: ['MLP', 'DRY', 'WET'],
    lastCollection: '15 Oct 2026, 16:00',
    batteryLevel: 82,
  },
  {
    id: 'cp-09',
    code: 'CP-09',
    name: 'Lake View Bund Road',
    village: 'Lake View',
    lat: 13.124,
    lng: 79.915,
    fillLevel: 45,
    weight: 25.0,
    mlpWeight: 8.5,
    status: 'Partial',
    wasteTypes: ['MLP', 'DRY'],
    lastCollection: '16 Oct 2026, 12:15',
    batteryLevel: 95,
  },
  {
    id: 'cp-12',
    code: 'CP-12',
    name: 'Weekly Sandy Market Area',
    village: 'Market Area',
    lat: 13.155,
    lng: 79.938,
    fillLevel: 95,
    weight: 110.0,
    mlpWeight: 42.0,
    status: 'Full',
    wasteTypes: ['MLP', 'DRY', 'WET', 'SANITARY'],
    lastCollection: '16 Oct 2026, 07:30',
    batteryLevel: 89,
  },
];

export const MOCK_VILLAGES: VillageProfile[] = [
  {
    id: 'v-01',
    name: 'Shanti Nagar',
    panchayat: 'Shanti Nagar Gram Panchayat',
    population: 2450,
    households: 560,
    collectionPointsCount: 4,
    dailyWasteKg: 285.4,
    dailyMlpKg: 98.2,
    segregationRate: 84.5,
    coordinatorName: 'M. Anand',
    coordinatorContact: '+91 94421 88301',
  },
  {
    id: 'v-02',
    name: 'Gandhi Street Colony',
    panchayat: 'Gandhi Street Gram Panchayat',
    population: 1890,
    households: 420,
    collectionPointsCount: 3,
    dailyWasteKg: 210.0,
    dailyMlpKg: 76.4,
    segregationRate: 79.2,
    coordinatorName: 'P. Saraswathi',
    coordinatorContact: '+91 98412 44923',
  },
  {
    id: 'v-03',
    name: 'Kovilpattu',
    panchayat: 'Kovilpattu Gram Panchayat',
    population: 1540,
    households: 360,
    collectionPointsCount: 3,
    dailyWasteKg: 165.2,
    dailyMlpKg: 52.1,
    segregationRate: 72.8,
    coordinatorName: 'R. Veeramani',
    coordinatorContact: '+91 97908 11204',
  },
  {
    id: 'v-04',
    name: 'Temple Road',
    panchayat: 'Periyapalayam Union',
    population: 1420,
    households: 310,
    collectionPointsCount: 2,
    dailyWasteKg: 140.5,
    dailyMlpKg: 48.6,
    segregationRate: 88.1,
    coordinatorName: 'S. Loganathan',
    coordinatorContact: '+91 94443 67190',
  },
  {
    id: 'v-05',
    name: 'Lake View',
    panchayat: 'Lake View Gram Panchayat',
    population: 1100,
    households: 250,
    collectionPointsCount: 2,
    dailyWasteKg: 115.0,
    dailyMlpKg: 35.0,
    segregationRate: 81.0,
    coordinatorName: 'K. Meenakshi',
    coordinatorContact: '+91 91765 89201',
  },
];

export const MOCK_BATCHES: WasteBatch[] = [
  {
    id: 'b-0143',
    batchNumber: 'MLP-2026-0143',
    collectionPointId: 'cp-03',
    collectionPointCode: 'CP-03',
    collectionPointName: 'Gandhi Street Ward 4',
    villageName: 'Gandhi Street Colony',
    workerId: 'w-01',
    workerName: 'Ramesh K',
    wasteType: 'MLP',
    grossWeight: 14.0,
    tareWeight: 1.2,
    netWeight: 12.8,
    qualityGrade: 'A',
    condition: 'Clean',
    moisture: 'Low',
    status: 'INSPECTION_PENDING',
    createdAt: '2026-10-16T10:24:00Z',
    weighedAt: '2026-10-16T10:24:00Z',
    qrToken: 'QR-MLP-2026-0143-SECURE-984',
    remarks: 'Clean metallized foil film, segregated chips/biscuit wrappers. Excellent quality.',
    photos: [
      'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400&q=80',
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&q=80',
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=80',
    ],
  },
  {
    id: 'b-0142',
    batchNumber: 'MLP-2026-0142',
    collectionPointId: 'cp-07',
    collectionPointCode: 'CP-07',
    collectionPointName: 'Panchayat Union School',
    villageName: 'Shanti Nagar',
    workerId: 'w-01',
    workerName: 'Ramesh K',
    wasteType: 'MLP',
    grossWeight: 17.6,
    tareWeight: 1.4,
    netWeight: 16.2,
    qualityGrade: 'B',
    condition: 'Slightly Dirty',
    moisture: 'Medium',
    status: 'INSPECTION_PENDING',
    createdAt: '2026-10-16T09:15:00Z',
    weighedAt: '2026-10-16T09:15:00Z',
    qrToken: 'QR-MLP-2026-0142-SECURE-771',
    remarks: 'Slight moisture present due to morning condensation, dryable within 2 hours.',
    photos: [
      'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80',
    ],
  },
  {
    id: 'b-0141',
    batchNumber: 'MLP-2026-0141',
    collectionPointId: 'cp-01',
    collectionPointCode: 'CP-01',
    collectionPointName: 'Shanti Nagar Center',
    villageName: 'Shanti Nagar',
    workerId: 'w-01',
    workerName: 'Ramesh K',
    wasteType: 'MLP',
    grossWeight: 11.5,
    tareWeight: 1.0,
    netWeight: 10.5,
    qualityGrade: 'C',
    condition: 'Contaminated',
    moisture: 'High',
    status: 'INSPECTION_PENDING',
    createdAt: '2026-10-16T08:45:00Z',
    weighedAt: '2026-10-16T08:45:00Z',
    qrToken: 'QR-MLP-2026-0141-SECURE-312',
    remarks: 'Mixed with organic debris. Needs washing and heavy sorting before shredding.',
    photos: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
    ],
  },
  {
    id: 'b-0140',
    batchNumber: 'MLP-2026-0140',
    collectionPointId: 'cp-05',
    collectionPointCode: 'CP-05',
    collectionPointName: 'Temple Road Circle',
    villageName: 'Temple Road',
    workerId: 'w-02',
    workerName: 'Murugan S',
    wasteType: 'MLP',
    grossWeight: 20.0,
    tareWeight: 1.4,
    netWeight: 18.6,
    qualityGrade: 'A',
    condition: 'Clean',
    moisture: 'Low',
    status: 'IN_STORAGE',
    storedAtZone: 'Zone A (MLP)',
    createdAt: '2026-10-15T04:20:00Z',
    weighedAt: '2026-10-15T04:20:00Z',
    inspectedAt: '2026-10-15T06:00:00Z',
    qrToken: 'QR-MLP-2026-0140-SECURE-442',
    remarks: 'Baled and stacked in Zone A bay 3.',
    photos: [
      'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400&q=80',
    ],
  },
  {
    id: 'b-0139',
    batchNumber: 'MLP-2026-0139',
    collectionPointId: 'cp-05',
    collectionPointCode: 'CP-05',
    collectionPointName: 'Temple Road Circle',
    villageName: 'Temple Road',
    workerId: 'w-02',
    workerName: 'Murugan S',
    wasteType: 'DRY',
    grossWeight: 17.8,
    tareWeight: 1.4,
    netWeight: 16.4,
    qualityGrade: 'A',
    condition: 'Clean',
    moisture: 'Low',
    status: 'IN_STORAGE',
    storedAtZone: 'Zone B (Dry)',
    createdAt: '2026-10-15T03:10:00Z',
    weighedAt: '2026-10-15T03:10:00Z',
    inspectedAt: '2026-10-15T05:30:00Z',
    qrToken: 'QR-MLP-2026-0139-SECURE-109',
    remarks: 'Sorted dry cardboard and PET containers.',
    photos: [],
  },
  {
    id: 'b-0138',
    batchNumber: 'MLP-2026-0138',
    collectionPointId: 'cp-03',
    collectionPointCode: 'CP-03',
    collectionPointName: 'Gandhi Street Ward 4',
    villageName: 'Gandhi Street Colony',
    workerId: 'w-01',
    workerName: 'Ramesh K',
    wasteType: 'MLP',
    grossWeight: 26.5,
    tareWeight: 1.5,
    netWeight: 25.0,
    qualityGrade: 'B',
    condition: 'Slightly Dirty',
    moisture: 'Low',
    status: 'IN_STORAGE',
    storedAtZone: 'Zone A (MLP)',
    createdAt: '2026-10-14T11:00:00Z',
    qrToken: 'QR-MLP-2026-0138-SECURE-892',
    photos: [],
  },
  {
    id: 'b-0135',
    batchNumber: 'MLP-2026-0135',
    collectionPointId: 'cp-05',
    collectionPointCode: 'CP-05',
    collectionPointName: 'Temple Road Circle',
    villageName: 'Temple Road',
    workerId: 'w-02',
    workerName: 'Murugan S',
    wasteType: 'MLP',
    grossWeight: 26.5,
    tareWeight: 1.5,
    netWeight: 25.0,
    qualityGrade: 'B',
    condition: 'Clean',
    moisture: 'Low',
    status: 'IN_STORAGE',
    storedAtZone: 'Zone A (MLP)',
    createdAt: '2026-10-14T08:30:00Z',
    qrToken: 'QR-MLP-2026-0135-SECURE-655',
    photos: [],
  },
];

export const MOCK_ROUTE_STOPS: RouteStop[] = [
  {
    id: 'stop-01',
    sequence: 1,
    collectionPointCode: 'CP-01',
    name: 'Shanti Nagar Center',
    lat: 13.1438,
    lng: 79.9132,
    weightEst: 42,
    distanceKm: 0.0,
    timeEstimate: '08:15 AM',
    status: 'Completed',
    completedAt: '08:15 AM',
  },
  {
    id: 'stop-02',
    sequence: 2,
    collectionPointCode: 'CP-03',
    name: 'Gandhi Street Ward 4',
    lat: 13.1389,
    lng: 79.921,
    weightEst: 28,
    distanceKm: 1.8,
    timeEstimate: '09:30 AM',
    status: 'In Progress',
  },
  {
    id: 'stop-03',
    sequence: 3,
    collectionPointCode: 'CP-05',
    name: 'Temple Road Circle',
    lat: 13.159,
    lng: 79.9195,
    weightEst: 28,
    distanceKm: 2.4,
    timeEstimate: '10:45 AM',
    status: 'Pending',
  },
  {
    id: 'stop-04',
    sequence: 4,
    collectionPointCode: 'CP-07',
    name: 'School Road Junction',
    lat: 13.148,
    lng: 79.932,
    weightEst: 0,
    distanceKm: 3.1,
    timeEstimate: '11:45 AM',
    status: 'Pending',
  },
  {
    id: 'stop-05',
    sequence: 5,
    collectionPointCode: 'CP-09',
    name: 'Lake View Bund Road',
    lat: 13.124,
    lng: 79.915,
    weightEst: 25,
    distanceKm: 4.2,
    timeEstimate: '01:00 PM',
    status: 'Pending',
  },
  {
    id: 'stop-06',
    sequence: 6,
    collectionPointCode: 'CP-12',
    name: 'Market Area High Street',
    lat: 13.155,
    lng: 79.938,
    weightEst: 0,
    distanceKm: 3.8,
    timeEstimate: '02:30 PM',
    status: 'Pending',
  },
];

export const MOCK_STORAGE_ZONES: StorageZone[] = [
  {
    id: 'zone-a',
    name: 'Zone A (MLP)',
    wasteType: 'MLP',
    currentWeightKg: 120,
    capacityKg: 500,
    percentage: 24,
    updatedAt: '16 Oct 10:40',
  },
  {
    id: 'zone-b',
    name: 'Zone B (Dry)',
    wasteType: 'DRY',
    currentWeightKg: 200,
    capacityKg: 500,
    percentage: 40,
    updatedAt: '16 Oct 09:30',
  },
  {
    id: 'zone-c',
    name: 'Zone C (Mixed)',
    wasteType: 'Mixed',
    currentWeightKg: 80,
    capacityKg: 500,
    percentage: 16,
    updatedAt: '15 Oct 18:20',
  },
];

export const MOCK_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'rep-01',
    citizenName: 'Karthik S',
    phone: '+91 98401 23456',
    collectionPointId: 'cp-07',
    collectionPointName: 'Panchayat Union School (CP-07)',
    binType: 'MLP',
    reportedIssue: 'Overflowing',
    timestamp: '16 Oct 2026, 09:30 AM',
    status: 'Assigned',
  },
  {
    id: 'rep-02',
    citizenName: 'Devi Priya',
    phone: '+91 94441 77210',
    collectionPointId: 'cp-03',
    collectionPointName: 'Gandhi Street Ward 4 (CP-03)',
    binType: 'DRY',
    reportedIssue: 'Foul Smell',
    timestamp: '15 Oct 2026, 04:15 PM',
    status: 'Resolved',
  },
];

export const MOCK_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'ANOM-804',
    severity: 'HIGH',
    category: 'Weight Discrepancy',
    batchId: 'MLP-2026-0143',
    description: 'Weighing station recorded 12.8 kg, preliminary bin strain sensor flagged 16.4 kg (+28% delta).',
    detectedAt: '16 Oct 2026, 10:25 AM',
    status: 'Under Review',
    location: 'CP-03 Gandhi Street',
  },
  {
    id: 'ANOM-805',
    severity: 'MEDIUM',
    category: 'Duplicate QR Scan',
    batchId: 'MLP-2026-0139',
    description: 'QR token scanned twice within 4 minutes at MRF intake bay.',
    detectedAt: '15 Oct 2026, 03:14 PM',
    status: 'Resolved',
    location: 'MRF Weighbridge 1',
  },
  {
    id: 'ANOM-806',
    severity: 'LOW',
    category: 'Missing Handover',
    batchId: 'MLP-2026-0132',
    description: 'Delivery acknowledgment from GreenCycle Pvt Ltd pending > 24 hours after dispatch.',
    detectedAt: '14 Oct 2026, 18:00 PM',
    status: 'Flagged',
    location: 'SIPCOT Recycler Gate 3',
  },
];

// ==========================================
// MLP CONSTRUCTION UPCYCLING MOCK DATA
// ==========================================
export interface MockProductionRun {
  id: string;
  runCode: string;
  mrfName: string;
  productType: 'PAVER_BLOCK' | 'FENCING_POST' | 'ROOF_SHEET' | 'ROAD_ADDITIVE';
  productName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  mlpInputKg: number;
  sandInputKg: number;
  binderInputKg: number;
  outputQuantity: number;
  outputUnit: string;
  yieldRatioPercent: number;
  grade: 'A' | 'B' | 'C';
  compressiveStrengthMpa: number;
  waterAbsorptionPercent: number;
  energyKwh: number;
  operatorName: string;
  machineId: string;
  sourceBatches: string[];
  createdAt: string;
}

export const MOCK_PRODUCTION_RUNS: MockProductionRun[] = [
  {
    id: 'PRD-001',
    runCode: 'RUN-2026-PV-081',
    mrfName: 'Thiruvallur Central PWMU',
    productType: 'PAVER_BLOCK',
    productName: 'EcoPave M30 Interlocking Paver (MLP 30%)',
    status: 'COMPLETED',
    mlpInputKg: 360,
    sandInputKg: 720,
    binderInputKg: 120,
    outputQuantity: 480,
    outputUnit: 'Blocks',
    yieldRatioPercent: 96.5,
    grade: 'A',
    compressiveStrengthMpa: 34.2,
    waterAbsorptionPercent: 3.1,
    energyKwh: 48.5,
    operatorName: 'Murugan K. (Shift A)',
    machineId: 'HYD-PRESS-02',
    sourceBatches: ['BAT-2026-10-001', 'BAT-2026-10-002'],
    createdAt: '18 Oct 2026, 09:30 AM',
  },
  {
    id: 'PRD-002',
    runCode: 'RUN-2026-FP-042',
    mrfName: 'Thiruvallur Central PWMU',
    productType: 'FENCING_POST',
    productName: 'Agrishield 6ft Recycled Composite Post',
    status: 'COMPLETED',
    mlpInputKg: 280,
    sandInputKg: 140,
    binderInputKg: 70,
    outputQuantity: 35,
    outputUnit: 'Poles',
    yieldRatioPercent: 94.0,
    grade: 'A',
    compressiveStrengthMpa: 28.6,
    waterAbsorptionPercent: 1.8,
    energyKwh: 62.0,
    operatorName: 'Selvam R.',
    machineId: 'EXTRUDER-01',
    sourceBatches: ['BAT-2026-10-003'],
    createdAt: '17 Oct 2026, 14:15 PM',
  },
  {
    id: 'PRD-003',
    runCode: 'RUN-2026-RD-019',
    mrfName: 'Thiruvallur Central PWMU',
    productType: 'ROAD_ADDITIVE',
    productName: 'IRC:SP:98 Shredded MLP Bitumen Modifier (2-4mm)',
    status: 'COMPLETED',
    mlpInputKg: 500,
    sandInputKg: 0,
    binderInputKg: 0,
    outputQuantity: 490,
    outputUnit: 'kg',
    yieldRatioPercent: 98.0,
    grade: 'A',
    compressiveStrengthMpa: 0,
    waterAbsorptionPercent: 0.4,
    energyKwh: 34.0,
    operatorName: 'Karthik V.',
    machineId: 'SHREDDER-HEAVY-03',
    sourceBatches: ['BAT-2026-10-004', 'BAT-2026-10-005'],
    createdAt: '16 Oct 2026, 11:00 AM',
  },
  {
    id: 'PRD-004',
    runCode: 'RUN-2026-RS-008',
    mrfName: 'Thiruvallur Central PWMU',
    productType: 'ROOF_SHEET',
    productName: 'Corrugated Thermal Insulated Roofing Sheet (8ft)',
    status: 'IN_PROGRESS',
    mlpInputKg: 220,
    sandInputKg: 110,
    binderInputKg: 40,
    outputQuantity: 0,
    outputUnit: 'Sheets',
    yieldRatioPercent: 0,
    grade: 'B',
    compressiveStrengthMpa: 0,
    waterAbsorptionPercent: 0,
    energyKwh: 18.2,
    operatorName: 'Murugan K.',
    machineId: 'HOT-PRESS-LINE-1',
    sourceBatches: ['BAT-2026-10-006'],
    createdAt: '20 Oct 2026, 08:00 AM',
  },
];

// ==========================================
// DEMAND-DRIVEN DYNAMIC ROUTING MOCK DATA
// ==========================================
export interface MockPickupRequest {
  id: string;
  requestCode: string;
  villageName: string;
  collectionPointName: string;
  fillLevelPercent: number;
  estimatedWeightKg: number;
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  status: 'PENDING' | 'ASSIGNED' | 'COMPLETED';
  requestType: 'BIN_OVERFLOW_IOT' | 'GP_ON_DEMAND' | 'WEEKLY_SCHEDULED';
  assignedVehicle?: string;
  createdAt: string;
}

export const MOCK_PICKUP_REQUESTS: MockPickupRequest[] = [
  {
    id: 'REQ-101',
    requestCode: 'PICK-2026-101',
    villageName: 'Perambakkam',
    collectionPointName: 'Weekly Shandy Market Gate',
    fillLevelPercent: 96,
    estimatedWeightKg: 85,
    urgency: 'CRITICAL',
    status: 'PENDING',
    requestType: 'BIN_OVERFLOW_IOT',
    createdAt: '20 Oct 2026, 07:15 AM',
  },
  {
    id: 'REQ-102',
    requestCode: 'PICK-2026-102',
    villageName: 'Kadambathur',
    collectionPointName: 'Panchayat Union Office Bin',
    fillLevelPercent: 88,
    estimatedWeightKg: 62,
    urgency: 'HIGH',
    status: 'PENDING',
    requestType: 'BIN_OVERFLOW_IOT',
    createdAt: '20 Oct 2026, 08:30 AM',
  },
  {
    id: 'REQ-103',
    requestCode: 'PICK-2026-103',
    villageName: 'Tiruvallur Block',
    collectionPointName: 'Community Health Centre',
    fillLevelPercent: 78,
    estimatedWeightKg: 44,
    urgency: 'NORMAL',
    status: 'ASSIGNED',
    assignedVehicle: 'TN-20-CZ-4412 (E-Tipper)',
    requestType: 'WEEKLY_SCHEDULED',
    createdAt: '20 Oct 2026, 06:45 AM',
  },
  {
    id: 'REQ-104',
    requestCode: 'PICK-2026-104',
    villageName: 'Manavala Nagar',
    collectionPointName: 'Bus Terminus Bin 2',
    fillLevelPercent: 91,
    estimatedWeightKg: 70,
    urgency: 'HIGH',
    status: 'PENDING',
    requestType: 'GP_ON_DEMAND',
    createdAt: '20 Oct 2026, 09:10 AM',
  },
];

export interface MockOptimizationLog {
  id: string;
  planName: string;
  triggerType: string;
  stopsCount: number;
  baselineDistanceKm: number;
  optimizedDistanceKm: number;
  distanceSavedKm: number;
  fuelSavedLitres: number;
  fuelSavedINR: number;
  co2SavedKg: number;
  solverDurationMs: number;
  algorithm: string;
  timestamp: string;
}

export const MOCK_OPTIMIZATION_LOGS: MockOptimizationLog[] = [
  {
    id: 'OPT-301',
    planName: 'Morning Circuit - Tiruvallur East Corridor',
    triggerType: 'IoT Fill Threshold (>85%)',
    stopsCount: 7,
    baselineDistanceKm: 46.8,
    optimizedDistanceKm: 31.4,
    distanceSavedKm: 15.4,
    fuelSavedLitres: 1.93,
    fuelSavedINR: 177.56,
    co2SavedKg: 5.17,
    solverDurationMs: 420,
    algorithm: 'OR-Tools Guided Local Search (CVRP)',
    timestamp: '20 Oct 2026, 07:30 AM',
  },
  {
    id: 'OPT-300',
    planName: 'Kadambathur Cluster Demand Re-route',
    triggerType: 'On-Demand GP Alert',
    stopsCount: 5,
    baselineDistanceKm: 38.2,
    optimizedDistanceKm: 27.6,
    distanceSavedKm: 10.6,
    fuelSavedLitres: 1.33,
    fuelSavedINR: 122.36,
    co2SavedKg: 3.56,
    solverDurationMs: 310,
    algorithm: 'OR-Tools Guided Local Search (CVRP)',
    timestamp: '19 Oct 2026, 14:00 PM',
  },
  {
    id: 'OPT-299',
    planName: 'Weekend Bulk Aggregation Route',
    triggerType: 'Scheduled Sunday Run',
    stopsCount: 9,
    baselineDistanceKm: 62.5,
    optimizedDistanceKm: 44.0,
    distanceSavedKm: 18.5,
    fuelSavedLitres: 2.31,
    fuelSavedINR: 212.52,
    co2SavedKg: 6.19,
    solverDurationMs: 580,
    algorithm: 'OR-Tools Guided Local Search (CVRP)',
    timestamp: '18 Oct 2026, 06:15 AM',
  },
];

// ==========================================
// PWMU O&M FINANCIAL SUSTAINABILITY MOCK DATA
// ==========================================
export interface MockFinancialEntry {
  id: string;
  type: 'EXPENSE' | 'REVENUE';
  categoryOrSource: string;
  description: string;
  amountINR: number;
  periodDate: string;
  recordedBy: string;
}

export const MOCK_OPERATIONAL_FINANCES: {
  monthlySummary: {
    totalRevenueINR: number;
    totalExpenseINR: number;
    netBalanceINR: number;
    recoveryRatioPercent: number;
    costPerKgProcessedINR: number;
    revenuePerKgProcessedINR: number;
  };
  expenses: MockFinancialEntry[];
  revenues: MockFinancialEntry[];
} = {
  monthlySummary: {
    totalRevenueINR: 184500,
    totalExpenseINR: 142200,
    netBalanceINR: 42300,
    recoveryRatioPercent: 129.7, // > 100% means self-sustaining!
    costPerKgProcessedINR: 9.48,
    revenuePerKgProcessedINR: 12.30,
  },
  expenses: [
    {
      id: 'EXP-101',
      type: 'EXPENSE',
      categoryOrSource: 'LABOR',
      description: 'SHG Machine Operators & Sorters (6 staff x ₹12,000/mo)',
      amountINR: 72000,
      periodDate: '15 Oct 2026',
      recordedBy: 'Accounts Officer R. Devi',
    },
    {
      id: 'EXP-102',
      type: 'EXPENSE',
      categoryOrSource: 'ELECTRICITY',
      description: 'PWMU Industrial Grid Power (TANGEDCO Tariff V)',
      amountINR: 28400,
      periodDate: '10 Oct 2026',
      recordedBy: 'Accounts Officer R. Devi',
    },
    {
      id: 'EXP-103',
      type: 'EXPENSE',
      categoryOrSource: 'FUEL',
      description: 'Diesel for 2 E-Tippers & Pickup Van (aggregation routes)',
      amountINR: 22800,
      periodDate: '18 Oct 2026',
      recordedBy: 'Fleet Supervisor S. Balan',
    },
    {
      id: 'EXP-104',
      type: 'EXPENSE',
      categoryOrSource: 'MAINTENANCE',
      description: 'Hydraulic Press seal replacement & shredder blade sharpening',
      amountINR: 14000,
      periodDate: '08 Oct 2026',
      recordedBy: 'Plant Manager K. Murugan',
    },
    {
      id: 'EXP-105',
      type: 'EXPENSE',
      categoryOrSource: 'CONSUMABLES',
      description: 'Binding wire, QR bale tags, safety gloves & PPE kit refill',
      amountINR: 5000,
      periodDate: '04 Oct 2026',
      recordedBy: 'Plant Manager K. Murugan',
    },
  ],
  revenues: [
    {
      id: 'REV-201',
      type: 'REVENUE',
      categoryOrSource: 'UPCYCLED_PRODUCT',
      description: 'Sale of 12,000 EcoPave blocks to Kadambathur GP for village roads',
      amountINR: 96000,
      periodDate: '12 Oct 2026',
      recordedBy: 'Marketing Lead T. Ramesh',
    },
    {
      id: 'REV-202',
      type: 'REVENUE',
      categoryOrSource: 'RECYCLER_SALE',
      description: 'Dispatch of 4.2 MT Baled Rigid HDPE & PP to Apex Recyclers',
      amountINR: 46200,
      periodDate: '14 Oct 2026',
      recordedBy: 'Logistics Desk',
    },
    {
      id: 'REV-203',
      type: 'REVENUE',
      categoryOrSource: 'EPR_CREDIT',
      description: 'CPCB EPR Certificate monetization (Category III MLP, ₹1.8/kg)',
      amountINR: 27000,
      periodDate: '16 Oct 2026',
      recordedBy: 'Compliance Desk',
    },
    {
      id: 'REV-204',
      type: 'REVENUE',
      categoryOrSource: 'GP_FEE',
      description: 'Monthly SWM user fee aggregation contribution from 5 Gram Panchayats',
      amountINR: 15300,
      periodDate: '01 Oct 2026',
      recordedBy: 'Panchayat Liaison',
    },
  ],
};

// ==========================================
// FORWARD LINKAGE & PWD MARKETPLACE MOCK DATA
// ==========================================
export interface MockProduct {
  id: string;
  name: string;
  productType: 'PAVER_BLOCK' | 'FENCING_POST' | 'ROOF_SHEET' | 'ROAD_ADDITIVE';
  specification: string;
  unitPriceINR: number;
  unit: string;
  availableStock: number;
  mlpContentKgPerUnit: number;
  standardCompliance: string;
  testedStrength: string;
  photoUrl: string;
  inStock: boolean;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'PROD-01',
    name: 'EcoPave M30 Interlocking Paver (Zig-Zag 60mm)',
    productType: 'PAVER_BLOCK',
    specification: 'Heavy duty composite paver block. Made with 30% cleaned post-consumer MLP + M-Sand + Cement.',
    unitPriceINR: 8.50,
    unit: 'Block',
    availableStock: 14500,
    mlpContentKgPerUnit: 0.75,
    standardCompliance: 'IS 15658:2006 Precast Concrete Blocks',
    testedStrength: '34.2 MPa Compressive Strength',
    photoUrl: '/images/products/paver.jpg',
    inStock: true,
  },
  {
    id: 'PROD-02',
    name: 'Agrishield 6ft Recycled Composite Fencing Post',
    productType: 'FENCING_POST',
    specification: 'Weatherproof, termite-resistant post for agricultural boundary fencing. Replaces concrete or wood.',
    unitPriceINR: 240.00,
    unit: 'Post',
    availableStock: 420,
    mlpContentKgPerUnit: 8.0,
    standardCompliance: 'Rural Infrastructure Guideline R-2024',
    testedStrength: '28.6 MPa Flexural Strength',
    photoUrl: '/images/products/post.jpg',
    inStock: true,
  },
  {
    id: 'PROD-03',
    name: 'IRC:SP:98 Shredded MLP Bitumen Modifier (2-4mm)',
    productType: 'ROAD_ADDITIVE',
    specification: 'Cleaned, shredded multi-layer plastic flakes for hot-mix bitumen rural road surfacing. Improves Marshall Stability by 22%.',
    unitPriceINR: 14.00,
    unit: 'kg',
    availableStock: 6800,
    mlpContentKgPerUnit: 1.0,
    standardCompliance: 'IRC:SP:98-2020 Guidelines for Polymer Modified Bitumen',
    testedStrength: 'Marshall Stability 14.8 kN (Req >12 kN)',
    photoUrl: '/images/products/flakes.jpg',
    inStock: true,
  },
  {
    id: 'PROD-04',
    name: 'Corrugated Thermal Insulated Roofing Sheet (8ft x 3ft)',
    productType: 'ROOF_SHEET',
    specification: 'High acoustic and thermal insulation sheet for village sheds, cow shelters, and community storage.',
    unitPriceINR: 420.00,
    unit: 'Sheet',
    availableStock: 165,
    mlpContentKgPerUnit: 7.2,
    standardCompliance: 'CPWD Green Building Spec Annexure B',
    testedStrength: 'Impact Resistant (>200 Joules)',
    photoUrl: '/images/products/sheet.jpg',
    inStock: true,
  },
];

export interface MockSaleOrder {
  id: string;
  orderCode: string;
  buyerName: string;
  buyerType: 'GRAM_PANCHAYAT' | 'PWD' | 'CONTRACTOR' | 'INDIVIDUAL';
  deliveryAddress: string;
  items: { productName: string; quantity: number; unitPriceINR: number; totalINR: number }[];
  totalAmountINR: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  orderDate: string;
  deliveryDate?: string;
  notes: string;
}

export const MOCK_ORDERS: MockSaleOrder[] = [
  {
    id: 'ORD-501',
    orderCode: 'PO-PWD-2026-089',
    buyerName: 'Tamil Nadu Highways & Rural Roads Wing (PWD)',
    buyerType: 'PWD',
    deliveryAddress: 'SH-57 Km 14+200 Stretch Worksite, Tiruvallur',
    items: [
      {
        productName: 'IRC:SP:98 Shredded MLP Bitumen Modifier (2-4mm)',
        quantity: 4000,
        unitPriceINR: 14.00,
        totalINR: 56000,
      },
    ],
    totalAmountINR: 56000,
    status: 'DELIVERED',
    orderDate: '10 Oct 2026',
    deliveryDate: '15 Oct 2026',
    notes: 'For 3.2 km rural PMGSY asphalt widening work under IRC:SP:98 norms.',
  },
  {
    id: 'ORD-502',
    orderCode: 'PO-GP-2026-012',
    buyerName: 'Kadambathur Village Gram Panchayat',
    buyerType: 'GRAM_PANCHAYAT',
    deliveryAddress: 'Panchayat Union School Play Area, Kadambathur',
    items: [
      {
        productName: 'EcoPave M30 Interlocking Paver (Zig-Zag 60mm)',
        quantity: 5000,
        unitPriceINR: 8.50,
        totalINR: 42500,
      },
      {
        productName: 'Agrishield 6ft Recycled Composite Fencing Post',
        quantity: 40,
        unitPriceINR: 240.00,
        totalINR: 9600,
      },
    ],
    totalAmountINR: 52100,
    status: 'DISPATCHED',
    orderDate: '16 Oct 2026',
    deliveryDate: '22 Oct 2026',
    notes: 'School approach path paving funded under 15th Finance Commission grant.',
  },
  {
    id: 'ORD-503',
    orderCode: 'PO-CON-2026-044',
    buyerName: 'Sri Balaji Infrastructure & Civil Works',
    buyerType: 'CONTRACTOR',
    deliveryAddress: 'Arakkonam Rural Sub-division Worksite',
    items: [
      {
        productName: 'EcoPave M30 Interlocking Paver (Zig-Zag 60mm)',
        quantity: 8000,
        unitPriceINR: 8.50,
        totalINR: 68000,
      },
    ],
    totalAmountINR: 68000,
    status: 'PENDING',
    orderDate: '19 Oct 2026',
    notes: 'Awaiting truck dispatch scheduling from Thiruvallur MRF yard.',
  },
];

// ==========================================
// LOW-BANDWIDTH EDGE SYNC MOCK DATA
// ==========================================
export interface MockEdgeDevice {
  deviceId: string;
  deviceName: string;
  operatorRole: string;
  assignedVillage: string;
  lastSyncAt: string;
  networkType: '2G' | '3G' | '4G' | 'OFFLINE';
  signalDbm: number;
  pendingQueueCount: number;
  totalSyncedPayloads: number;
  compressionRatio: string;
}

export const MOCK_EDGE_DEVICES: MockEdgeDevice[] = [
  {
    deviceId: 'DEV-TAB-01',
    deviceName: 'Rugged Worker Tab #1',
    operatorRole: 'Village Waste Collection Agent',
    assignedVillage: 'Shanti Nagar & Perambakkam',
    lastSyncAt: 'Just now (18:15 PM)',
    networkType: '2G',
    signalDbm: -92,
    pendingQueueCount: 3,
    totalSyncedPayloads: 142,
    compressionRatio: '78% reduction (Gzip / CBOR)',
  },
  {
    deviceId: 'DEV-TAB-02',
    deviceName: 'Rugged Worker Tab #2',
    operatorRole: 'Village Waste Collection Agent',
    assignedVillage: 'Kadambathur Cluster',
    lastSyncAt: '42 mins ago',
    networkType: 'OFFLINE',
    signalDbm: -110,
    pendingQueueCount: 7,
    totalSyncedPayloads: 98,
    compressionRatio: '82% reduction (Gzip / CBOR)',
  },
  {
    deviceId: 'DEV-IOT-ESP32-A',
    deviceName: 'Smart Bin Gateway #A (ESP32-S3)',
    operatorRole: 'Ultrasonic Fill & Load Cell Node',
    assignedVillage: 'Weekly Shandy Market Gate',
    lastSyncAt: '4 mins ago',
    networkType: '2G',
    signalDbm: -85,
    pendingQueueCount: 0,
    totalSyncedPayloads: 648,
    compressionRatio: '91% delta binary packet',
  },
];

export interface MockOfflineQueueItem {
  id: string;
  deviceId: string;
  operationType: 'CREATE_BATCH' | 'UPDATE_BIN_FILL' | 'RECORD_COLLECTION' | 'LOG_EXPENSE';
  summary: string;
  capturedAt: string;
  status: 'QUEUED' | 'SYNCED' | 'FAILED';
  payloadBytes: number;
}

export const MOCK_OFFLINE_QUEUE: MockOfflineQueueItem[] = [
  {
    id: 'Q-901',
    deviceId: 'DEV-TAB-02',
    operationType: 'CREATE_BATCH',
    summary: 'Bagged 18.5 kg MLP at Shanti Nagar Community Bin #2',
    capturedAt: '20 Oct 2026, 16:40 PM',
    status: 'QUEUED',
    payloadBytes: 342,
  },
  {
    id: 'Q-902',
    deviceId: 'DEV-TAB-02',
    operationType: 'UPDATE_BIN_FILL',
    summary: 'Bin CP-04 fill level reading: 92% (Manual check)',
    capturedAt: '20 Oct 2026, 17:05 PM',
    status: 'QUEUED',
    payloadBytes: 184,
  },
  {
    id: 'Q-903',
    deviceId: 'DEV-TAB-02',
    operationType: 'RECORD_COLLECTION',
    summary: 'Citizen pickup confirmation at Door 44, North Street',
    capturedAt: '20 Oct 2026, 17:22 PM',
    status: 'QUEUED',
    payloadBytes: 210,
  },
  {
    id: 'Q-900',
    deviceId: 'DEV-TAB-01',
    operationType: 'CREATE_BATCH',
    summary: 'Batch B-092 weighed at Perambakkam Center (24.0 kg)',
    capturedAt: '20 Oct 2026, 15:30 PM',
    status: 'SYNCED',
    payloadBytes: 318,
  },
];
