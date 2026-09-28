/**
 * Global Store using Zustand
 * Manages auth state, cart state, and UI state for KRUMAK TRADERS
 */
'use client';

import { create } from 'zustand';
import { products as mockProducts } from '@/lib/mockData';

// ==================== AUTH STORE ====================
export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  // Initialize auth from localStorage
  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('krumak_token');
      const userStr = localStorage.getItem('krumak_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true, loading: false });
        } catch {
          set({ loading: false });
        }
      } else {
        set({ loading: false });
      }
    }
  },

  // Login action
  login: (user, token) => {
    localStorage.setItem('krumak_token', token);
    localStorage.setItem('krumak_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('krumak_token');
    localStorage.removeItem('krumak_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Update user info
  updateUser: (user) => {
    localStorage.setItem('krumak_user', JSON.stringify(user));
    set({ user });
  },

  // Check if user is admin
  isAdmin: () => get().user?.role === 'admin',
}));

// ==================== CART STORE ====================
export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  // Initialize cart from localStorage
  initCart: () => {
    if (typeof window !== 'undefined') {
      const cartStr = localStorage.getItem('krumak_cart');
      if (cartStr) {
        try {
          set({ items: JSON.parse(cartStr) });
        } catch {
          set({ items: [] });
        }
      }
    }
  },

  // Save cart to localStorage
  _saveCart: (items) => {
    localStorage.setItem('krumak_cart', JSON.stringify(items));
  },

  // Add item to cart
  addItem: (product, quantity = 1) => {
    const { items, _saveCart } = get();
    const existing = items.find(i => i.id === product.id);
    let newItems;
    if (existing) {
      newItems = items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
    } else {
      newItems = [...items, { id: product.id, name: product.name, price: product.price, image: product.image, quantity, slug: product.slug }];
    }
    _saveCart(newItems);
    set({ items: newItems });
  },

  // Update item quantity
  updateQuantity: (itemId, quantity) => {
    const { items, _saveCart } = get();
    if (quantity <= 0) {
      const newItems = items.filter(i => i.id !== itemId);
      _saveCart(newItems);
      set({ items: newItems });
    } else {
      const newItems = items.map(i => i.id === itemId ? { ...i, quantity } : i);
      _saveCart(newItems);
      set({ items: newItems });
    }
  },

  // Remove item
  removeItem: (itemId) => {
    const { items, _saveCart } = get();
    const newItems = items.filter(i => i.id !== itemId);
    _saveCart(newItems);
    set({ items: newItems });
  },

  // Clear cart
  clearCart: () => {
    localStorage.removeItem('krumak_cart');
    set({ items: [] });
  },

  // Get cart totals
  getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getTax: () => get().getSubtotal() * 0.18, // 18% GST
  getTotal: () => get().getSubtotal() + get().getTax(),
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

// ==================== UI STORE ====================
export const useUIStore = create((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
