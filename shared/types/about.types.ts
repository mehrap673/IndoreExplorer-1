import { Document } from 'mongoose';
import { z } from 'zod';

export interface IAbout extends Document {
  section: string;
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const aboutValidation = z.object({
  section: z.string().min(1),
  title: z.string().min(1).max(100),
  content: z.string().min(10),
  imageUrl: z.string().url().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type AboutType = z.infer<typeof aboutValidation>;