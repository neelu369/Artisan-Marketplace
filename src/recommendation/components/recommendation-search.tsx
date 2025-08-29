'use client';

import React, { useState } from 'react';
import { Search, Sparkles, Filter, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { RecommendationAPIClient } from '../api-client';
import type { RecommendationResponse, Product, UserPreference } from '../types';

interface RecommendationSearchProps {
  onRecommendations?: (recommendations: RecommendationResponse) => void;
  className?: string;
}

export function RecommendationSearch({ onRecommendations, className = '' }: RecommendationSearchProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<UserPreference>({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    preferredArtisans: [],
    styles: [],
    colors: [],
    occasions: []
  });

  const categories = ['Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Metalwork', 'Painting'];
  const occasions = ['Wedding', 'Festival', 'Gift', 'Home Decor', 'Personal Use'];

  const handleSearch = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const result = await RecommendationAPIClient.getRecommendations({
        userPrompt: prompt,
        userPreferences: showFilters ? filters : undefined,
        maxResults: 6
      });
      
      setRecommendations(result);
      onRecommendations?.(result);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async (searchPrompt: string) => {
    setPrompt(searchPrompt);
    setLoading(true);
    try {
      const result = await RecommendationAPIClient.getRecommendations({
        userPrompt: searchPrompt,
        maxResults: 6
      });
      
      setRecommendations(result);
      onRecommendations?.(result);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePriceRange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min: values[0], max: values[1] }
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const quickSearches = [
    "Beautiful handmade pottery for my kitchen",
    "Traditional textiles for home decoration",
    "Unique jewelry for a special occasion",
    "Wooden crafts under ₹2000",
    "Eco-friendly artisan products",
    "Wedding gift ideas"
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Input */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Textarea
              placeholder="Tell us what you're looking for... (e.g., 'I need a unique wedding gift under ₹3000' or 'Show me traditional pottery for my dining room')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="pl-10 min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={loading || !prompt.trim()}
              className="h-[60px] px-6"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Find
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-[26px] px-3"
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Quick Search Buttons */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 mr-2">Quick searches:</span>
          {quickSearches.slice(0, 3).map((search, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch(search)}
              className="text-xs"
            >
              {search}
            </Button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Narrow down your search with specific preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium">Price Range: ₹{filters.priceRange.min} - ₹{filters.priceRange.max}</label>
              <Slider
                value={[filters.priceRange.min, filters.priceRange.max]}
                onValueChange={updatePriceRange}
                max={10000}
                min={0}
                step={100}
                className="mt-2"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium mb-2 block">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={filters.categories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div>
              <label className="text-sm font-medium mb-2 block">Occasion</label>
              <Select
                value={filters.occasions[0] || ''}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  occasions: value ? [value] : [] 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map(occasion => (
                    <SelectItem key={occasion} value={occasion}>
                      {occasion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {recommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Recommended for you 
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({recommendations.products.length} products)
              </span>
            </h3>
            <Badge variant="outline" className="text-xs">
              {Math.round(recommendations.confidence * 100)}% confidence
            </Badge>
          </div>

          {/* AI Reasoning */}
          {recommendations.reasoning && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-sm text-blue-800">
                  <Sparkles className="inline h-4 w-4 mr-1" />
                  {recommendations.reasoning}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.products.map((product) => (
              <ProductRecommendationCard key={product.id} product={product} />
            ))}
          </div>

          {/* Suggested Filters */}
          {recommendations.suggestedFilters && Object.keys(recommendations.suggestedFilters).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">You might also like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recommendations.suggestedFilters.categories?.map(cat => (
                    <Button
                      key={cat}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(`Show me more ${cat} products`)}
                    >
                      More {cat}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

interface ProductRecommendationCardProps {
  product: Product & { relevanceScore?: number };
}

function ProductRecommendationCard({ product }: ProductRecommendationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        {product.relevanceScore && product.relevanceScore > 0.8 && (
          <Badge className="absolute top-2 left-2 bg-green-500">
            Perfect Match
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h4 className="font-semibold line-clamp-2">{product.name}</h4>
          <p className="text-sm text-gray-600">by {product.artisan}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <Button className="w-full" size="sm">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
