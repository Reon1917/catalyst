'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import EnhancedForm from '@/components/ui/enhanced-form';

interface FormData {
  title: string;
  description: string;
  budget: string;
  startDate: string;
  endDate: string;
  channel: string;
  tags: string[];
  team: string[];
}

export default function NewCampaignPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Campaign created:', formData);
    
    // Redirect to campaigns list or dashboard
    router.push('/campaigns');
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4">
                <PlusIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Campaign</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Set up your marketing campaign with detailed configuration</p>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <div className="px-8 py-6">
            <EnhancedForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 