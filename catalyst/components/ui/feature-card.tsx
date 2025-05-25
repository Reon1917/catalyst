"use client";

import { useState, useEffect } from 'react';
import { BackgroundGradient } from './background-gradient';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <BackgroundGradient className="rounded-[22px] p-4 sm:p-10">
      <div className={`bg-card rounded-2xl p-6 transition-all duration-700 transform ${
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
    </BackgroundGradient>
  );
} 