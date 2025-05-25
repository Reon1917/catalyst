'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlusIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { Campaign } from '@/lib/schemas';

interface Column {
  id: string;
  title: string;
  campaigns: Campaign[];
  color: string;
}

interface DragDropBoardProps {
  campaigns?: Campaign[];
  isLoading?: boolean;
  onCampaignMove: (campaignId: string, fromColumn: string, toColumn: string) => void;
}

const createDefaultColumns = (campaigns: Campaign[]): Column[] => {
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const pausedCampaigns = campaigns.filter(c => c.status === 'paused');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');

  return [
    {
      id: 'draft',
      title: 'Draft',
      campaigns: draftCampaigns,
      color: 'bg-gray-100 dark:bg-gray-800'
    },
    {
      id: 'active',
      title: 'Active',
      campaigns: activeCampaigns,
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'paused',
      title: 'Paused',
      campaigns: pausedCampaigns,
      color: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      id: 'completed',
      title: 'Completed',
      campaigns: completedCampaigns,
      color: 'bg-green-50 dark:bg-green-900/20'
    }
  ];
};

export default function DragDropBoard({ 
  campaigns = [],
  onCampaignMove = () => {} 
}: DragDropBoardProps) {
  const columnsData = useMemo(() => createDefaultColumns(campaigns), [campaigns]);
  const [columns, setColumns] = useState<Column[]>(columnsData);

  // Update columns when campaigns change
  useMemo(() => {
    setColumns(createDefaultColumns(campaigns));
  }, [campaigns]);
  const [draggedCampaign, setDraggedCampaign] = useState<Campaign | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = useCallback((campaign: Campaign) => {
    // Prevent dragging mock campaigns
    if (campaign.isMockData) {
      return;
    }
    setDraggedCampaign(campaign);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCampaign(null);
    setDraggedOver(null);
    dragCounter.current = 0;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggedOver(columnId);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDraggedOver(columnId);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDraggedOver(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedCampaign || draggedCampaign.isMockData) return;

    const sourceColumnId = columns.find(col => 
      col.campaigns.some(c => c.id === draggedCampaign.id)
    )?.id;

    if (sourceColumnId && sourceColumnId !== targetColumnId) {
      setColumns(prev => {
        const newColumns = prev.map(column => {
          if (column.id === sourceColumnId) {
            return {
              ...column,
              campaigns: column.campaigns.filter(c => c.id !== draggedCampaign.id)
            };
          }
          if (column.id === targetColumnId) {
            return {
              ...column,
              campaigns: [...column.campaigns, { ...draggedCampaign, status: targetColumnId as Campaign['status'] }]
            };
          }
          return column;
        });
        return newColumns;
      });

      onCampaignMove(draggedCampaign.id, sourceColumnId, targetColumnId);
    }

    handleDragEnd();
  }, [draggedCampaign, columns, onCampaignMove, handleDragEnd]);

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex space-x-6 p-6 min-w-max">
        {columns.map((column) => {
          const userCampaigns = column.campaigns.filter(c => !c.isMockData);
          const mockCampaigns = column.campaigns.filter(c => c.isMockData);
          
          return (
            <motion.div
              key={column.id}
              layout
              className={`flex-shrink-0 w-80 ${column.color} rounded-xl p-4 transition-colors ${
                draggedOver === column.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {column.campaigns.length}
                  </span>
                  {mockCampaigns.length > 0 && (
                    <div className="ml-2 flex items-center">
                      <SparklesIcon className="w-4 h-4 text-purple-500" />
                      <span className="ml-1 text-xs text-purple-600 dark:text-purple-400">
                        {mockCampaigns.length} demo
                      </span>
                    </div>
                  )}
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Campaign Cards */}
              <div className="space-y-3">
                <AnimatePresence>
                  {/* User campaigns first */}
                  {userCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onDragStart={() => handleDragStart(campaign)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedCampaign?.id === campaign.id}
                    />
                  ))}
                  
                  {/* Mock campaigns with visual separation */}
                  {mockCampaigns.length > 0 && userCampaigns.length > 0 && (
                    <div className="flex items-center my-3">
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                      <span className="px-2 text-xs text-gray-500 dark:text-gray-400">Demo</span>
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                  )}
                  
                  {mockCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onDragStart={() => handleDragStart(campaign)}
                      onDragEnd={handleDragEnd}
                      isDragging={false} // Mock campaigns can't be dragged
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Drop Zone Indicator */}
              <AnimatePresence>
                {draggedOver === column.id && draggedCampaign && !draggedCampaign.isMockData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 60 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium"
                  >
                    Drop here to move to {column.title}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

function CampaignCard({ campaign, onDragStart, onDragEnd, isDragging }: CampaignCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMockCampaign = campaign.isMockData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 0.95 : 1,
        rotate: isDragging ? 5 : 0
      }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={!isMockCampaign ? { y: -2 } : {}}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-md relative ${
        isDragging ? 'shadow-lg' : ''
      } ${
        isMockCampaign 
          ? 'cursor-default opacity-75 border-purple-200 dark:border-purple-800' 
          : 'cursor-grab active:cursor-grabbing'
      }`}
      draggable={!isMockCampaign}
      onDragStart={!isMockCampaign ? onDragStart : undefined}
      onDragEnd={!isMockCampaign ? onDragEnd : undefined}
    >
      {/* Mock Campaign Indicator */}
      {isMockCampaign && (
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <SparklesIcon className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Demo</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-8">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
            {campaign.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {campaign.messaging.coreMessage}
          </p>
        </div>
        <button 
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <EllipsisVerticalIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
          {isMockCampaign && (
            <LockClosedIcon className="w-3 h-3 text-gray-400" title="Demo campaign - cannot be modified" />
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {primaryChannel}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${isMockCampaign ? 'bg-purple-500' : 'bg-blue-600'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <CurrencyDollarIcon className="w-3 h-3 mr-1" />
          ${campaign.overallBudget?.toLocaleString() || 'TBD'}
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <UserGroupIcon className="w-3 h-3 mr-1" />
          {campaign.channels.length} channel{campaign.channels.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-2 text-xs">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <ChartBarIcon className="w-3 h-3 mr-1" />
                Goal: {campaign.goal}
              </div>
              {campaign.simulatedResults && (
                <div className="text-gray-500 dark:text-gray-400">
                  Projected: {campaign.simulatedResults.reach?.toLocaleString()} reach, {campaign.simulatedResults.leads || 0} leads
                </div>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {campaign.channels.map((channel) => (
                  <span
                    key={channel.id}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                  >
                    {channel.name}: ${channel.budget?.toLocaleString() || 0}
                  </span>
                ))}
              </div>
              {isMockCampaign && (
                <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-purple-700 dark:text-purple-300 text-xs">
                  💡 This is a demo campaign. Create your own campaigns to get started!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 