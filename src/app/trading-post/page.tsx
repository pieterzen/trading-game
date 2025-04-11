'use client';

import React, { useState } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import { Building2, Coins, Package, Plus, Save, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function TradingPostSelection() {
  const { gameSession, updateCurrency } = useGameContext();
  const { t } = useLanguage();

  // State for tracking which post's currency is being edited
  const [editingCurrency, setEditingCurrency] = useState<string | null>(null);
  const [currencyValue, setCurrencyValue] = useState<number>(0);

  // Handle starting to edit currency
  const handleEditCurrency = (postId: string, currentValue: number) => {
    setEditingCurrency(postId);
    setCurrencyValue(currentValue);
  };

  // Handle saving currency
  const handleSaveCurrency = (postId: string) => {
    if (currencyValue >= 0) {
      updateCurrency(postId, currencyValue);
    }
    setEditingCurrency(null);
  };

  // Handle input blur (save on blur)
  const handleInputBlur = (postId: string) => {
    handleSaveCurrency(postId);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.selectPost || 'Trading Posts'}</h1>
        <p className="text-muted-foreground">
          {t.manageInventory || 'Select a trading post to manage inventory and currency'}
        </p>
      </div>

      {gameSession.tradingPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gameSession.tradingPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{post.name}</CardTitle>
                  </div>
                  <Badge variant={post.isActive ? "success" : "secondary"}>
                    {post.isActive ? t.gameActive || 'Active' : t.gameInactive || 'Inactive'}
                  </Badge>
                </div>
                <CardDescription className="mt-2">{post.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 rounded-lg border p-3">
                    <span className="text-xs font-medium text-muted-foreground">{t.currency || 'Currency'}</span>
                    {editingCurrency === post.id ? (
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-amber-500" />
                        <Input
                          type="number"
                          value={currencyValue}
                          onChange={(e) => setCurrencyValue(parseInt(e.target.value) || 0)}
                          onBlur={() => handleInputBlur(post.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveCurrency(post.id)}
                          className="h-7 w-20 text-sm"
                          min="0"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                        onClick={() => gameSession.isActive && handleEditCurrency(post.id, post.currency)}
                      >
                        <Coins className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">{post.currency}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border p-3">
                    <span className="text-xs font-medium text-muted-foreground">{t.items || 'Items'}</span>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="font-medium">{Object.keys(post.inventory).length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/trading-post/${post.id}`}>
                    {t.manageCurrency || 'Manage Trading Post'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No trading posts available</h3>
                <p className="text-sm text-muted-foreground">Create trading posts to start managing inventory</p>
              </div>
              <Button asChild className="mt-2">
                <Link href="/admin/trading-posts" className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Trading Posts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
