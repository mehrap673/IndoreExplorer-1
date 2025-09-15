// --- User Management ---
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

// --- Content: Places ---
export interface Place {
  _id: string;
  name: string;
  description: string;
  category: "historical" | "religious" | "modern" | "nature";
  imageUrl: string;
  location: string;
  featured: boolean;
  rating?: number;
  visitingHours?: string;
  entryFee?: string;
  isActive: boolean;
}

// --- Content: Food ---
export interface Food {
  _id: string;
  name: string;
  description: string;
  category: "breakfast" | "snacks" | "sweets" | "dinner" | "beverages";
  imageUrl: string;
  priceRange: string;
  rating?: number;
  featured: boolean;
  ingredients: string[];
  restaurants: string[];
  isVegetarian: boolean;
  isActive: boolean;
}

// --- Content: Events ---
export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string; // Stored as ISO string
  endDate?: string; // Stored as ISO string
  category: "cultural" | "religious" | "festival" | "food" | "music";
  imageUrl: string;
  location: string;
  price?: string;
  organizer?: string;
  featured: boolean;
  isActive: boolean;
}

// --- Content: Gallery ---
export interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category:
    | "places"
    | "culture"
    | "food"
    | "events"
    | "people"
    | "architecture";
  featured: boolean;
  tags: string[];
  photographer?: string;
  location?: string;
  isActive: boolean;
}

// --- Content: About/History ---
export interface AboutSection {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  order: number; // To determine the display order
  isActive: boolean;
}

// --- Communication ---
export interface ContactMessage {
  _id:string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  reply?: string;
  replyDate?: string; // Stored as ISO string
  createdAt: string; // Stored as ISO string
}

// --- Site Configuration ---
export interface Setting {
  key: string;
  value: string;
}