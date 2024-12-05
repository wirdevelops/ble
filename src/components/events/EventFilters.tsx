import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaFilter } from 'react-icons/fa';

interface EventFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventFilters({ isOpen, onClose }: EventFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const locations = [
    'All Locations',
    'Commercial Avenue',
    'City Hall',
    'Food Market',
    'Up Station',
    'Hospital Roundabout',
  ];

  const categories = [
    'Music',
    'Dance',
    'Art',
    'Theatre',
    'Fashion',
    'Cultural',
    'Food',
    'Sports',
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const index = e.target.name === 'min' ? 0 : 1;
    setPriceRange((prev) => {
      const newRange = [...prev];
      newRange[index] = value;
      return newRange as [number, number];
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface rounded-full transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-text/60" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Date Filter */}
              <div>
                <label className="flex items-center gap-2 text-lg font-medium text-text mb-4">
                  <FaCalendarAlt />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary/50 focus:outline-none text-text"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="flex items-center gap-2 text-lg font-medium text-text mb-4">
                  <FaMapMarkerAlt />
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary/50 focus:outline-none text-text"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="flex items-center gap-2 text-lg font-medium text-text mb-4">
                  <FaTicketAlt />
                  Price Range (FCFA)
                </label>
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm text-text/60 mb-2 block">Min</label>
                    <input
                      type="number"
                      name="min"
                      value={priceRange[0]}
                      onChange={handlePriceChange}
                      min={0}
                      max={priceRange[1]}
                      step={1000}
                      className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary/50 focus:outline-none text-text"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text/60 mb-2 block">Max</label>
                    <input
                      type="number"
                      name="max"
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                      min={priceRange[0]}
                      step={1000}
                      className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary/50 focus:outline-none text-text"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="flex items-center gap-2 text-lg font-medium text-text mb-4">
                  <FaFilter />
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedCategories.includes(category)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-border text-text hover:border-primary/50'
                      } transition-colors`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-white rounded-xl font-medium"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
