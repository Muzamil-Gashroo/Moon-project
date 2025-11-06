/**
 * Product Filters Component
 * Advanced filtering UI with search and category filters
 */

import React, { useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ProductFilters as Filters, ProductCategory } from '@/types/product';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductFiltersProps {
  filters: Filters;
  categories: ProductCategory[];
  onFilterChange: (filters: Filters) => void;
  resultCount: number;
}

export const ProductFilters = React.memo<ProductFiltersProps>(
  ({ filters, categories, onFilterChange, resultCount }) => {
    const [searchValue, setSearchValue] = React.useState(filters.search || '');
    const debouncedSearch = useDebounce(searchValue, 300);

    // Update filters when debounced search changes
    React.useEffect(() => {
      onFilterChange({ ...filters, search: debouncedSearch });
    }, [debouncedSearch]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    }, []);

    const handleCategoryChange = useCallback(
      (category: ProductCategory | 'all') => {
        onFilterChange({ ...filters, category });
      },
      [filters, onFilterChange]
    );

    const handleStockToggle = useCallback(() => {
      onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
    }, [filters, onFilterChange]);

    return (
      <div className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="mb-2 block">
            Search Products
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by name, description..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <Label className="mb-3 block font-semibold">Categories</Label>
          <div className="space-y-2">
            <Button
              variant={filters.category === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('all')}
              className="w-full justify-start"
            >
              All Products
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={filters.category === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="w-full justify-start capitalize"
              >
                {category.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Stock Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStockOnly}
            onCheckedChange={handleStockToggle}
          />
          <Label htmlFor="inStock" className="text-sm cursor-pointer">
            In stock only
          </Label>
        </div>

        {/* Results Count */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{resultCount}</span>{' '}
            {resultCount === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>
    );
  }
);

ProductFilters.displayName = 'ProductFilters';
