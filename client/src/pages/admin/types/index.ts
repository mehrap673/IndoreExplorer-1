export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

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

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  endDate?: string;
  category: "cultural" | "religious" | "festival" | "food" | "music";
  imageUrl: string;
  location: string;
  price?: string;
  organizer?: string;
  featured: boolean;
  isActive: boolean;
}

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

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  reply?: string;
  replyDate?: string;
  createdAt: string;
}

export interface Setting {
  key: string;
  value: string;
}