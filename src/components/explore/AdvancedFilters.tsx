'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaFilter,
  FaDollarSign,
  FaClock,
  FaStar,
  FaLanguage,
  FaMapMarkerAlt,
  FaTimes,
} from 'react-icons/fa';

interface FilterOption {
  id: string;
  label: string;
  value: string | number;
}

interface FilterSection {
  id: string;
  label: string;
  icon: React.ElementType;
  type: 'radio' | 'checkbox' | 'range';
  options?: FilterOption[];
  range?: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const filterSections: FilterSection[] = [
  {
    id: 'price',
    label: 'Price Range',
    icon: FaDollarSign,
    type: 'range',
    range: {
      min: 0,
      max: 1000,
      step: 10,
      unit: '$',
    },
  },
  {
    id: 'availability',
    label: 'Availability',
    icon: FaClock,
    type: 'radio',
    options: [
      { id: 'now', label: 'Available Now', value: 'now' },
      { id: 'today', label: 'Today', value: 'today' },
      { id: 'this-week', label: 'This Week', value: 'this-week' },
      { id: 'this-month', label: 'This Month', value: 'this-month' },
    ],
  },
  {
    id: 'rating',
    label: 'Minimum Rating',
    icon: FaStar,
    type: 'radio',
    options: [
      { id: '4.5', label: '4.5+ Stars', value: 4.5 },
      { id: '4.0', label: '4.0+ Stars', value: 4.0 },
      { id: '3.5', label: '3.5+ Stars', value: 3.5 },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: FaLanguage,
    type: 'checkbox',
    options: [
      { id: 'english', label: 'English', value: 'en' },
      { id: 'french', label: 'French', value: 'fr' },
      { id: 'pidgin', label: 'Pidgin', value: 'pid' },
    ],
  },
  {
    id: 'distance',
    label: 'Distance',
    icon: FaMapMarkerAlt,
    type: 'range',
    range: {
      min: 0,
      max: 50,
      step: 1,
      unit: 'km',
    },
  },
];

export default function AdvancedFilters({
  onFiltersChange,
  isOpen,
  onClose,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (
    sectionId: string,
    value: string | number | string[]
  ) => {
    const newFilters = {
      ...filters,
      [sectionId]: value,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-border shadow-xl overflow-y-auto z-50"
    >
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaFilter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Advanced Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {filterSections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-2 mb-3">
              <section.icon className="w-5 h-5 text-primary" />
              <h3 className="font-medium">{section.label}</h3>
            </div>

            {section.type === 'range' && section.range && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={section.range.min}
                  max={section.range.max}
                  step={section.range.step}
                  value={filters[section.id] || section.range.min}
                  onChange={(e) =>
                    handleFilterChange(section.id, Number(e.target.value))
                  }
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-sm text-text/60">
                  <span>
                    {section.range.unit}
                    {filters[section.id] || section.range.min}
                  </span>
                  <span>
                    {section.range.unit}
                    {section.range.max}
                  </span>
                </div>
              </div>
            )}

            {section.type === 'radio' && section.options && (
              <div className="space-y-2">
                {section.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={section.id}
                      value={option.value}
                      checked={filters[section.id] === option.value}
                      onChange={(e) =>
                        handleFilterChange(section.id, option.value)
                      }
                      className="accent-primary"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {section.type === 'checkbox' && section.options && (
              <div className="space-y-2">
                {section.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={
                        (filters[section.id] || []).includes(option.value)
                      }
                      onChange={(e) => {
                        const currentValues = filters[section.id] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option.value]
                          : currentValues.filter((v: string) => v !== option.value);
                        handleFilterChange(section.id, newValues);
                      }}
                      className="accent-primary"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 mt-8">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setFilters({});
                onFiltersChange({});
              }}
              className="flex-1 px-4 py-2 border border-border rounded-xl hover:border-primary/50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-primary text-background rounded-xl hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
