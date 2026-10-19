import { z } from 'zod';
import { WasteStream, MaterialSubtype, WeightSource } from '@gram-circular/types';

export const CreateBatchSchema = z.object({
  collectionPointId: z.string().uuid(),
  wasteStream: z.nativeEnum(WasteStream),
  materialSubtype: z.nativeEnum(MaterialSubtype).optional(),
  grossWeightKg: z.number().positive().max(10000),
  tareWeightKg: z.number().min(0).default(0),
  weightSource: z.nativeEnum(WeightSource),
  workerName: z.string().min(2).max(100),
  notes: z.string().max(500).optional(),
  photoUrl: z.string().url().optional(),
  deviceId: z.string().optional(),
  clientOperationId: z.string().uuid(),
});

export type CreateBatchDto = z.infer<typeof CreateBatchSchema>;

export const UpdateBatchStatusSchema = z.object({
  status: z.string(),
  performedBy: z.string(),
  notes: z.string().optional(),
});
