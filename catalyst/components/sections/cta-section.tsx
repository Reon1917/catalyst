"use client";

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Ready to transform your marketing?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Join thousands of marketers who trust Catalyst to drive their campaign success.
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