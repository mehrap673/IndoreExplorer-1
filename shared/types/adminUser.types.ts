import { Document } from 'mongoose';
import { z } from 'zod';

export interface IAdminUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  updatedAt: Date;
}

export const adminUserValidation = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'super_admin']).optional(),
});

export type AdminUserType = z.infer<typeof adminUserValidation>;