'use client';

import React from 'react';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { gameSession } = useGameContext();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex h-16 items-center gap-4 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">{t.setup || 'Setup'}</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <GameStatusBadge isActive={gameSession.isActive} t={t} />
          </div>
        </div>
      </div>
      <div className="p-6 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}

// Separate component to handle client-side rendering of status
function GameStatusBadge({ isActive, t }: { isActive: boolean, t: any }) {
  // Use state to ensure consistent rendering between server and client
  const [mounted, setMounted] = React.useState(false);

  // Only show the actual status after client-side hydration is complete
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // During server rendering and initial client render, show a neutral state
  if (!mounted) {
    return (
      <Badge variant="secondary">Loading...</Badge>
    );
  }

  // After hydration, show the actual status
  return (
    <Badge variant={isActive ? "success" : "secondary"}>
      {isActive ? t.gameActive || 'Game Active' : t.gameInactive || 'Game Inactive'}
    </Badge>
  );
}
