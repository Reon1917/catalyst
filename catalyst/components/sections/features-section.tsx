"use client";

import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  CalendarIcon,
  PresentationChartLineIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: ChartBarIcon,
    title: 'Campaign Analytics',
    description: 'Track performance metrics and analyze campaign effectiveness with detailed insights.'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Budget Management',
    description: 'Allocate and monitor budgets across different channels and campaign objectives.'
  },
  {
    icon: UserGroupIcon,
    title: 'Audience Targeting',
    description: 'Define and segment target audiences for precise marketing campaign delivery.'
  },
  {
    icon: CalendarIcon,
    title: 'Campaign Scheduling',
    description: 'Plan and schedule campaigns with flexible timing and automated execution.'
  },
  {
    icon: PresentationChartLineIcon,
    title: 'Performance Simulation',
    description: 'Simulate campaign outcomes and optimize strategies before launch.'
  },
  {
    icon: CogIcon,
    title: 'Workflow Automation',
    description: 'Streamline repetitive tasks and automate campaign management processes.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for planning, executing, and analyzing your marketing campaigns.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card p-6 hover:border-primary/30 animate-slide-up group"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 