import mongoose, { Schema } from 'mongoose';
import { IAbout } from '../../shared/types/about.types';

const AboutSchema = new Schema<IAbout>({
  section: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const About = mongoose.model<IAbout>('About', AboutSchema);