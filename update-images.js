// Script to update all product images with relevant Unsplash images
const fs = require('fs');
const path = require('path');

// Read the data.ts file
const dataPath = path.join(__dirname, 'src', 'lib', 'data.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Define relevant images for each category
const categoryImages = {
  'Pottery': [
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop'
  ],
  'Textiles': [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1594736797933-d0e18dc8b6b7?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop'
  ],
  'Jewelry': [
    'https://images.unsplash.com/photo-1543699565-003b8adda5fc?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=500&fit=crop'
  ],
  'Woodwork': [
    'https://images.unsplash.com/photo-1591796912049-d6c26d8de8b9?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=500&fit=crop'
  ],
  'Metalwork': [
    'https://images.unsplash.com/photo-1543699565-003b8adda5fc?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop'
  ],
  'Painting': [
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=500&fit=crop'
  ]
};

// Replace all picsum URLs with appropriate category images
let imageIndex = 0;

// Simple replacement of all picsum URLs with Unsplash URLs
const picsumUrls = content.match(/https:\/\/picsum\.photos\/400\/[45]00\?random=\d+/g);
if (picsumUrls) {
  console.log(`Found ${picsumUrls.length} placeholder images to replace`);
  
  picsumUrls.forEach((picsumUrl, index) => {
    // Use a rotating selection of good craft images
    const craftImages = [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1543699565-003b8adda5fc?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1591796912049-d6c26d8de8b9?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0e18dc8b6b7?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=500&fit=crop'
    ];
    
    const newImageUrl = craftImages[index % craftImages.length];
    content = content.replace(picsumUrl, newImageUrl);
  });
}

// Write the updated content back to the file
fs.writeFileSync(dataPath, content);
console.log('Successfully updated all product images!');
