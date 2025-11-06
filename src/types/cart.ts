/**
 * Shopping cart domain types
 */

import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart }
  | { type: 'OPTIMISTIC_ADD'; payload: { product: Product; quantity: number } }
  | { type: 'ROLLBACK_ADD'; payload: { productId: string } };
