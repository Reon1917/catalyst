'use client';

import CommandPalette from '@/components/ui/command-palette';
import { useCommandPalette } from '@/hooks/use-command-palette';

export default function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, close, commands } = useCommandPalette();

  return (
    <>
      {children}
      <CommandPalette 
        isOpen={isOpen} 
        onClose={close} 
        commands={commands} 
      />
    </>
  );
} 