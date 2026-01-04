/**
 * Shopping Cart Hook and Context
 *
 * Provides cart state management and API integration for the shopping cart.
 * Supports both authenticated users and guest sessions.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  addedAt: Date;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  summary: CartSummary;
  status: 'active' | 'checkout' | 'completed';
  updatedAt: Date;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  const refreshCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cart', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to cart');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update quantity');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove item');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
