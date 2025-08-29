import React from 'react';
import { RecommendationSearch } from '../../recommendation/components/recommendation-search';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Sparkles, Target, Zap, Heart } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          AI-Powered Product Recommendations
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the perfect artisan products tailored just for you. Our AI understands your preferences 
          and suggests beautiful handcrafted items that match your style and needs.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
              Smart AI Matching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our Gemini-powered AI analyzes your preferences, style, and requirements to suggest 
              products that perfectly match what you're looking for.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-green-500" />
              Personalized Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get recommendations based on your budget, preferred categories, occasions, 
              and past browsing history for truly personalized suggestions.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Instant Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Simply describe what you need in natural language, and our AI will instantly 
              find the best artisan products matching your requirements.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Main Search Component */}
      <div className="max-w-4xl mx-auto">
        <RecommendationSearch />
      </div>

      {/* How it Works */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>How Our AI Recommendations Work</CardTitle>
          <CardDescription>
            Powered by Google's Gemini 1.5 Pro model for superior understanding and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">🎯 Understanding Your Needs</h4>
              <p className="text-sm text-gray-600">
                Our AI analyzes your natural language input to understand exactly what you're looking for, 
                including style preferences, budget constraints, and intended use.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">🧠 Smart Product Matching</h4>
              <p className="text-sm text-gray-600">
                Using advanced semantic understanding, the AI matches your requirements with our artisan 
                products, considering craftsmanship quality, cultural significance, and value.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">📊 Confidence Scoring</h4>
              <p className="text-sm text-gray-600">
                Each recommendation comes with a confidence score showing how well it matches your request, 
                helping you make informed decisions.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">💡 Intelligent Suggestions</h4>
              <p className="text-sm text-gray-600">
                Beyond just showing products, our AI explains its reasoning and suggests related categories 
                or filters to help you discover even more perfect matches.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Searches */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Try These Example Searches</CardTitle>
          <CardDescription>
            Get inspired with these sample queries to see the power of AI recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">🎁 Gift Recommendations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Unique wedding gift under ₹5000"</li>
                <li>• "Housewarming gift for art lovers"</li>
                <li>• "Traditional gift for elderly parents"</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">🏠 Home Decor</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Pottery for my modern kitchen"</li>
                <li>• "Wall art for meditation room"</li>
                <li>• "Eco-friendly home accessories"</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">💍 Personal Items</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Silver jewelry for daily wear"</li>
                <li>• "Handmade bags for college"</li>
                <li>• "Wooden accessories for men"</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">🎨 By Technique</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Show me Kalamkari textiles"</li>
                <li>• "Blue pottery from Jaipur"</li>
                <li>• "Dhokra metal craft pieces"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
