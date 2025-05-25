'use client';

/**
 * ThemeSwitcher Component - Modern toggle between light and dark modes
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
      <div 
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: 'var(--muted)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
    );
  }

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '10px',
        borderRadius: '12px',
        backgroundColor: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--foreground)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent)';
        e.currentTarget.style.borderColor = 'rgb(59 130 246 / 0.3)';
        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon style={{ width: '20px', height: '20px' }} />
      ) : (
        <SunIcon style={{ width: '20px', height: '20px' }} />
      )}
    </button>
  );
};

export default ThemeSwitcher; 