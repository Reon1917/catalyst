'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import DragDropBoard from '@/components/ui/drag-drop-board';
import AdvancedSearch from '@/components/ui/advanced-search';
import { useCampaigns } from '@/hooks/useCampaigns';
import {
  ViewColumnsIcon,
  Squares2X2Icon,
  PlusIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface SearchFilters {
  status: string[];
  budget: { min: number; max: number };
  dateRange: { start: string; end: string };
  channels: string[];
  tags: string[];
}

export default function CampaignBoardPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'board' | 'grid'>('board');
  const { campaigns, isLoading, updateCampaignStatus, getUserCampaigns, getMockCampaigns } = useCampaigns({ type: 'hybrid', mockCount: 3 });
  
  const userCampaigns = getUserCampaigns();
  const mockCampaigns = getMockCampaigns();
  
  const handleSearch = (query: string, filters: SearchFilters) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Search:', query, 'Filters:', filters);
    }
  };

  const handleCampaignMove = (campaignId: string, fromColumn: string, toColumn: string) => {
    // Map column names to status values
    const statusMap: Record<string, 'draft' | 'active' | 'paused' | 'completed'> = {
      'draft': 'draft',
      'active': 'active', 
      'paused': 'paused',
      'completed': 'completed'
    };
    
    const newStatus = statusMap[toColumn];
    if (newStatus) {
      updateCampaignStatus(campaignId, newStatus);
    }
  };

  const handleNewCampaign = () => {
    router.push('/campaigns/new');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Campaign Board
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your campaigns with drag-and-drop workflow
              </p>
              
              {/* Campaign Stats */}
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userCampaigns.length} Your Campaigns
                  </span>
                </div>
                {mockCampaigns.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {mockCampaigns.length} Demo Campaigns
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'board'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <ViewColumnsIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <button 
                onClick={handleNewCampaign}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Campaign
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6">
            <AdvancedSearch
              onSearch={handleSearch}
              placeholder="Search campaigns by name, status, or channel..."
              className="max-w-2xl"
            />
          </div>

          {/* Demo Info Banner */}
          {mockCampaigns.length > 0 && userCampaigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4"
            >
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Welcome to your Campaign Board!
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-200 mt-1">
                    We&apos;ve added some demo campaigns to show you how the board works. 
                    Create your first campaign to get started, and the demo campaigns will automatically be reduced.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Board Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="h-[calc(100vh-200px)]"
        >
          {viewMode === 'board' ? (
            <DragDropBoard
              campaigns={campaigns}
              isLoading={isLoading}
              onCampaignMove={handleCampaignMove}
            />
          ) : (
            <div className="p-6">
              <div className="text-center py-12">
                <Squares2X2Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Grid View Coming Soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Grid view is under development. Use board view for now.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Keyboard Shortcuts Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-xs text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center space-x-4">
            <span>💡 Tip: Drag campaigns between columns to change status</span>
            <span>⌘K to open command palette</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}