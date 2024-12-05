'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFire, FaTrophy, FaFilter, FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation } from '@/hooks/useLocation';
import { SearchCache } from '@/utils/searchCache';
import { cancelableDebounce } from '@/utils/debounce';
import SimilarTalents from '@/components/profile/SimilarTalents';
import TalentAchievements from '@/components/profile/TalentAchievements';
import SearchResults from '@/components/explore/SearchResults';
import TalentMap from '@/components/explore/TalentMap';
import AdvancedFilters from '@/components/explore/AdvancedFilters';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/auth/withAuth';

// Mock data - Replace with API calls
const mockTalents = [
  {
    id: '1',
    name: 'John Doe',
    category: 'music',
    image: '/placeholder.jpg',
    rating: 4.8,
    reviews: 120,
    matchPercentage: 98,
  },
  {
    id: '2',
    name: 'Jane Smith',
    category: 'dance',
    image: '/placeholder.jpg',
    rating: 4.7,
    reviews: 89,
    matchPercentage: 95,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    category: 'photography',
    image: '/placeholder.jpg',
    rating: 4.9,
    reviews: 156,
    matchPercentage: 92,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    category: 'art',
    image: '/placeholder.jpg',
    rating: 4.6,
    reviews: 78,
    matchPercentage: 90,
  },
  {
    id: '5',
    name: 'Alex Brown',
    category: 'music',
    image: '/placeholder.jpg',
    rating: 4.5,
    reviews: 65,
    matchPercentage: 88,
  },
];

const mockCategories = [
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    count: 156,
    color: 'bg-purple-500',
  },
  {
    id: 'dance',
    name: 'Dance',
    icon: '💃',
    count: 89,
    color: 'bg-pink-500',
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: '📸',
    count: 134,
    color: 'bg-blue-500',
  },
  {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    count: 112,
    color: 'bg-green-500',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👗',
    count: 78,
    color: 'bg-yellow-500',
  },
  {
    id: 'comedy',
    name: 'Comedy',
    icon: '🎭',
    count: 45,
    color: 'bg-red-500',
  },
];

const mockFeaturedAchievements = [
  {
    id: '1',
    title: 'Bamenda Music Festival 2023',
    date: 'December 2023',
    description: 'Grand Prize Winner',
    type: 'award',
  },
  {
    id: '2',
    title: 'Rising Star Award',
    date: 'November 2023',
    description: 'Recognized as top emerging talent in Cameroon',
    type: 'feature',
  },
  {
    id: '3',
    title: 'International Collaboration',
    date: 'October 2023',
    description: 'Featured in global arts initiative',
    type: 'milestone',
  },
];

function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [filteredTalents, setFilteredTalents] = useState(mockTalents);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Update selected category when URL parameter changes
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filter talents when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filtered = mockTalents.filter(
        talent => talent.category === selectedCategory.toLowerCase()
      );
      setFilteredTalents(filtered);
    } else {
      setFilteredTalents(mockTalents);
    }
  }, [selectedCategory]);

  // Initialize location tracking
  const { location, error: locationError } = useLocation({
    enableHighAccuracy: true,
    updateInterval: 30000, // Update every 30 seconds
  });

  // Initialize search cache
  const searchCache = useMemo(() => new SearchCache<SearchResult[]>({
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
  }), []);

  // Debounced search function
  const debouncedSearch = useCallback(
    cancelableDebounce(async (query: string, filters: Record<string, any>) => {
      setIsLoading(true);
      try {
        // Check cache first
        const cachedResults = searchCache.get(query, filters);
        if (cachedResults) {
          setSearchResults(cachedResults);
          setShowResults(true);
          return;
        }

        // Simulate API call - Replace with actual API call
        const results = [
          {
            id: '1',
            type: 'talent' as const,
            name: 'John Doe',
            image: '/placeholder.jpg',
            category: 'Music',
            rating: 4.8,
          },
          {
            id: '2',
            type: 'category' as const,
            name: 'Dance',
            description: '89 talents',
          },
          {
            id: '3',
            type: 'achievement' as const,
            name: 'Bamenda Music Festival Winner',
            date: 'December 2023',
            description: 'Grand Prize',
          },
        ].filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        // Cache the results
        searchCache.set(query, results, filters);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [searchCache]
  );

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setShowResults(false);
      return;
    }
    debouncedSearch(query, activeFilters);
  };

  // Handle filter changes
  const handleFiltersChange = useCallback((filters: Record<string, any>) => {
    setActiveFilters(filters);
    if (searchQuery) {
      debouncedSearch(searchQuery, filters);
    }
  }, [searchQuery, debouncedSearch]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Update URL with the new category
    const newUrl = categoryId ? `/explore?category=${categoryId}` : '/explore';
    router.push(newUrl);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Optimize re-renders for search results
  const memoizedSearchResults = useMemo(() => (
    <SearchResults
      results={searchResults}
      query={searchQuery}
      onClose={() => setShowResults(false)}
      isLoading={isLoading}
    />
  ), [searchResults, searchQuery, isLoading]);

  // Optimize re-renders for map
  const memoizedMap = useMemo(() => (
    <TalentMap
      userLocation={location}
      onLocationChange={() => {}}
      locationError={locationError}
    />
  ), [location, locationError]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search talents, categories, or achievements..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface rounded-xl border border-border focus:border-primary/50 focus:outline-none text-text"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text/60" />
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="px-4 py-3 bg-surface rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <FaFilter className="w-5 h-5 text-text/60" />
              </button>
            </div>

            {/* Search Results */}
            {showResults && memoizedSearchResults}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-12">
        {/* Categories section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-2 rounded-full transition-all ${
                !selectedCategory
                  ? 'bg-primary text-background'
                  : 'bg-surface hover:bg-surface/80'
              }`}
            >
              All Categories
            </button>
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-background'
                    : 'bg-surface hover:bg-surface/80'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Talents Grid Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text">
              {selectedCategory 
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Talents`
                : 'All Talents'}
            </h2>
            <span className="text-text/60">{filteredTalents.length} talents found</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map((talent) => (
              <div
                key={talent.id}
                className="bg-surface border border-border rounded-xl p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={talent.image}
                      alt={talent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-text">{talent.name}</h3>
                    <p className="text-sm text-text/60 capitalize">{talent.category}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center text-yellow-500">
                        <span className="text-sm mr-1">{talent.rating}</span>
                        <FaTrophy className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-text/60 ml-2">
                        ({talent.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text/60">Match</span>
                    <span className="text-sm font-medium text-primary">
                      {talent.matchPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-surface/50 rounded-full h-2 mt-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${talent.matchPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              <h2 className="text-xl font-semibold text-text">Nearby Talents</h2>
            </div>
            {locationError && (
              <p className="text-sm text-red-500">{locationError.message}</p>
            )}
          </div>
          {memoizedMap}
        </section>

        {/* Trending Talents */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FaFire className="text-red-500" />
            <h2 className="text-xl font-semibold text-text">Trending Talents</h2>
          </div>
          <SimilarTalents talents={mockTalents} />
        </section>

        {/* Featured Achievements */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FaTrophy className="text-yellow-500" />
            <h2 className="text-xl font-semibold text-text">Featured Achievements</h2>
          </div>
          <TalentAchievements achievements={mockFeaturedAchievements} />
        </section>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
        initialFilters={activeFilters}
      />
    </div>
  );
}

// Wrap the component with authentication
export default withAuth(ExplorePage, { requireAuth: true, requireOnboarding: true });
