import * as SQLite from 'expo-sqlite';
import { OfflineBatch, SyncQueueItem, CachedCollectionPoint, SyncStatus, WasteCategory } from '../types';

export function generateUUID(): string {
  // RFC4122 compliant UUID v4 generator safe in all JS runtimes
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// In-memory fallback if native SQLite is unavailable (e.g. web or test runners)
class FallbackDatabase {
  private batches: Map<string, OfflineBatch> = new Map();
  private queue: Map<string, SyncQueueItem> = new Map();
  private points: Map<string, CachedCollectionPoint> = new Map();

  async init() {}

  async enqueue(
    entityType: SyncQueueItem['entityType'],
    action: SyncQueueItem['action'],
    payload: any,
    clientOperationId?: string
  ): Promise<SyncQueueItem> {
    const opId = clientOperationId || generateUUID();
    const item: SyncQueueItem = {
      id: generateUUID(),
      clientOperationId: opId,
      entityType,
      action,
      payload: JSON.stringify(payload),
      status: 'PENDING',
      retryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.queue.set(opId, item);
    return item;
  }

  async getPending(): Promise<SyncQueueItem[]> {
    return Array.from(this.queue.values()).filter((item) => item.status === 'PENDING' || item.status === 'FAILED');
  }

  async markSynced(clientOperationId: string): Promise<void> {
    const item = this.queue.get(clientOperationId);
    if (item) {
      item.status = 'SYNCED';
      item.updatedAt = new Date().toISOString();
    }
    // Also update batch if it matches
    for (const batch of this.batches.values()) {
      if (batch.clientOperationId === clientOperationId) {
        batch.syncStatus = 'SYNCED';
        batch.syncedAt = new Date().toISOString();
      }
    }
  }

  async markFailed(clientOperationId: string, error: string): Promise<void> {
    const item = this.queue.get(clientOperationId);
    if (item) {
      item.status = 'FAILED';
      item.retryCount += 1;
      item.lastError = error;
      item.updatedAt = new Date().toISOString();
    }
  }

  async createOfflineBatch(batch: Omit<OfflineBatch, 'id' | 'clientOperationId' | 'syncStatus' | 'createdAt'> & { clientOperationId?: string }): Promise<OfflineBatch> {
    const opId = batch.clientOperationId || generateUUID();
    const record: OfflineBatch = {
      ...batch,
      id: generateUUID(),
      clientOperationId: opId,
      syncStatus: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.batches.set(record.id, record);

    // Automatically enqueue to sync_queue
    await this.enqueue('batch', 'CREATE', record, opId);
    return record;
  }

  async getOfflineBatches(): Promise<OfflineBatch[]> {
    return Array.from(this.batches.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async cacheCollectionPoints(points: CachedCollectionPoint[]): Promise<void> {
    for (const p of points) {
      this.points.set(p.id, p);
    }
  }

  async getCachedCollectionPoints(): Promise<CachedCollectionPoint[]> {
    return Array.from(this.points.values()).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  async getStats() {
    const pendingCount = (await this.getPending()).length;
    const batches = await this.getOfflineBatches();
    return {
      pendingQueueCount: pendingCount,
      totalBatches: batches.length,
      syncedBatches: batches.filter((b) => b.syncStatus === 'SYNCED').length,
    };
  }
}

class SQLiteDatabase {
  private db: SQLite.SQLiteDatabase | null = null;
  private fallback = new FallbackDatabase();
  private isNative = false;

  constructor() {
    try {
      if (typeof SQLite.openDatabaseSync === 'function') {
        this.db = SQLite.openDatabaseSync('gram_circular.db');
        this.isNative = true;
        this.init();
      }
    } catch {
      // In web, tests, or non-native environments, use fallback
      this.isNative = false;
    }
  }

  public init(): void {
    if (!this.isNative || !this.db) return;

    try {
      this.db.execSync(`
        CREATE TABLE IF NOT EXISTS offline_batches (
          id TEXT PRIMARY KEY,
          batchNumber TEXT NOT NULL,
          clientOperationId TEXT NOT NULL UNIQUE,
          collectionPointId TEXT NOT NULL,
          collectionPointName TEXT NOT NULL,
          wasteType TEXT NOT NULL,
          weightKg REAL NOT NULL,
          condition TEXT,
          moisture TEXT,
          qualityGrade TEXT,
          storageZone TEXT,
          photoUri TEXT,
          qrPayload TEXT,
          status TEXT NOT NULL,
          syncStatus TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          syncedAt TEXT,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS sync_queue (
          id TEXT PRIMARY KEY,
          clientOperationId TEXT NOT NULL UNIQUE,
          entityType TEXT NOT NULL,
          action TEXT NOT NULL,
          payload TEXT NOT NULL,
          status TEXT NOT NULL,
          retryCount INTEGER DEFAULT 0,
          lastError TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS cached_collection_points (
          id TEXT PRIMARY KEY,
          code TEXT NOT NULL,
          name TEXT NOT NULL,
          ward TEXT NOT NULL,
          village TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          targetWeightKg REAL NOT NULL,
          collectedWeightKg REAL NOT NULL,
          status TEXT NOT NULL,
          sequenceOrder INTEGER NOT NULL,
          binTypes TEXT NOT NULL,
          lastUpdated TEXT NOT NULL
        );
      `);
    } catch (e) {
      console.warn('[DB] SQLite init warning, continuing with fallback:', e);
      this.isNative = false;
    }
  }

  public async enqueue(
    entityType: SyncQueueItem['entityType'],
    action: SyncQueueItem['action'],
    payload: any,
    clientOperationId?: string
  ): Promise<SyncQueueItem> {
    if (!this.isNative || !this.db) {
      return this.fallback.enqueue(entityType, action, payload, clientOperationId);
    }

    const opId = clientOperationId || generateUUID();
    const id = generateUUID();
    const payloadStr = JSON.stringify(payload);
    const now = new Date().toISOString();

    this.db.runSync(
      `INSERT OR REPLACE INTO sync_queue (id, clientOperationId, entityType, action, payload, status, retryCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'PENDING', 0, ?, ?);`,
      [id, opId, entityType, action, payloadStr, now, now]
    );

    return {
      id,
      clientOperationId: opId,
      entityType,
      action,
      payload: payloadStr,
      status: 'PENDING',
      retryCount: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  public async getPending(): Promise<SyncQueueItem[]> {
    if (!this.isNative || !this.db) {
      return this.fallback.getPending();
    }

    const rows = this.db.getAllSync<SyncQueueItem>(
      `SELECT * FROM sync_queue WHERE status IN ('PENDING', 'FAILED') ORDER BY createdAt ASC;`
    );
    return rows;
  }

  public async markSynced(clientOperationId: string): Promise<void> {
    if (!this.isNative || !this.db) {
      return this.fallback.markSynced(clientOperationId);
    }

    const now = new Date().toISOString();
    this.db.runSync(
      `UPDATE sync_queue SET status = 'SYNCED', updatedAt = ? WHERE clientOperationId = ?;`,
      [now, clientOperationId]
    );

    this.db.runSync(
      `UPDATE offline_batches SET syncStatus = 'SYNCED', syncedAt = ? WHERE clientOperationId = ?;`,
      [now, clientOperationId]
    );
  }

  public async markFailed(clientOperationId: string, error: string): Promise<void> {
    if (!this.isNative || !this.db) {
      return this.fallback.markFailed(clientOperationId, error);
    }

    const now = new Date().toISOString();
    this.db.runSync(
      `UPDATE sync_queue SET status = 'FAILED', retryCount = retryCount + 1, lastError = ?, updatedAt = ? WHERE clientOperationId = ?;`,
      [error, now, clientOperationId]
    );

    this.db.runSync(
      `UPDATE offline_batches SET syncStatus = 'FAILED' WHERE clientOperationId = ?;`,
      [clientOperationId]
    );
  }

  public async createOfflineBatch(
    batch: Omit<OfflineBatch, 'id' | 'clientOperationId' | 'syncStatus' | 'createdAt'> & { clientOperationId?: string }
  ): Promise<OfflineBatch> {
    if (!this.isNative || !this.db) {
      return this.fallback.createOfflineBatch(batch);
    }

    const opId = batch.clientOperationId || generateUUID();
    const id = generateUUID();
    const now = new Date().toISOString();

    this.db.runSync(
      `INSERT INTO offline_batches (
        id, batchNumber, clientOperationId, collectionPointId, collectionPointName,
        wasteType, weightKg, condition, moisture, qualityGrade, storageZone,
        photoUri, qrPayload, status, syncStatus, createdAt, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?);`,
      [
        id,
        batch.batchNumber,
        opId,
        batch.collectionPointId,
        batch.collectionPointName,
        batch.wasteType,
        batch.weightKg,
        batch.condition || null,
        batch.moisture || null,
        batch.qualityGrade || null,
        batch.storageZone || null,
        batch.photoUri || null,
        batch.qrPayload || null,
        batch.status,
        now,
        batch.notes || null,
      ]
    );

    const record: OfflineBatch = {
      ...batch,
      id,
      clientOperationId: opId,
      syncStatus: 'PENDING',
      createdAt: now,
    };

    // Auto enqueue to sync queue
    await this.enqueue('batch', 'CREATE', record, opId);
    return record;
  }

  public async getOfflineBatches(): Promise<OfflineBatch[]> {
    if (!this.isNative || !this.db) {
      return this.fallback.getOfflineBatches();
    }

    return this.db.getAllSync<OfflineBatch>(
      `SELECT * FROM offline_batches ORDER BY createdAt DESC;`
    );
  }

  public async cacheCollectionPoints(points: CachedCollectionPoint[]): Promise<void> {
    if (!this.isNative || !this.db) {
      return this.fallback.cacheCollectionPoints(points);
    }

    for (const p of points) {
      this.db.runSync(
        `INSERT OR REPLACE INTO cached_collection_points (
          id, code, name, ward, village, latitude, longitude,
          targetWeightKg, collectedWeightKg, status, sequenceOrder, binTypes, lastUpdated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          p.id,
          p.code,
          p.name,
          p.ward,
          p.village,
          p.latitude,
          p.longitude,
          p.targetWeightKg,
          p.collectedWeightKg,
          p.status,
          p.sequenceOrder,
          p.binTypes,
          p.lastUpdated,
        ]
      );
    }
  }

  public async getCachedCollectionPoints(): Promise<CachedCollectionPoint[]> {
    if (!this.isNative || !this.db) {
      return this.fallback.getCachedCollectionPoints();
    }

    return this.db.getAllSync<CachedCollectionPoint>(
      `SELECT * FROM cached_collection_points ORDER BY sequenceOrder ASC;`
    );
  }

  public async getStats() {
    if (!this.isNative || !this.db) {
      return this.fallback.getStats();
    }

    const pending = this.db.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM sync_queue WHERE status IN ('PENDING', 'FAILED');`
    );
    const batches = this.db.getFirstSync<{ total: number; synced: number }>(
      `SELECT COUNT(*) as total, SUM(CASE WHEN syncStatus = 'SYNCED' THEN 1 ELSE 0 END) as synced FROM offline_batches;`
    );

    return {
      pendingQueueCount: pending?.count || 0,
      totalBatches: batches?.total || 0,
      syncedBatches: batches?.synced || 0,
    };
  }
}

export const db = new SQLiteDatabase();
