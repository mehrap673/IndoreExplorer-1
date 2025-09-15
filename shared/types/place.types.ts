import { Document } from 'mongoose';
import { z } from 'zod';

export interface IPlace extends Document {
  name: string;
  description: string;
  category: 'historical' | 'religious' | 'modern' | 'nature';
  imageUrl: string;
  location: string;
  featured: boolean;
  rating?: number;
  visitingHours?: string;
  entryFee?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const placeValidation = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10),
  category: z.enum(['historical', 'religious', 'modern', 'nature']),
  imageUrl: z.string().url(),
  location: z.string().min(1),
  featured: z.boolean().optional(),
  rating: z.number().min(1).max(5).optional(),
  visitingHours: z.string().optional(),
  entryFee: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type PlaceType = z.infer<typeof placeValidation>;