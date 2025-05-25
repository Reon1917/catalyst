'use client';

/**
 * New Campaign page - Create a new marketing campaign
 * Multi-step form for comprehensive campaign setup
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CampaignInput, CampaignChannel } from '@/lib/schemas';
import { saveCampaign } from '@/lib/data';

// Available marketing channels
const AVAILABLE_CHANNELS = [
  { id: 'socialMedia', name: 'Social Media', description: 'Facebook, Instagram, Twitter, LinkedIn' },
  { id: 'email', name: 'Email Marketing', description: 'Newsletter, drip campaigns, automation' },
  { id: 'seo', name: 'SEO', description: 'Search engine optimization' },
  { id: 'ppc', name: 'PPC Advertising', description: 'Google Ads, Bing Ads' },
  { id: 'contentMarketing', name: 'Content Marketing', description: 'Blog posts, videos, infographics' },
  { id: 'influencer', name: 'Influencer Marketing', description: 'Partnerships with influencers' },
  { id: 'pr', name: 'Public Relations', description: 'Press releases, media outreach' },
  { id: 'events', name: 'Events & Webinars', description: 'Virtual and in-person events' }
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data state - initialized with empty values matching Campaign structure
  const [formData, setFormData] = useState<CampaignInput>({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    overallBudget: 0,
    targetAudience: {
      personaName: '',
      demographics: '',
      interestsAndBehaviors: '',
      painPoints: ''
    },
    channels: [],
    messaging: {
      coreMessage: '',
      valueProps: [''],
      contentIdeas: ''
    }
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested object properties (e.g., "targetAudience.demographics")
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CampaignInput],
          [child]: type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle channel selection
  const handleChannelToggle = (channelId: string, channelName: string) => {
    setFormData(prev => {
      const existingChannelIndex = prev.channels.findIndex(c => c.id === channelId);
      
      if (existingChannelIndex >= 0) {
        // Remove channel
        return {
          ...prev,
          channels: prev.channels.filter(c => c.id !== channelId)
        };
      } else {
        // Add channel
        return {
          ...prev,
          channels: [...prev.channels, { id: channelId, name: channelName, budget: 0 }]
        };
      }
    });
  };

  // Handle channel budget change
  const handleChannelBudgetChange = (channelId: string, budget: number) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.map(channel =>
        channel.id === channelId ? { ...channel, budget } : channel
      )
    }));
  };

  // Handle value proposition changes
  const handleValuePropChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        valueProps: prev.messaging.valueProps.map((prop, i) => i === index ? value : prop)
      }
    }));
  };

  // Add new value proposition
  const addValueProp = () => {
    if (formData.messaging.valueProps.length < 3) {
      setFormData(prev => ({
        ...prev,
        messaging: {
          ...prev.messaging,
          valueProps: [...prev.messaging.valueProps, '']
        }
      }));
    }
  };

  // Remove value proposition
  const removeValueProp = (index: number) => {
    if (formData.messaging.valueProps.length > 1) {
      setFormData(prev => ({
        ...prev,
        messaging: {
          ...prev.messaging,
          valueProps: prev.messaging.valueProps.filter((_, i) => i !== index)
        }
      }));
    }
  };

  // Validation function
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Campaign name is required';
        if (!formData.goal) newErrors.goal = 'Campaign goal is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;
      case 2:
        if (!formData.targetAudience.demographics.trim()) newErrors['targetAudience.demographics'] = 'Demographics are required';
        if (!formData.targetAudience.interestsAndBehaviors.trim()) newErrors['targetAudience.interestsAndBehaviors'] = 'Interests & behaviors are required';
        if (!formData.targetAudience.painPoints.trim()) newErrors['targetAudience.painPoints'] = 'Pain points are required';
        break;
      case 3:
        if (formData.channels.length === 0) newErrors.channels = 'At least one channel must be selected';
        break;
      case 4:
        if (!formData.messaging.coreMessage.trim()) newErrors['messaging.coreMessage'] = 'Core message is required';
        if (formData.messaging.valueProps.filter(prop => prop.trim()).length === 0) {
          newErrors['messaging.valueProps'] = 'At least one value proposition is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const handleNextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save campaign
  const handleSaveCampaign = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      // Filter out empty value propositions
      const cleanedFormData = {
        ...formData,
        messaging: {
          ...formData.messaging,
          valueProps: formData.messaging.valueProps.filter(prop => prop.trim())
        }
      };

      console.log('Saving campaign:', cleanedFormData);
      const savedCampaign = saveCampaign(cleanedFormData);
      console.log('Campaign saved successfully:', savedCampaign);
      
      // Redirect to dashboard after successful save
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Error saving campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step titles for progress indicator
  const stepTitles = [
    'Campaign Basics',
    'Target Audience',
    'Channels & Budget',
    'Messaging & Content'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
        <p className="mt-2 text-gray-600">Set up a new marketing campaign with goals, audience, and channels</p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-8">
          {stepTitles.map((title, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : isCompleted 
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    Step {stepNumber}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {title}
                  </p>
                </div>
                {index < stepTitles.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="min-h-[500px]">
          {/* Step 1: Campaign Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Campaign Basics</h2>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  💡 Defining a clear goal is key
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter campaign name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Goal *
                  </label>
                  <select
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.goal ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a goal</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Sales Conversion">Sales Conversion</option>
                    <option value="Customer Retention">Customer Retention</option>
                    <option value="Product Launch">Product Launch</option>
                  </select>
                  {errors.goal && <p className="mt-1 text-sm text-red-600">{errors.goal}</p>}
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="overallBudget" className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Budget ($)
                  </label>
                  <input
                    type="number"
                    id="overallBudget"
                    name="overallBudget"
                    value={formData.overallBudget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter total budget"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target Audience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Target Audience</h2>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  💡 Understand your audience deeply
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="targetAudience.personaName" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Persona Name
                  </label>
                  <input
                    type="text"
                    id="targetAudience.personaName"
                    name="targetAudience.personaName"
                    value={formData.targetAudience.personaName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Tech-Savvy Millennials, Busy Working Parents"
                  />
                </div>

                <div>
                  <label htmlFor="targetAudience.demographics" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Demographics *
                  </label>
                  <textarea
                    id="targetAudience.demographics"
                    name="targetAudience.demographics"
                    value={formData.targetAudience.demographics}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors['targetAudience.demographics'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Age range, gender, location, income level, education, occupation..."
                  />
                  {errors['targetAudience.demographics'] && <p className="mt-1 text-sm text-red-600">{errors['targetAudience.demographics']}</p>}
                </div>

                <div>
                  <label htmlFor="targetAudience.interestsAndBehaviors" className="block text-sm font-medium text-gray-700 mb-2">
                    Interests & Behaviors *
                  </label>
                  <textarea
                    id="targetAudience.interestsAndBehaviors"
                    name="targetAudience.interestsAndBehaviors"
                    value={formData.targetAudience.interestsAndBehaviors}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors['targetAudience.interestsAndBehaviors'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Hobbies, online behavior, shopping habits, preferred platforms..."
                  />
                  {errors['targetAudience.interestsAndBehaviors'] && <p className="mt-1 text-sm text-red-600">{errors['targetAudience.interestsAndBehaviors']}</p>}
                </div>

                <div>
                  <label htmlFor="targetAudience.painPoints" className="block text-sm font-medium text-gray-700 mb-2">
                    Pain Points/Needs *
                  </label>
                  <textarea
                    id="targetAudience.painPoints"
                    name="targetAudience.painPoints"
                    value={formData.targetAudience.painPoints}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors['targetAudience.painPoints'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Challenges, frustrations, needs your product/service addresses..."
                  />
                  {errors['targetAudience.painPoints'] && <p className="mt-1 text-sm text-red-600">{errors['targetAudience.painPoints']}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Channels & Budget */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Channels & Budget Allocation</h2>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  💡 Choose channels where your audience is
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Marketing Channels *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AVAILABLE_CHANNELS.map((channel) => {
                      const isSelected = formData.channels.some(c => c.id === channel.id);
                      return (
                        <div
                          key={channel.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => handleChannelToggle(channel.id, channel.name)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by div onClick
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">{channel.name}</h4>
                              <p className="text-xs text-gray-500">{channel.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.channels && <p className="mt-2 text-sm text-red-600">{errors.channels}</p>}
                </div>

                {/* Budget allocation for selected channels */}
                {formData.channels.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Budget Allocation per Channel
                    </label>
                    <div className="space-y-4">
                      {formData.channels.map((channel) => (
                        <div key={channel.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">$</span>
                            <input
                              type="number"
                              value={channel.budget}
                              onChange={(e) => handleChannelBudgetChange(channel.id, parseFloat(e.target.value) || 0)}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                              min="0"
                              step="100"
                            />
                          </div>
                        </div>
                      ))}
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>Total Channel Budget: </strong>
                        ${formData.channels.reduce((sum, channel) => sum + channel.budget, 0).toLocaleString()}
                        {formData.overallBudget > 0 && (
                          <span className="ml-2">
                            / ${formData.overallBudget.toLocaleString()} overall budget
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Messaging & Content */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Messaging & Content Pillars</h2>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  💡 Consistent messaging is crucial
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="messaging.coreMessage" className="block text-sm font-medium text-gray-700 mb-2">
                    Core Campaign Message *
                  </label>
                  <textarea
                    id="messaging.coreMessage"
                    name="messaging.coreMessage"
                    value={formData.messaging.coreMessage}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors['messaging.coreMessage'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Main message you want to communicate to your audience..."
                  />
                  {errors['messaging.coreMessage'] && <p className="mt-1 text-sm text-red-600">{errors['messaging.coreMessage']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Value Propositions (Max 3) *
                  </label>
                  <div className="space-y-3">
                    {formData.messaging.valueProps.map((prop, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={prop}
                          onChange={(e) => handleValuePropChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder={`Value proposition ${index + 1}`}
                        />
                        {formData.messaging.valueProps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeValueProp(index)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors"
                            title="Remove value proposition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {formData.messaging.valueProps.length < 3 && (
                      <button
                        type="button"
                        onClick={addValueProp}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Value Proposition</span>
                      </button>
                    )}
                  </div>
                  {errors['messaging.valueProps'] && <p className="mt-1 text-sm text-red-600">{errors['messaging.valueProps']}</p>}
                </div>

                <div>
                  <label htmlFor="messaging.contentIdeas" className="block text-sm font-medium text-gray-700 mb-2">
                    Content Ideas/Themes
                  </label>
                  <textarea
                    id="messaging.contentIdeas"
                    name="messaging.contentIdeas"
                    value={formData.messaging.contentIdeas}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Blog posts, social media content, videos, infographics, case studies..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSaveCampaign}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Campaign'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 