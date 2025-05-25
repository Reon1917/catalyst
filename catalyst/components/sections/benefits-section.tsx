"use client";

import { CheckIcon } from '@heroicons/react/24/outline';

const benefits = [
  'Navigate 10x faster with command palette shortcuts',
  'Visualize campaigns with drag-and-drop kanban boards',
  'Monitor performance with real-time interactive charts',
  'Filter and search campaigns with advanced faceted search',
  'Validate forms intelligently with smart date and budget logic',
  'Experience realistic scenarios with immersive mock data'
];

export function BenefitsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Built for Power Users
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Experience the next generation of marketing campaign management with sophisticated features that 
              rival enterprise tools while maintaining intuitive usability.
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
          <div className="animate-scale-in space-y-4">
            <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-2">⌘K</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Command Palette</div>
            </div>
            <div className="card p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
              <div className="text-3xl font-semibold text-green-600 dark:text-green-400 mb-2">📊</div>
              <div className="text-sm text-green-700 dark:text-green-300">Live Analytics</div>
            </div>
            <div className="card p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-semibold text-purple-600 dark:text-purple-400 mb-2">🎯</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Drag & Drop</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 