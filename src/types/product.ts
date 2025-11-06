/**
 * Product domain types
 * These types define the structure of products in our e-commerce system
 */

export type ProductCategory = 'shilajit' | 'saffron' | 'dry-fruits';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  featured: boolean;
  inStock: boolean;
  weight: string;
  benefits: string[];
  tags: string[];
}

export interface ProductFilters {
  category?: ProductCategory | 'all';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}
