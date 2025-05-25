/**
 * Campaign Card Component - Modern, clean campaign display
 */

import Link from 'next/link';
import { Campaign } from '@/lib/schemas';
import { CampaignStatus } from '@/components/ui/campaign-status';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  RectangleStackIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

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

  return (
    <div className="card p-6 h-full flex flex-col group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {campaign.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {campaign.goal}
          </p>
        </div>
        <div className="ml-4">
          <CampaignStatus 
            startDate={campaign.startDate} 
            endDate={campaign.endDate} 
          />
        </div>
      </div>

      {/* Campaign Details */}
      <div className="space-y-3 mb-6 flex-1">
        {/* Date Range */}
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
        </div>

        {/* Budget */}
        {campaign.overallBudget && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CurrencyDollarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Budget: <span className="font-medium text-foreground">${campaign.overallBudget.toLocaleString()}</span></span>
          </div>
        )}

        {/* Channels */}
        <div className="flex items-center text-sm text-muted-foreground">
          <RectangleStackIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{campaign.channels.length} Channel{campaign.channels.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Target Audience */}
        {campaign.targetAudience.personaName && (
          <div className="flex items-center text-sm text-muted-foreground">
            <UserGroupIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{campaign.targetAudience.personaName}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/campaigns/${campaign.id}`}
          className="flex-1 btn-primary text-sm text-center flex items-center justify-center gap-2"
        >
          <EyeIcon className="w-4 h-4" />
          View
        </Link>

        <Link
          href={`/campaigns/${campaign.id}/edit`}
          className="flex-1 btn-secondary text-sm text-center flex items-center justify-center gap-2"
        >
          <PencilIcon className="w-4 h-4" />
          Edit
        </Link>

        <button
          onClick={() => onDelete(campaign.id)}
          className="bg-transparent text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 rounded-xl px-3 py-2 text-sm transition-all duration-200 flex items-center justify-center hover:bg-accent/50"
          title="Delete Campaign"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 