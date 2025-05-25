'use client';

/**
 * Dashboard page - Overview of all marketing campaigns
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Campaign } from '@/lib/schemas';
import { getCampaigns, deleteCampaign } from '@/lib/data';
import CampaignCard from '@/components/campaigns/CampaignCard';

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
          // Re-fetch campaigns to update the list
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Overview of your marketing campaigns and performance</p>
        </div>
        
        <div className="card-enhanced p-6 rounded-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Overview of your marketing campaigns and performance</p>
          </div>
          
          {/* Create New Campaign Button */}
          <Link 
            href="/campaigns/new"
            className="group relative inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">Create New Campaign</span>
          </Link>
        </div>
      </div>

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-enhanced p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground">Total Campaigns</h3>
          <p className="text-3xl font-bold text-primary mt-2">{campaigns.length}</p>
        </div>
        <div className="card-enhanced p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground">Active Campaigns</h3>
          <p className="text-3xl font-bold text-success mt-2">
            {campaigns.filter(c => new Date(c.endDate) > new Date()).length}
          </p>
        </div>
        <div className="card-enhanced p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground">Total Budget</h3>
          <p className="text-3xl font-bold text-info mt-2">
            ${campaigns.reduce((sum, c) => sum + (c.overallBudget || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Campaigns Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Campaigns</h2>
        
        {campaigns.length === 0 ? (
          <div className="card-enhanced p-12 rounded-lg text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-6">Get started by creating your first marketing campaign</p>
              <Link 
                href="/campaigns/new"
                className="btn-primary inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                Create Your First Campaign
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onDelete={handleDeleteCampaign}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 