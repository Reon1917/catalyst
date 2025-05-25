'use client';

/**
 * ThemeSwitcher Component - Toggle between light and dark modes
 * Handles theme persistence and system preference detection
 */

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setMounted(true);
    
    // Check for stored theme preference or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply theme to document
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Persist theme preference
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
    );
  }

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-card hover:bg-accent transition-all duration-200 border border-border shadow-sm hover:shadow-md group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <SunIcon 
          className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-75'
          }`}
        />
        
        {/* Moon Icon */}
        <MoonIcon 
          className={`absolute inset-0 w-6 h-6 text-slate-700 dark:text-slate-300 transition-all duration-300 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
          }`}
        />
      </div>
      
      {/* Tooltip-like indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded border shadow-md whitespace-nowrap">
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </div>
      </div>
    </button>
  );
};

export default ThemeSwitcher; 