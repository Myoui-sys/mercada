'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { api } from '@/lib/api';
import { useAuth } from './auth-context';
import type { Cart } from '@/types';

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.get<Cart>('/cart', token);
      setCart(data);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function addItem(productId: string, quantity: number) {
    const data = await api.post<Cart>(
      '/cart/items',
      { productId, quantity },
      token,
    );
    setCart(data);
  }

  async function updateItem(itemId: string, quantity: number) {
    const data = await api.patch<Cart>(
      `/cart/items/${itemId}`,
      { quantity },
      token,
    );
    setCart(data);
  }

  async function removeItem(itemId: string) {
    const data = await api.delete<Cart>(`/cart/items/${itemId}`, token);
    setCart(data);
  }

  async function clearCart() {
    await api.delete('/cart', token);
    setCart((prev) => (prev ? { ...prev, items: [] } : prev));
  }

  const itemCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart precisa ser usado dentro de um CartProvider.');
  }

  return context;
}
