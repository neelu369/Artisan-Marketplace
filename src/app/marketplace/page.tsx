'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import { RecommendationAPIClient } from '@/recommendation/api-client';
import type { Product, RecommendationResponse } from '@/recommendation/types';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [originalProducts, setOriginalProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Use local products from data.ts
  useEffect(() => {
    // Filter out any products with missing required fields
    const validProducts = products.filter(product => 
      product && 
      product.id && 
      product.name && 
      product.price !== undefined &&
      product.category &&
      product.artisan
    );
    
    console.log('🚀 Products loading useEffect triggered');
    console.log('📦 Raw products imported:', products.length);
    console.log('✅ Valid products after filtering:', validProducts.length);
    console.log('🔍 First valid product:', validProducts[0]);
    console.log('💾 Setting originalProducts and filteredProducts');
    
    setOriginalProducts(validProducts);
    setFilteredProducts(validProducts);
    setLoadingProducts(false);
    // Initial filter to ensure products show up
    setTimeout(() => {
      if (validProducts.length > 0) {
        console.log('⏰ Timeout: Re-setting filtered products to:', validProducts.length);
        setFilteredProducts(validProducts);
      }
    }, 0);
  }, []);
  
  const [isAISearch, setIsAISearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<RecommendationResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Handle AI-powered search
  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;

    console.log('🚀 AI Search triggered!');
    console.log('🔍 Search query:', searchQuery);
    console.log('📦 originalProducts at search time:', originalProducts?.length || 0);
    console.log('� Sample originalProduct:', originalProducts[0]);

    setLoading(true);
    setIsAISearch(true);
    
    try {
      // Extract price range from query
      function extractPriceRange(query: string) {
        const patterns = [
          { regex: /under\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'under' },
          { regex: /above\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'above' },
          { regex: /between\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)\s+(?:and|to|-)\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'between' }
        ];
        
        for (const pattern of patterns) {
          const match = query.match(pattern.regex);
          if (match) {
            const parseNumber = (str: string) => parseInt(str.replace(/,/g, ''), 10);
            if (pattern.type === 'under') {
              return { min: 0, max: parseNumber(match[1]) };
            } else if (pattern.type === 'above') {
              return { min: parseNumber(match[1]), max: Infinity };
            } else if (pattern.type === 'between') {
              return { min: parseNumber(match[1]), max: parseNumber(match[2]) };
            }
          }
        }
        return null;
      }

      // Start with all products
      let filtered = [...originalProducts];
      
      // Apply price filtering
      const priceRange = extractPriceRange(searchQuery);
      if (priceRange) {
        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
        console.log(`💰 Price filter (${priceRange.min} - ${priceRange.max}): ${filtered.length} products`);
      }

      // Apply category filtering
      const query = searchQuery.toLowerCase();
      const categories = ['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'painting'];
      const matchedCategory = categories.find(cat => query.includes(cat));
      
      if (matchedCategory) {
        filtered = filtered.filter(p => p.category.toLowerCase().includes(matchedCategory));
        console.log(`🎯 Category filter (${matchedCategory}): ${filtered.length} products`);
      }

      // Sort by price (ascending for budget queries)
      if (priceRange && priceRange.max !== Infinity) {
        filtered.sort((a, b) => a.price - b.price);
      }

      const response = {
        products: filtered,
        reasoning: filtered.length > 0 
          ? `Found ${filtered.length} products matching "${searchQuery}"${priceRange ? ` with price range ₹${priceRange.min}-₹${priceRange.max}` : ''}${matchedCategory ? ` in ${matchedCategory}` : ''}`
          : `No products found matching "${searchQuery}". Try browsing our categories below.`,
        confidence: 0.95,
        categories: matchedCategory ? [matchedCategory] : categories,
        suggestedFilters: { categories: categories }
      };
      
      console.log('📤 Setting AI recommendations:', response);
      setAiRecommendations(response);
      setFilteredProducts(response.products);
      
    } catch (error) {
      console.error('❌ AI search failed:', error);
      // Fallback to regular search
      handleRegularSearch();
      setIsAISearch(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle regular keyword search
  const handleRegularSearch = () => {
    let filtered = originalProducts;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product: any) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.artisan.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product: any) =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      default: // newest
        break;
    }

    setFilteredProducts(filtered);
    setIsAISearch(false);
    setAiRecommendations(null);
  };

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Check if it's a natural language query (contains multiple words or descriptive terms)
      const isNaturalLanguage = searchQuery.includes(' ') || 
        /for|under|above|beautiful|unique|traditional|handmade|gift|wedding|home|kitchen/.test(searchQuery.toLowerCase());
      
      if (isNaturalLanguage) {
        handleAISearch();
      } else {
        handleRegularSearch();
      }
    }
  };

  // Effect for real-time filtering (non-AI search)
  useEffect(() => {
    if (!isAISearch && !loading && !loadingProducts && originalProducts.length > 0) {
      handleRegularSearch();
    }
  }, [selectedCategory, sortBy, originalProducts, loadingProducts, isAISearch, loading]);

  // Clear AI search
  const clearAISearch = () => {
    setIsAISearch(false);
    setAiRecommendations(null);
    setSearchQuery('');
    setFilteredProducts(originalProducts);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline text-primary">
          Artisan Marketplace
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore a curated collection of authentic, handcrafted products from
          the heart of India.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        {/* AI-Powered Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Type product name or describe what you're looking for (e.g., 'beautiful pottery for kitchen under ₹2000')" 
            className="pl-10 pr-20 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            {/* ...existing code for Button and examples... */}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-4 flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="pottery">Pottery</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="woodwork">Woodwork</SelectItem>
                <SelectItem value="metalwork">Metalwork</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Search Results Header */}
        {isAISearch && aiRecommendations && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">AI-Powered Results</h3>
                <Badge variant="outline" className="text-xs">
                  {Math.round(aiRecommendations.confidence * 100)}% confidence
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAISearch}
                className="h-8 text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            {aiRecommendations.reasoning && (
              <p className="text-sm text-blue-800">{aiRecommendations.reasoning}</p>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} products
          {isAISearch && aiRecommendations && " based on AI recommendations"}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={{
              id: product.id.toString(),
              name: product.name,
              price: product.price,
              imageUrl: product.image,
              artisan: product.artisan,
              category: product.category,
              aiHint: '',
            }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-6">
            {searchQuery ? `Didn't find the product you wanted?` : 'No products available.'}
          </p>
          {searchQuery && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Try browsing our categories:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery('pottery');
                  setSelectedCategory('pottery');
                  handleRegularSearch();
                }}>
                  🏺 Pottery
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery('textiles');
                  setSelectedCategory('textiles');
                  handleRegularSearch();
                }}>
                  🧵 Textiles
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery('jewelry');
                  setSelectedCategory('jewelry');
                  handleRegularSearch();
                }}>
                  💎 Jewelry
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery('woodwork');
                  setSelectedCategory('woodwork');
                  handleRegularSearch();
                }}>
                  🪵 Woodwork
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery('metalwork');
                  setSelectedCategory('metalwork');
                  handleRegularSearch();
                }}>
                  🔨 Metalwork
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery('painting');
                  setSelectedCategory('painting');
                  handleRegularSearch();
                }}>
                  🎨 Painting
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related suggestions for successful searches */}
      {isAISearch && filteredProducts.length > 0 && aiRecommendations && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h4 className="font-semibold mb-3 text-gray-800">Explore more categories:</h4>
          <div className="flex flex-wrap gap-3">
            {['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'painting'].map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(category);
                  setSelectedCategory(category);
                  handleRegularSearch();
                }}
                className="capitalize"
              >
                🎨 {category}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
