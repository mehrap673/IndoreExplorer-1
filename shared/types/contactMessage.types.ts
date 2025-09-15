import { Document } from 'mongoose';
import { z } from 'zod';

export interface IContactMessage extends Document {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  reply?: string;
  replyDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const contactMessageValidation = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  subject: z.string().min(1).max(100),
  message: z.string().min(10),
});

export type ContactMessageType = z.infer<typeof contactMessageValidation>;