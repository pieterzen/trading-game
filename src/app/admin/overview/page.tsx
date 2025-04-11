'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useOptimizedGameContext } from '@/lib/OptimizedGameContext';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export default function GameOverview() {
  const { gameSession, calculatePriceOptimized, activeTradingPosts, totalInventory } = useOptimizedGameContext();
  const priceChartRef = useRef(null);
  const currencyChartRef = useRef(null);
  const stockChartRef = useRef(null);
  const priceChartInstance = useRef(null);
  const currencyChartInstance = useRef(null);
  const stockChartInstance = useRef(null);

  // Memoize colors to prevent regeneration on each render
  const itemColors = useMemo(() =>
    generateColors(gameSession.items.length),
    [gameSession.items.length]
  );

  const postColors = useMemo(() =>
    generateColors(gameSession.tradingPosts.length),
    [gameSession.tradingPosts.length]
  );

  // Generate random colors for chart - moved outside of render cycle
  function generateColors(count) {
    const colors = [];
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
      const data = gameSession.tradingPosts.map(post => calculatePriceOptimized(post.id, item.id));
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

  if (!gameSession.isActive) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Game Overview</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Start the game to see real-time data visualizations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Game Overview</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Real-time data visualizations of the trading game.
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
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
      </div>
    </div>
  );
}
