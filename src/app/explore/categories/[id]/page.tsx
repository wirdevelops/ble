'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaStar, FaSort } from 'react-icons/fa';
import TalentCard from '@/components/TalentCard';

// Mock data - Replace with API call
const mockTalents = [
  {
    id: '1',
    name: 'John Doe',
    category: 'Music',
    image: '/placeholder.jpg',
    rating: 4.8,
    reviews: 120,
    skills: ['Piano', 'Guitar', 'Vocals'],
    location: 'Bamenda',
    price: 50,
    availability: 'Available',
  },
  // Add more mock talents...
];

const filters = [
  {
    id: 'rating',
    label: 'Rating',
    options: [
      { value: '4.5', label: '4.5+ Stars' },
      { value: '4.0', label: '4.0+ Stars' },
      { value: '3.5', label: '3.5+ Stars' },
    ],
  },
  {
    id: 'price',
    label: 'Price Range',
    options: [
      { value: 'low', label: 'Under $50' },
      { value: 'medium', label: '$50 - $200' },
      { value: 'high', label: '$200+' },
    ],
  },
  {
    id: 'availability',
    label: 'Availability',
    options: [
      { value: 'available', label: 'Available Now' },
      { value: 'this-week', label: 'This Week' },
      { value: 'this-month', label: 'This Month' },
    ],
  },
];

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Category Header */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
              🎵
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text">Music</h1>
              <p className="text-text/60 mt-1">156 talents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-surface rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <FaFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <FaSort className="w-4 h-4 text-text/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-text focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <div className="py-4 space-y-4">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <h3 className="font-medium text-text mb-2">{filter.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            [filter.id]: option.value,
                          }))
                        }
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          selectedFilters[filter.id] === option.value
                            ? 'bg-primary text-background border-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Talent Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTalents.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>
      </div>
    </div>
  );
}
