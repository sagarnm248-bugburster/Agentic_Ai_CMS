import { create } from 'zustand';
import api from '../services/api';

export const useComplaintStore = create((set) => ({
  complaints: [],
  currentComplaint: null,
  loading: false,
  error: null,

  // Fetch complaints (students get their own, admins get all)
  fetchComplaints: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      const params = new URLSearchParams(filters).toString();
      const url = params ? `/complaints?${params}` : '/complaints';
      const res = await api.get(url);
      set({ complaints: res.data, loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch complaints';
      set({ error: msg, loading: false });
    }
  },

  // Fetch single complaint details
  fetchComplaintById: async (id) => {
    try {
      set({ loading: true, error: null, currentComplaint: null });
      const res = await api.get(`/complaints/${id}`);
      set({ currentComplaint: res.data, loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch complaint details';
      set({ error: msg, loading: false });
    }
  },

  // Create new complaint
  createComplaint: async (complaintData) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post('/complaints', complaintData);
      set((state) => ({
        complaints: [res.data, ...state.complaints],
        loading: false,
      }));
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create complaint';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  // Update complaint details (Admin Only)
  updateComplaint: async (id, updateData) => {
    try {
      set({ loading: true, error: null });
      const res = await api.put(`/complaints/${id}`, updateData);
      set((state) => ({
        currentComplaint: res.data,
        complaints: state.complaints.map((c) => (c._id === id ? res.data : c)),
        loading: false,
      }));
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update complaint';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  // Delete complaint (Admin Only)
  deleteComplaint: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/complaints/${id}`);
      set((state) => ({
        complaints: state.complaints.filter((c) => c._id !== id),
        currentComplaint: null,
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete complaint';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  clearCurrentComplaint: () => set({ currentComplaint: null }),
  clearError: () => set({ error: null }),
}));

