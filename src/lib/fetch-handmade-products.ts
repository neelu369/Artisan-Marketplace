// Fetch and filter FakeStoreAPI products for anything resembling "handmade" or "art"
export async function fetchHandmadeProducts() {
  const response = await fetch('https://fakestoreapi.com/products');
  const products = await response.json();
  // Filter by keywords in title or description
  const keywords = ["handmade", "art", "craft", "artisan", "paint", "unique", "vintage"];
  return products.filter((product: any) => {
    const text = `${product.title} ${product.description}`.toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });
}
