'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  SparklesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  MegaphoneIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LightBulbIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { CampaignInput } from '@/lib/schemas';
import { saveCampaign } from '@/lib/data';
import { generateSimulatedResults } from '@/lib/simulation';

interface FormErrors {
  [key: string]: string;
}

const CAMPAIGN_GOALS = [
  { 
    value: 'Brand Awareness', 
    icon: '🎯', 
    description: 'Increase visibility and recognition',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  { 
    value: 'Lead Generation', 
    icon: '🧲', 
    description: 'Capture potential customer information',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  { 
    value: 'Sales Conversion', 
    icon: '💰', 
    description: 'Drive direct sales and revenue',
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  { 
    value: 'Customer Retention', 
    icon: '🤝', 
    description: 'Keep existing customers engaged',
    color: 'bg-orange-50 border-orange-200 text-orange-700'
  },
  { 
    value: 'Product Launch', 
    icon: '🚀', 
    description: 'Introduce new products or features',
    color: 'bg-pink-50 border-pink-200 text-pink-700'
  }
];

const AVAILABLE_CHANNELS = [
  { 
    id: 'socialMedia', 
    name: 'Social Media', 
    icon: '📱', 
    description: 'Facebook, Instagram, LinkedIn, Twitter',
    suggestedBudget: 2000,
    color: 'bg-blue-500'
  },
  { 
    id: 'googleAds', 
    name: 'Google Ads', 
    icon: '🔍', 
    description: 'Search and Display advertising',
    suggestedBudget: 3000,
    color: 'bg-red-500'
  },
  { 
    id: 'email', 
    name: 'Email Marketing', 
    icon: '📧', 
    description: 'Newsletter and automated campaigns',
    suggestedBudget: 500,
    color: 'bg-green-500'
  },
  { 
    id: 'contentMarketing', 
    name: 'Content Marketing', 
    icon: '📝', 
    description: 'Blog posts, videos, podcasts',
    suggestedBudget: 1500,
    color: 'bg-purple-500'
  },
  { 
    id: 'influencer', 
    name: 'Influencer Marketing', 
    icon: '⭐', 
    description: 'Partnerships with influencers',
    suggestedBudget: 4000,
    color: 'bg-yellow-500'
  },
  { 
    id: 'seo', 
    name: 'SEO', 
    icon: '🎯', 
    description: 'Organic search optimization',
    suggestedBudget: 1000,
    color: 'bg-indigo-500'
  }
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<CampaignInput>({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    overallBudget: 0,
    status: 'draft',
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

  const stepTitles = [
    { title: 'Campaign Basics', icon: MegaphoneIcon },
    { title: 'Target Audience', icon: UsersIcon },
    { title: 'Channels & Budget', icon: CurrencyDollarIcon },
    { title: 'Messaging & Content', icon: LightBulbIcon },
    { title: 'Review & Launch', icon: SparklesIcon }
  ];

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

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
        if (!formData.targetAudience.demographics.trim()) {
          newErrors['targetAudience.demographics'] = 'Demographics are required';
        }
        if (!formData.targetAudience.interestsAndBehaviors.trim()) {
          newErrors['targetAudience.interestsAndBehaviors'] = 'Interests & behaviors are required';
        }
        if (!formData.targetAudience.painPoints.trim()) {
          newErrors['targetAudience.painPoints'] = 'Pain points are required';
        }
        break;
      case 3:
        if (formData.channels.length === 0) {
          newErrors.channels = 'At least one channel must be selected';
        }
        const totalBudget = formData.channels.reduce((sum, channel) => sum + channel.budget, 0);
        if (totalBudget <= 0) {
          newErrors.budget = 'Total budget must be greater than 0';
        }
        break;
      case 4:
        if (!formData.messaging.coreMessage.trim()) {
          newErrors['messaging.coreMessage'] = 'Core message is required';
        }
        const validValueProps = formData.messaging.valueProps.filter(prop => prop.trim());
        if (validValueProps.length === 0) {
          newErrors['messaging.valueProps'] = 'At least one value proposition is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const handleNextStep = () => {
    if (validateStep(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 4) {
        generateSimulation();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form handlers
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof CampaignInput] as object),
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChannelToggle = (channelId: string) => {
    const channel = AVAILABLE_CHANNELS.find(c => c.id === channelId);
    if (!channel) return;

    setFormData(prev => {
      const existingIndex = prev.channels.findIndex(c => c.id === channelId);
      
      if (existingIndex >= 0) {
        // Remove channel
        return {
          ...prev,
          channels: prev.channels.filter(c => c.id !== channelId)
        };
      } else {
        // Add channel with suggested budget
        return {
          ...prev,
          channels: [...prev.channels, { 
            id: channelId, 
            name: channel.name, 
            budget: channel.suggestedBudget 
          }]
        };
      }
    });
  };

  const handleChannelBudgetChange = (channelId: string, budget: number) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.map(channel =>
        channel.id === channelId ? { ...channel, budget } : channel
      )
    }));
  };

  const handleValuePropChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        valueProps: prev.messaging.valueProps.map((prop, i) => i === index ? value : prop)
      }
    }));
  };

  const addValueProp = () => {
    setFormData(prev => ({
      ...prev,
      messaging: {
        ...prev.messaging,
        valueProps: [...prev.messaging.valueProps, '']
      }
    }));
  };

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

  // Simulation
  const generateSimulation = () => {
    const totalBudget = formData.channels.reduce((sum, channel) => sum + channel.budget, 0);
    const simulationInput = {
      overallBudget: totalBudget,
      channels: formData.channels,
      goal: formData.goal,
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    const results = generateSimulatedResults(simulationInput);
    setFormData(prev => ({ ...prev, simulatedResults: results, overallBudget: totalBudget }));
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      saveCampaign(formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to campaign board
      router.push('/campaigns/board');
    } catch (error) {
      console.error('Error saving campaign:', error);
      setErrors({ submit: 'Failed to save campaign. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <PlusIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Campaign
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Build a comprehensive marketing campaign with our guided workflow. 
            Get instant performance projections and launch with confidence.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {stepTitles.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const IconComponent = step.icon;
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200' 
                          : isCompleted 
                          ? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-200'
                          : 'border-gray-300 bg-white text-gray-400 dark:bg-gray-700 dark:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </motion.div>
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Form Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Campaign Basics */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Campaign Basics
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Let&apos;s start with the fundamentals of your campaign
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Campaign Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Campaign Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 ${
                          errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="Enter a memorable campaign name..."
                      />
                      {errors.name && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    {/* Campaign Goal */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Campaign Goal *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {CAMPAIGN_GOALS.map(goal => (
                          <motion.button
                            key={goal.value}
                            type="button"
                            onClick={() => handleInputChange('goal', goal.value)}
                            className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                              formData.goal === goal.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{goal.icon}</span>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {goal.value}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {goal.description}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      {errors.goal && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.goal}
                        </motion.p>
                      )}
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className={`w-full px-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 ${
                            errors.startDate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                        {errors.startDate && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 flex items-center"
                          >
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            {errors.startDate}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          End Date *
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className={`w-full px-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 ${
                            errors.endDate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                          }`}
                        />
                        {errors.endDate && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 flex items-center"
                          >
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            {errors.endDate}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Target Audience */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Target Audience
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Define who you&apos;re trying to reach with this campaign
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Persona Name */}
                    <div>
                      <label htmlFor="personaName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Persona Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="personaName"
                        value={formData.targetAudience.personaName || ''}
                        onChange={(e) => handleInputChange('targetAudience.personaName', e.target.value)}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        placeholder="e.g., Tech-Savvy Sarah, Busy Business Owner Bob..."
                      />
                    </div>

                    {/* Demographics */}
                    <div>
                      <label htmlFor="demographics" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Demographics *
                      </label>
                      <textarea
                        id="demographics"
                        value={formData.targetAudience.demographics}
                        onChange={(e) => handleInputChange('targetAudience.demographics', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none ${
                          errors['targetAudience.demographics'] ? 'border-red-300 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="Age range, gender, location, income level, education..."
                      />
                      {errors['targetAudience.demographics'] && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors['targetAudience.demographics']}
                        </motion.p>
                      )}
                    </div>

                    {/* Interests & Behaviors */}
                    <div>
                      <label htmlFor="interests" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Interests & Behaviors *
                      </label>
                      <textarea
                        id="interests"
                        value={formData.targetAudience.interestsAndBehaviors}
                        onChange={(e) => handleInputChange('targetAudience.interestsAndBehaviors', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none ${
                          errors['targetAudience.interestsAndBehaviors'] ? 'border-red-300 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="Hobbies, online behavior, shopping habits, preferred platforms..."
                      />
                      {errors['targetAudience.interestsAndBehaviors'] && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors['targetAudience.interestsAndBehaviors']}
                        </motion.p>
                      )}
                    </div>

                    {/* Pain Points */}
                    <div>
                      <label htmlFor="painPoints" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Pain Points *
                      </label>
                      <textarea
                        id="painPoints"
                        value={formData.targetAudience.painPoints}
                        onChange={(e) => handleInputChange('targetAudience.painPoints', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none ${
                          errors['targetAudience.painPoints'] ? 'border-red-300 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="Challenges, frustrations, problems your product/service solves..."
                      />
                      {errors['targetAudience.painPoints'] && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors['targetAudience.painPoints']}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Channels & Budget */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Channels & Budget
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose your marketing channels and allocate budget
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Channel Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Select Marketing Channels *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {AVAILABLE_CHANNELS.map(channel => {
                          const isSelected = formData.channels.some(c => c.id === channel.id);
                          return (
                            <motion.button
                              key={channel.id}
                              type="button"
                              onClick={() => handleChannelToggle(channel.id)}
                              className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-10 h-10 rounded-lg ${channel.color} flex items-center justify-center text-white text-lg`}>
                                  {channel.icon}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {channel.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {channel.description}
                                  </p>
                                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                    Suggested: ${channel.suggestedBudget.toLocaleString()}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                      {errors.channels && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.channels}
                        </motion.p>
                      )}
                    </div>

                    {/* Budget Allocation */}
                    {formData.channels.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Budget Allocation
                        </label>
                        <div className="space-y-3">
                          {formData.channels.map(channel => {
                            const channelInfo = AVAILABLE_CHANNELS.find(c => c.id === channel.id);
                            return (
                              <div key={channel.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <div className={`w-8 h-8 rounded-lg ${channelInfo?.color} flex items-center justify-center text-white text-sm`}>
                                  {channelInfo?.icon}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {channel.name}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">$</span>
                                  <input
                                    type="number"
                                    value={channel.budget}
                                    onChange={(e) => handleChannelBudgetChange(channel.id, parseInt(e.target.value) || 0)}
                                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                          <span className="font-semibold text-gray-900 dark:text-white">Total Budget:</span>
                          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            ${formData.channels.reduce((sum, channel) => sum + channel.budget, 0).toLocaleString()}
                          </span>
                        </div>
                        {errors.budget && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 flex items-center"
                          >
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            {errors.budget}
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Messaging & Content */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Messaging & Content
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Craft your campaign&apos;s core message and value propositions
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Core Message */}
                    <div>
                      <label htmlFor="coreMessage" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Core Message *
                      </label>
                      <textarea
                        id="coreMessage"
                        value={formData.messaging.coreMessage}
                        onChange={(e) => handleInputChange('messaging.coreMessage', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none ${
                          errors['messaging.coreMessage'] ? 'border-red-300 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="What&apos;s the main message you want to communicate?"
                      />
                      {errors['messaging.coreMessage'] && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors['messaging.coreMessage']}
                        </motion.p>
                      )}
                    </div>

                    {/* Value Propositions */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Value Propositions *
                        </label>
                        <motion.button
                          type="button"
                          onClick={addValueProp}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          + Add Another
                        </motion.button>
                      </div>
                      <div className="space-y-3">
                        {formData.messaging.valueProps.map((prop, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="text"
                              value={prop}
                              onChange={(e) => handleValuePropChange(index, e.target.value)}
                              className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                              placeholder={`Value proposition ${index + 1}...`}
                            />
                            {formData.messaging.valueProps.length > 1 && (
                              <motion.button
                                type="button"
                                onClick={() => removeValueProp(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <TrashIcon className="w-5 h-5" />
                              </motion.button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      {errors['messaging.valueProps'] && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors['messaging.valueProps']}
                        </motion.p>
                      )}
                    </div>

                    {/* Content Ideas */}
                    <div>
                      <label htmlFor="contentIdeas" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Content Ideas (Optional)
                      </label>
                      <textarea
                        id="contentIdeas"
                        value={formData.messaging.contentIdeas}
                        onChange={(e) => handleInputChange('messaging.contentIdeas', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Blog posts, social media content, videos, infographics..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Review & Launch */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Review & Launch
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Review your campaign details and projected performance
                    </p>
                  </div>

                  {/* Campaign Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Campaign Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-600 dark:text-gray-400">Name:</span> <span className="font-medium">{formData.name}</span></p>
                          <p><span className="text-gray-600 dark:text-gray-400">Goal:</span> <span className="font-medium">{formData.goal}</span></p>
                          <p><span className="text-gray-600 dark:text-gray-400">Duration:</span> <span className="font-medium">{formData.startDate} to {formData.endDate}</span></p>
                          <p><span className="text-gray-600 dark:text-gray-400">Total Budget:</span> <span className="font-medium">${formData.channels.reduce((sum, channel) => sum + channel.budget, 0).toLocaleString()}</span></p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Channels</h4>
                        <div className="space-y-1 text-sm">
                          {formData.channels.map(channel => (
                            <p key={channel.id}>
                              <span className="text-gray-600 dark:text-gray-400">{channel.name}:</span> <span className="font-medium">${channel.budget.toLocaleString()}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simulation Results */}
                  {formData.simulatedResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center mb-6">
                        <SparklesIcon className="w-6 h-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Projected Performance</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                          <UsersIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formData.simulatedResults.reach.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Reach</p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                          <ChartBarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formData.simulatedResults.impressions.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Impressions</p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                          <CurrencyDollarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formData.simulatedResults.clicks.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Clicks</p>
                        </div>
                        {formData.simulatedResults.leads && (
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                            <MegaphoneIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formData.simulatedResults.leads.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Leads</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Error Display */}
                  {errors.submit && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4"
                    >
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                        <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <motion.button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
                whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </motion.button>

              <div className="flex items-center space-x-3">
                {currentStep < 5 ? (
                  <motion.button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Campaign...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Create Campaign
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 