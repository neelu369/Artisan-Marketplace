import { personalizedRecommendationFlow } from './flows/personalized-recommendation';
import { extractPriceRange } from './price-parser';
import type { 
  RecommendationRequest, 
  RecommendationResponse, 
  UserProfile,
  UserPreference 
} from './types';

export class RecommendationService {
  /**
   * Get personalized product recommendations based on user input
   */
  static async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
      // Extract price range from user prompt and set in userPreferences for reliable filtering
      if (request.userPrompt) {
        const priceRange = extractPriceRange(request.userPrompt);
        if (priceRange && typeof priceRange.max === 'number') {
          request.userPreferences = request.userPreferences || {
            categories: [],
            priceRange: { min: 0, max: 100000 },
            preferredArtisans: [],
            styles: [],
            colors: [],
            occasions: []
          };
          request.userPreferences.priceRange = {
            min: typeof priceRange.min === 'number' ? priceRange.min : 0,
            max: priceRange.max
          };
        }
      }
    try {
  // Let the Gemini model interpret the user's prompt and extract price constraints
      const flowInput = {
        ...request,
        maxResults: request.maxResults || 5
      };
      const result = await personalizedRecommendationFlow(flowInput);
      return result;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  /**
   * Get recommendations for a specific user profile
   */
  static async getRecommendationsForUser(
    userProfile: UserProfile, 
    prompt: string,
    maxResults: number = 5
  ): Promise<RecommendationResponse> {
    const request: RecommendationRequest = {
      userPrompt: prompt,
      userPreferences: userProfile.preferences,
      userHistory: userProfile.purchaseHistory,
      maxResults,
    };

    return this.getRecommendations(request);
  }

  /**
   * Get trending recommendations based on popular categories
   */
  static async getTrendingRecommendations(
    prompt: string = "Show me trending artisan products",
    maxResults: number = 8
  ): Promise<RecommendationResponse> {
    const request: RecommendationRequest = {
      userPrompt: prompt,
      maxResults,
    };

    return this.getRecommendations(request);
  }

  /**
   * Get recommendations for a specific category
   */
  static async getCategoryRecommendations(
    category: string,
    prompt?: string,
    maxResults: number = 6
  ): Promise<RecommendationResponse> {
    const userPrompt = prompt || `Show me beautiful ${category} products`;
    
    const request: RecommendationRequest = {
      userPrompt,
      userPreferences: {
        categories: [category],
        priceRange: { min: 0, max: 100000 },
        preferredArtisans: [],
        styles: [],
        colors: [],
        occasions: []
      },
      maxResults,
    };

    return this.getRecommendations(request);
  }

  /**
   * Get recommendations based on price range
   */
  static async getBudgetRecommendations(
    minPrice: number,
    maxPrice: number,
    prompt?: string,
    maxResults: number = 6
  ): Promise<RecommendationResponse> {
    const userPrompt = prompt || `Show me quality artisan products within my budget of ₹${minPrice} to ₹${maxPrice}`;
    
    const request: RecommendationRequest = {
      userPrompt,
      userPreferences: {
        categories: [],
        priceRange: { min: minPrice, max: maxPrice },
        preferredArtisans: [],
        styles: [],
        colors: [],
        occasions: []
      },
      maxResults,
    };

    return this.getRecommendations(request);
  }

  /**
   * Get similar products to a given product
   */
  static async getSimilarProducts(
    productId: string,
    prompt?: string,
    maxResults: number = 4
  ): Promise<RecommendationResponse> {
    const userPrompt = prompt || `Show me products similar to product ID ${productId}`;
    
    const request: RecommendationRequest = {
      userPrompt,
      excludeProducts: [productId],
      maxResults,
    };

    return this.getRecommendations(request);
  }

  /**
   * Get gift recommendations based on occasion and recipient
   */
  static async getGiftRecommendations(
    occasion: string,
    recipient?: string,
    priceRange?: { min: number; max: number },
    maxResults: number = 6
  ): Promise<RecommendationResponse> {
    let userPrompt = `Recommend beautiful artisan gifts for ${occasion}`;
    if (recipient) {
      userPrompt += ` for a ${recipient}`;
    }
    
    const request: RecommendationRequest = {
      userPrompt,
      userPreferences: {
        categories: [],
        priceRange: priceRange || { min: 0, max: 100000 },
        preferredArtisans: [],
        styles: [],
        colors: [],
        occasions: [occasion]
      },
      maxResults,
    };

    return this.getRecommendations(request);
  }
}
