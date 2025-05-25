"use client";

import { ArrowRightIcon, CommandLineIcon, ChartBarIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20"></div>
      
      <div className="max-w-6xl mx-auto text-center animate-fade-in relative z-10">
        {/* Logo */}
        <div className="mb-8 animate-scale-in">
          <img 
            src="/branding/logo-only.png" 
            alt="Catalyst Logo" 
            className="h-20 w-20 mx-auto mb-4 drop-shadow-lg"
          />
        </div>

        {/* Modern badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-xl border border-border/50 bg-muted/30 text-sm text-muted-foreground mb-8 backdrop-blur-sm">
          <RocketLaunchIcon className="w-4 h-4 mr-2" />
          Advanced Marketing Campaign Platform
        </div>

        {/* Clean headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-6 leading-tight animate-slide-up">
          Launch Campaigns with
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
            Precision & Power
          </span>
        </h1>

        {/* Simple description */}
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
          From command palette shortcuts to drag-and-drop kanban boards, advanced analytics to intelligent forms - 
          everything you need to plan, execute, and optimize marketing campaigns.
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

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-scale-in" style={{animationDelay: '0.3s'}}>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CommandLineIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-lg font-semibold text-foreground mb-2">Command Palette</div>
            <div className="text-sm text-muted-foreground">Navigate instantly with ⌘K shortcuts and fuzzy search</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-lg font-semibold text-foreground mb-2">Advanced Analytics</div>
            <div className="text-sm text-muted-foreground">Real-time insights with interactive charts and metrics</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RocketLaunchIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-lg font-semibold text-foreground mb-2">Drag & Drop Board</div>
            <div className="text-sm text-muted-foreground">Kanban-style workflow with smooth animations</div>
          </div>
        </div>
      </div>
    </section>
  );
} 