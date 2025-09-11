import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variantId: string;
  maxQuantity?: number;
};

type CartState = {
  cart: CartItem[];
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  fetchCartCount: () => Promise<{ count: number; items: CartItem[] }>;
  getCartCount: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  itemCount: 0,
  isLoading: false,
  error: null,

  addToCart: (item) =>
    set((state) => {
      console.log("item is doing cart", item)
      const existing = state.cart.find((i) => i.id === item.id);
      const newCart = existing
        ? state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        : [...state.cart, item];
      return { cart: newCart, itemCount: newCart.reduce((sum, item) => sum + item.quantity, 0) };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      const newCart = state.cart.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      return { cart: newCart, itemCount: newCart.reduce((sum, item) => sum + item.quantity, 0) };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const newCart = state.cart.filter((i) => i.id !== id);
      return { cart: newCart, itemCount: newCart.reduce((sum, item) => sum + item.quantity, 0) };
    }),

  clearCart: () => set({ cart: [], itemCount: 0 }),

  fetchCartCount: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/cart/items/count');
      if (!res.ok) throw new Error('Failed to fetch cart count');
      const { count, items = [] } = await res.json();
      
      // Update both cart items and count
      set({ 
        cart: items.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variantId: item.variantId,
          maxQuantity: item.maxQuantity
        })),
        itemCount: count,
        isLoading: false 
      });
      
      return { count, items };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart count';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getCartCount: () => get().itemCount,
}));
