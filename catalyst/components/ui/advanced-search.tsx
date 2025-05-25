'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface SearchFilters {
  status: string[];
  budget: { min: number; max: number };
  dateRange: { start: string; end: string };
  channels: string[];
  tags: string[];
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

const statusOptions: FilterOption[] = [
  { id: 'active', label: 'Active', count: 12 },
  { id: 'paused', label: 'Paused', count: 5 },
  { id: 'completed', label: 'Completed', count: 8 },
  { id: 'draft', label: 'Draft', count: 3 }
];

const channelOptions: FilterOption[] = [
  { id: 'email', label: 'Email', count: 15 },
  { id: 'social', label: 'Social Media', count: 10 },
  { id: 'search', label: 'Search Ads', count: 8 },
  { id: 'display', label: 'Display', count: 6 },
  { id: 'direct', label: 'Direct Mail', count: 4 }
];

const tagOptions: FilterOption[] = [
  { id: 'seasonal', label: 'Seasonal', count: 7 },
  { id: 'product-launch', label: 'Product Launch', count: 5 },
  { id: 'brand-awareness', label: 'Brand Awareness', count: 9 },
  { id: 'conversion', label: 'Conversion', count: 12 },
  { id: 'retention', label: 'Retention', count: 6 }
];

export default function AdvancedSearch({ onSearch, placeholder = "Search campaigns...", className = "" }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    status: [],
    budget: { min: 0, max: 100000 },
    dateRange: { start: '', end: '' },
    channels: [],
    tags: []
  });

  // Debounced search
  const debouncedSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    const debouncedFn = debounce(() => {
      onSearch(searchQuery, searchFilters);
    }, 300);
    debouncedFn();
  }, [onSearch]);

  useEffect(() => {
    debouncedSearch(query, filters);
  }, [query, filters, debouncedSearch]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.status.length +
      filters.channels.length +
      filters.tags.length +
      (filters.dateRange.start || filters.dateRange.end ? 1 : 0) +
      (filters.budget.min > 0 || filters.budget.max < 100000 ? 1 : 0)
    );
  }, [filters]);

  const handleFilterChange = (filterType: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleArrayFilter = (filterType: 'status' | 'channels' | 'tags', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      budget: { min: 0, max: 100000 },
      dateRange: { start: '', end: '' },
      channels: [],
      tags: []
    });
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      {children}
    </div>
  );

  const CheckboxGroup = ({ 
    options, 
    selected, 
    onChange 
  }: { 
    options: FilterOption[]; 
    selected: string[]; 
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-2">
      {options.map(option => (
        <label key={option.id} className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(option.id)}
            onChange={() => onChange(option.id)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
            {option.label}
          </span>
          {option.count && (
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
              {option.count}
            </span>
          )}
        </label>
      ))}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 mr-1 rounded-lg transition-colors ${
              isFilterOpen || activeFilterCount > 0
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <FunnelIcon className="h-5 w-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {filters.status.map(status => (
              <FilterTag
                key={`status-${status}`}
                label={statusOptions.find(s => s.id === status)?.label || status}
                onRemove={() => toggleArrayFilter('status', status)}
              />
            ))}
            {filters.channels.map(channel => (
              <FilterTag
                key={`channel-${channel}`}
                label={channelOptions.find(c => c.id === channel)?.label || channel}
                onRemove={() => toggleArrayFilter('channels', channel)}
              />
            ))}
            {filters.tags.map(tag => (
              <FilterTag
                key={`tag-${tag}`}
                label={tagOptions.find(t => t.id === tag)?.label || tag}
                onRemove={() => toggleArrayFilter('tags', tag)}
              />
            ))}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <FilterTag
                label="Date Range"
                onRemove={() => handleFilterChange('dateRange', { start: '', end: '' })}
              />
            )}
            {(filters.budget.min > 0 || filters.budget.max < 100000) && (
              <FilterTag
                label="Budget Range"
                onRemove={() => handleFilterChange('budget', { min: 0, max: 100000 })}
              />
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <FilterSection title="Status">
                <CheckboxGroup
                  options={statusOptions}
                  selected={filters.status}
                  onChange={(value) => toggleArrayFilter('status', value)}
                />
              </FilterSection>

              {/* Channel Filter */}
              <FilterSection title="Channels">
                <CheckboxGroup
                  options={channelOptions}
                  selected={filters.channels}
                  onChange={(value) => toggleArrayFilter('channels', value)}
                />
              </FilterSection>

              {/* Tags Filter */}
              <FilterSection title="Tags">
                <CheckboxGroup
                  options={tagOptions}
                  selected={filters.tags}
                  onChange={(value) => toggleArrayFilter('tags', value)}
                />
              </FilterSection>

              {/* Budget & Date Range */}
              <div className="space-y-6">
                <FilterSection title="Budget Range">
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.budget.min || ''}
                        onChange={(e) => handleFilterChange('budget', {
                          ...filters.budget,
                          min: parseInt(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.budget.max === 100000 ? '' : filters.budget.max}
                        onChange={(e) => handleFilterChange('budget', {
                          ...filters.budget,
                          max: parseInt(e.target.value) || 100000
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </FilterSection>

                <FilterSection title="Date Range">
                  <div className="space-y-3">
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        start: e.target.value
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        end: e.target.value
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </FilterSection>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear all filters
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-2 hover:text-blue-600 dark:hover:text-blue-300"
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    </motion.span>
  );
}

// Debounce utility
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 