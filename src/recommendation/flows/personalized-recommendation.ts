import { z } from 'zod';
import { recommendationAI } from '../genkit';
import { products } from '../../lib/data';
import type { 
  RecommendationRequest, 
  RecommendationResponse, 
  Product,
  UserPreference 
} from '../types';

// Input schema for the recommendation flow
const RecommendationInputSchema = z.object({
  userPrompt: z.string().describe('User\'s request or description of what they\'re looking for'),
  userPreferences: z.object({
    categories: z.array(z.string()).optional(),
    priceRange: z.object({
      min: z.number(),
      max: z.number()
    }).optional(),
    preferredArtisans: z.array(z.string()).optional(),
    styles: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    occasions: z.array(z.string()).optional()
  }).optional(),
  userHistory: z.array(z.string()).optional(),
  maxResults: z.number().default(5),
  excludeProducts: z.array(z.string()).optional()
});

// Output schema for the recommendation response
const RecommendationOutputSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    artisan: z.string(),
    category: z.string(),
    aiHint: z.string(),
    relevanceScore: z.number().describe('Score from 0-1 indicating how well this matches the user request')
  })),
  reasoning: z.string().describe('Explanation of why these products were recommended'),
  confidence: z.number().describe('Confidence score from 0-1 for the overall recommendation'),
  categories: z.array(z.string()).describe('Main categories represented in the recommendations'),
  suggestedFilters: z.object({
    priceRange: z.object({ min: z.number(), max: z.number() }).optional(),
    categories: z.array(z.string()).optional(),
    artisans: z.array(z.string()).optional()
  }).optional()
});

export const personalizedRecommendationFlow = recommendationAI.defineFlow(
  {
    name: 'personalizedRecommendation',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async (input: z.infer<typeof RecommendationInputSchema>) => {
    const { userPrompt, userPreferences, userHistory, maxResults, excludeProducts } = input;

    // Filter available products
    let availableProducts = products;
    
    if (excludeProducts?.length) {
      availableProducts = products.filter(p => !excludeProducts.includes(p.id));
    }

    // Apply basic preference filters if provided
    if (userPreferences?.categories?.length) {
      availableProducts = availableProducts.filter(p => 
        userPreferences.categories!.some((cat: string) => 
          p.category.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    if (userPreferences?.priceRange) {
      const { min, max } = userPreferences.priceRange;
      availableProducts = availableProducts.filter(p => p.price >= min && p.price <= max);
    }

    if (userPreferences?.preferredArtisans?.length) {
      availableProducts = availableProducts.filter(p =>
        userPreferences.preferredArtisans!.some((artisan: string) =>
          p.artisan.toLowerCase().includes(artisan.toLowerCase())
        )
      );
    }

    // Create context for AI recommendation
    const productContext = availableProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      artisan: p.artisan,
      category: p.category,
      aiHint: p.aiHint
    }));

    const userContext = {
      preferences: userPreferences,
      history: userHistory,
      prompt: userPrompt
    };

  const prompt = `
You are an expert recommendation system for an artisan marketplace. Your task is to recommend products based on the user's request and preferences.

USER REQUEST: "${userPrompt}"

USER PREFERENCES: ${JSON.stringify(userPreferences, null, 2)}

USER HISTORY: ${userHistory ? userHistory.join(', ') : 'No previous purchases'}

AVAILABLE PRODUCTS:
${JSON.stringify(productContext, null, 2)}

IMPORTANT: If the user's request or preferences mention a price constraint (e.g., "under ₹6000", "below 5000 rupees", "budget of 3000 INR"), ONLY recommend products whose price is within that range. Do not include products above the specified price limit.

Please analyze the user's request and recommend the top ${maxResults} products that best match their needs. Consider:

1. Semantic similarity between the user's request and product descriptions
2. User's stated preferences (categories, price range, artisans, etc.)
3. User's purchase history patterns
4. Cultural significance and craftsmanship quality
5. Value for money
6. Uniqueness and artistic merit

For each recommended product, assign a relevanceScore (0-1) based on how well it matches the user's request.

Provide reasoning for your recommendations and suggest additional filters that might help the user refine their search.

Return your response in the specified JSON format with products, reasoning, confidence, categories, and suggestedFilters.
`;

    const response = await recommendationAI.generate({
      prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
    });

    // Parse and validate the AI response
    try {
      const aiResponse = JSON.parse(response.text);
      
      // Ensure we have the required fields and valid data
      const recommendedProducts = aiResponse.products?.map((p: any) => {
        const fullProduct = availableProducts.find(prod => prod.id === p.id);
        return fullProduct ? {
          ...fullProduct,
          relevanceScore: p.relevanceScore || 0.5
        } : null;
      }).filter(Boolean) || [];

      return {
        products: recommendedProducts.slice(0, maxResults),
        reasoning: aiResponse.reasoning || 'Products selected based on user preferences and request.',
        confidence: Math.min(Math.max(aiResponse.confidence || 0.7, 0), 1),
        categories: [...new Set(recommendedProducts.map((p: Product) => p.category))] as string[],
        suggestedFilters: aiResponse.suggestedFilters || {}
      };
    } catch (error) {
      // Fallback to simple matching if AI response parsing fails
      console.error('Error parsing AI response:', error);
      
      const fallbackProducts = availableProducts
        .filter(p => {
          const searchTerms = userPrompt.toLowerCase().split(' ');
          return searchTerms.some((term: string) => 
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.aiHint.toLowerCase().includes(term) ||
            p.artisan.toLowerCase().includes(term)
          );
        })
        .slice(0, maxResults)
        .map(p => ({ ...p, relevanceScore: 0.6 }));

      return {
        products: fallbackProducts,
        reasoning: 'Products selected based on keyword matching with your request.',
        confidence: 0.6,
        categories: [...new Set(fallbackProducts.map(p => p.category))] as string[],
        suggestedFilters: {}
      };
    }
  }
);
