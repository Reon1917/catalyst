/**
 * Navigation component for the Marketing Campaign Planner
 * Modern design with smooth borders and refined interactions
 */

import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  return (
    <nav className="bg-background/95 backdrop-blur-xl border-b border-border/30 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-foreground hover:text-primary transition-all duration-300 hover:scale-105"
            >
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Catalyst
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-200 px-4 py-2 rounded-xl hover:bg-accent/60 hover:shadow-sm"
            >
              Dashboard
            </Link>
            <Link 
              href="/analytics" 
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-200 px-4 py-2 rounded-xl hover:bg-accent/60 hover:shadow-sm"
            >
              Analytics
            </Link>
            <Link 
              href="/campaigns/board" 
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-200 px-4 py-2 rounded-xl hover:bg-accent/60 hover:shadow-sm"
            >
              Board
            </Link>
            <Link 
              href="/campaigns/new" 
              className="btn-primary text-sm font-medium px-5 py-2.5 hover:shadow-lg transition-all duration-200"
            >
              + New Campaign
            </Link>
            
            {/* Theme Switcher */}
            <div className="ml-2">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 