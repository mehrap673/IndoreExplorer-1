import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// API Data Types (for external API responses)
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
  forecast: {
    day: string;
    icon: string;
    condition: string;
    high: number;
    low: number;
  }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  urlToImage?: string;
  category: string;
  url: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: 'historical' | 'religious' | 'modern' | 'nature';
  imageUrl: string;
  location: string;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'snacks' | 'sweets' | 'dinner';
  imageUrl: string;
  priceRange: string;
  rating: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  category: 'cultural' | 'religious' | 'festival' | 'food';
  imageUrl: string;
  location: string;
  price?: string;
}
