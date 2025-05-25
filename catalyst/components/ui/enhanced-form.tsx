'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getChannels, getTags, getTeamMembers } from '@/lib/mock-data';

interface FormData {
  title: string;
  description: string;
  budget: string;
  startDate: string;
  endDate: string;
  channel: string;
  tags: string[];
  team: string[];
}

interface FormErrors {
  title?: string;
  description?: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  channel?: string;
  dateRange?: string;
}

interface EnhancedFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
  isLoading?: boolean;
}

export default function EnhancedForm({ onSubmit, initialData, isLoading = false }: EnhancedFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    channel: '',
    tags: [],
    team: [],
    ...initialData
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValid, setIsValid] = useState(false);

  const channels = getChannels();
  const tags = getTags();
  const teamMembers = getTeamMembers();

  // Validation rules
  const validateField = useCallback((name: string, value: string | string[]): string | undefined => {
    switch (name) {
      case 'title':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          return 'Title must be at least 3 characters long';
        }
        if (typeof value === 'string' && value.length > 100) {
          return 'Title must be less than 100 characters';
        }
        break;
      
      case 'description':
        if (!value || (typeof value === 'string' && value.trim().length < 10)) {
          return 'Description must be at least 10 characters long';
        }
        if (typeof value === 'string' && value.length > 500) {
          return 'Description must be less than 500 characters';
        }
        break;
      
      case 'budget':
        if (!value || typeof value !== 'string') {
          return 'Budget is required';
        }
        const budgetNum = parseFloat(value);
        if (isNaN(budgetNum) || budgetNum <= 0) {
          return 'Budget must be a positive number';
        }
        if (budgetNum < 100) {
          return 'Minimum budget is $100';
        }
        if (budgetNum > 1000000) {
          return 'Maximum budget is $1,000,000';
        }
        break;
      
      case 'startDate':
        if (!value || typeof value !== 'string') {
          return 'Start date is required';
        }
        const startDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
          return 'Start date cannot be in the past';
        }
        break;
      
      case 'endDate':
        if (!value || typeof value !== 'string') {
          return 'End date is required';
        }
        break;
      
      case 'channel':
        if (!value || typeof value !== 'string') {
          return 'Please select a channel';
        }
        break;
    }
    return undefined;
  }, []);

  // Date range validation
  const validateDateRange = useCallback((): string | undefined => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        return 'End date must be after start date';
      }
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
        return 'Campaign must run for at least 7 days';
      }
      
      if (diffDays > 365) {
        return 'Campaign cannot run for more than 365 days';
      }
    }
    return undefined;
  }, [formData.startDate, formData.endDate]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    const dateRangeError = validateDateRange();
    if (dateRangeError) {
      newErrors.dateRange = dateRangeError;
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField, validateDateRange]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBudgetChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue;
    
    handleInputChange('budget', formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const toggleArrayValue = (array: string[], value: string): string[] => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Campaign Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
            touched.title && errors.title
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
          }`}
          placeholder="Enter campaign title..."
        />
        <AnimatePresence>
          {touched.title && errors.title && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center text-red-600 text-sm"
            >
              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
              {errors.title}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors resize-none ${
            touched.description && errors.description
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
          }`}
          placeholder="Describe your campaign objectives and strategy..."
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <AnimatePresence>
            {touched.description && errors.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center text-red-600"
              >
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {errors.description}
              </motion.div>
            )}
          </AnimatePresence>
          <span className={formData.description.length > 450 ? 'text-red-500' : ''}>
            {formData.description.length}/500
          </span>
        </div>
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Budget (USD) *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="budget"
            value={formData.budget}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
              touched.budget && errors.budget
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            }`}
            placeholder="Enter budget amount..."
          />
        </div>
        <AnimatePresence>
          {touched.budget && errors.budget && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center text-red-600 text-sm"
            >
              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
              {errors.budget}
            </motion.div>
          )}
        </AnimatePresence>
        {formData.budget && !errors.budget && (
          <div className="mt-1 text-sm text-gray-500">
            Budget: ${parseFloat(formData.budget || '0').toLocaleString()}
          </div>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                touched.startDate && errors.startDate
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
            />
          </div>
          <AnimatePresence>
            {touched.startDate && errors.startDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex items-center text-red-600 text-sm"
              >
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {errors.startDate}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                touched.endDate && (errors.endDate || errors.dateRange)
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
            />
          </div>
          <AnimatePresence>
            {touched.endDate && errors.endDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex items-center text-red-600 text-sm"
              >
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {errors.endDate}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Date Range Error */}
      <AnimatePresence>
        {errors.dateRange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center text-red-600 text-sm"
          >
            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
            {errors.dateRange}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duration Display */}
      {formData.startDate && formData.endDate && !errors.dateRange && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Campaign duration: {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
        </div>
      )}

      {/* Channel */}
      <div>
        <label htmlFor="channel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Marketing Channel *
        </label>
        <select
          id="channel"
          value={formData.channel}
          onChange={(e) => handleInputChange('channel', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
            touched.channel && errors.channel
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
          }`}
        >
          <option value="">Select a channel...</option>
          {channels.map(channel => (
            <option key={channel} value={channel}>{channel}</option>
          ))}
        </select>
        <AnimatePresence>
          {touched.channel && errors.channel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center text-red-600 text-sm"
            >
              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
              {errors.channel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleInputChange('tags', toggleArrayValue(formData.tags, tag))}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                formData.tags.includes(tag)
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {formData.tags.length > 0 && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Selected: {formData.tags.join(', ')}
          </div>
        )}
      </div>

      {/* Team Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Team Members (Optional)
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {teamMembers.map(member => (
            <label key={member.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.team.includes(member.name)}
                onChange={() => handleInputChange('team', toggleArrayValue(formData.team, member.name))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="ml-3 flex items-center">
                <span className="text-lg mr-2">{member.avatar}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {member.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {member.role}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
        {formData.team.length > 0 && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {formData.team.length} member{formData.team.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            isValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            <div className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Create Campaign
            </div>
          )}
        </button>
      </div>
    </form>
  );
} 