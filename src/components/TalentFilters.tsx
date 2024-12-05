'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const categories = [
  'All',
  'Music',
  'Dance',
  'Art',
  'Sports',
  'Voice',
  'Photography',
];

const filters = {
  availability: ['Available Now', 'Available This Week', 'Custom Date'],
  rating: ['4.5 & up', '4.0 & up', '3.5 & up'],
  experience: ['Beginner', 'Intermediate', 'Professional'],
  price: ['Free', 'Paid', 'Negotiable'],
};

export default function TalentFilters() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    availability: [],
    rating: [],
    experience: [],
    price: [],
  });

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      availability: [],
      rating: [],
      experience: [],
      price: [],
    });
  };

  return (
    <div className="sticky top-16 z-30 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
            <input
              type="text"
              placeholder="Search talents..."
              className="w-full pl-10 pr-4 py-2 bg-surface rounded-full border border-border focus:border-primary outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-surface border border-border rounded-full flex items-center gap-2 hover:border-primary transition-colors"
          >
            <FaFilter className="text-text/60" />
            <span className="text-text">Filters</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-primary text-background'
                  : 'bg-surface text-text hover:bg-primary/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-surface rounded-xl border border-border"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-text">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(filters).map(([category, options]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-text mb-2 capitalize">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[category].includes(option)}
                          onChange={() => toggleFilter(category, option)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-text/80 group-hover:text-text">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
