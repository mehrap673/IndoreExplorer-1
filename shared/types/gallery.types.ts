import { Document } from 'mongoose';
import { z } from 'zod';

export interface IGallery extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  category: 'places' | 'culture' | 'food' | 'events' | 'people' | 'architecture';
  featured: boolean;
  tags: string[];
  photographer?: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const galleryValidation = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  category: z.enum(['places', 'culture', 'food', 'events', 'people', 'architecture']),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  photographer: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type GalleryType = z.infer<typeof galleryValidation>;