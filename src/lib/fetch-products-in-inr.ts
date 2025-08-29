// Utility to fetch products from FakeStoreAPI, convert price to INR, filter out electronics, and map categories
export async function fetchProductsInINR() {
  const response = await fetch('https://fakestoreapi.com/products');
  const products = await response.json();
  // Example conversion rate (update as needed)
  const USD_TO_INR = 83;
  
  // Filter out electronics and map to artisan categories
  const filteredProducts = products
    .filter((product: any) => !product.category.toLowerCase().includes('electronics'))
    .map((product: any) => {
      let mappedCategory = 'General';
      
      // Map FakeStoreAPI categories to artisan marketplace categories
      switch (product.category.toLowerCase()) {
        case 'jewelery':
          mappedCategory = 'Jewelry';
          break;
        case "men's clothing":
        case "women's clothing":
          mappedCategory = 'Textiles';
          break;
        default:
          mappedCategory = 'General';
      }
      
      return {
        ...product,
        price: Math.round(product.price * USD_TO_INR),
        currency: 'INR',
        category: mappedCategory,
      };
    });
    
  return filteredProducts;
}
