'use client';

/**
 * Dashboard page - Overview of all marketing campaigns with modern design
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Campaign } from '@/lib/schemas';
import { getCampaigns, deleteCampaign } from '@/lib/data';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { 
  ChartBarIcon, 
  RocketLaunchIcon, 
  CurrencyDollarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = () => {
      try {
        const allCampaigns = getCampaigns();
        setCampaigns(allCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Handle campaign deletion
  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const success = deleteCampaign(id);
        if (success) {
          const updatedCampaigns = getCampaigns();
          setCampaigns(updatedCampaigns);
        } else {
          alert('Failed to delete campaign');
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Error deleting campaign');
      }
    }
  };

  // Calculate statistics
  const activeCampaigns = campaigns.filter(c => new Date(c.endDate) > new Date()).length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.overallBudget || 0), 0);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded-xl w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6">
                  <div className="h-6 bg-muted rounded-xl w-32 mb-4"></div>
                  <div className="h-8 bg-muted rounded-xl w-16 mb-2"></div>
                  <div className="h-4 bg-muted rounded-xl w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
        <ChartBarIcon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">No campaigns yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Get started by creating your first marketing campaign and unlock the power of data-driven marketing.
      </p>
      <Link 
        href="/campaigns/new"
        className="btn-primary inline-flex items-center"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Create Your First Campaign
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your marketing campaigns</p>
          </div>
          <Link 
            href="/campaigns/new"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Campaign
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground mb-1">{campaigns.length}</div>
            <div className="text-sm text-muted-foreground">Total Campaigns</div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                <RocketLaunchIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground mb-1">{activeCampaigns}</div>
            <div className="text-sm text-muted-foreground">Active Campaigns</div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground mb-1">${totalBudget.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Budget</div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
          {campaigns.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              <h2 className="text-xl font-medium text-foreground mb-6">Your Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDelete={handleDeleteCampaign}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 