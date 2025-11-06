/**
 * Product Card Component
 * Memoized for performance with large lists
 */

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateDiscount } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = React.memo<ProductCardProps>(({ product }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      addToCart(product);
    },
    [addToCart, product]
  );

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice)(product.price)
    : 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-glow transition-spring"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-smooth">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg text-primary">
              {formatCurrency(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={cn(
              'transition-spring',
              isInCart(product.id) && 'bg-accent hover:bg-accent/90'
            )}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';
