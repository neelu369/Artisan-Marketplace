// Test file for the Recommendation API
// You can run this in the browser console or as a Node.js script

// Test basic recommendation
async function testBasicRecommendation() {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userPrompt: "I want beautiful pottery for my kitchen under ₹2000",
        maxResults: 5
      })
    });
    
    const result = await response.json();
    console.log('Basic Recommendation Result:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test trending recommendations
async function testTrendingRecommendations() {
  try {
    const response = await fetch('/api/recommendations?type=trending&maxResults=6');
    const result = await response.json();
    console.log('Trending Recommendations:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test category recommendations
async function testCategoryRecommendations() {
  try {
    const response = await fetch('/api/recommendations?type=category&category=Pottery&maxResults=4');
    const result = await response.json();
    console.log('Category Recommendations:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test budget recommendations
async function testBudgetRecommendations() {
  try {
    const response = await fetch('/api/recommendations?type=budget&minPrice=1000&maxPrice=3000&maxResults=5');
    const result = await response.json();
    console.log('Budget Recommendations:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test gift recommendations
async function testGiftRecommendations() {
  try {
    const response = await fetch('/api/recommendations?type=gift&occasion=Wedding&recipient=bride&maxResults=4');
    const result = await response.json();
    console.log('Gift Recommendations:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Running Recommendation API Tests...\n');
  
  console.log('1. Testing Basic Recommendations...');
  await testBasicRecommendation();
  
  console.log('\n2. Testing Trending Recommendations...');
  await testTrendingRecommendations();
  
  console.log('\n3. Testing Category Recommendations...');
  await testCategoryRecommendations();
  
  console.log('\n4. Testing Budget Recommendations...');
  await testBudgetRecommendations();
  
  console.log('\n5. Testing Gift Recommendations...');
  await testGiftRecommendations();
  
  console.log('\n✅ All tests completed!');
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testBasicRecommendation,
    testTrendingRecommendations,
    testCategoryRecommendations,
    testBudgetRecommendations,
    testGiftRecommendations,
    runAllTests
  };
}

// Instructions for testing:
console.log(`
🧪 RECOMMENDATION SYSTEM TESTING GUIDE
=====================================

1. BROWSER TESTING:
   - Open http://localhost:9002/recommendations
   - Try these example prompts:
     • "Beautiful handmade pottery for my kitchen"
     • "Unique wedding gift under ₹5000"
     • "Traditional textiles for home decoration"
     • "Eco-friendly artisan products"

2. CONSOLE TESTING:
   - Open browser dev tools (F12)
   - Paste and run: runAllTests()

3. API ENDPOINT TESTING:
   - POST /api/recommendations (for custom searches)
   - GET /api/recommendations?type=trending
   - GET /api/recommendations?type=category&category=Pottery
   - GET /api/recommendations?type=budget&minPrice=1000&maxPrice=3000
   - GET /api/recommendations?type=gift&occasion=Wedding

4. RECOMMENDED MODEL:
   - Currently using: Gemini 1.5 Pro
   - Alternative: Gemini 1.5 Flash (faster, less sophisticated)
   - Change in: src/recommendation/genkit.ts
`);
