'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import {
  ChartBarIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CalendarIcon,
  TagIcon,
  UsersIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Campaign } from '@/lib/schemas';
import { useCampaigns } from '@/hooks/useCampaigns';

interface CampaignCardProps {
  campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-3 h-3" />;
      case 'paused': return <PauseCircleIcon className="w-3 h-3" />;
      case 'completed': return <CheckCircleIcon className="w-3 h-3" />;
      default: return <DocumentTextIcon className="w-3 h-3" />;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'TBD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Calculate progress based on campaign dates
  const calculateProgress = () => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  const progress = calculateProgress();
  const primaryChannel = campaign.channels[0]?.name || 'Multi-channel';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
            {campaign.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {campaign.messaging.coreMessage}
          </p>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
          {getStatusIcon(campaign.status)}
          <span className="ml-1 capitalize">{campaign.status}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center justify-center mb-1">
            <EyeIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Reach</span>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {campaign.simulatedResults ? formatNumber(campaign.simulatedResults.reach) : 'TBD'}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center justify-center mb-1">
            <CursorArrowRaysIcon className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Leads</span>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {campaign.simulatedResults?.leads || 'TBD'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <CurrencyDollarIcon className="w-4 h-4 mr-2" />
          <span>Budget: {formatCurrency(campaign.overallBudget)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <TagIcon className="w-4 h-4 mr-2" />
          <span>{primaryChannel}</span>
        </div>
      </div>

      {/* Goal */}
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <UsersIcon className="w-4 h-4 mr-2" />
        <span>Goal: {campaign.goal}</span>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { campaigns, isLoading } = useCampaigns();

  // Calculate statistics
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.overallBudget || 0), 0);
  const totalReach = campaigns.reduce((sum, c) => sum + (c.simulatedResults?.reach || 0), 0);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Marketing Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your campaign performance and growth metrics</p>
          </div>
          <Link 
            href="/campaigns/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Campaign
          </Link>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{campaigns.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <RocketLaunchIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{activeCampaigns}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">15%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              ${totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Budget</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">23%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {totalReach.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Reach</div>
          </motion.div>
        </div>

        {/* Recent Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Campaigns</h2>
            <Link 
              href="/campaigns/board"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
            >
              View All →
            </Link>
          </div>
          
          {campaigns.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create your first campaign to start tracking performance
              </p>
              <Link 
                href="/campaigns/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Campaign
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.slice(0, 6).map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}