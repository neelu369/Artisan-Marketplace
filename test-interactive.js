// Interactive Recommendation Tester
// Run this to test custom queries interactively

const readline = require('readline');
const { products } = require('./src/lib/data.ts');

// Price extraction function
function extractPriceRange(query) {
  const patterns = [
    { regex: /under\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'under' },
    { regex: /below\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'under' },
    { regex: /less\s+than\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'under' },
    { regex: /above\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'above' },
    { regex: /over\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'above' },
    { regex: /more\s+than\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'above' },
    { regex: /between\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)\s+(?:and|to|-)\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'between' },
    { regex: /(\d+(?:,\d{3})*)\s*(?:₹|rs\.?|rupees?)\s+(?:and|to|-)\s+(\d+(?:,\d{3})*)\s*(?:₹|rs\.?|rupees?)/i, type: 'between' },
    { regex: /around\s+(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d{3})*)/i, type: 'around' },
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern.regex);
    if (match) {
      const parseNumber = (str) => parseInt(str.replace(/,/g, ''), 10);
      
      switch (pattern.type) {
        case 'under':
          return { min: 0, max: parseNumber(match[1]) };
        case 'above':
          return { min: parseNumber(match[1]), max: Infinity };
        case 'between':
          return { min: parseNumber(match[1]), max: parseNumber(match[2]) };
        case 'around':
          const price = parseNumber(match[1]);
          const tolerance = price * 0.2;
          return { min: price - tolerance, max: price + tolerance };
      }
    }
  }
  return null;
}

// Recommendation function
function getRecommendations(userPrompt, maxResults = 8) {
  console.log(`\n🔍 Processing: "${userPrompt}"`);
  
  const priceRange = extractPriceRange(userPrompt);
  if (priceRange) {
    console.log(`💰 Price filter: ₹${priceRange.min} - ${priceRange.max === Infinity ? '∞' : '₹' + priceRange.max}`);
  }
  
  let filtered = products;
  
  // Price filter
  if (priceRange) {
    filtered = filtered.filter(product => {
      const price = product.price;
      return price >= priceRange.min && price <= priceRange.max;
    });
  }
  
  // Category filter
  const query = userPrompt.toLowerCase();
  const categoryMatches = filtered.filter(product => 
    product.category.toLowerCase().includes(query) ||
    query.includes(product.category.toLowerCase())
  );
  
  if (categoryMatches.length > 0) {
    filtered = categoryMatches;
  }
  
  // Keyword search
  const keywordMatches = filtered.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.artisan.toLowerCase().includes(query) ||
    product.aiHint.toLowerCase().includes(query)
  );
  
  if (keywordMatches.length > 0) {
    filtered = keywordMatches;
  }
  
  // Sort
  if (priceRange) {
    filtered.sort((a, b) => a.price - b.price);
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  const results = filtered.slice(0, maxResults);
  
  console.log(`\n📊 Found ${filtered.length} products, showing top ${results.length}:`);
  console.log('─'.repeat(60));
  
  results.forEach((product, i) => {
    console.log(`${i + 1}. 🎨 ${product.name}`);
    console.log(`   💰 ₹${product.price} | 🏷️ ${product.category} | 👨‍🎨 ${product.artisan}`);
    console.log('');
  });
  
  return results;
}

// Interactive mode
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🛍️ INTERACTIVE RECOMMENDATION TESTER');
console.log('====================================');
console.log(`📦 Database: ${products.length} handcrafted products`);
console.log('\n💡 Try queries like:');
console.log('   • "pottery under 2000 rupees"');
console.log('   • "jewelry by Priya Soni"');
console.log('   • "saree between 4000 and 6000"');
console.log('   • "woodwork items"');
console.log('   • "products by Ritu Kumar"');
console.log('\n🔧 Type "exit" to quit\n');

function askQuery() {
  rl.question('🔍 Enter your query: ', (query) => {
    if (query.toLowerCase() === 'exit') {
      console.log('\n👋 Thanks for testing! Your recommendation model is working great!');
      rl.close();
      return;
    }
    
    if (query.trim() === '') {
      console.log('❌ Please enter a query');
      askQuery();
      return;
    }
    
    try {
      getRecommendations(query);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
    askQuery();
  });
}

askQuery();
