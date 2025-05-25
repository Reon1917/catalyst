/**
 * Core TypeScript interfaces for the Marketing Campaign Planner
 */

export interface CampaignChannel {
  id: string; // e.g., 'socialMedia', 'email'
  name: string; // e.g., 'Social Media', 'Email Marketing'
  budget: number;
}

export interface Campaign {
  id: string; // unique ID
  name: string;
  goal: string; // e.g., "Lead Generation", "Brand Awareness"
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  overallBudget?: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetAudience: {
    personaName?: string;
    demographics: string;
    interestsAndBehaviors: string;
    painPoints: string;
  };
  channels: CampaignChannel[];
  messaging: {
    coreMessage: string;
    valueProps: string[];
    contentIdeas: string;
  };
  simulatedResults?: {
    reach: number;
    impressions: number;
    clicks: number;
    leads?: number;
    conversionRate?: number;
    cpc?: number; // cost per click
    cpl?: number; // cost per lead
  };
  isMockData?: boolean; // Flag to identify mock campaigns
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Type for creating/updating campaigns (excludes auto-generated fields)
export type CampaignInput = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> & { 
  id?: string 
}; 