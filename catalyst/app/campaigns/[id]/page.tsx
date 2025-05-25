'use client';

/**
 * Campaign Detail page - View specific campaign details with simulated metrics
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Campaign } from '@/lib/schemas';
import { getCampaignById } from '@/lib/data';
import { generateSimulatedResults, getPerformanceInsights, getCampaignDuration } from '@/lib/simulation';

export default function CampaignDetailPage() {
  const params = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [simulatedResults, setSimulatedResults] = useState<Campaign['simulatedResults']>(null);

  useEffect(() => {
    const fetchCampaign = () => {
      try {
        const id = params.id as string;
        const foundCampaign = getCampaignById(id);
        
        if (foundCampaign) {
          setCampaign(foundCampaign);
          
          // Generate simulated results
          const results = generateSimulatedResults({
            overallBudget: foundCampaign.overallBudget,
            channels: foundCampaign.channels,
            goal: foundCampaign.goal,
            startDate: foundCampaign.startDate,
            endDate: foundCampaign.endDate
          });
          setSimulatedResults(results);
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Loading Campaign...</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Campaign Not Found</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.875a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign not found</h3>
            <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist or may have been deleted.</p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate campaign status
  const getCampaignStatus = () => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    if (now < startDate) return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800', icon: '🔮' };
    if (now > endDate) return { status: 'Completed', color: 'bg-gray-100 text-gray-800', icon: '✅' };
    return { status: 'Active', color: 'bg-green-100 text-green-800', icon: '🚀' };
  };

  const { status, color, icon } = getCampaignStatus();
  const duration = getCampaignDuration(campaign.startDate, campaign.endDate);
  const insights = simulatedResults ? getPerformanceInsights(simulatedResults, campaign.overallBudget || 0) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${color}`}>
                {icon} {status}
              </span>
              <span className="text-gray-600">{campaign.goal}</span>
              <span className="text-gray-600">{duration} days</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/campaigns/${campaign.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Campaign
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Campaign Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Basics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Basics</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Campaign Goal</label>
              <p className="text-gray-900">{campaign.goal}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p className="text-gray-900">{formatDate(campaign.startDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">End Date</label>
              <p className="text-gray-900">{formatDate(campaign.endDate)}</p>
            </div>
            {campaign.overallBudget && (
              <div>
                <label className="text-sm font-medium text-gray-500">Overall Budget</label>
                <p className="text-gray-900 text-lg font-semibold">${campaign.overallBudget.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Target Audience</h2>
          <div className="space-y-4">
            {campaign.targetAudience.personaName && (
              <div>
                <label className="text-sm font-medium text-gray-500">Persona</label>
                <p className="text-gray-900 font-medium">{campaign.targetAudience.personaName}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Demographics</label>
              <p className="text-gray-900 text-sm">{campaign.targetAudience.demographics}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Interests & Behaviors</label>
              <p className="text-gray-900 text-sm">{campaign.targetAudience.interestsAndBehaviors}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pain Points</label>
              <p className="text-gray-900 text-sm">{campaign.targetAudience.painPoints}</p>
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Messaging</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Core Message</label>
              <p className="text-gray-900 text-sm">{campaign.messaging.coreMessage}</p>
            </div>
            {campaign.messaging.valueProps.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Value Propositions</label>
                <ul className="mt-2 space-y-1">
                  {campaign.messaging.valueProps.map((prop, index) => (
                    <li key={index} className="text-gray-900 text-sm flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {prop}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {campaign.messaging.contentIdeas && (
              <div>
                <label className="text-sm font-medium text-gray-500">Content Ideas</label>
                <p className="text-gray-900 text-sm">{campaign.messaging.contentIdeas}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Channels & Budget */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Marketing Channels & Budget</h2>
        {campaign.channels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaign.channels.map((channel) => (
              <div key={channel.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">{channel.name}</h3>
                <p className="text-lg font-semibold text-blue-600 mt-2">
                  ${channel.budget.toLocaleString()}
                </p>
                {campaign.overallBudget && campaign.overallBudget > 0 && (
                  <p className="text-sm text-gray-500">
                    {((channel.budget / campaign.overallBudget) * 100).toFixed(1)}% of total budget
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No channels selected for this campaign.</p>
        )}
      </div>

      {/* Simulated Performance Metrics */}
      {simulatedResults && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Simulated Performance Metrics</h2>
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{simulatedResults.reach.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Estimated Reach</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{simulatedResults.impressions.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{simulatedResults.clicks.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{simulatedResults.conversionRate}%</div>
              <div className="text-sm text-gray-500">Conversion Rate</div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {simulatedResults.leads && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-700">{simulatedResults.leads.toLocaleString()}</div>
                <div className="text-sm text-green-600">Estimated Leads</div>
              </div>
            )}
            {simulatedResults.cpc && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-700">${simulatedResults.cpc}</div>
                <div className="text-sm text-blue-600">Cost Per Click</div>
              </div>
            )}
            {simulatedResults.cpl && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-700">${simulatedResults.cpl}</div>
                <div className="text-sm text-purple-600">Cost Per Lead</div>
              </div>
            )}
          </div>

          {/* Performance Insights */}
          {insights.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-700 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
            <strong>Note:</strong> These are simulated metrics based on industry benchmarks and your campaign parameters. 
            Actual results may vary based on market conditions, competition, and execution quality.
          </div>
        </div>
      )}

      {/* Campaign Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Campaign Created</p>
              <p className="text-sm text-gray-500">{formatDate(campaign.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Campaign Start</p>
              <p className="text-sm text-gray-500">{formatDate(campaign.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Campaign End</p>
              <p className="text-sm text-gray-500">{formatDate(campaign.endDate)}</p>
            </div>
          </div>
          {campaign.updatedAt !== campaign.createdAt && (
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-500">{formatDate(campaign.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 