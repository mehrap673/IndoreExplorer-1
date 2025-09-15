import { Document } from 'mongoose';
import { z } from 'zod';

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

export type FoodType = z.infer<typeof foodValidation>;