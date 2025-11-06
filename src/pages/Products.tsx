/**
 * Products Page
 * Main product browsing page with filters
 */

import { useProducts } from '@/contexts/ProductsContext';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';

export default function Products() {
  const { filteredProducts, isLoading, filters, setFilters, categories } = useProducts();

  return (
    <div className="min-h-screen py-12 gradient-warm">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            Discover our premium collection of natural wellness products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-soft sticky top-20">
              <h2 className="font-semibold text-lg mb-4 flex items-center">
                <span>Filters</span>
              </h2>
              <ProductFilters
                filters={filters}
                categories={categories}
                onFilterChange={setFilters}
                resultCount={filteredProducts.length}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={filteredProducts} itemsPerPage={12} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
