import mongoose, { Schema } from 'mongoose';
import { IPlace } from '../../shared/types/place.types';

const PlaceSchema = new Schema<IPlace>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['historical', 'religious', 'modern', 'nature'], required: true },
  imageUrl: { type: String, required: true },
  location: { type: String, required: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5 },
  visitingHours: { type: String },
  entryFee: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Place = mongoose.model<IPlace>('Place', PlaceSchema);