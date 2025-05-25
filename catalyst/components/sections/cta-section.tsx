"use client";

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <div className="mb-8">
          <img 
            src="/branding/logo-only.png" 
            alt="Catalyst Logo" 
            className="h-16 w-16 mx-auto mb-6 opacity-80"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Experience Enterprise-Level Marketing Tools
        </h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
          From command palette navigation to advanced analytics - discover why Catalyst is the 
          sophisticated choice for modern marketing teams.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/dashboard"
            className="btn-primary inline-flex items-center px-8 py-3 text-lg group"
          >
            Get Started Today
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          
          <Link 
            href="/campaigns/new"
            className="btn-secondary px-8 py-3 text-lg"
          >
            Create Campaign
          </Link>
        </div>
      </div>
    </section>
  );
} 