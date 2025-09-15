import mongoose, { Schema } from 'mongoose';
import { IFood } from '../../shared/types/food.types';

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

export const Food = mongoose.model<IFood>('Food', FoodSchema);