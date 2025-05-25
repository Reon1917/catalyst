export interface Campaign {
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
  tags: string[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    conversionRate: number;
    costPerClick: number;
    costPerConversion: number;
  };
  targetAudience: {
    ageRange: string;
    gender: string;
    location: string[];
    interests: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

export interface AnalyticsData {
  timeSeriesData: {
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
  channelPerformance: {
    channel: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
  }[];
  deviceBreakdown: {
    device: string;
    percentage: number;
    users: number;
  }[];
  topCampaigns: {
    id: string;
    name: string;
    revenue: number;
    roi: number;
  }[];
}

// Collavo Productivity App Campaign Data
const campaignTitles = [
  'Collavo Beta Launch',
  'Productivity Influencer Campaign',
  'Team Collaboration Features',
  'Free Trial Conversion Drive',
  'Product Hunt Launch Day',
  'LinkedIn Professional Outreach',
  'Content Creator Partnership',
  'Enterprise Sales Campaign'
];

const campaignDescriptions = [
  'Launch Collavo beta to early adopters and gather feedback',
  'Partner with productivity influencers to showcase Collavo features',
  'Highlight team collaboration tools for remote work',
  'Convert free trial users to paid subscriptions',
  'Coordinate Product Hunt launch for maximum visibility',
  'Target professionals on LinkedIn with productivity content',
  'Collaborate with content creators for authentic reviews',
  'Drive enterprise adoption with B2B sales campaigns'
];

const channels = [
  'LinkedIn Ads',
  'Content Marketing',
  'Influencer Marketing',
  'Product Hunt',
  'Twitter/X Marketing',
  'YouTube Ads',
  'Email Marketing',
  'SEO/Organic',
  'Google Ads',
  'Podcast Sponsorship'
];

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Chen', role: 'Marketing Lead', avatar: '👩‍💼', email: 'sarah@collavo.com' },
  { id: '2', name: 'Alex Rodriguez', role: 'Growth Marketer', avatar: '👨‍📈', email: 'alex@collavo.com' },
  { id: '3', name: 'Maya Patel', role: 'Content Creator', avatar: '👩‍💻', email: 'maya@collavo.com' },
  { id: '4', name: 'Jordan Kim', role: 'Product Marketer', avatar: '👨‍🚀', email: 'jordan@collavo.com' },
  { id: '5', name: 'Emma Thompson', role: 'Community Manager', avatar: '👩‍🤝‍👩', email: 'emma@collavo.com' },
  { id: '6', name: 'David Park', role: 'Performance Analyst', avatar: '👨‍📊', email: 'david@collavo.com' }
];

const tags = [
  'beta-launch', 'productivity', 'collaboration', 'free-trial', 'conversion',
  'influencer', 'content-marketing', 'product-hunt', 'enterprise', 'b2b',
  'remote-work', 'team-tools', 'saas', 'startup', 'growth-hacking'
];

const locations = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Australia', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'India',
  'Singapore', 'Netherlands', 'Sweden', 'Spain', 'Italy', 'Switzerland'
];

const interests = [
  'Productivity Tools', 'Remote Work', 'Team Management', 'Project Management',
  'Startup Culture', 'SaaS Products', 'Business Efficiency', 'Collaboration',
  'Time Management', 'Work-Life Balance', 'Digital Nomad', 'Entrepreneurship'
];

// Utility functions
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}



function generateMetrics(budget: number, status: string): Campaign['metrics'] {
  const baseImpressions = Math.floor(budget * (10 + Math.random() * 20)); // 10-30 impressions per dollar
  const ctr = 0.01 + Math.random() * 0.05; // 1-6% CTR
  const clicks = Math.floor(baseImpressions * ctr);
  const conversionRate = 0.02 + Math.random() * 0.15; // 2-17% conversion rate
  const conversions = Math.floor(clicks * conversionRate);
  const avgOrderValue = 50 + Math.random() * 200; // $50-250 AOV
  const revenue = conversions * avgOrderValue;
  
  // Adjust based on status
  const statusMultiplier = status === 'completed' ? 1 : status === 'active' ? 0.7 : status === 'paused' ? 0.3 : 0.1;
  
  return {
    impressions: Math.floor(baseImpressions * statusMultiplier),
    clicks: Math.floor(clicks * statusMultiplier),
    conversions: Math.floor(conversions * statusMultiplier),
    revenue: Math.floor(revenue * statusMultiplier),
    ctr: parseFloat((ctr * 100).toFixed(2)),
    conversionRate: parseFloat((conversionRate * 100).toFixed(2)),
    costPerClick: parseFloat((budget / (clicks * statusMultiplier || 1)).toFixed(2)),
    costPerConversion: parseFloat((budget / (conversions * statusMultiplier || 1)).toFixed(2))
  };
}

export function generateCampaign(id?: string): Campaign {
  const now = new Date();
  const startDate = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000); // Up to 60 days ago
  const endDate = new Date(startDate.getTime() + (14 + Math.random() * 45) * 24 * 60 * 60 * 1000); // 14-60 days duration
  const status = randomChoice(['draft', 'active', 'paused', 'completed'] as const);
  const budget = Math.floor(500 + Math.random() * 9500); // $500-10K budget (startup-friendly)
  const teamSize = 1 + Math.floor(Math.random() * 3); // 1-3 team members
  const tagCount = 1 + Math.floor(Math.random() * 3); // 1-3 tags
  
  return {
    id: id || `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: randomChoice(campaignTitles),
    description: randomChoice(campaignDescriptions),
    budget,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    status,
    channel: randomChoice(channels),
    progress: status === 'completed' ? 100 : status === 'active' ? 30 + Math.random() * 60 : status === 'paused' ? 20 + Math.random() * 40 : Math.random() * 30,
    team: randomChoices(teamMembers, teamSize).map(member => member.name),
    tags: randomChoices(tags, tagCount),
    metrics: generateMetrics(budget, status),
    targetAudience: {
      ageRange: randomChoice(['18-24', '25-34', '35-44', '45-54', '55-64', '65+']),
      gender: randomChoice(['All', 'Male', 'Female', 'Non-binary']),
      location: randomChoices(locations, 1 + Math.floor(Math.random() * 3)),
      interests: randomChoices(interests, 2 + Math.floor(Math.random() * 4))
    },
    createdAt: new Date(startDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function generateCampaigns(count: number): Campaign[] {
  return Array.from({ length: count }, (_, i) => generateCampaign(`campaign_${i + 1}`));
}

export function generateAnalyticsData(campaigns: Campaign[]): AnalyticsData {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const timeSeriesData = last30Days.map(date => {
    const dayMetrics = campaigns.reduce((acc, campaign) => {
      const dailyFraction = 1 / 30; // Distribute metrics across 30 days
      return {
        impressions: acc.impressions + Math.floor(campaign.metrics.impressions * dailyFraction * (0.5 + Math.random())),
        clicks: acc.clicks + Math.floor(campaign.metrics.clicks * dailyFraction * (0.5 + Math.random())),
        conversions: acc.conversions + Math.floor(campaign.metrics.conversions * dailyFraction * (0.5 + Math.random())),
        revenue: acc.revenue + Math.floor(campaign.metrics.revenue * dailyFraction * (0.5 + Math.random()))
      };
    }, { impressions: 0, clicks: 0, conversions: 0, revenue: 0 });

    return { date, ...dayMetrics };
  });

  const channelPerformance = channels.slice(0, 8).map(channel => {
    const channelCampaigns = campaigns.filter(c => c.channel === channel);
    const metrics = channelCampaigns.reduce((acc, campaign) => ({
      impressions: acc.impressions + campaign.metrics.impressions,
      clicks: acc.clicks + campaign.metrics.clicks,
      conversions: acc.conversions + campaign.metrics.conversions,
      revenue: acc.revenue + campaign.metrics.revenue
    }), { impressions: 0, clicks: 0, conversions: 0, revenue: 0 });

    return {
      channel,
      ...metrics,
      ctr: metrics.impressions > 0 ? parseFloat(((metrics.clicks / metrics.impressions) * 100).toFixed(2)) : 0
    };
  });

  const deviceBreakdown = [
    { device: 'Desktop', percentage: 45, users: 12500 },
    { device: 'Mobile', percentage: 40, users: 11100 },
    { device: 'Tablet', percentage: 15, users: 4200 }
  ];

  const topCampaigns = campaigns
    .sort((a, b) => b.metrics.revenue - a.metrics.revenue)
    .slice(0, 5)
    .map(campaign => ({
      id: campaign.id,
      name: campaign.title,
      revenue: campaign.metrics.revenue,
      roi: parseFloat(((campaign.metrics.revenue / campaign.budget - 1) * 100).toFixed(1))
    }));

  return {
    timeSeriesData,
    channelPerformance,
    deviceBreakdown,
    topCampaigns
  };
}

export function getTeamMembers(): TeamMember[] {
  return teamMembers;
}

export function getTags(): string[] {
  return tags;
}

export function getChannels(): string[] {
  return channels;
} 