import mongoose, { Schema } from 'mongoose';
import { IContactMessage } from '../../shared/types/contactMessage.types';

const ContactMessageSchema = new Schema<IContactMessage>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isReplied: { type: Boolean, default: false },
  reply: { type: String },
  replyDate: { type: Date },
}, { timestamps: true });

export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);