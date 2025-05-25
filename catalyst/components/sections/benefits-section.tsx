"use client";

import { CheckIcon } from '@heroicons/react/24/outline';

const benefits = [
  'Streamline campaign planning and execution',
  'Optimize budget allocation across channels',
  'Improve targeting with detailed audience insights',
  'Simulate campaign performance before launch',
  'Track real-time analytics and ROI',
  'Automate repetitive marketing tasks'
];

export function BenefitsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Why choose Catalyst?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Transform your marketing approach with data-driven insights and streamlined workflows that deliver measurable results.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li 
                  key={index}
                  className="flex items-start animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Modern visual element */}
          <div className="animate-scale-in">
            <div className="card p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-4xl font-semibold text-primary mb-2">95%</div>
              <div className="text-muted-foreground mb-4">Success Rate</div>
              <div className="text-sm text-muted-foreground">
                of campaigns see improved performance with our platform
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 