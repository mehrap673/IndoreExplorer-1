import mongoose, { Schema } from 'mongoose';
import { IGallery } from '../../shared/types/gallery.types';

const GallerySchema = new Schema<IGallery>({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  category: { type: String, enum: ['places', 'culture', 'food', 'events', 'people', 'architecture'], required: true },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  photographer: { type: String },
  location: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);