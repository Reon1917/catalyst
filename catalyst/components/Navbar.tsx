/**
 * Navigation component for the Marketing Campaign Planner
 * Modern design with smooth borders and refined interactions
 */

import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  return (
    <nav className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-semibold text-foreground hover:text-primary transition-colors duration-200"
            >
              Catalyst
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-accent/50"
            >
              Dashboard
            </Link>
            <Link 
              href="/campaigns/new" 
              className="btn-primary text-sm"
            >
              New Campaign
            </Link>
            
            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
} 