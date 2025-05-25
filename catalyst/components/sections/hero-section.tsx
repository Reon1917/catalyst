"use client";

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        {/* Modern badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-xl border border-border/50 bg-muted/30 text-sm text-muted-foreground mb-8 backdrop-blur-sm">
          Marketing Campaign Planner
        </div>

        {/* Clean headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-6 leading-tight animate-slide-up">
          Craft, Manage, and Analyze Marketing Campaigns
        </h1>

        {/* Simple description */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
          Plan your marketing strategies, define target audiences, allocate budgets, and simulate campaign results all in one place.
        </p>

        {/* Modern CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Link 
            href="/dashboard"
            className="btn-primary inline-flex items-center px-8 py-3 text-lg group"
          >
            Get Started
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link 
            href="/campaigns/new"
            className="btn-secondary px-8 py-3 text-lg"
          >
            Create Campaign
          </Link>
        </div>

        {/* Modern stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-scale-in" style={{animationDelay: '0.3s'}}>
          <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30 backdrop-blur-sm">
            <div className="text-3xl font-semibold text-foreground mb-1">5+</div>
            <div className="text-sm text-muted-foreground">Campaign Types</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30 backdrop-blur-sm">
            <div className="text-3xl font-semibold text-foreground mb-1">8+</div>
            <div className="text-sm text-muted-foreground">Marketing Channels</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30 backdrop-blur-sm">
            <div className="text-3xl font-semibold text-foreground mb-1">10+</div>
            <div className="text-sm text-muted-foreground">Simulation Metrics</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30 backdrop-blur-sm">
            <div className="text-3xl font-semibold text-foreground mb-1">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
} 