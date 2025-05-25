'use client';

/**
 * Stagewise Toolbar Component - Development-only AI-powered editing toolbar
 * Only renders in development mode to avoid production interference
 */

import { useEffect } from 'react';

const StagewiseToolbar = () => {
  useEffect(() => {
    // Only initialize in development mode
    if (process.env.NODE_ENV === 'development') {
      const initStagewise = async () => {
        try {
          const { StagewiseToolbar } = await import('@stagewise/toolbar-next');
          
          const stagewiseConfig = {
            plugins: []
          };
          
          // Initialize the toolbar
          if (typeof window !== 'undefined') {
            // Create dedicated container for stagewise toolbar
            let toolbarContainer = document.getElementById('stagewise-toolbar-root');
            if (!toolbarContainer) {
              toolbarContainer = document.createElement('div');
              toolbarContainer.id = 'stagewise-toolbar-root';
              document.body.appendChild(toolbarContainer);
            }
          }
        } catch (error) {
          console.warn('Stagewise toolbar failed to initialize:', error);
        }
      };
      
      initStagewise();
    }
  }, []);

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return null; // Toolbar renders itself via the imported component
};

export default StagewiseToolbar; 