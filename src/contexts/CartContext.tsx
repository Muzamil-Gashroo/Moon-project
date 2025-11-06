/**
 * Cart Context with useReducer
 * Manages shopping cart state with complex reducer logic
 * Includes optimistic updates and rollback capabilities
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartAction, CartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

const CART_STORAGE_KEY = 'monnn_cart';

// Initial cart state
const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Cart reducer with complex state management
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        // Update existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { product, quantity, addedAt: Date.now() }];
      }

      return calculateCartTotals({ ...state, items: newItems });
    }

    case 'OPTIMISTIC_ADD': {
      // Optimistic update - add immediately before server confirmation
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity, addedAt: Date.now() }];
      }

      return calculateCartTotals({ ...state, items: newItems });
    }

    case 'ROLLBACK_ADD': {
      // Rollback optimistic update on failure
      const { productId } = action.payload;
      const itemIndex = state.items.findIndex(
        item => item.product.id === productId
      );
      
      if (itemIndex === -1) return state;
      
      const newItems = state.items.filter((_, index) => index !== itemIndex);
      return calculateCartTotals({ ...state, items: newItems });
    }

    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      const newItems = state.items.filter(item => item.product.id !== productId);
      return calculateCartTotals({ ...state, items: newItems });
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }

      const newItems = state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return calculateCartTotals({ ...state, items: newItems });
    }

    case 'CLEAR_CART': {
      return initialCart;
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
}

// Helper function to calculate cart totals
function calculateCartTotals(cart: Cart): Cart {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return { ...cart, totalItems, totalPrice };
}

// Context type
interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [storedCart, setStoredCart] = useLocalStorage<Cart>(CART_STORAGE_KEY, initialCart);
  const [cart, dispatch] = useReducer(cartReducer, storedCart);

  // Sync cart to localStorage
  useEffect(() => {
    setStoredCart(cart);
  }, [cart, setStoredCart]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (storedCart.items.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: storedCart });
    }
  }, []); // Only run once on mount

  // Add to cart with optimistic update and simulated async operation
  const addToCart = async (product: Product, quantity = 1) => {
    // Optimistic update
    dispatch({ type: 'OPTIMISTIC_ADD', payload: { product, quantity } });
    
    try {
      // Simulate async operation (e.g., API call to validate stock)
      await simulateAsyncValidation(product.id);
      
      // Confirm the addition
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      // Rollback on failure
      dispatch({ type: 'ROLLBACK_ADD', payload: { productId: product.id } });
      toast({
        title: 'Failed to add to cart',
        description: 'The item could not be added. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
    toast({
      title: 'Removed from cart',
      description: 'Item has been removed from your cart.',
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart.',
    });
  };

  const isInCart = (productId: string): boolean => {
    return cart.items.some(item => item.product.id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find(item => item.product.id === productId);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Simulate async validation (e.g., checking stock availability)
async function simulateAsyncValidation(productId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 95% success rate for demonstration
      if (Math.random() > 0.05) {
        resolve();
      } else {
        reject(new Error('Stock validation failed'));
      }
    }, 500);
  });
}
