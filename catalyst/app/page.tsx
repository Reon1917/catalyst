'use client';

/**
 * Landing Page - Main entry point for the Marketing Campaign Planner
 * Clean, modular implementation with Aceternity UI components
 */

import { useState, useEffect } from 'react';
import { 
  HeroSection, 
  FeaturesSection, 
  BenefitsSection, 
  CTASection 
} from '@/components/sections';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
    </div>
  );
}
