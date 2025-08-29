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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
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

  // Generate search suggestions
  const generateSuggestions = (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerms = [
      'pottery under ₹2000',
      'woodwork greater than ₹1000', 
      'jewelry under ₹1000',
      'textiles between ₹500 and ₹2000',
      'painting above ₹1500',
      'metalwork under ₹3000',
      'handmade pottery',
      'traditional textiles',
      'brass jewelry',
      'wooden sculptures',
      'folk art paintings',
      'copper vessels'
    ];

    const correctedQuery = query.toLowerCase()
      .replace('woowork', 'woodwork')
      .replace('poterry', 'pottery')
      .replace('jewlery', 'jewelry')
      .replace('textils', 'textiles')
      .replace('paiting', 'painting')
      .replace('metalowrk', 'metalwork');

    const matches = searchTerms.filter(term => 
      term.toLowerCase().includes(correctedQuery) ||
      correctedQuery.split(' ').some(word => term.toLowerCase().includes(word))
    ).slice(0, 5);

    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  };

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
      // Typo correction and fuzzy matching
      function correctTypos(text: string) {
        const corrections: { [key: string]: string } = {
          'woowork': 'woodwork',
          'woodowrk': 'woodwork',
          'wooodwork': 'woodwork',
          'woodwrok': 'woodwork',
          'poterry': 'pottery',
          'potery': 'pottery',
          'pottry': 'pottery',
          'textils': 'textiles',
          'textiles': 'textiles',
          'jewlery': 'jewelry',
          'jewelery': 'jewelry',
          'jewellry': 'jewelry',
          'metalowrk': 'metalwork',
          'mettalwork': 'metalwork',
          'paintng': 'painting',
          'paiting': 'painting',
          'paintintg': 'painting'
        };
        
        let corrected = text.toLowerCase();
        for (const [typo, correct] of Object.entries(corrections)) {
          corrected = corrected.replace(new RegExp(typo, 'gi'), correct);
        }
        return corrected;
      }

      // Extract price range from query
      function extractPriceRange(query: string) {
        const patterns = [
          { regex: /(under|below|less\s+than)\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'under' },
          { regex: /(above|over|more\s+than|greater\s+than)\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'above' },
          { regex: /between\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)\s+(?:and|to|-)\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'between' }
        ];
        
        for (const pattern of patterns) {
          const match = query.match(pattern.regex);
          if (match) {
            const parseNumber = (str: string) => parseInt(str.replace(/,/g, ''), 10);
            if (pattern.type === 'under') {
              return { min: 0, max: parseNumber(match[2]) };
            } else if (pattern.type === 'above') {
              return { min: parseNumber(match[2]), max: Infinity };
            } else if (pattern.type === 'between') {
              return { min: parseNumber(match[2]), max: parseNumber(match[3]) };
            }
          }
        }
        return null;
      }

      // Start with all products
      let filtered = [...originalProducts];
      
      // Apply typo correction to search query
      const correctedQuery = correctTypos(searchQuery);
      console.log(`🔧 Original: "${searchQuery}" → Corrected: "${correctedQuery}"`);
      
      // Apply price filtering
      const priceRange = extractPriceRange(correctedQuery);
      if (priceRange) {
        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
        console.log(`💰 Price filter (${priceRange.min} - ${priceRange.max}): ${filtered.length} products`);
      }

      // Apply category filtering with fuzzy matching
      const query = correctedQuery.toLowerCase();
      const categories = ['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'painting'];
      
      // Try exact match first, then fuzzy match
      let matchedCategory = categories.find(cat => query.includes(cat));
      
      // If no exact match, try fuzzy matching with Levenshtein distance
      if (!matchedCategory) {
        function levenshteinDistance(a: string, b: string): number {
          const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
          for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
          for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
          for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
              const cost = a[i - 1] === b[j - 1] ? 0 : 1;
              matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + cost
              );
            }
          }
          return matrix[b.length][a.length];
        }
        
        // Find closest category with distance <= 2
        const queryWords = query.split(' ');
        for (const word of queryWords) {
          if (word.length >= 4) { // Only check words with 4+ characters
            for (const cat of categories) {
              const distance = levenshteinDistance(word, cat);
              if (distance <= 2 && word.length >= cat.length - 2) {
                matchedCategory = cat;
                console.log(`🎯 Fuzzy match: "${word}" → "${cat}" (distance: ${distance})`);
                break;
              }
            }
            if (matchedCategory) break;
          }
        }
      }
      
      if (matchedCategory) {
        filtered = filtered.filter(p => p.category.toLowerCase().includes(matchedCategory!));
        console.log(`🎯 Category filter (${matchedCategory}): ${filtered.length} products`);
      }

      // Sort by price (ascending for budget queries, but respect user's sort preference)
      if (priceRange && priceRange.max !== Infinity && sortBy === 'newest') {
        // Only auto-sort by price if user hasn't selected a specific sort
        filtered.sort((a, b) => a.price - b.price);
      } else {
        // Apply user's selected sorting preference
        switch (sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price); // Low to High
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price); // High to Low
            break;
          case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          default: // newest - keep original order
            break;
        }
      }

      const response = {
        products: filtered,
        reasoning: filtered.length > 0 
          ? `Found ${filtered.length} products matching "${searchQuery}"${correctedQuery !== searchQuery ? ` (corrected from "${searchQuery}" to "${correctedQuery}")` : ''}${priceRange ? ` with price range ₹${priceRange.min}-${priceRange.max === Infinity ? '∞' : priceRange.max}` : ''}${matchedCategory ? ` in ${matchedCategory}` : ''}`
          : `No products found matching "${searchQuery}". ${correctedQuery !== searchQuery ? `Did you mean "${correctedQuery}"? ` : ''}Try browsing our categories below.`,
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
        filtered.sort((a: any, b: any) => a.price - b.price); // Low to High
        break;
      case 'price-desc':
        filtered.sort((a: any, b: any) => b.price - a.price); // High to Low
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

  // Reset sort to "newest" when category changes
  useEffect(() => {
    setSortBy('newest');
  }, [selectedCategory]);

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
            placeholder="Type product name or describe what you're looking for (e.g., 'woodwork greater than ₹1000')" 
            className="pl-10 pr-20 h-12 text-base"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              generateSuggestions(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => generateSuggestions(searchQuery)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                    // Auto-trigger search for suggestions
                    setTimeout(() => {
                      const isNaturalLanguage = suggestion.includes(' ') || 
                        /for|under|above|beautiful|unique|traditional|handmade|gift|wedding|home|kitchen|greater|than/.test(suggestion.toLowerCase());
                      if (isNaturalLanguage) {
                        handleAISearch();
                      } else {
                        handleRegularSearch();
                      }
                    }, 100);
                  }}
                >
                  <Search className="inline h-3 w-3 mr-2 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
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
              </SelectContent>
            </Select>
          </div>
        </div>
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
