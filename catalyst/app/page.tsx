'use client';

/**
 * Landing Page - Main entry point for the Marketing Campaign Planner
 * Features hero section, benefits overview, and call-to-action
 */

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  TagIcon, 
  CurrencyDollarIcon, 
  LightBulbIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Animated text component
const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

// Feature card component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`card-enhanced p-6 rounded-xl transition-all duration-700 transform ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold ml-3 text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

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
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Transform Your Marketing Strategy
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              <AnimatedText 
                text="Craft, Manage, and Analyze" 
                className="block"
              />
              <span className="text-gradient block mt-2">
                Marketing Campaigns
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 text-muted-foreground">
                Effortlessly
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Plan your marketing strategies, define target audiences, allocate budgets, and simulate campaign results all in one place. 
              <span className="text-foreground font-medium"> Streamline your workflow and bring clarity to your marketing efforts.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  Get Started
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>

              <Link
                href="/campaigns/new"
                className="inline-flex items-center px-8 py-4 bg-card text-card-foreground border border-border rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-accent hover:scale-105 shadow-sm hover:shadow-md"
              >
                Create Campaign
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: 'Campaign Types', value: '5+' },
                { label: 'Marketing Channels', value: '8+' },
                { label: 'Simulation Metrics', value: '10+' },
                { label: 'Success Rate', value: '95%' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your marketing campaign management from planning to analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={TagIcon}
              title="Smart Targeting"
              description="Define detailed audience personas with demographics, interests, and pain points for precise targeting."
              delay={100}
            />
            <FeatureCard
              icon={CurrencyDollarIcon}
              title="Budget Allocation"
              description="Distribute budgets across multiple channels with real-time tracking and optimization suggestions."
              delay={200}
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="Performance Simulation"
              description="Get realistic performance predictions based on industry benchmarks and campaign parameters."
              delay={300}
            />
            <FeatureCard
              icon={LightBulbIcon}
              title="Smart Insights"
              description="Receive actionable recommendations to improve campaign performance and ROI."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose <span className="text-gradient">Catalyst</span>?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Save Time & Resources",
                    description: "Streamline your campaign planning process with intuitive workflows and automated insights."
                  },
                  {
                    title: "Data-Driven Decisions",
                    description: "Make informed choices with realistic performance simulations and industry benchmarks."
                  },
                  {
                    title: "Comprehensive Management",
                    description: "Handle everything from audience targeting to budget allocation in one unified platform."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="card-enhanced p-8 rounded-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Campaign Performance</span>
                    <span className="text-sm text-success font-medium">+24% ROI</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reach</span>
                      <span className="font-medium">125,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-4/5"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conversions</span>
                      <span className="font-medium">3,250</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-success h-2 rounded-full w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of marketers who trust Catalyst to plan, execute, and optimize their campaigns.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                Start Your Journey
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
