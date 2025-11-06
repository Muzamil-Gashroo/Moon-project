/**
 * Products Context
 * Manages product data with async loading simulation
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product, ProductFilters, ProductCategory } from '@/types/product';
import productsData from '../../data/products.json';

interface ProductsContextType {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  categories: ProductCategory[];
  getFeaturedProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: ProductCategory) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'all',
    search: '',
    inStockOnly: false,
  });

  // Simulate async product loading
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts(productsData as Product[]);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  // Get unique categories
  const categories = useMemo<ProductCategory[]>(() => {
    const uniqueCategories = new Set(products.map(p => p.category));
    return Array.from(uniqueCategories);
  }, [products]);

  // Complex filtering logic with memoization
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Search filter (searches name, description, and tags)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Price range filter
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }

      // Stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  // Memoized selectors for derived data
  const getFeaturedProducts = useMemo(() => {
    return () => products.filter(p => p.featured);
  }, [products]);

  const getProductById = useMemo(() => {
    return (id: string) => products.find(p => p.id === id);
  }, [products]);

  const getProductsByCategory = useMemo(() => {
    return (category: ProductCategory) => products.filter(p => p.category === category);
  }, [products]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        isLoading,
        filters,
        setFilters,
        categories,
        getFeaturedProducts,
        getProductById,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
