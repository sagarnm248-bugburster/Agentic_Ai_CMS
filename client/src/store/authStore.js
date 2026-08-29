import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('resolvedesk_token') || null,
  isAuthenticated: !!localStorage.getItem('resolvedesk_token'),
  loading: true,
  error: null,

  // Fetch current logged in user profile
  fetchMe: async () => {
    const token = get().token;
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }

    try {
      set({ loading: true, error: null });
      const res = await api.get('/auth/me');
      set({ user: res.data.user, isAuthenticated: true, loading: false });
    } catch (err) {
      console.error('Fetch me failed:', err);
      localStorage.removeItem('resolvedesk_token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  // Login
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('resolvedesk_token', token);
      set({ user, token, isAuthenticated: true, loading: false, error: null });
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Register
  register: async (name, email, password, role = 'student') => {
    try {
      set({ loading: true, error: null });
      const res = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = res.data;

      localStorage.setItem('resolvedesk_token', token);
      set({ user, token, isAuthenticated: true, loading: false, error: null });
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('resolvedesk_token');
    set({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
