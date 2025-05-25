'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  UserIcon,
  HomeIcon,
  FolderIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: 'navigation' | 'actions' | 'settings' | 'search';
  keywords: string[];
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Define all available commands
  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      subtitle: 'View campaign overview',
      icon: HomeIcon,
      action: () => router.push('/dashboard'),
      category: 'navigation',
      keywords: ['dashboard', 'home', 'overview', 'campaigns']
    },
    {
      id: 'nav-campaigns',
      title: 'All Campaigns',
      subtitle: 'Browse all campaigns',
      icon: FolderIcon,
      action: () => router.push('/campaigns'),
      category: 'navigation',
      keywords: ['campaigns', 'list', 'browse', 'all']
    },
    {
      id: 'nav-campaign-board',
      title: 'Campaign Board',
      subtitle: 'Drag-and-drop campaign management',
      icon: FolderIcon,
      action: () => router.push('/campaigns/board'),
      category: 'navigation',
      keywords: ['board', 'kanban', 'drag', 'drop', 'workflow', 'manage']
    },
    {
      id: 'nav-analytics',
      title: 'Analytics',
      subtitle: 'View detailed analytics',
      icon: ChartBarIcon,
      action: () => router.push('/analytics'),
      category: 'navigation',
      keywords: ['analytics', 'charts', 'data', 'metrics', 'performance']
    },
    
    // Actions
    {
      id: 'action-new-campaign',
      title: 'New Campaign',
      subtitle: 'Create a new marketing campaign',
      icon: PlusIcon,
      action: () => router.push('/campaigns/new'),
      category: 'actions',
      keywords: ['new', 'create', 'campaign', 'add', 'marketing']
    },
    {
      id: 'action-search',
      title: 'Search Campaigns',
      subtitle: 'Find specific campaigns',
      icon: MagnifyingGlassIcon,
      action: () => {
        // This would open a search modal or navigate to search
        console.log('Search campaigns');
      },
      category: 'search',
      keywords: ['search', 'find', 'filter', 'campaigns']
    },
    
    // Settings
    {
      id: 'settings-preferences',
      title: 'Preferences',
      subtitle: 'Manage app settings',
      icon: Cog6ToothIcon,
      action: () => router.push('/settings'),
      category: 'settings',
      keywords: ['settings', 'preferences', 'config', 'options']
    },
    {
      id: 'settings-profile',
      title: 'Profile',
      subtitle: 'Manage your profile',
      icon: UserIcon,
      action: () => router.push('/profile'),
      category: 'settings',
      keywords: ['profile', 'account', 'user', 'personal']
    }
  ];

  // Keyboard shortcut handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Cmd+K or Ctrl+K to open command palette
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    open,
    close,
    commands
  };
} 