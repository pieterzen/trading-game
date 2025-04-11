'use client';

import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import { ArrowLeft, Building2, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TradingPostDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // In this version of Next.js, we can access params directly
  const postId = params.id;

  const { gameSession } = useGameContext();
  const { t } = useLanguage();

  // Find the current trading post
  const post = gameSession.tradingPosts.find(p => p.id === postId);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-2 mb-1"
          >
            <Link href="/trading-post" className="inline-flex items-center gap-1">
              <ArrowLeft size={16} />
              {t.backToList || 'Back to Trading Posts'}
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {post?.name || 'Trading Post'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {post?.description || 'Trading location'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {post && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <Coins size={16} className="text-amber-500" />
              <span className="font-medium">{post.currency}</span>
              <span className="text-sm text-muted-foreground">coins</span>
            </div>
          )}

          <PostStatusBadge isActive={post?.isActive} t={t} />
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        {children}
      </div>
    </div>
  );
}

// Separate component to handle client-side rendering of status
function PostStatusBadge({ isActive, t }: { isActive?: boolean, t: any }) {
  // Use state to ensure consistent rendering between server and client
  const [mounted, setMounted] = useState(false);

  // Only show the actual status after client-side hydration is complete
  useEffect(() => {
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
      {isActive ? t.postActive || 'Active' : t.postInactive || 'Inactive'}
    </Badge>
  );
}
