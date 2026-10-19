import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

function qrToken(suffix?: string) {
  return suffix ? `qr_${suffix}_${randomBytes(8).toString('hex')}` : randomBytes(16).toString('hex');
}

async function main() {
  console.log('Seeding GRAM-CIRCULAR SIH 2026 demo data...');

  // Cleanup in reverse dependency order
  await prisma.processingEvidence.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.dispatchBatch.deleteMany();
  await prisma.dispatch.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.qualityInspection.deleteMany();
  await prisma.batchEvent.deleteMany();
  await prisma.wasteBatch.deleteMany();
  await prisma.bin.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.routePlan.deleteMany();
  await prisma.collectionPoint.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.storageZone.deleteMany();
  await prisma.purchaseRequest.deleteMany();
  await prisma.processor.deleteMany();
  await prisma.citizenReport.deleteMany();
  await prisma.collectionSchedule.deleteMany();
  await prisma.rewardTransaction.deleteMany();
  await prisma.village.deleteMany();
  await prisma.deviceReading.deleteMany();
  await prisma.weighingDevice.deleteMany();
  await prisma.anomalyFlag.deleteMany();
  await prisma.syncOperation.deleteMany();

  // ── 1. Villages ────────────────────────────────────────────
  const shantiNagar = await prisma.village.create({
    data: {
      name: 'Shanti Nagar',
      district: 'Coimbatore',
      taluk: 'Coimbatore South',
      pincode: '641001',
      latitude: 11.0168,
      longitude: 76.9558,
      population: 3200,
      wardCount: 8,
    },
  });

  const gandhiStreet = await prisma.village.create({
    data: {
      name: 'Gandhi Street Colony',
      district: 'Coimbatore',
      taluk: 'Coimbatore South',
      pincode: '641002',
      latitude: 11.025,
      longitude: 76.964,
      population: 2100,
      wardCount: 5,
    },
  });

  const kovilpattu = await prisma.village.create({
    data: {
      name: 'Kovilpattu',
      district: 'Coimbatore',
      taluk: 'Pollachi',
      pincode: '642003',
      latitude: 10.655,
      longitude: 77.014,
      population: 1800,
      wardCount: 4,
    },
  });

  // ── 2. Collection Points (CP-01 to CP-05) ───────────────────
  const cp01 = await prisma.collectionPoint.create({
    data: {
      villageId: shantiNagar.id,
      name: 'CP-01 Main Market Junction',
      address: 'Near Bus Stand, Main Road, Shanti Nagar',
      latitude: 11.017,
      longitude: 76.956,
      wasteStreams: ['MLP', 'DRY', 'WET'],
      lastCollectedAt: new Date(Date.now() - 2 * 3600000),
    },
  });

  const cp02 = await prisma.collectionPoint.create({
    data: {
      villageId: shantiNagar.id,
      name: 'CP-02 Ward 4 Community Hall',
      address: 'Ward 4, Community Hall Road, Shanti Nagar',
      latitude: 11.019,
      longitude: 76.958,
      wasteStreams: ['MLP', 'DRY'],
      lastCollectedAt: new Date(Date.now() - 5 * 3600000),
    },
  });

  const cp03 = await prisma.collectionPoint.create({
    data: {
      villageId: gandhiStreet.id,
      name: 'CP-03 Gandhi Street Market',
      address: 'Gandhi Street, Near Temple, Gandhi Street Colony',
      latitude: 11.026,
      longitude: 76.965,
      wasteStreams: ['MLP', 'DRY', 'WET', 'HAZARDOUS'],
      lastCollectedAt: new Date(Date.now() - 1 * 3600000),
    },
  });

  const cp04 = await prisma.collectionPoint.create({
    data: {
      villageId: kovilpattu.id,
      name: 'CP-04 Kovilpattu Central',
      address: 'Main Street, Kovilpattu Village',
      latitude: 10.656,
      longitude: 77.015,
      wasteStreams: ['MLP', 'DRY'],
      lastCollectedAt: new Date(Date.now() - 28 * 3600000),
    },
  });

  const cp05 = await prisma.collectionPoint.create({
    data: {
      villageId: shantiNagar.id,
      name: 'CP-05 Primary Health Centre',
      address: 'PHC Campus, Hospital Road, Shanti Nagar',
      latitude: 11.021,
      longitude: 76.9595,
      wasteStreams: ['MLP', 'DRY', 'SANITARY'],
      lastCollectedAt: new Date(Date.now() - 4 * 3600000),
    },
  });

  // ── 3. Bins with Fill Level Sensors ───────────────────────
  await prisma.bin.createMany({
    data: [
      {
        collectionPointId: cp01.id,
        serialNumber: 'BIN-SN-001-MLP',
        wasteStream: 'MLP',
        capacityLitres: 240,
        fillLevel: 'HIGH',
        fillPercent: 82,
        sensorDeviceId: 'SENS-001-ULTRASONIC',
        lastReadingAt: new Date(Date.now() - 25 * 60000),
      },
      {
        collectionPointId: cp01.id,
        serialNumber: 'BIN-SN-001-DRY',
        wasteStream: 'DRY',
        capacityLitres: 120,
        fillLevel: 'MEDIUM',
        fillPercent: 55,
        sensorDeviceId: 'SENS-002-OPTICAL',
        lastReadingAt: new Date(Date.now() - 45 * 60000),
      },
      {
        collectionPointId: cp01.id,
        serialNumber: 'BIN-SN-001-WET',
        wasteStream: 'WET',
        capacityLitres: 120,
        fillLevel: 'LOW',
        fillPercent: 20,
        sensorDeviceId: 'SENS-003-WEIGHT',
        lastReadingAt: new Date(Date.now() - 60 * 60000),
      },
      {
        collectionPointId: cp02.id,
        serialNumber: 'BIN-SN-002-MLP',
        wasteStream: 'MLP',
        capacityLitres: 240,
        fillLevel: 'FULL',
        fillPercent: 95,
        sensorDeviceId: 'SENS-004-ULTRASONIC',
        lastReadingAt: new Date(Date.now() - 10 * 60000),
      },
      {
        collectionPointId: cp03.id,
        serialNumber: 'BIN-GS-003-MLP',
        wasteStream: 'MLP',
        capacityLitres: 240,
        fillLevel: 'HIGH',
        fillPercent: 78,
        sensorDeviceId: 'SENS-005-ULTRASONIC',
        lastReadingAt: new Date(Date.now() - 15 * 60000),
      },
      {
        collectionPointId: cp03.id,
        serialNumber: 'BIN-GS-003-DRY',
        wasteStream: 'DRY',
        capacityLitres: 120,
        fillLevel: 'MEDIUM',
        fillPercent: 48,
        sensorDeviceId: 'SENS-006-OPTICAL',
        lastReadingAt: new Date(Date.now() - 35 * 60000),
      },
      {
        collectionPointId: cp04.id,
        serialNumber: 'BIN-KP-004-MLP',
        wasteStream: 'MLP',
        capacityLitres: 120,
        fillLevel: 'EMPTY',
        fillPercent: 12,
        sensorDeviceId: 'SENS-007-ULTRASONIC',
        lastReadingAt: new Date(Date.now() - 120 * 60000),
      },
      {
        collectionPointId: cp05.id,
        serialNumber: 'BIN-SN-005-MLP',
        wasteStream: 'MLP',
        capacityLitres: 240,
        fillLevel: 'MEDIUM',
        fillPercent: 62,
        sensorDeviceId: 'SENS-008-ULTRASONIC',
        lastReadingAt: new Date(Date.now() - 20 * 60000),
      },
    ],
  });

  // ── 4. Vehicles with Capacities ───────────────────────────
  const vehicle1 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'TN-38-XX-1234',
      type: 'AUTO_RICKSHAW',
      capacityKg: 300,
      currentLoadKg: 42.5,
      driverName: 'Rajan Kumar',
      driverPhone: '9876543210',
      depotVillageId: shantiNagar.id,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'TN-38-YY-5678',
      type: 'MINI_TRUCK',
      capacityKg: 1500,
      currentLoadKg: 120.0,
      driverName: 'Selvam P',
      driverPhone: '9876543211',
      depotVillageId: shantiNagar.id,
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'TN-38-ZZ-9012',
      type: 'ELECTRIC_TIPPER',
      capacityKg: 800,
      currentLoadKg: 0,
      driverName: 'Karthik M',
      driverPhone: '9876543212',
      depotVillageId: gandhiStreet.id,
    },
  });

  // ── 5. Storage Zones (Zone A MLP, Zone B Dry, Zone C Mixed) ──
  const zoneA = await prisma.storageZone.create({
    data: {
      mrfId: 'MRF-CBE-001',
      name: 'Zone A MLP',
      wasteStream: 'MLP',
      capacityKg: 2500,
      currentStockKg: 420.5,
      location: 'Central MRF - Bay A (Multi-Layer Plastics)',
    },
  });

  const zoneB = await prisma.storageZone.create({
    data: {
      mrfId: 'MRF-CBE-001',
      name: 'Zone B Dry',
      wasteStream: 'DRY',
      capacityKg: 2000,
      currentStockKg: 180.0,
      location: 'Central MRF - Bay B (Recyclable Dry Waste)',
    },
  });

  const zoneC = await prisma.storageZone.create({
    data: {
      mrfId: 'MRF-CBE-001',
      name: 'Zone C Mixed',
      wasteStream: 'MIXED',
      capacityKg: 1500,
      currentStockKg: 95.0,
      location: 'Central MRF - Bay C (Mixed & Inerts)',
    },
  });

  // ── 6. Processors (GreenCycle Pvt Ltd, EcoPlast Recyclers) ───
  const processor1 = await prisma.processor.create({
    data: {
      name: 'GreenCycle Pvt Ltd',
      contactName: 'Arjun Nair',
      contactPhone: '9988776655',
      address: 'Plot 42, SIDCO Industrial Estate, Coimbatore - 641021',
      latitude: 11.0018,
      longitude: 76.9558,
      acceptedMaterials: ['MLP', 'PET', 'HDPE', 'LDPE'],
      minQuantityKg: 50,
      maxQuantityKg: 5000,
      indicativePricePerKg: 8.0,
      isVerified: true,
      isDemo: true,
    },
  });

  const processor2 = await prisma.processor.create({
    data: {
      name: 'EcoPlast Recyclers',
      contactName: 'Priya Devi',
      contactPhone: '9988776644',
      address: 'Pollachi Industrial Hub, Pollachi Road, Coimbatore - 642001',
      latitude: 10.66,
      longitude: 77.01,
      acceptedMaterials: ['MLP', 'HDPE', 'PP'],
      minQuantityKg: 100,
      maxQuantityKg: 4000,
      indicativePricePerKg: 7.5,
      isVerified: true,
      isDemo: true,
    },
  });

  // ── 7. Weighing Device ─────────────────────────────────────
  const device1 = await prisma.weighingDevice.create({
    data: {
      serialNumber: 'WD-2026-001',
      location: 'Central MRF Gate 1 Weighbridge',
      isOnline: true,
      lastPingAt: new Date(),
      calibratedAt: new Date(Date.now() - 5 * 24 * 3600000),
      isSimulated: true,
    },
  });

  // ── 8. MLP Batches with QR Tokens (MLP-2026-0143, 0142, etc.) ─
  const batch143 = await prisma.wasteBatch.create({
    data: {
      batchCode: 'MLP-2026-0143',
      qrToken: 'GC-QR-0143-' + qrToken('143'),
      collectionPointId: cp01.id,
      wasteStream: 'PLASTIC',
      materialSubtype: 'MLP',
      grossWeightKg: 42.5,
      tareWeightKg: 1.5,
      netWeightKg: 41.0,
      weightSource: 'DEVICE',
      deviceId: device1.id,
      calibrationStatus: 'VERIFIED',
      workerName: 'Murugan S',
      collectedAt: new Date(Date.now() - 2 * 3600000),
      status: 'IN_STORAGE',
      notes: 'Clean post-consumer MLP wrappers and packaging pouches',
      events: {
        create: [
          {
            eventType: 'BATCH_CREATED',
            toStatus: 'CREATED',
            performedBy: 'Murugan S',
            role: 'WORKER',
          },
          {
            eventType: 'STATUS_INSPECTED',
            fromStatus: 'CREATED',
            toStatus: 'INSPECTED',
            performedBy: 'Kavitha R',
            role: 'MRF_OPERATOR',
          },
          {
            eventType: 'STATUS_IN_STORAGE',
            fromStatus: 'INSPECTED',
            toStatus: 'IN_STORAGE',
            performedBy: 'Kavitha R',
            role: 'MRF_OPERATOR',
            notes: 'Moved into Zone A MLP',
          },
        ],
      },
      inspection: {
        create: {
          inspectorName: 'Kavitha R',
          contaminationLevel: 'LOW',
          moistureLevel: 'DRY',
          packagingCondition: 'GOOD',
          foreignMaterials: false,
          outcome: 'ACCEPTED',
          grade: 'A',
          notes: 'High-density MLP laminate suitable for coprocessing or pyrolysis',
          inspectedAt: new Date(Date.now() - 90 * 60000),
        },
      },
    },
  });

  const batch142 = await prisma.wasteBatch.create({
    data: {
      batchCode: 'MLP-2026-0142',
      qrToken: 'GC-QR-0142-' + qrToken('142'),
      collectionPointId: cp02.id,
      wasteStream: 'PLASTIC',
      materialSubtype: 'MLP',
      grossWeightKg: 58.2,
      tareWeightKg: 1.7,
      netWeightKg: 56.5,
      weightSource: 'DEVICE',
      deviceId: device1.id,
      calibrationStatus: 'VERIFIED',
      workerName: 'Suresh V',
      collectedAt: new Date(Date.now() - 8 * 3600000),
      status: 'DISPATCHED',
      notes: 'Baled MLP snack pouches and foil bags',
      events: {
        create: [
          {
            eventType: 'BATCH_CREATED',
            toStatus: 'CREATED',
            performedBy: 'Suresh V',
            role: 'WORKER',
          },
          {
            eventType: 'STATUS_INSPECTED',
            fromStatus: 'CREATED',
            toStatus: 'INSPECTED',
            performedBy: 'Kavitha R',
            role: 'MRF_OPERATOR',
          },
          {
            eventType: 'STATUS_IN_STORAGE',
            fromStatus: 'INSPECTED',
            toStatus: 'IN_STORAGE',
            performedBy: 'Kavitha R',
            role: 'MRF_OPERATOR',
          },
          {
            eventType: 'STATUS_DISPATCHED',
            fromStatus: 'IN_STORAGE',
            toStatus: 'DISPATCHED',
            performedBy: 'MRF Dispatch Manager',
            role: 'MRF_OPERATOR',
            notes: 'Dispatched to GreenCycle Pvt Ltd under DSP-2026-001',
          },
        ],
      },
      inspection: {
        create: {
          inspectorName: 'Kavitha R',
          contaminationLevel: 'LOW',
          moistureLevel: 'DRY',
          packagingCondition: 'GOOD',
          foreignMaterials: false,
          outcome: 'ACCEPTED',
          grade: 'A',
          notes: 'Verified Grade A industrial MLP scrap',
          inspectedAt: new Date(Date.now() - 7 * 3600000),
        },
      },
    },
  });

  const batch141 = await prisma.wasteBatch.create({
    data: {
      batchCode: 'MLP-2026-0141',
      qrToken: 'GC-QR-0141-' + qrToken('141'),
      collectionPointId: cp03.id,
      wasteStream: 'PLASTIC',
      materialSubtype: 'MLP',
      grossWeightKg: 31.4,
      tareWeightKg: 1.4,
      netWeightKg: 30.0,
      weightSource: 'MANUAL',
      workerName: 'Anitha K',
      collectedAt: new Date(Date.now() - 14 * 3600000),
      status: 'IN_STORAGE',
      notes: 'Community market collection: snack and biscuit wrappers',
      events: {
        create: [
          {
            eventType: 'BATCH_CREATED',
            toStatus: 'CREATED',
            performedBy: 'Anitha K',
            role: 'WORKER',
          },
          {
            eventType: 'STATUS_INSPECTED',
            fromStatus: 'CREATED',
            toStatus: 'INSPECTED',
            performedBy: 'Kavitha R',
            role: 'MRF_OPERATOR',
          },
          {
            eventType: 'STATUS_IN_STORAGE',
            fromStatus: 'INSPECTED',
            toStatus: 'IN_STORAGE',
            performedBy: 'Kavitha R',
            role: 'MRF_OPERATOR',
          },
        ],
      },
      inspection: {
        create: {
          inspectorName: 'Kavitha R',
          contaminationLevel: 'MEDIUM',
          moistureLevel: 'DRY',
          packagingCondition: 'GOOD',
          foreignMaterials: false,
          outcome: 'ACCEPTED',
          grade: 'B',
          notes: 'Slight organic residue, dry; acceptable for co-processing',
          inspectedAt: new Date(Date.now() - 12 * 3600000),
        },
      },
    },
  });

  const batch140 = await prisma.wasteBatch.create({
    data: {
      batchCode: 'MLP-2026-0140',
      qrToken: 'GC-QR-0140-' + qrToken('140'),
      collectionPointId: cp05.id,
      wasteStream: 'PLASTIC',
      materialSubtype: 'MLP',
      grossWeightKg: 22.0,
      tareWeightKg: 1.2,
      netWeightKg: 20.8,
      weightSource: 'SIMULATED',
      workerName: 'Murugan S',
      collectedAt: new Date(Date.now() - 45 * 60000),
      status: 'CREATED',
      notes: 'Freshly collected at PHC Campus bin',
      events: {
        create: {
          eventType: 'BATCH_CREATED',
          toStatus: 'CREATED',
          performedBy: 'Murugan S',
          role: 'WORKER',
        },
      },
    },
  });

  const batch139 = await prisma.wasteBatch.create({
    data: {
      batchCode: 'MLP-2026-0139',
      qrToken: 'GC-QR-0139-' + qrToken('139'),
      collectionPointId: cp04.id,
      wasteStream: 'PLASTIC',
      materialSubtype: 'MLP',
      grossWeightKg: 65.0,
      tareWeightKg: 1.8,
      netWeightKg: 63.2,
      weightSource: 'MANUAL',
      workerName: 'Selvam P',
      collectedAt: new Date(Date.now() - 3 * 3600000),
      status: 'IN_TRANSIT',
      notes: 'En route to MRF via Mini Truck',
      events: {
        create: [
          {
            eventType: 'BATCH_CREATED',
            toStatus: 'CREATED',
            performedBy: 'Selvam P',
            role: 'WORKER',
          },
          {
            eventType: 'STATUS_IN_TRANSIT',
            fromStatus: 'CREATED',
            toStatus: 'IN_TRANSIT',
            performedBy: 'Selvam P',
            role: 'DRIVER',
          },
        ],
      },
    },
  });

  // ── 9. Dispatches, Receipts & Processing Evidence ─────────
  const dispatch1 = await prisma.dispatch.create({
    data: {
      dispatchCode: 'DSP-2026-001',
      processorId: processor1.id,
      vehicleId: vehicle2.id,
      totalWeightKg: 56.5,
      scheduledDate: new Date(Date.now() - 4 * 3600000),
      createdBy: 'MRF Dispatch Manager',
      status: 'DELIVERED',
      notes: 'Priority dispatch for co-processing at GreenCycle SIDCO plant',
      batches: {
        create: [
          { batchId: batch142.id, weightKg: 56.5 },
        ],
      },
      receipts: {
        create: [
          {
            receivedBy: 'R. Balan (GreenCycle Store Incharge)',
            receivedWeightKg: 56.0,
            discrepancyKg: 0.5,
            notes: 'Gross 56.0kg received; tare verified at weighbridge',
            evidenceUrl: 'https://cdn.gramcircular.gov.in/evidence/gc-receipt-001.pdf',
            receivedAt: new Date(Date.now() - 2 * 3600000),
          },
        ],
      },
      processingEvidences: {
        create: [
          {
            processedWeightKg: 56.0,
            processType: 'PYROLYSIS_FUEL_RECOVERY',
            evidenceUrl: 'https://cdn.gramcircular.gov.in/evidence/gc-pyrolysis-cert-001.pdf',
            verifiedBy: 'Dr. C. Mohan (Certified EPR Auditor)',
            notes: 'Batch processed into pyrolysis oil and carbon black pellets for road asphalt',
            processedAt: new Date(Date.now() - 1 * 3600000),
          },
        ],
      },
    },
  });

  await prisma.dispatch.create({
    data: {
      dispatchCode: 'DSP-2026-002',
      processorId: processor2.id,
      vehicleId: vehicle3.id,
      totalWeightKg: 71.0,
      scheduledDate: new Date(Date.now() + 48 * 3600000),
      createdBy: 'MRF Dispatch Manager',
      status: 'CONFIRMED',
      notes: 'Scheduled delivery for mechanical recycling & plastic extrusion',
      batches: {
        create: [
          { batchId: batch143.id, weightKg: 41.0 },
          { batchId: batch141.id, weightKg: 30.0 },
        ],
      },
    },
  });

  // ── 10. Route Plans and Stops ─────────────────────────────
  const route1 = await prisma.routePlan.create({
    data: {
      vehicleId: vehicle1.id,
      status: 'COMPLETED',
      plannedDate: new Date(),
      estimatedDistanceKm: 14.2,
      estimatedDurationMin: 75,
      optimized: true,
      stops: {
        create: [
          {
            collectionPointId: cp01.id,
            sequence: 1,
            status: 'COMPLETED',
            collectedWeightKg: 42.5,
            actualArrival: new Date(Date.now() - 3 * 3600000),
          },
          {
            collectionPointId: cp02.id,
            sequence: 2,
            status: 'COMPLETED',
            collectedWeightKg: 58.2,
            actualArrival: new Date(Date.now() - 2 * 3600000),
          },
          {
            collectionPointId: cp05.id,
            sequence: 3,
            status: 'COMPLETED',
            collectedWeightKg: 22.0,
            actualArrival: new Date(Date.now() - 1 * 3600000),
          },
        ],
      },
    },
  });

  await prisma.routePlan.create({
    data: {
      vehicleId: vehicle2.id,
      status: 'PLANNED',
      plannedDate: new Date(Date.now() + 24 * 3600000),
      estimatedDistanceKm: 28.5,
      estimatedDurationMin: 120,
      optimized: false,
      stops: {
        create: [
          {
            collectionPointId: cp03.id,
            sequence: 1,
            status: 'PENDING',
          },
          {
            collectionPointId: cp04.id,
            sequence: 2,
            status: 'PENDING',
          },
        ],
      },
    },
  });

  // ── 11. Inventory Movements ───────────────────────────────
  await prisma.inventoryMovement.createMany({
    data: [
      {
        storageZoneId: zoneA.id,
        batchId: batch143.id,
        movementType: 'IN',
        weightKg: 41.0,
        performedBy: 'Kavitha R',
        notes: 'Batch MLP-2026-0143 placed in Bay A rack 4',
      },
      {
        storageZoneId: zoneA.id,
        batchId: batch141.id,
        movementType: 'IN',
        weightKg: 30.0,
        performedBy: 'Kavitha R',
        notes: 'Batch MLP-2026-0141 placed in Bay A rack 2',
      },
      {
        storageZoneId: zoneA.id,
        batchId: batch142.id,
        movementType: 'OUT',
        weightKg: 56.5,
        performedBy: 'MRF Dispatch Manager',
        notes: 'Dispatched to GreenCycle Pvt Ltd in DSP-2026-001',
      },
    ],
  });

  // ── 12. Collection Schedules ──────────────────────────────
  await prisma.collectionSchedule.createMany({
    data: [
      { villageId: shantiNagar.id, wasteStream: 'MLP', dayOfWeek: 1, timeSlot: '08:00-10:00' },
      { villageId: shantiNagar.id, wasteStream: 'DRY', dayOfWeek: 3, timeSlot: '08:00-10:00' },
      { villageId: shantiNagar.id, wasteStream: 'WET', dayOfWeek: 0, timeSlot: '07:00-09:00' },
      { villageId: gandhiStreet.id, wasteStream: 'MLP', dayOfWeek: 2, timeSlot: '09:00-11:00' },
      { villageId: gandhiStreet.id, wasteStream: 'DRY', dayOfWeek: 4, timeSlot: '09:00-11:00' },
      { villageId: kovilpattu.id, wasteStream: 'MLP', dayOfWeek: 5, timeSlot: '10:00-12:00' },
    ],
  });

  // ── 13. Citizen Reports ───────────────────────────────────
  await prisma.citizenReport.createMany({
    data: [
      {
        villageId: shantiNagar.id,
        collectionPointId: cp02.id,
        reportType: 'OVERFLOW',
        description: 'Ward 4 community bin is 95% full with snack packets spilling onto sidewalk.',
        reportedBy: 'K. Senthil (Ward 4 Resident)',
        status: 'PENDING',
        latitude: 11.019,
        longitude: 76.958,
      },
      {
        villageId: gandhiStreet.id,
        collectionPointId: cp03.id,
        reportType: 'MISSED_COLLECTION',
        description: 'Dry waste bin was scheduled for pickup Tuesday 9am, not yet collected.',
        reportedBy: 'Meenakshi Raman',
        status: 'IN_PROGRESS',
      },
      {
        villageId: kovilpattu.id,
        collectionPointId: cp04.id,
        reportType: 'ILLEGAL_DUMPING',
        description: 'Plastic packaging waste dumped near irrigation canal edge.',
        reportedBy: 'Panchayat Ward Member',
        status: 'RESOLVED',
        resolvedAt: new Date(Date.now() - 24 * 3600000),
      },
    ],
  });

  // ── 14. Anomaly Flags ─────────────────────────────────────
  await prisma.anomalyFlag.createMany({
    data: [
      {
        anomalyType: 'BIN_OVERFLOW',
        entityId: cp02.id,
        entityType: 'COLLECTION_POINT',
        description: 'Ultrasonic sensor reported 95% fill level at CP-02 Ward 4 Community Hall',
        severity: 'HIGH',
      },
      {
        anomalyType: 'NO_COLLECTION_24H',
        entityId: cp04.id,
        entityType: 'COLLECTION_POINT',
        description: 'No collection recorded at Kovilpattu Central in over 28 hours',
        severity: 'MEDIUM',
      },
    ],
  });

  // ── 15. Reward Transactions ───────────────────────────────
  await prisma.rewardTransaction.createMany({
    data: [
      { citizenName: 'Rajan Kumar', villageId: shantiNagar.id, points: 50, reason: 'Segregated MLP hand-in', referenceId: batch143.id },
      { citizenName: 'Priya S', villageId: shantiNagar.id, points: 30, reason: 'Accurate overflow report verified', referenceId: cp02.id },
      { citizenName: 'Murugan K', villageId: gandhiStreet.id, points: 50, reason: 'Clean plastic submission', referenceId: batch141.id },
    ],
  });

  console.log('✅ Seed complete with rich SIH 2026 demo data!');
  console.log(`   Villages: 3`);
  console.log(`   Collection Points: 5 (CP-01 to CP-05)`);
  console.log(`   Bins: 8`);
  console.log(`   Vehicles: 3`);
  console.log(`   Storage Zones: 3 (Zone A MLP, Zone B Dry, Zone C Mixed)`);
  console.log(`   Processors: 2 (GreenCycle Pvt Ltd, EcoPlast Recyclers)`);
  console.log(`   Batches: 5 (MLP-2026-0143, 0142, 0141, 0140, 0139)`);
  console.log(`   Dispatches: 2`);
  console.log(`   Receipts & Evidences: Yes`);
  console.log(`   Route Plans: 2`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
