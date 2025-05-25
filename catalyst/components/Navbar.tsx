/**
 * Navigation component for the Marketing Campaign Planner
 * Provides links to main sections of the application with theme support
 */

import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-foreground hover:text-foreground/80 transition-colors"
            >
              <span className="text-gradient">Catalyst</span>
            </Link>
            <span className="ml-2 text-sm text-muted-foreground hidden sm:inline">
              Marketing Campaign Planner
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent"
            >
              Dashboard
            </Link>
            <Link 
              href="/campaigns/new" 
              className="btn-primary px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
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