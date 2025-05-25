/**
 * Campaign Card Component - Displays campaign information in a card format
 * Used in the dashboard to show campaign overview with action buttons
 */

import Link from 'next/link';
import { Campaign } from '@/lib/schemas';

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (id: string) => void;
}

export default function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate campaign status
  const getCampaignStatus = () => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    if (now < startDate) return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    if (now > endDate) return { status: 'Completed', color: 'bg-gray-100 text-gray-800' };
    return { status: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const { status, color } = getCampaignStatus();

  return (
    <div className="relative group">
      {/* Background Gradient Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      
      {/* Card Content */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{campaign.goal}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
            {status}
          </span>
        </div>

        {/* Campaign Details */}
        <div className="space-y-3 mb-6">
          {/* Date Range */}
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
          </div>

          {/* Budget */}
          {campaign.overallBudget && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Budget: ${campaign.overallBudget.toLocaleString()}
            </div>
          )}

          {/* Channels */}
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {campaign.channels.length} Channel{campaign.channels.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {/* View Details Button */}
          <Link
            href={`/campaigns/${campaign.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 text-center"
          >
            View Details
          </Link>

          {/* Edit Button */}
          <Link
            href={`/campaigns/${campaign.id}/edit`}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 text-center"
          >
            Edit
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(campaign.id)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200"
            title="Delete Campaign"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 