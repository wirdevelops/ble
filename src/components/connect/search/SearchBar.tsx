'use client';

import { useState, useEffect } from 'react';
import { BiSearch, BiFilter, BiX } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  tags: string[];
  type: 'all' | 'contacts' | 'meetings' | 'events' | 'mentors';
  status: 'all' | 'active' | 'pending' | 'archived';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export default function SearchBar({ onSearch, onFilter }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    type: 'all',
    status: 'all',
    dateRange: {
      start: null,
      end: null,
    },
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: string | string[] | { start: Date | null; end: Date | null }
  ) => {
    const updatedFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      setSelectedTags(updatedTags);
      handleFilterChange('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updatedTags);
    handleFilterChange('tags', updatedTags);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search contacts, meetings, events..."
            className="w-full pl-10 pr-4 py-2 bg-surface-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/60" />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${
            showFilters ? 'bg-primary text-white' : 'bg-surface-dark hover:bg-surface-darker'
          }`}
        >
          <BiFilter className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-surface-dark rounded-lg space-y-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'contacts', 'meetings', 'events', 'mentors'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('type', type)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.type === type
                          ? 'bg-primary text-white'
                          : 'bg-surface hover:bg-surface-darker'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'active', 'pending', 'archived'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange('status', status)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.status === status
                          ? 'bg-primary text-white'
                          : 'bg-surface hover:bg-surface-darker'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add tags..."
                    className="flex-1 px-3 py-1 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-surface rounded-full"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <BiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    onChange={(e) =>
                      handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        start: e.target.value ? new Date(e.target.value) : null,
                      })
                    }
                    className="px-3 py-1 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="date"
                    onChange={(e) =>
                      handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        end: e.target.value ? new Date(e.target.value) : null,
                      })
                    }
                    className="px-3 py-1 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
