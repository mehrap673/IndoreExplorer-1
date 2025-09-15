import { Document } from 'mongoose';
import { z } from 'zod';

export interface ISettings extends Document {
  key: string;
  value: string;
  type: 'api_key' | 'config' | 'general';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const settingsValidation = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  type: z.enum(['api_key', 'config', 'general']),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type SettingsType = z.infer<typeof settingsValidation>;