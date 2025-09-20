import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Policy, PolicyFilters, PolicyStore } from '@/types/policy';
import { mockPolicies } from '@/data/policies';

const defaultFilters: PolicyFilters = {
  regions: [],
  topics: [],
  timeRange: 'all',
  searchQuery: '',
  importance: [],
};

export const usePolicyStore = create<PolicyStore>()(
  persist(
    (set, get) => ({
      policies: mockPolicies,
      filteredPolicies: mockPolicies,
      filters: defaultFilters,
      favorites: [],
      isLoading: false,

      setPolicies: (policies) => {
        set({ policies });
        get().applyFilters();
      },

      setFilters: (newFilters) => {
        const currentFilters = get().filters;
        set({ filters: { ...currentFilters, ...newFilters } });
        get().applyFilters();
      },

      applyFilters: () => {
        const { policies, filters } = get();
        let filtered = [...policies];

        // Filter by regions
        if (filters.regions.length > 0) {
          filtered = filtered.filter(policy => 
            policy.region.some(r => filters.regions.includes(r))
          );
        }

        // Filter by topics
        if (filters.topics.length > 0) {
          filtered = filtered.filter(policy => 
            policy.topics.some(t => filters.topics.includes(t))
          );
        }

        // Filter by importance
        if (filters.importance.length > 0) {
          filtered = filtered.filter(policy => 
            filters.importance.includes(policy.importance)
          );
        }

        // Filter by search query
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(policy => 
            policy.title.toLowerCase().includes(query) ||
            policy.summary.toLowerCase().includes(query) ||
            policy.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }

        // Filter by time range
        if (filters.timeRange !== 'all') {
          const now = new Date();
          const cutoffDate = new Date();
          
          switch (filters.timeRange) {
            case 'week':
              cutoffDate.setDate(now.getDate() - 7);
              break;
            case 'month':
              cutoffDate.setMonth(now.getMonth() - 1);
              break;
            case 'quarter':
              cutoffDate.setMonth(now.getMonth() - 3);
              break;
            case 'year':
              cutoffDate.setFullYear(now.getFullYear() - 1);
              break;
          }

          filtered = filtered.filter(policy => 
            new Date(policy.publishDate) >= cutoffDate
          );
        }

        // Sort by pinned and date
        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        });

        set({ filteredPolicies: filtered });
      },

      toggleFavorite: (policyId) => {
        const { favorites } = get();
        const newFavorites = favorites.includes(policyId)
          ? favorites.filter(id => id !== policyId)
          : [...favorites, policyId];
        set({ favorites: newFavorites });
      },

      clearFilters: () => {
        set({ filters: defaultFilters });
        get().applyFilters();
      },
    }),
    {
      name: 'policy-store',
      partialize: (state) => ({ 
        favorites: state.favorites,
        filters: state.filters,
      }),
    }
  )
);