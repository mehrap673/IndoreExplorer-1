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

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
