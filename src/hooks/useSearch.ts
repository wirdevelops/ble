import { useState, useEffect, useMemo } from 'react';
import { FilterOptions } from '@/components/connect/search/SearchBar';

interface SearchableItem {
  id: string;
  type: string;
  status: string;
  tags: string[];
  date?: Date;
  [key: string]: any;
}

export function useSearch<T extends SearchableItem>(items: T[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    type: 'all',
    status: 'all',
    dateRange: {
      start: null,
      end: null,
    },
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search query filter
      const searchString = Object.values(item)
        .filter((value) => typeof value === 'string')
        .join(' ')
        .toLowerCase();
      if (
        searchQuery &&
        !searchString.includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }

      // Tags filter
      if (
        filters.tags.length > 0 &&
        !filters.tags.every((tag) => item.tags.includes(tag))
      ) {
        return false;
      }

      // Date range filter
      if (item.date && (filters.dateRange.start || filters.dateRange.end)) {
        const itemDate = new Date(item.date);
        if (
          filters.dateRange.start &&
          itemDate < filters.dateRange.start
        ) {
          return false;
        }
        if (
          filters.dateRange.end &&
          itemDate > filters.dateRange.end
        ) {
          return false;
        }
      }

      return true;
    });
  }, [items, searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return {
    filteredItems,
    handleSearch,
    handleFilter,
    searchQuery,
    filters,
  };
}
