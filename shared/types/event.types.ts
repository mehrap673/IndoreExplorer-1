import { Document } from 'mongoose';
import { z } from 'zod';

export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  endDate?: Date;
  category: 'cultural' | 'religious' | 'festival' | 'food' | 'music';
  imageUrl: string;
  location: string;
  price?: string;
  organizer?: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const eventValidation = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10),
  date: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  category: z.enum(['cultural', 'religious', 'festival', 'food', 'music']),
  imageUrl: z.string().url(),
  location: z.string().min(1),
  price: z.string().optional(),
  organizer: z.string().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type EventType = z.infer<typeof eventValidation>;