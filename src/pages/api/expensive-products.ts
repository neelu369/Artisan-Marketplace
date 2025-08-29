import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('https://fakestoreapi.com/products');
  const products = await response.json();
  // Filter for expensive products (price > 100)
  const expensiveProducts = products.filter((product: any) => product.price > 100);
  res.status(200).json(expensiveProducts);
}
