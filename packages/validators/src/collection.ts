import { z } from 'zod';

export const CreateVillageSchema = z.object({
  name: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  taluk: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/),
  latitude: z.number().min(8).max(37),
  longitude: z.number().min(68).max(97),
  population: z.number().int().positive(),
  wardCount: z.number().int().positive(),
});

export const CreateCollectionPointSchema = z.object({
  villageId: z.string().uuid(),
  name: z.string().min(2).max(100),
  address: z.string().min(5).max(300),
  latitude: z.number().min(8).max(37),
  longitude: z.number().min(68).max(97),
  wasteStreams: z.array(z.string()).min(1),
});

export const CitizenReportSchema = z.object({
  villageId: z.string().uuid(),
  collectionPointId: z.string().uuid().optional(),
  reportType: z.enum(['OVERFLOW_BIN', 'WASTE_ACCUMULATION', 'OTHER']),
  description: z.string().min(10).max(500),
  photoUrl: z.string().url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  reportedBy: z.string().min(2).max(100),
});
