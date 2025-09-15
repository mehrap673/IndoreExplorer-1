import mongoose, { Schema } from 'mongoose';
import { ISettings } from '../../shared/types/settings.types';

const SettingsSchema = new Schema<ISettings>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  type: { type: String, enum: ['api_key', 'config', 'general'], required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);