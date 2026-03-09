import { create } from 'zustand';
import { authAPI, cartAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('flipmart_user')) || null,
  token: localStorage.getItem('flipmart_token') || null,
  loading: false,

  register: async (data) => {
    set({ loading: true });
    try {
      const res = await authAPI.register(data);
      localStorage.setItem('flipmart_token', res.data.token);
      localStorage.setItem('flipmart_user', JSON.stringify(res.data.user));
      set({ user: res.data.user, token: res.data.token, loading: false });
      toast.success('Account created! 🎉');
      return { success: true };
    } catch (err) {
      set({ loading: false });
      toast.error(err.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  },

  login: async (data) => {
    set({ loading: true });
    try {
      const res = await authAPI.login(data);
      localStorage.setItem('flipmart_token', res.data.token);
      localStorage.setItem('flipmart_user', JSON.stringify(res.data.user));
      set({ user: res.data.user, token: res.data.token, loading: false });
      toast.success(`Welcome back, ${res.data.user.name}! 🎉`);
      return { success: true };
    } catch (err) {
      set({ loading: false });
      toast.error(err.response?.data?.message || 'Login failed');
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem('flipmart_token');
    localStorage.removeItem('flipmart_user');
    set({ user: null, token: null });
    toast.success('Logged out successfully!');
  },

  updateUser: (user) => {
    localStorage.setItem('flipmart_user', JSON.stringify(user));
    set({ user });
  },

  sendOTP: async (phone) => {
    try {
      await authAPI.sendOTP(phone);
      toast.success('OTP sent!');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
      return { success: false };
    }
  },

  verifyOTP: async (data) => {
    try {
      const res = await authAPI.verifyOTP(data);
      localStorage.setItem('flipmart_token', res.data.token);
      localStorage.setItem('flipmart_user', JSON.stringify(res.data.user));
      set({ user: res.data.user, token: res.data.token });
      toast.success('Phone verified! ✅');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      return { success: false };
    }
  },
}));

// 🕐 RECENTLY VIEWED STORE
export const useRecentlyViewedStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('flipmart_recently_viewed')) || [],

  addProduct: (product) => {
    const current = get().items;
    const filtered = current.filter(p => p._id !== product._id);
    const updated = [product, ...filtered].slice(0, 8);
    localStorage.setItem('flipmart_recently_viewed', JSON.stringify(updated));
    set({ items: updated });
  },

  clearAll: () => {
    localStorage.removeItem('flipmart_recently_viewed');
    set({ items: [] });
  },
}));

// 🌙 DARK MODE STORE
export const useDarkModeStore = create((set) => ({
  isDark: JSON.parse(localStorage.getItem('flipmart_dark')) || false,

  toggle: () => set((state) => {
    const newVal = !state.isDark;
    localStorage.setItem('flipmart_dark', JSON.stringify(newVal));
    if (newVal) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    return { isDark: newVal };
  }),

  init: () => {
    const isDark = JSON.parse(localStorage.getItem('flipmart_dark')) || false;
    if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
  },
}));

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  fetchCart: async () => {
    const token = localStorage.getItem('flipmart_token');
    if (!token) return;
    try {
      const res = await cartAPI.get();
      set({ cart: res.data.cart });
    } catch (err) {
      console.log('Cart fetch error:', err);
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const token = localStorage.getItem('flipmart_token');
    if (!token) {
      toast.error('Please login to add items to cart!');
      return false;
    }
    try {
      const res = await cartAPI.add(productId, quantity);
      set({ cart: res.data.cart });
      toast.success('Added to cart! 🛒');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  },

  updateQty: async (productId, quantity) => {
    try {
      const res = await cartAPI.update(productId, quantity);
      set({ cart: res.data.cart });
    } catch (err) {
      toast.error('Failed to update cart');
    }
  },

  removeItem: async (productId) => {
    try {
      const res = await cartAPI.remove(productId);
      set({ cart: res.data.cart });
      toast.success('Item removed!');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      const res = await cartAPI.clear();
      set({ cart: res.data.cart });
    } catch (err) {
      console.log('Clear cart error');
    }
  },

  get totalItems() {
    return get().cart?.totalItems || 0;
  },
}));