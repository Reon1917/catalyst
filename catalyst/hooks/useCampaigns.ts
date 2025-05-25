import { useState, useEffect } from 'react';
import { Campaign } from '@/lib/schemas';
import { getCampaigns, saveCampaign, deleteCampaign } from '@/lib/data';
import { generateCampaigns } from '@/lib/mock-data';
import type { Campaign as MockCampaign } from '@/lib/mock-data';

interface DataMode {
  type: 'hybrid' | 'user-only';
  mockCount?: number;
}

// Transform mock campaign to match main app schema
function transformMockCampaign(mockCampaign: MockCampaign, index: number): Campaign {
  return {
    id: `mock_${index + 1}`,
    name: `${mockCampaign.title} (Demo)`,
    goal: 'Brand Awareness', // Default goal for mock campaigns
    startDate: mockCampaign.startDate,
    endDate: mockCampaign.endDate,
    overallBudget: mockCampaign.budget,
    status: 'active' as const,
    targetAudience: {
      personaName: '',
      demographics: `${mockCampaign.targetAudience.ageRange}, ${mockCampaign.targetAudience.gender}, ${mockCampaign.targetAudience.location.join(', ')}`,
      interestsAndBehaviors: mockCampaign.targetAudience.interests.join(', '),
      painPoints: 'Looking for better productivity and collaboration tools'
    },
    channels: [{
      id: mockCampaign.channel.toLowerCase().replace(/\s+/g, ''),
      name: mockCampaign.channel,
      budget: mockCampaign.budget
    }],
    messaging: {
      coreMessage: mockCampaign.description,
      valueProps: ['Increase productivity', 'Better collaboration', 'Streamlined workflows'],
      contentIdeas: 'Blog posts, social media content, video tutorials'
    },
    simulatedResults: {
      reach: mockCampaign.metrics.impressions,
      impressions: mockCampaign.metrics.impressions,
      clicks: mockCampaign.metrics.clicks,
      leads: mockCampaign.metrics.conversions,
      conversionRate: mockCampaign.metrics.conversionRate,
      cpc: mockCampaign.metrics.costPerClick,
      cpl: mockCampaign.metrics.costPerConversion
    },
    isMockData: true,
    createdAt: mockCampaign.createdAt,
    updatedAt: mockCampaign.updatedAt
  };
}

export function useCampaigns(mode: DataMode = { type: 'hybrid', mockCount: 3 }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load campaigns from localStorage and mix with mock data
  useEffect(() => {
    const loadCampaigns = () => {
      try {
        const userCampaigns = getCampaigns();
        
        if (mode.type === 'hybrid') {
          // Generate mock campaigns only if we have fewer than 3 total campaigns
          const mockCount = Math.max(0, (mode.mockCount || 3) - userCampaigns.length);
          const mockCampaigns = mockCount > 0 ? generateCampaigns(mockCount) : [];
          
          // Transform mock campaigns to match main app schema
          const markedMockCampaigns = mockCampaigns.map((campaign, index) => 
            transformMockCampaign(campaign, index)
          );
          
          // Combine user campaigns (priority) with mock campaigns
          setCampaigns([...userCampaigns, ...markedMockCampaigns]);
        } else {
          setCampaigns(userCampaigns);
        }
      } catch (error) {
        console.error('Error loading campaigns:', error);
        setCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [mode.type, mode.mockCount]);

  // Add or update campaign (only for user campaigns)
  const upsertCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    try {
      const savedCampaign = saveCampaign(campaignData);
      setCampaigns(prev => {
        const existingIndex = prev.findIndex(c => c.id === savedCampaign.id);
        if (existingIndex >= 0) {
          // Update existing
          return prev.map(c => c.id === savedCampaign.id ? savedCampaign : c);
        } else {
          // Add new - insert at beginning to show user campaigns first
          return [savedCampaign, ...prev];
        }
      });
      return savedCampaign;
    } catch (error) {
      console.error('Error saving campaign:', error);
      throw error;
    }
  };

  // Remove campaign (only allow removing user campaigns, not mock data)
  const removeCampaign = (id: string) => {
    // Prevent deletion of mock campaigns
    if (id.startsWith('mock_')) {
      console.warn('Cannot delete mock campaigns');
      return false;
    }

    try {
      const success = deleteCampaign(id);
      if (success) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return false;
    }
  };

  // Update campaign status (for drag-drop) - only for user campaigns
  const updateCampaignStatus = (id: string, newStatus: 'draft' | 'active' | 'paused' | 'completed') => {
    // Prevent status updates on mock campaigns
    if (id.startsWith('mock_')) {
      console.warn('Cannot update status of mock campaigns');
      return;
    }

    setCampaigns(prev => {
      const updated = prev.map(campaign => {
        if (campaign.id === id && !campaign.isMockData) {
          const updatedCampaign = { ...campaign, status: newStatus, updatedAt: new Date().toISOString() };
          // Save to localStorage
          try {
            saveCampaign(updatedCampaign);
          } catch (error) {
            console.error('Error updating campaign status:', error);
          }
          return updatedCampaign;
        }
        return campaign;
      });
      return updated;
    });
  };

  // Get campaigns by status
  const getCampaignsByStatus = (status: string) => {
    return campaigns.filter(campaign => campaign.status === status);
  };

  // Get only user campaigns (excluding mock data)
  const getUserCampaigns = () => {
    return campaigns.filter(campaign => !campaign.isMockData);
  };

  // Get only mock campaigns
  const getMockCampaigns = () => {
    return campaigns.filter(campaign => campaign.isMockData);
  };

  // Convert mock campaign to user campaign
  const convertMockToUser = (mockId: string) => {
    const mockCampaign = campaigns.find(c => c.id === mockId && c.isMockData);
    if (!mockCampaign) return null;

    // Remove mock data markers and save as user campaign
    const { isMockData, ...campaignData } = mockCampaign;
    const userCampaign = {
      ...campaignData,
      name: campaignData.name.replace(' (Demo)', ''), // Remove demo suffix
      status: 'draft' as const // Start as draft for user editing
    };

    return upsertCampaign(userCampaign);
  };

  return {
    campaigns,
    isLoading,
    upsertCampaign,
    removeCampaign,
    updateCampaignStatus,
    getCampaignsByStatus,
    getUserCampaigns,
    getMockCampaigns,
    convertMockToUser,
    refreshCampaigns: () => {
      const userCampaigns = getCampaigns();
      if (mode.type === 'hybrid') {
        const mockCount = Math.max(0, (mode.mockCount || 3) - userCampaigns.length);
        const mockCampaigns = mockCount > 0 ? generateCampaigns(mockCount) : [];
        const markedMockCampaigns = mockCampaigns.map((campaign, index) => 
          transformMockCampaign(campaign, index)
        );
        setCampaigns([...userCampaigns, ...markedMockCampaigns]);
      } else {
        setCampaigns(userCampaigns);
      }
    }
  };
} 