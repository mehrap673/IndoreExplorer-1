export interface WikipediaData {
  title: string;
  extract: string;
  wikiUrl: string | null;
  wikiImage: string | null;
  
}


export interface PlaceFromDB {
  _id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  rating?: number;
  imageUrl?: string;
  tags?: string[];
  visitingHours?: string; // This is now consistent with your frontend code
  entryFee?: string;
  featured?: boolean;
  isActive?: boolean;
}

export interface MergedPlace extends PlaceFromDB {
  wikipedia: WikipediaData;
}

// Wikipedia API response type
export interface WikipediaSummary {
  title?: string;
  extract?: string;
  content_urls?: {
    desktop?: { page?: string };
  };
  thumbnail?: { source?: string };
}