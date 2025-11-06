/**
 * Product Grid with Pagination
 * Implements pagination for large product sets
 */

import React, { useMemo } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  itemsPerPage?: number;
}

export const ProductGrid = React.memo<ProductGridProps>(
  ({ products, itemsPerPage = 12 }) => {
    const [currentPage, setCurrentPage] = React.useState(1);

    // Calculate pagination
    const { paginatedProducts, totalPages, startIndex, endIndex } = useMemo(() => {
      const total = Math.ceil(products.length / itemsPerPage);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginated = products.slice(start, end);

      return {
        paginatedProducts: paginated,
        totalPages: total,
        startIndex: start + 1,
        endIndex: Math.min(end, products.length),
      };
    }, [products, currentPage, itemsPerPage]);

    // Reset page when products change
    React.useEffect(() => {
      setCurrentPage(1);
    }, [products]);

    const handlePrevPage = () => {
      setCurrentPage(prev => Math.max(1, prev - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNextPage = () => {
      setCurrentPage(prev => Math.min(totalPages, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex}-{endIndex} of {products.length}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ProductGrid.displayName = 'ProductGrid';
