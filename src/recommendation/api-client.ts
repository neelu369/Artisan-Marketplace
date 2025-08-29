import type { 
  RecommendationRequest, 
  RecommendationResponse 
} from './types';

export class RecommendationAPIClient {
  private static baseUrl = '/api/recommendations';

  /**
   * Get personalized recommendations via API
   */
  static async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get recommendations');
    }

    return response.json();
  }

  /**
   * Get trending recommendations
   */
  static async getTrendingRecommendations(
    prompt?: string,
    maxResults: number = 8
  ): Promise<RecommendationResponse> {
    const params = new URLSearchParams({
      type: 'trending',
      maxResults: maxResults.toString(),
    });

    if (prompt) {
      params.append('prompt', prompt);
    }

    const response = await fetch(`${this.baseUrl}?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get trending recommendations');
    }

    return response.json();
  }

  /**
   * Get category-specific recommendations
   */
  static async getCategoryRecommendations(
    category: string,
    prompt?: string,
    maxResults: number = 6
  ): Promise<RecommendationResponse> {
    const params = new URLSearchParams({
      type: 'category',
      category,
      maxResults: maxResults.toString(),
    });

    if (prompt) {
      params.append('prompt', prompt);
    }

    const response = await fetch(`${this.baseUrl}?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get category recommendations');
    }

    return response.json();
  }

  /**
   * Get budget-based recommendations
   */
  static async getBudgetRecommendations(
    minPrice: number,
    maxPrice: number,
    prompt?: string,
    maxResults: number = 6
  ): Promise<RecommendationResponse> {
    const params = new URLSearchParams({
      type: 'budget',
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      maxResults: maxResults.toString(),
    });

    if (prompt) {
      params.append('prompt', prompt);
    }

    const response = await fetch(`${this.baseUrl}?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get budget recommendations');
    }

    return response.json();
  }

  /**
   * Get similar product recommendations
   */
  static async getSimilarProducts(
    productId: string,
    prompt?: string,
    maxResults: number = 4
  ): Promise<RecommendationResponse> {
    const params = new URLSearchParams({
      type: 'similar',
      productId,
      maxResults: maxResults.toString(),
    });

    if (prompt) {
      params.append('prompt', prompt);
    }

    const response = await fetch(`${this.baseUrl}?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get similar product recommendations');
    }

    return response.json();
  }

  /**
   * Get gift recommendations
   */
  static async getGiftRecommendations(
    occasion: string,
    recipient?: string,
    priceRange?: { min: number; max: number },
    prompt?: string,
    maxResults: number = 6
  ): Promise<RecommendationResponse> {
    const params = new URLSearchParams({
      type: 'gift',
      occasion,
      maxResults: maxResults.toString(),
    });

    if (recipient) {
      params.append('recipient', recipient);
    }

    if (priceRange) {
      params.append('priceMin', priceRange.min.toString());
      params.append('priceMax', priceRange.max.toString());
    }

    if (prompt) {
      params.append('prompt', prompt);
    }

    const response = await fetch(`${this.baseUrl}?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get gift recommendations');
    }

    return response.json();
  }
}
