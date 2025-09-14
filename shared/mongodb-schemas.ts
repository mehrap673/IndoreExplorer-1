import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Admin User Schema for authentication
export interface IAdminUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
}, { timestamps: true });

// Places Schema
export interface IPlace extends Document {
  name: string;
  description: string;
  category: 'historical' | 'religious' | 'modern' | 'nature';
  imageUrl: string;
  location: string;
  featured: boolean;
  rating?: number;
  visitingHours?: string;
  entryFee?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

// Food Schema
export interface IFood extends Document {
  name: string;
  description: string;
  category: 'breakfast' | 'snacks' | 'sweets' | 'dinner' | 'beverages';
  imageUrl: string;
  priceRange: string;
  rating?: number;
  featured: boolean;
  ingredients?: string[];
  restaurants?: string[];
  isVegetarian: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['breakfast', 'snacks', 'sweets', 'dinner', 'beverages'], required: true },
  imageUrl: { type: String, required: true },
  priceRange: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  featured: { type: Boolean, default: false },
  ingredients: [{ type: String }],
  restaurants: [{ type: String }],
  isVegetarian: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Events Schema
export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  endDate?: Date;
  category: 'cultural' | 'religious' | 'festival' | 'food' | 'music';
  imageUrl: string;
  location: string;
  price?: string;
  organizer?: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

// Gallery Schema
export interface IGallery extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  category: 'places' | 'culture' | 'food' | 'events' | 'people' | 'architecture';
  featured: boolean;
  tags: string[];
  photographer?: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

// About/History Schema
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

const AboutSchema = new Schema<IAbout>({
  section: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Contact Messages Schema
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

// Settings Schema for API keys and configuration
export interface ISettings extends Document {
  key: string;
  value: string;
  type: 'api_key' | 'config' | 'general';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  type: { type: String, enum: ['api_key', 'config', 'general'], required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Zod validation schemas for form validation
export const adminUserValidation = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'super_admin']).optional(),
});

export const placeValidation = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10),
  category: z.enum(['historical', 'religious', 'modern', 'nature']),
  imageUrl: z.string().url(),
  location: z.string().min(1),
  featured: z.boolean().optional(),
  rating: z.number().min(1).max(5).optional(),
  visitingHours: z.string().optional(),
  entryFee: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const foodValidation = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10),
  category: z.enum(['breakfast', 'snacks', 'sweets', 'dinner', 'beverages']),
  imageUrl: z.string().url(),
  priceRange: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  ingredients: z.array(z.string()).optional(),
  restaurants: z.array(z.string()).optional(),
  isVegetarian: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const eventValidation = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10),
  date: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  category: z.enum(['cultural', 'religious', 'festival', 'food', 'music']),
  imageUrl: z.string().url(),
  location: z.string().min(1),
  price: z.string().optional(),
  organizer: z.string().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const galleryValidation = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  category: z.enum(['places', 'culture', 'food', 'events', 'people', 'architecture']),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  photographer: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const aboutValidation = z.object({
  section: z.string().min(1),
  title: z.string().min(1).max(100),
  content: z.string().min(10),
  imageUrl: z.string().url().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const contactMessageValidation = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  subject: z.string().min(1).max(100),
  message: z.string().min(10),
});

export const settingsValidation = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  type: z.enum(['api_key', 'config', 'general']),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Create and export models
export const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
export const Place = mongoose.model<IPlace>('Place', PlaceSchema);
export const Food = mongoose.model<IFood>('Food', FoodSchema);
export const Event = mongoose.model<IEvent>('Event', EventSchema);
export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
export const About = mongoose.model<IAbout>('About', AboutSchema);
export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);

// Type exports for use in other files
export type AdminUserType = z.infer<typeof adminUserValidation>;
export type PlaceType = z.infer<typeof placeValidation>;
export type FoodType = z.infer<typeof foodValidation>;
export type EventType = z.infer<typeof eventValidation>;
export type GalleryType = z.infer<typeof galleryValidation>;
export type AboutType = z.infer<typeof aboutValidation>;
export type ContactMessageType = z.infer<typeof contactMessageValidation>;
export type SettingsType = z.infer<typeof settingsValidation>;