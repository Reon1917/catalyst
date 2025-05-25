'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlusIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  channel: string;
  progress: number;
  team: string[];
}

interface Column {
  id: string;
  title: string;
  campaigns: Campaign[];
  color: string;
}

interface DragDropBoardProps {
  initialColumns: Column[];
  onCampaignMove: (campaignId: string, fromColumn: string, toColumn: string) => void;
  onCampaignUpdate: (campaign: Campaign) => void;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Summer Sale 2024',
    description: 'Seasonal promotion campaign',
    budget: 15000,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'active',
    channel: 'Email + Social',
    progress: 65,
    team: ['John', 'Sarah', 'Mike']
  },
  {
    id: '2',
    title: 'Product Launch',
    description: 'New product introduction',
    budget: 25000,
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    status: 'draft',
    channel: 'Multi-channel',
    progress: 30,
    team: ['Alice', 'Bob']
  },
  {
    id: '3',
    title: 'Brand Awareness',
    description: 'Increase brand visibility',
    budget: 8000,
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    status: 'paused',
    channel: 'Display Ads',
    progress: 45,
    team: ['Carol', 'David', 'Eve']
  }
];

const defaultColumns: Column[] = [
  {
    id: 'draft',
    title: 'Draft',
    campaigns: [mockCampaigns[1]],
    color: 'bg-gray-100 dark:bg-gray-800'
  },
  {
    id: 'active',
    title: 'Active',
    campaigns: [mockCampaigns[0]],
    color: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: 'paused',
    title: 'Paused',
    campaigns: [mockCampaigns[2]],
    color: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  {
    id: 'completed',
    title: 'Completed',
    campaigns: [],
    color: 'bg-green-50 dark:bg-green-900/20'
  }
];

export default function DragDropBoard({ 
  initialColumns = defaultColumns, 
  onCampaignMove = () => {}, 
  onCampaignUpdate = () => {} 
}: Partial<DragDropBoardProps>) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedCampaign, setDraggedCampaign] = useState<Campaign | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = useCallback((campaign: Campaign) => {
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

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDraggedOver(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedCampaign) return;

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
              campaigns: [...column.campaigns, { ...draggedCampaign, status: targetColumnId as any }]
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
        {columns.map((column) => (
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
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Campaign Cards */}
            <div className="space-y-3">
              <AnimatePresence>
                {column.campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDragStart={() => handleDragStart(campaign)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedCampaign?.id === campaign.id}
                    onUpdate={onCampaignUpdate}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Drop Zone Indicator */}
            <AnimatePresence>
              {draggedOver === column.id && draggedCampaign && (
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
        ))}
      </div>
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  onUpdate: (campaign: Campaign) => void;
}

function CampaignCard({ campaign, onDragStart, onDragEnd, isDragging, onUpdate }: CampaignCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

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
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        isDragging ? 'shadow-lg' : ''
      }`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
            {campaign.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {campaign.description}
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
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {campaign.channel}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{campaign.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${campaign.progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <CurrencyDollarIcon className="w-3 h-3 mr-1" />
          ${campaign.budget.toLocaleString()}
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <UserGroupIcon className="w-3 h-3 mr-1" />
          {campaign.team.length} members
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
                Performance tracking enabled
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {campaign.team.map((member, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 