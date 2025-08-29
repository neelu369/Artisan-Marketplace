import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '../../../recommendation/service';
import type { RecommendationRequest } from '../../../recommendation/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    
    // Validate required fields
    if (!body.userPrompt) {
      return NextResponse.json(
        { error: 'userPrompt is required' },
        { status: 400 }
      );
    }

    // Get recommendations from the AI service
    const recommendations = await RecommendationService.getRecommendations(body);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const prompt = searchParams.get('prompt') || '';
  const maxResults = parseInt(searchParams.get('maxResults') || '5');

  try {
    let recommendations;

    switch (type) {
      case 'trending':
        recommendations = await RecommendationService.getTrendingRecommendations(prompt, maxResults);
        break;
      
      case 'category':
        const category = searchParams.get('category');
        if (!category) {
          return NextResponse.json(
            { error: 'category is required for category recommendations' },
            { status: 400 }
          );
        }
        recommendations = await RecommendationService.getCategoryRecommendations(category, prompt, maxResults);
        break;
      
      case 'budget':
        const minPrice = parseInt(searchParams.get('minPrice') || '0');
        const maxPrice = parseInt(searchParams.get('maxPrice') || '10000');
        recommendations = await RecommendationService.getBudgetRecommendations(minPrice, maxPrice, prompt, maxResults);
        break;
      
      case 'similar':
        const productId = searchParams.get('productId');
        if (!productId) {
          return NextResponse.json(
            { error: 'productId is required for similar product recommendations' },
            { status: 400 }
          );
        }
        recommendations = await RecommendationService.getSimilarProducts(productId, prompt, maxResults);
        break;
      
      case 'gift':
        const occasion = searchParams.get('occasion');
        const recipient = searchParams.get('recipient');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        
        if (!occasion) {
          return NextResponse.json(
            { error: 'occasion is required for gift recommendations' },
            { status: 400 }
          );
        }
        
        const priceRange = (priceMin && priceMax) ? {
          min: parseInt(priceMin),
          max: parseInt(priceMax)
        } : undefined;
        
        recommendations = await RecommendationService.getGiftRecommendations(
          occasion, 
          recipient || undefined, 
          priceRange, 
          maxResults
        );
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid recommendation type. Use: trending, category, budget, similar, or gift' },
          { status: 400 }
        );
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
