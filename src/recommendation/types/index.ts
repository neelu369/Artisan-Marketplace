export interface UserPreference {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  preferredArtisans: string[];
  styles: string[];
  colors: string[];
  occasions: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  artisan: string;
  category: string;
  aiHint: string;
  description?: string;
  tags?: string[];
  materials?: string[];
  techniques?: string[];
  region?: string;
  rating?: number;
  availability?: boolean;
}

export interface RecommendationRequest {
  userPrompt: string;
  userPreferences?: UserPreference;
  userHistory?: string[];
  maxResults?: number;
  excludeProducts?: string[];
}

export interface RecommendationResponse {
  products: Product[];
  reasoning: string;
  confidence: number;
  categories: string[];
  suggestedFilters?: {
    priceRange?: { min: number; max: number };
    categories?: string[];
    artisans?: string[];
  };
}

export interface UserProfile {
  id: string;
  preferences: UserPreference;
  purchaseHistory: string[];
  browsingHistory: string[];
  favoriteArtisans: string[];
  recentSearches: string[];
  demographics?: {
    age?: number;
    location?: string;
    interests?: string[];
  };
}
