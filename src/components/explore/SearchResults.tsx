'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaTimes } from 'react-icons/fa';

interface SearchResult {
  id: string;
  type: 'talent' | 'category' | 'achievement';
  name: string;
  image?: string;
  category?: string;
  rating?: number;
  description?: string;
  date?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onClose: () => void;
}

export default function SearchResults({
  results,
  query,
  onClose,
}: SearchResultsProps) {
  if (!query) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-medium text-text">
            Results for "{query}"
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <FaTimes className="w-4 h-4 text-text/60" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-text/60">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-2">
                Try searching for different keywords or browse categories below
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={
                    result.type === 'talent'
                      ? `/talents/${result.id}`
                      : result.type === 'category'
                      ? `/explore/categories/${result.id}`
                      : `/explore/achievements/${result.id}`
                  }
                >
                  <motion.div
                    whileHover={{ backgroundColor: 'rgba(var(--color-primary), 0.05)' }}
                    className="flex items-center gap-4 p-4 transition-colors"
                  >
                    {result.image && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                        <Image
                          src={result.image}
                          alt={result.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-text truncate">
                          {result.name}
                        </h4>
                        {result.type === 'talent' && result.rating && (
                          <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-text/60">
                              {result.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      {result.category && (
                        <p className="text-sm text-text/60 truncate">
                          {result.category}
                        </p>
                      )}
                      {result.description && (
                        <p className="text-sm text-text/60 truncate">
                          {result.description}
                        </p>
                      )}
                      {result.date && (
                        <p className="text-sm text-text/60">{result.date}</p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
