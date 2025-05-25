"use client";

import { 
  CommandLineIcon,
  ChartBarIcon, 
  RectangleGroupIcon,
  MagnifyingGlassIcon,
  DocumentCheckIcon,
  CursorArrowRaysIcon,
  PresentationChartLineIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: CommandLineIcon,
    title: 'Command Palette (⌘K)',
    description: 'Navigate instantly with keyboard shortcuts, fuzzy search, and categorized commands for lightning-fast workflow.'
  },
  {
    icon: ChartBarIcon,
    title: 'Interactive Analytics',
    description: 'Real-time charts, performance metrics, and live activity feeds with Chart.js integration.'
  },
  {
    icon: RectangleGroupIcon,
    title: 'Drag & Drop Kanban',
    description: 'Visual campaign management with smooth animations, expandable cards, and status tracking.'
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Advanced Search & Filters',
    description: 'Faceted search with debounced input, multiple filter categories, and animated filter tags.'
  },
  {
    icon: DocumentCheckIcon,
    title: 'Smart Form Validation',
    description: 'Enhanced forms with real-time validation, date range logic, and intelligent budget formatting.'
  },
  {
    icon: SparklesIcon,
    title: 'Immersive Mock Data',
    description: 'Realistic campaign scenarios with generated metrics, team members, and performance data.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Sophisticated Features for Modern Marketing
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience enterprise-level functionality with intuitive design. From command palette navigation to 
            advanced analytics - every feature is crafted for productivity and performance.
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