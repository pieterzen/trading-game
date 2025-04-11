'use client';

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';
import { ArrowDown, ArrowUp, Coins, Package, Plus, Minus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

// Optimized version of the trading post detail page
export default function TradingPostDetail({ params }: { params: { id: string } }) {
  // In this version of Next.js, we can access params directly
  const postId = params.id;

  const { gameSession, updateInventory, updateCurrency, calculatePrice } = useGameContext();
  const { t } = useLanguage();

  // State for adding new items
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<number>(1);

  // Chart references
  const priceHistoryChartRef = useRef<HTMLCanvasElement>(null);
  const stockDistributionChartRef = useRef<HTMLCanvasElement>(null);
  const priceHistoryChartInstance = useRef<Chart | null>(null);
  const stockDistributionChartInstance = useRef<Chart | null>(null);

  // Memoize the current post to prevent unnecessary recalculations
  const post = useMemo(() =>
    gameSession.tradingPosts.find(p => p.id === postId),
    [gameSession.tradingPosts, postId]
  );

  // Memoize the available items
  const availableItems = useMemo(() =>
    gameSession.items,
    [gameSession.items]
  );

  // Memoize inventory items with calculated prices
  const inventoryWithPrices = useMemo(() => {
    if (!post) return [];

    return Object.entries(post.inventory).map(([itemId, item]) => {
      const currentPrice = calculatePrice(post.id, itemId);
      return {
        ...item,
        currentPrice
      };
    });
  }, [post, calculatePrice]);

  // State for manual currency adjustment
  const [manualCurrencyAmount, setManualCurrencyAmount] = useState<number>(0);

  // Memoize the currency update handler
  const handleUpdateCurrency = useCallback((amount: number) => {
    if (!post) return;
    updateCurrency(post.id, amount);
  }, [post, updateCurrency]);

  // Handle manual currency adjustment
  const handleAddManualCurrency = useCallback(() => {
    if (!post || manualCurrencyAmount === 0) return;
    updateCurrency(post.id, post.currency + manualCurrencyAmount);
    setManualCurrencyAmount(0);
  }, [post, manualCurrencyAmount, updateCurrency]);

  // Generate random colors for chart
  const generateColors = useCallback((count: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360; // Use golden angle approximation for good distribution
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  }, []);

  // Memoize stock distribution chart data
  const stockDistributionData = useMemo(() => {
    if (!post) return null;

    const inventoryItems = Object.values(post.inventory);
    if (inventoryItems.length === 0) return null;

    const labels = inventoryItems.map(item => item.name);
    const data = inventoryItems.map(item => item.quantity);
    const colors = generateColors(inventoryItems.length);

    return { labels, data, colors };
  }, [post, generateColors]);

  // Memoize price history data (simulated for demo)
  const priceHistoryData = useMemo(() => {
    if (!post) return null;

    const inventoryItems = Object.values(post.inventory);
    if (inventoryItems.length === 0) return null;

    // Generate some sample data points for the last 7 days
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString();
    });

    // Generate random price history for each item
    const datasets = inventoryItems.slice(0, 5).map((item, index) => {
      const basePrice = item.basePrice;
      const data = Array.from({ length: 7 }, () => {
        return Math.round(basePrice * (0.8 + Math.random() * 0.4)); // Random fluctuation between 80% and 120%
      });

      return {
        label: item.name,
        data,
        borderColor: generateColors(1)[0],
        fill: false,
        tension: 0.1
      };
    });

    return { labels, datasets };
  }, [post, generateColors]);

  // Memoize the inventory update handler
  const handleUpdateInventory = useCallback((itemId: string, quantity: number) => {
    if (!post) return;
    updateInventory(post.id, itemId, quantity);
  }, [post, updateInventory]);

  // Handler for adding a new item to inventory
  const handleAddItem = useCallback(() => {
    if (!post || !selectedItemId) return;

    const item = availableItems.find(i => i.id === selectedItemId);
    if (!item) return;

    // Get current quantity if item already exists in inventory
    const currentQuantity = post.inventory[selectedItemId]?.quantity || 0;
    updateInventory(post.id, selectedItemId, currentQuantity + itemQuantity);

    // Reset selection
    setSelectedItemId('');
    setItemQuantity(1);
  }, [post, selectedItemId, itemQuantity, availableItems, updateInventory]);

  // Create and update stock distribution chart
  useEffect(() => {
    if (!stockDistributionData || !stockDistributionChartRef.current) return;

    // Destroy previous chart if it exists
    if (stockDistributionChartInstance.current) {
      stockDistributionChartInstance.current.destroy();
    }

    stockDistributionChartInstance.current = new Chart(stockDistributionChartRef.current, {
      type: 'pie',
      data: {
        labels: stockDistributionData.labels,
        datasets: [{
          data: stockDistributionData.data,
          backgroundColor: stockDistributionData.colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: t.stockDistribution || 'Stock Distribution'
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (stockDistributionChartInstance.current) {
        stockDistributionChartInstance.current.destroy();
      }
    };
  }, [stockDistributionData, t]);

  // Create and update price history chart
  useEffect(() => {
    if (!priceHistoryData || !priceHistoryChartRef.current) return;

    // Destroy previous chart if it exists
    if (priceHistoryChartInstance.current) {
      priceHistoryChartInstance.current.destroy();
    }

    priceHistoryChartInstance.current = new Chart(priceHistoryChartRef.current, {
      type: 'line',
      data: {
        labels: priceHistoryData.labels,
        datasets: priceHistoryData.datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: t.priceHistory || 'Price History'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: t.price || 'Price'
            }
          },
          x: {
            title: {
              display: true,
              text: t.date || 'Date'
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (priceHistoryChartInstance.current) {
        priceHistoryChartInstance.current.destroy();
      }
    };
  }, [priceHistoryData, t]);

  // Early return if post not found
  if (!post) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">{t.tradingPostView} not found</h3>
            <p className="text-sm text-muted-foreground">The requested trading post could not be found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{post.name}</h1>
        <p className="text-muted-foreground">
          {post.description || t.tradingPostView || 'Trading Post Details'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.currency || 'Currency'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold">{post.currency}</span>
              </div>

              {gameSession.isActive && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleUpdateCurrency(post.currency + 1)}
                        disabled={!gameSession.isActive}
                      >
                        +1
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleUpdateCurrency(post.currency + 5)}
                        disabled={!gameSession.isActive}
                      >
                        +5
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleUpdateCurrency(post.currency + 10)}
                        disabled={!gameSession.isActive}
                      >
                        +10
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleUpdateCurrency(Math.max(0, post.currency - 1))}
                        disabled={!gameSession.isActive || post.currency < 1}
                      >
                        -1
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleUpdateCurrency(Math.max(0, post.currency - 5))}
                        disabled={!gameSession.isActive || post.currency < 5}
                      >
                        -5
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleUpdateCurrency(Math.max(0, post.currency - 10))}
                        disabled={!gameSession.isActive || post.currency < 10}
                      >
                        -10
                      </Button>
                    </div>
                  </div>

                  {/* Manual Currency Adjustment */}
                  <div className="mt-2 border-t pt-2">
                    <div className="text-xs font-medium mb-1">{t.manualCurrencyAdjustment || 'Manual Adjustment'}</div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={manualCurrencyAmount}
                        onChange={(e) => setManualCurrencyAmount(parseInt(e.target.value) || 0)}
                        className="h-7 text-xs"
                        placeholder="+/- amount"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs whitespace-nowrap"
                        onClick={handleAddManualCurrency}
                        disabled={!gameSession.isActive || manualCurrencyAmount === 0}
                      >
                        {manualCurrencyAmount > 0 ? 'Add' : manualCurrencyAmount < 0 ? 'Remove' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.totalItems || 'Total Items'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{inventoryWithPrices.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {post.inventory && Object.keys(post.inventory).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.priceHistory || 'Price History'}</CardTitle>
              <CardDescription>{t.priceHistoryDesc || 'Price trends over the last 7 days'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <canvas ref={priceHistoryChartRef}></canvas>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.stockDistribution || 'Stock Distribution'}</CardTitle>
              <CardDescription>{t.stockDistributionDesc || 'Current inventory breakdown'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <canvas ref={stockDistributionChartRef}></canvas>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.currentInventory || 'Current Inventory'}</CardTitle>
          {gameSession.isActive && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Item to Inventory</DialogTitle>
                  <DialogDescription>Select an item and quantity to add to this trading post.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item</label>
                    <Select
                      value={selectedItemId}
                      onValueChange={setSelectedItemId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems.map(item => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                        className="w-full text-center"
                      />
                      <div className="flex items-center justify-between gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setItemQuantity(1)}
                        >
                          1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setItemQuantity(5)}
                        >
                          5
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setItemQuantity(10)}
                        >
                          10
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setItemQuantity(itemQuantity + 1)}
                        >
                          +1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setItemQuantity(itemQuantity + 5)}
                        >
                          +5
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setItemQuantity(itemQuantity + 10)}
                        >
                          +10
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddItem} disabled={!selectedItemId}>
                    Add to Inventory
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.item || 'Item'}</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.quantity || 'Quantity'}</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.basePrice || 'Base Price'}</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.currentPrice || 'Current Price'}</th>
                  {gameSession.isActive && (
                    <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.actions || 'Actions'}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {inventoryWithPrices.length > 0 ? (
                  inventoryWithPrices.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{item.quantity}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{item.basePrice}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {item.currentPrice > item.basePrice ? (
                            <ArrowUp className="h-3 w-3 text-green-600" />
                          ) : item.currentPrice < item.basePrice ? (
                            <ArrowDown className="h-3 w-3 text-red-600" />
                          ) : null}
                          <span className={`${item.currentPrice > item.basePrice ? 'text-green-600' : item.currentPrice < item.basePrice ? 'text-red-600' : ''}`}>
                            {item.currentPrice}
                          </span>
                        </div>
                      </td>
                      {gameSession.isActive && (
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <div className="flex items-center gap-1 mr-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleUpdateInventory(item.id, item.quantity + 1)}
                              >
                                +1
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleUpdateInventory(item.id, item.quantity + 5)}
                              >
                                +5
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleUpdateInventory(item.id, item.quantity + 10)}
                              >
                                +10
                              </Button>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleUpdateInventory(item.id, Math.max(0, item.quantity - 1))}
                                disabled={item.quantity < 1}
                              >
                                -1
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleUpdateInventory(item.id, Math.max(0, item.quantity - 5))}
                                disabled={item.quantity < 5}
                              >
                                -5
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleUpdateInventory(item.id, Math.max(0, item.quantity - 10))}
                                disabled={item.quantity < 10}
                              >
                                -10
                              </Button>
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={gameSession.isActive ? 5 : 4} className="py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                        <p>{t.noItems || 'No items in inventory'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
