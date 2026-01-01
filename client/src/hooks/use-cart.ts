import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Brand } from '@shared/schema';

/**
 * Shopping Cart State Management
 * 
 * Uses Zustand for state management with localStorage persistence
 * Syncs with backend API for authenticated users
 */

export interface CartItem {
  id: number; // Cart item ID from database
  brandId: number;
  name: string;
  price: number;
  quantity: number;
  sectorId?: number;
  integration?: string;
  imageUrl?: string;
  metadata?: any;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (brand: Brand, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (brandId: number) => number;
}

/**
 * Shopping Cart Store
 * Persists to localStorage and syncs with backend
 */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      /**
       * Add item to cart
       */
      addItem: async (brand: Brand, quantity = 1) => {
        set({ isLoading: true, error: null });
        
        try {
          // Call backend API
          const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              brandId: brand.id,
              quantity,
              metadata: {
                name: brand.name,
                description: brand.description,
                integration: brand.integration,
                sectorId: brand.sectorId,
              },
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to add item to cart');
          }

          const data = await response.json();
          
          // Reload cart from backend
          await get().loadCart();
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Error adding to cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add item',
            isLoading: false,
          });
        }
      },

      /**
       * Remove item from cart
       */
      removeItem: async (cartItemId: number) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/cart/item/${cartItemId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to remove item from cart');
          }

          // Update local state
          set((state) => ({
            items: state.items.filter((item) => item.id !== cartItemId),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error removing from cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove item',
            isLoading: false,
          });
        }
      },

      /**
       * Update item quantity
       */
      updateQuantity: async (cartItemId: number, quantity: number) => {
        if (quantity < 1) {
          return get().removeItem(cartItemId);
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`/api/cart/item/${cartItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          });

          if (!response.ok) {
            throw new Error('Failed to update quantity');
          }

          // Update local state
          set((state) => ({
            items: state.items.map((item) =>
              item.id === cartItemId ? { ...item, quantity } : item
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error updating quantity:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            isLoading: false,
          });
        }
      },

      /**
       * Clear all items from cart
       */
      clearCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/cart', {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to clear cart');
          }

          set({ items: [], isLoading: false });
        } catch (error) {
          console.error('Error clearing cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            isLoading: false,
          });
        }
      },

      /**
       * Load cart from backend
       */
      loadCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/cart');
          
          if (!response.ok) {
            throw new Error('Failed to load cart');
          }

          const data = await response.json();
          
          // Transform backend data to cart items
          const items: CartItem[] = data.items.map((item: any) => ({
            id: item.id,
            brandId: item.brandId,
            name: item.metadata?.name || `Brand ${item.brandId}`,
            price: 29.99, // Default price, would come from brand data
            quantity: item.quantity,
            sectorId: item.metadata?.sectorId,
            integration: item.metadata?.integration,
            metadata: item.metadata,
          }));

          set({ items, isLoading: false });
        } catch (error) {
          console.error('Error loading cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load cart',
            isLoading: false,
          });
        }
      },

      /**
       * Get total number of items in cart
       */
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Get total price of cart
       */
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      /**
       * Get quantity of specific brand in cart
       */
      getItemCount: (brandId: number) => {
        const item = get().items.find((item) => item.brandId === brandId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'fruitful-cart-storage',
      // Only persist items array, not loading/error states
      partialize: (state) => ({ items: state.items }),
    }
  )
);
