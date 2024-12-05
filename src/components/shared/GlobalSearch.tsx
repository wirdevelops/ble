'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiSearch, BiX, BiHistory, BiTrendingUp } from 'react-icons/bi';
import { useSearch } from '@/context/AppContext';

export default function GlobalSearch() {
  const { isOpen, query, openSearch, closeSearch, setQuery } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSearch]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-background/80 backdrop-blur-lg"
        >
          <div
            ref={searchRef}
            className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl"
          >
            {/* Search Input */}
            <div className="relative flex items-center p-4 border-b border-border">
              <BiSearch className="w-5 h-5 text-text/60" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="flex-1 ml-3 bg-transparent border-none outline-none text-text placeholder:text-text/60"
              />
              <button
                onClick={closeSearch}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <BiX className="w-5 h-5 text-text/60" />
              </button>
            </div>

            {/* Search Content */}
            <div className="p-4">
              {query ? (
                <SearchResults query={query} />
              ) : (
                <div className="space-y-4">
                  <RecentSearches />
                  <TrendingSearches />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchResults({ query }: { query: string }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center text-text/60">
      Searching for "{query}"...
    </div>
  );
}

function RecentSearches() {
  const recentSearches = [
    'Photography workshops',
    'Music events',
    'Web development',
    'Art exhibitions',
  ];

  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-medium text-text/60 mb-2">
        <BiHistory className="w-4 h-4" />
        Recent Searches
      </h3>
      <div className="space-y-2">
        {recentSearches.map((search) => (
          <button
            key={search}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}

function TrendingSearches() {
  const trendingSearches = [
    'Digital marketing',
    'Local talents',
    'Business opportunities',
    'Tech meetups',
  ];

  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-medium text-text/60 mb-2">
        <BiTrendingUp className="w-4 h-4" />
        Trending Searches
      </h3>
      <div className="space-y-2">
        {trendingSearches.map((search) => (
          <button
            key={search}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}
