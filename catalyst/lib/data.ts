/**
 * localStorage utility functions for managing marketing campaigns
 * These functions handle client-side data persistence and retrieval
 */

import { Campaign, CampaignInput } from './schemas';

const STORAGE_KEY = 'marketingCampaigns';

/**
 * Generates a unique ID for campaigns
 * Uses timestamp with random suffix for better uniqueness
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if localStorage is available (client-side only)
 */
function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && 'localStorage' in window;
  } catch {
    return false;
  }
}

/**
 * Retrieves and parses campaigns from localStorage
 * Returns empty array if none exist or on error
 */
export function getCampaigns(): Campaign[] {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available');
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    const campaigns = JSON.parse(stored);
    return Array.isArray(campaigns) ? campaigns : [];
  } catch (error) {
    console.error('Error parsing campaigns from localStorage:', error);
    return [];
  }
}

/**
 * Retrieves a single campaign by ID
 */
export function getCampaignById(id: string): Campaign | undefined {
  const campaigns = getCampaigns();
  return campaigns.find(campaign => campaign.id === id);
}

/**
 * Saves a campaign to localStorage
 * If campaignData.id exists, updates existing campaign
 * If campaignData.id doesn't exist, creates new campaign
 * Returns the saved/updated campaign
 */
export function saveCampaign(campaignData: CampaignInput): Campaign {
  if (!isLocalStorageAvailable()) {
    throw new Error('localStorage not available');
  }

  const campaigns = getCampaigns();
  const now = new Date().toISOString();
  
  let savedCampaign: Campaign;

  if (campaignData.id) {
    // Update existing campaign
    const existingIndex = campaigns.findIndex(c => c.id === campaignData.id);
    
    if (existingIndex === -1) {
      throw new Error(`Campaign with id ${campaignData.id} not found`);
    }

    savedCampaign = {
      ...campaignData as Campaign,
      updatedAt: now,
      // Preserve original createdAt
      createdAt: campaigns[existingIndex].createdAt
    };

    campaigns[existingIndex] = savedCampaign;
  } else {
    // Create new campaign
    savedCampaign = {
      ...campaignData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    } as Campaign;

    campaigns.push(savedCampaign);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    return savedCampaign;
  } catch (error) {
    console.error('Error saving campaign to localStorage:', error);
    throw new Error('Failed to save campaign');
  }
}

/**
 * Deletes a campaign by ID and updates localStorage
 * Returns true on success, false on failure
 */
export function deleteCampaign(id: string): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available');
    return false;
  }

  try {
    const campaigns = getCampaigns();
    const filteredCampaigns = campaigns.filter(campaign => campaign.id !== id);
    
    // Check if campaign was actually found and removed
    if (filteredCampaigns.length === campaigns.length) {
      console.warn(`Campaign with id ${id} not found`);
      return false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCampaigns));
    return true;
  } catch (error) {
    console.error('Error deleting campaign from localStorage:', error);
    return false;
  }
}

/**
 * Clears all campaigns from localStorage (useful for development/testing)
 */
export function clearAllCampaigns(): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available');
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing campaigns from localStorage:', error);
    return false;
  }
} 