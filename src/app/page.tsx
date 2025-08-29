import { Button } from '@/components/ui/button';
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
import {
  Palette,
  Sparkles,
  ScanSearch,
  CheckCircle,
  BookText,
  Workflow,
  Heart,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { products, artisans } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FirebaseTest } from '@/components/firebase-test';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        <Image
          src="https://picsum.photos/1800/1000"
          alt="Indian artisan crafting a pot"
          fill
          className="object-cover object-center"
          data-ai-hint="indian artisan"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="relative px-4 text-primary-foreground">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline text-white drop-shadow-lg">
              kalaaVerse
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl font-body text-white/90 drop-shadow-md">
              Empowering India&apos;s Artisans with AI. <br />
              Bridging Heritage and the Digital World.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="font-headline text-lg">
                <Link href="/marketplace">Explore the Marketplace</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="font-headline text-lg"
              >
                <Link href="/tools">Artisan Tools</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <FirebaseTest />
        </div>
      </section>
    </div>
  );
}
