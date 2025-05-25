/**
 * Campaign simulation logic for generating realistic performance metrics
 * Based on budget, channels, goals, and industry benchmarks
 */

import { Campaign } from './schemas';

export type SimulationInput = Pick<Campaign, 'overallBudget' | 'channels' | 'goal' | 'startDate' | 'endDate'>;

/**
 * Generates simulated campaign results based on campaign parameters
 * Uses industry benchmarks and realistic multipliers
 */
export function generateSimulatedResults(campaign: SimulationInput): Campaign['simulatedResults'] {
  const budget = campaign.overallBudget || 0;
  const channelCount = campaign.channels.length;
  const goal = campaign.goal;

  // Base calculations with some randomization for realism
  const baseReachMultiplier = getReachMultiplierByGoal(goal);
  const reach = Math.round((budget * baseReachMultiplier) + (channelCount * 1000) + (Math.random() * 500));
  
  // Impressions: typically 1.5-3x reach depending on frequency
  const impressionMultiplier = 1.5 + (Math.random() * 1.5);
  const impressions = Math.round(reach * impressionMultiplier);
  
  // Click-through rate varies by goal and channels
  const ctrBase = getCTRByGoal(goal);
  const ctrVariation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
  const ctr = Math.max(0.005, ctrBase + ctrVariation); // Minimum 0.5% CTR
  const clicks = Math.round(impressions * ctr);
  
  // Conversion rate varies significantly by goal
  const conversionRateBase = getConversionRateByGoal(goal);
  const conversionRateVariation = (Math.random() - 0.5) * 0.02; // ±1% variation
  const conversionRate = Math.max(0.01, conversionRateBase + conversionRateVariation);
  
  // Calculate leads (only for lead generation campaigns)
  const leads = goal === 'Lead Generation' ? Math.round(clicks * conversionRate) : undefined;
  
  // Cost calculations
  const cpc = clicks > 0 ? Math.round((budget / clicks) * 100) / 100 : undefined;
  const cpl = leads && leads > 0 ? Math.round((budget / leads) * 100) / 100 : undefined;

  return {
    reach,
    impressions,
    clicks,
    leads,
    conversionRate: Math.round(conversionRate * 10000) / 100, // Convert to percentage with 2 decimals
    cpc,
    cpl
  };
}

/**
 * Get reach multiplier based on campaign goal
 */
function getReachMultiplierByGoal(goal: string): number {
  const multipliers: Record<string, number> = {
    'Brand Awareness': 15, // Higher reach for awareness campaigns
    'Lead Generation': 8,  // Lower reach but higher quality
    'Sales Conversion': 6, // Focused reach for conversions
    'Customer Retention': 5, // Targeted existing customers
    'Product Launch': 12   // Broad reach for new products
  };
  
  return multipliers[goal] || 10;
}

/**
 * Get base click-through rate by campaign goal
 */
function getCTRByGoal(goal: string): number {
  const ctrs: Record<string, number> = {
    'Brand Awareness': 0.015,    // 1.5% - lower engagement but broad reach
    'Lead Generation': 0.025,    // 2.5% - targeted audience, higher engagement
    'Sales Conversion': 0.035,   // 3.5% - high-intent audience
    'Customer Retention': 0.045, // 4.5% - existing customers more likely to engage
    'Product Launch': 0.02       // 2.0% - mixed audience interest
  };
  
  return ctrs[goal] || 0.02;
}

/**
 * Get base conversion rate by campaign goal
 */
function getConversionRateByGoal(goal: string): number {
  const rates: Record<string, number> = {
    'Brand Awareness': 0.01,     // 1% - awareness doesn't directly convert
    'Lead Generation': 0.08,     // 8% - optimized for lead capture
    'Sales Conversion': 0.12,    // 12% - high-intent traffic
    'Customer Retention': 0.15,  // 15% - existing customers more likely to convert
    'Product Launch': 0.05       // 5% - new product uncertainty
  };
  
  return rates[goal] || 0.05;
}

/**
 * Calculate campaign duration in days
 */
export function getCampaignDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get performance insights based on simulated results
 */
export function getPerformanceInsights(results: Campaign['simulatedResults'], budget: number): string[] {
  const insights: string[] = [];
  
  if (!results) return insights;
  
  // CTR insights
  const ctr = results.clicks / results.impressions;
  if (ctr > 0.03) {
    insights.push("🎯 Excellent click-through rate! Your targeting is very effective.");
  } else if (ctr < 0.015) {
    insights.push("💡 Consider refining your ad copy or targeting to improve engagement.");
  }
  
  // CPC insights
  if (results.cpc && results.cpc < 2) {
    insights.push("💰 Great cost efficiency! Your cost per click is very competitive.");
  } else if (results.cpc && results.cpc > 5) {
    insights.push("⚠️ High cost per click. Consider optimizing your targeting or bidding strategy.");
  }
  
  // Conversion insights
  if (results.conversionRate && results.conversionRate > 10) {
    insights.push("🚀 Outstanding conversion rate! Your landing page and offer are highly compelling.");
  } else if (results.conversionRate && results.conversionRate < 3) {
    insights.push("🔧 Consider optimizing your landing page or refining your value proposition.");
  }
  
  // Budget efficiency
  const reachPerDollar = results.reach / budget;
  if (reachPerDollar > 10) {
    insights.push("📈 Excellent budget efficiency! You're reaching a large audience cost-effectively.");
  }
  
  return insights;
} 