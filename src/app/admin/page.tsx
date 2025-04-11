'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { useOptimizedGameContext } from '@/lib/OptimizedGameContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Pencil, Trash2, Building2, BarChart3, Settings } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import Link from 'next/link';

// Register Chart.js components
if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

export default function AdminDashboard() {
  const { gameSession, startGame, resetGame, endGame, addItem, updateItem, removeItem, addTradingPost, updateTradingPost, removeTradingPost } = useGameContext();
  const { calculatePriceOptimized, activeTradingPosts, totalInventory } = useOptimizedGameContext();
  const { t } = useLanguage();

  // State for client-side rendering
  const [mounted, setMounted] = React.useState(false);
  const [formattedStartTime, setFormattedStartTime] = React.useState('Not set');
  const [formattedEndTime, setFormattedEndTime] = React.useState('Not set');

  // State for items management
  const [newItem, setNewItem] = React.useState({ name: '', basePrice: 0, description: '' });
  const [editingItem, setEditingItem] = React.useState<{ id: string, name: string, basePrice: number, description: string } | null>(null);

  // State for trading posts management
  const [newPost, setNewPost] = React.useState({ name: '', description: '' });
  const [editingPost, setEditingPost] = React.useState<{ id: string, name: string, description: string } | null>(null);

  // Chart refs
  const priceChartRef = useRef(null);
  const currencyChartRef = useRef(null);
  const stockChartRef = useRef(null);
  const priceChartInstance = useRef(null);
  const currencyChartInstance = useRef(null);
  const stockChartInstance = useRef(null);

  // Use useEffect to handle client-side date formatting
  React.useEffect(() => {
    // Mark as mounted to avoid hydration mismatch
    setMounted(true);

    // Only format dates on the client side to avoid hydration mismatch
    if (gameSession.startTime) {
      setFormattedStartTime(new Date(gameSession.startTime).toLocaleString());
    }

    if (gameSession.endTime) {
      setFormattedEndTime(new Date(gameSession.endTime).toLocaleString());
    }
  }, [gameSession.startTime, gameSession.endTime]);

  // Handlers for items management
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name && newItem.basePrice > 0) {
      addItem({
        id: Math.random().toString(36).substring(2, 9),
        name: newItem.name,
        basePrice: newItem.basePrice,
        description: newItem.description
      });
      setNewItem({ name: '', basePrice: 0, description: '' });
    }
  };

  const handleUpdateItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingItem && editingItem.name && editingItem.basePrice > 0) {
      updateItem(editingItem);
      setEditingItem(null);
    }
  };

  const handleRemoveItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeItem(id);
    }
  };

  // Handlers for trading posts management
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.name) {
      addTradingPost({
        id: Math.random().toString(36).substring(2, 9),
        name: newPost.name,
        description: newPost.description,
        isActive: true,
        inventory: {},
        currency: 100 // Default starting currency
      });
      setNewPost({ name: '', description: '' });
    }
  };

  const handleUpdatePost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingPost && editingPost.name) {
      const post = gameSession.tradingPosts.find(p => p.id === editingPost.id);
      if (post) {
        updateTradingPost({
          ...post,
          name: editingPost.name,
          description: editingPost.description
        });
      }
      setEditingPost(null);
    }
  };

  const handleRemovePost = (id: string) => {
    if (window.confirm('Are you sure you want to remove this trading post?')) {
      removeTradingPost(id);
    }
  };

  // Memoize colors to prevent regeneration on each render
  const itemColors = useMemo(() =>
    generateColors(gameSession.items.length),
    [gameSession.items.length]
  );

  const postColors = useMemo(() =>
    generateColors(gameSession.tradingPosts.length),
    [gameSession.tradingPosts.length]
  );

  // Generate random colors for chart
  function generateColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360; // Use golden angle approximation for good distribution
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  }

  // Memoize chart data to prevent recalculation on each render
  const priceChartData = useMemo(() => {
    if (!gameSession.isActive || gameSession.items.length === 0 || gameSession.tradingPosts.length === 0) {
      return null;
    }

    const labels = gameSession.tradingPosts.map(post => post.name);
    const datasets = gameSession.items.map((item, index) => {
      const data = gameSession.tradingPosts.map(post => {
        // Make sure post exists and has an inventory before calculating price
        if (!post || !post.inventory) return 0;
        return calculatePriceOptimized(post.id, item.id);
      });
      return {
        label: item.name,
        data,
        backgroundColor: itemColors[index],
        borderColor: itemColors[index],
        borderWidth: 1
      };
    });

    return { labels, datasets };
  }, [gameSession.isActive, gameSession.items, gameSession.tradingPosts, calculatePriceOptimized, itemColors]);

  // Memoize currency chart data
  const currencyChartData = useMemo(() => {
    if (!gameSession.isActive || gameSession.tradingPosts.length === 0) {
      return null;
    }

    const labels = gameSession.tradingPosts.map(post => post.name);
    const data = gameSession.tradingPosts.map(post => post.currency);

    return { labels, data };
  }, [gameSession.isActive, gameSession.tradingPosts]);

  // Memoize stock chart data
  const stockChartData = useMemo(() => {
    if (!gameSession.isActive || gameSession.items.length === 0 || gameSession.tradingPosts.length === 0) {
      return null;
    }

    const labels = gameSession.items.map(item => item.name);
    const datasets = gameSession.tradingPosts.map((post, index) => {
      const data = gameSession.items.map(item => {
        // Check if post.inventory exists before accessing it
        if (!post.inventory) return 0;
        const inventoryItem = post.inventory[item.id];
        return inventoryItem ? inventoryItem.quantity : 0;
      });
      return {
        label: post.name,
        data,
        backgroundColor: postColors[index],
        borderColor: postColors[index],
        borderWidth: 1
      };
    });

    return { labels, datasets };
  }, [gameSession.isActive, gameSession.items, gameSession.tradingPosts, postColors]);

  // Create and update price chart
  useEffect(() => {
    if (!priceChartData || !priceChartRef.current) return;

    // Destroy previous chart if it exists
    if (priceChartInstance.current) {
      priceChartInstance.current.destroy();
    }

    priceChartInstance.current = new Chart(priceChartRef.current, {
      type: 'bar',
      data: priceChartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Item Prices by Trading Post'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Price'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Trading Post'
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (priceChartInstance.current) {
        priceChartInstance.current.destroy();
      }
    };
  }, [priceChartData]);

  // Create and update currency chart
  useEffect(() => {
    if (!currencyChartData || !currencyChartRef.current) return;

    // Destroy previous chart if it exists
    if (currencyChartInstance.current) {
      currencyChartInstance.current.destroy();
    }

    currencyChartInstance.current = new Chart(currencyChartRef.current, {
      type: 'pie',
      data: {
        labels: currencyChartData.labels,
        datasets: [{
          data: currencyChartData.data,
          backgroundColor: postColors,
          borderColor: postColors.map(color => color.replace('60%', '50%')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Currency Distribution'
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (currencyChartInstance.current) {
        currencyChartInstance.current.destroy();
      }
    };
  }, [currencyChartData, postColors]);

  // Create and update stock chart
  useEffect(() => {
    if (!stockChartData || !stockChartRef.current) return;

    // Destroy previous chart if it exists
    if (stockChartInstance.current) {
      stockChartInstance.current.destroy();
    }

    stockChartInstance.current = new Chart(stockChartRef.current, {
      type: 'bar',
      data: stockChartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Stock Levels by Item'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantity'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Item'
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (stockChartInstance.current) {
        stockChartInstance.current.destroy();
      }
    };
  }, [stockChartData]);

  return (
    <div className="space-y-8">
      {/* Game Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Game Session</CardTitle>
          <CardDescription>Control the current game session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {!mounted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Loading...
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      gameSession.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {gameSession.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{formattedStartTime}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">End Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{formattedEndTime}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={startGame}
                disabled={gameSession.isActive}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${gameSession.isActive ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
              >
                Start Game
              </Button>
              <Button
                onClick={endGame}
                disabled={!gameSession.isActive}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${!gameSession.isActive ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
              >
                End Game
              </Button>
              <Button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset the game? This will clear all data.')) {
                    resetGame();
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Game
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Management */}
      <Card>
        <CardHeader>
          <CardTitle>Items Management</CardTitle>
          <CardDescription>Add, edit, or remove items that can be traded in the game</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="basePrice" className="text-sm font-medium">Base Price</label>
                <Input
                  type="number"
                  name="basePrice"
                  id="basePrice"
                  min="1"
                  step="1"
                  value={newItem.basePrice}
                  onChange={(e) => setNewItem({...newItem, basePrice: Math.floor(parseFloat(e.target.value))})}
                  required
                  onBlur={(e) => {
                    // Ensure the value is a whole number on blur
                    const value = Math.floor(parseFloat(e.target.value));
                    setNewItem({...newItem, basePrice: value});
                  }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="mt-2">
                Add Item
              </Button>
            </div>
          </form>



          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Current Items</h3>
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Base Price</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gameSession.items.map((item) => {
                    const isEditing = editingItem && editingItem.id === item.id;

                    return (
                      <tr key={item.id} className={`border-b ${isEditing ? 'bg-muted/30' : 'hover:bg-muted/50'}`}>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                              <Package className="h-4 w-4 text-primary" />
                            </div>
                            {isEditing ? (
                              <Input
                                type="text"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                className="h-8 w-full max-w-[200px]"
                                required
                              />
                            ) : (
                              <span className="font-medium">{item.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isEditing ? (
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              value={editingItem.basePrice}
                              onChange={(e) => setEditingItem({...editingItem, basePrice: Math.floor(parseFloat(e.target.value))})}
                              className="h-8 w-24"
                              required
                              onBlur={(e) => {
                                // Ensure the value is a whole number on blur
                                const value = Math.floor(parseFloat(e.target.value));
                                setEditingItem({...editingItem, basePrice: value});
                              }}
                            />
                          ) : (
                            item.basePrice
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editingItem.description}
                              onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                              className="h-8 w-full"
                            />
                          ) : (
                            item.description
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (editingItem.name && editingItem.basePrice > 0) {
                                      handleUpdateItem();
                                    } else {
                                      setEditingItem(null);
                                    }
                                  }}
                                >
                                  Done
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingItem({
                                    id: item.id,
                                    name: item.name,
                                    basePrice: item.basePrice,
                                    description: item.description || ''
                                  })}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {gameSession.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Package className="h-8 w-8 text-muted-foreground/50" />
                          <p>No items added yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Posts Management */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Posts Management</CardTitle>
          <CardDescription>Create and manage trading posts in the game</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPost} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="post-name" className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  name="post-name"
                  id="post-name"
                  value={newPost.name}
                  onChange={(e) => setNewPost({...newPost, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="post-description" className="text-sm font-medium">Description</label>
                <Input
                  type="text"
                  name="post-description"
                  id="post-description"
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="mt-2">
                Add Trading Post
              </Button>
            </div>
          </form>



          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Current Trading Posts</h3>
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gameSession.tradingPosts.map((post) => {
                    const isEditing = editingPost && editingPost.id === post.id;

                    return (
                      <tr key={post.id} className={`border-b ${isEditing ? 'bg-muted/30' : 'hover:bg-muted/50'}`}>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            {isEditing ? (
                              <Input
                                type="text"
                                value={editingPost.name}
                                onChange={(e) => setEditingPost({...editingPost, name: e.target.value})}
                                className="h-8 w-full max-w-[200px]"
                                required
                              />
                            ) : (
                              <span className="font-medium">{post.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editingPost.description}
                              onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                              className="h-8 w-full"
                            />
                          ) : (
                            post.description
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (editingPost.name) {
                                      handleUpdatePost();
                                    } else {
                                      setEditingPost(null);
                                    }
                                  }}
                                >
                                  Done
                                </Button>
                              </>
                            ) : (
                              <>
                                <Link href={`/trading-post/${post.id}`}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                  >
                                    Manage
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingPost({
                                    id: post.id,
                                    name: post.name,
                                    description: post.description || ''
                                  })}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive"
                                  onClick={() => handleRemovePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {gameSession.tradingPosts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Building2 className="h-8 w-8 text-muted-foreground/50" />
                          <p>No trading posts added yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Overview */}
      {gameSession.isActive && (
        <Card>
          <CardHeader>
            <CardTitle>Game Overview</CardTitle>
            <CardDescription>Real-time data visualizations of the trading game</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="h-64">
                  <canvas ref={priceChartRef}></canvas>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="h-64">
                  <canvas ref={currencyChartRef}></canvas>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm lg:col-span-2">
                <div className="h-64">
                  <canvas ref={stockChartRef}></canvas>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
