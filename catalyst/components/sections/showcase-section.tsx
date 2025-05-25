"use client";

import { 
  CommandLineIcon,
  ChartBarIcon,
  RectangleGroupIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const showcaseFeatures = [
  {
    icon: CommandLineIcon,
    title: "Command Palette",
    description: "Press ⌘K to access instant navigation, fuzzy search, and categorized commands",
    demo: "Try: ⌘K → 'new campaign' → Enter",
    color: "blue",
    link: "/dashboard"
  },
  {
    icon: ChartBarIcon,
    title: "Interactive Analytics",
    description: "Real-time charts, performance metrics, and live activity feeds",
    demo: "View live data visualization",
    color: "green",
    link: "/analytics"
  },
  {
    icon: RectangleGroupIcon,
    title: "Kanban Board",
    description: "Drag and drop campaigns between workflow stages with smooth animations",
    demo: "Experience visual workflow",
    color: "purple",
    link: "/campaigns/board"
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Advanced Search",
    description: "Faceted search with filters, debounced input, and animated tags",
    demo: "Filter campaigns instantly",
    color: "orange",
    link: "/campaigns/board"
  }
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    button: "bg-blue-600 hover:bg-blue-700 text-white"
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    button: "bg-green-600 hover:bg-green-700 text-white"
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    border: "border-purple-200 dark:border-purple-800",
    icon: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    button: "bg-purple-600 hover:bg-purple-700 text-white"
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-800",
    icon: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    button: "bg-orange-600 hover:bg-orange-700 text-white"
  }
};

export function ShowcaseSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Experience the Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Don&apos;t just read about it - interact with our sophisticated features designed for modern marketing teams.
          </p>
        </div>

        {/* Features showcase grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {showcaseFeatures.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <div 
                key={index}
                className={`card p-8 ${colors.bg} ${colors.border} hover:shadow-lg transition-all duration-300 animate-slide-up group`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center`}>
                    <feature.icon className={`w-7 h-7 ${colors.icon}`} />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                    DEMO
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <div className="bg-background/50 rounded-lg p-3 mb-6 border border-border/50">
                  <div className="text-sm font-mono text-muted-foreground">
                    {feature.demo}
                  </div>
                </div>

                <Link 
                  href={feature.link}
                  className={`inline-flex items-center px-4 py-2 rounded-lg ${colors.button} text-sm font-medium transition-all duration-200 group-hover:shadow-md`}
                >
                  Try it now
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
            <Link href="/dashboard" className="flex items-center">
              Explore All Features
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 