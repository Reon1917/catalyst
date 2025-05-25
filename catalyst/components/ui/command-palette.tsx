'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'motion/react';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: 'navigation' | 'actions' | 'settings' | 'search';
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export default function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fuzzy search implementation
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return commands.filter(command => {
      const searchableText = [
        command.title,
        command.subtitle || '',
        ...command.keywords
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    }).sort((a, b) => {
      // Prioritize title matches
      const aTitle = a.title.toLowerCase().includes(query.toLowerCase());
      const bTitle = b.title.toLowerCase().includes(query.toLowerCase());
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });
  }, [query, commands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    settings: 'Settings',
    search: 'Search'
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex items-start justify-center pt-[10vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 outline-none text-lg"
                autoFocus
              />
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                <div key={category}>
                  <div className="px-6 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  {categoryCommands.map((command) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    const isSelected = globalIndex === selectedIndex;
                    
                    return (
                      <motion.button
                        key={command.id}
                        className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                        }`}
                        onClick={() => {
                          command.action();
                          onClose();
                        }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                          isSelected ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <command.icon className={`w-4 h-4 ${
                            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                          }`}>
                            {command.title}
                          </div>
                          {command.subtitle && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {command.subtitle}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
              
              {filteredCommands.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No commands found for &quot;{query}&quot;
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
                <div>
                  {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
} 