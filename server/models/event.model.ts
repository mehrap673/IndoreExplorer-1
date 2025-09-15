import mongoose, { Schema } from 'mongoose';
import { IEvent } from '../../shared/types/event.types';

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  category: { type: String, enum: ['cultural', 'religious', 'festival', 'food', 'music'], required: true },
  imageUrl: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String },
  organizer: { type: String },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Event = mongoose.model<IEvent>('Event', EventSchema);