import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Badge } from './ui/badge';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  artisan: string;
  category: string;
  aiHint: string;
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Fallback image URL if imageUrl is empty or undefined
  const imageUrl = product.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
  
  return (
    <Card className="group flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          <Image
            src={imageUrl}
            alt={product.name || 'Product image'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.aiHint}
            onError={(e) => {
              console.warn('Image failed to load:', imageUrl);
              // Set a fallback image on error
              e.currentTarget.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop';
            }}
          />
           <Badge variant="secondary" className="absolute top-2 left-2">{product.category}</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full text-muted-foreground hover:text-primary"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <CardTitle className="font-headline text-lg leading-tight mb-2">
          <Link href="#">{product.name}</Link>
        </CardTitle>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {product.artisan.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">By</span>
            <Badge variant="outline" className="text-xs font-medium text-primary border-primary/30">
              {product.artisan}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-semibold text-primary">₹{product.price}</p>
        <Button variant="secondary" asChild>
          <Link href="#">View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
