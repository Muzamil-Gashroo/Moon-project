/**
 * Home Page
 * Landing page with hero section and featured products
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Award } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Lab-tested and certified products from trusted sources',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and secure shipping across India',
  },
  {
    icon: Award,
    title: 'Authentic Products',
    description: '100% pure and natural ingredients',
  },
];

export default function Home() {
  const { getFeaturedProducts, isLoading } = useProducts();
  const featuredProducts = React.useMemo(() => getFeaturedProducts(), [getFeaturedProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Nature's Finest Treasures
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 text-balance">
              Premium Himalayan Shilajit, Kashmiri Saffron, and carefully selected dry fruits
              for your health and wellness
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="shadow-glow">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 gradient-warm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-card shadow-soft transition-spring hover:shadow-glow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked selection of our most popular products
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-accent-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience the Power of Nature
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of satisfied customers who trust Monnn for authentic,
              premium-quality natural products.
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
