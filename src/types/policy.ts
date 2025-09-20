export interface Policy {
  id: string;
  title: string;
  titleCN: string;
  summary: string;
  summaryCN: string;
  content: string;
  contentCN: string;
  source: string;
  sourceUrl: string;
  region: string[];
  topics: string[];
  tags: string[];
  publishDate: string;
  effectiveDate?: string;
  readTime: number;
  importance: 'high' | 'medium' | 'low';
  isPinned?: boolean;
  status: 'draft' | 'published' | 'updated';
}

export interface PolicyFilters {
  regions: string[];
  topics: string[];
  timeRange: 'all' | 'week' | 'month' | 'quarter' | 'year';
  searchQuery: string;
  importance: ('high' | 'medium' | 'low')[];
}

export interface PolicyStore {
  policies: Policy[];
  filteredPolicies: Policy[];
  filters: PolicyFilters;
  favorites: string[];
  isLoading: boolean;
  setPolicies: (policies: Policy[]) => void;
  setFilters: (filters: Partial<PolicyFilters>) => void;
  applyFilters: () => void;
  toggleFavorite: (policyId: string) => void;
  clearFilters: () => void;
}