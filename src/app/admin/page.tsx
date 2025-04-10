'use client';

import React from 'react';
import { useGameContext } from '@/lib/GameContext';

export default function AdminDashboard() {
  const { gameSession, startGame, resetGame, endGame } = useGameContext();
  
  const formattedTime = (date: Date | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Game Session Control</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Manage the current game session and view real-time status.
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Session Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{gameSession.name}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                gameSession.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {gameSession.isActive ? 'Active' : 'Inactive'}
              </span>
            </dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Start Time</dt>
            <dd className="mt-1 text-sm text-gray-900">{formattedTime(gameSession.startTime)}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">End Time</dt>
            <dd className="mt-1 text-sm text-gray-900">{formattedTime(gameSession.endTime)}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Items</dt>
            <dd className="mt-1 text-sm text-gray-900">{gameSession.items.length}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Trading Posts</dt>
            <dd className="mt-1 text-sm text-gray-900">{gameSession.tradingPosts.length}</dd>
          </div>
        </dl>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="flex space-x-4">
          <button
            onClick={startGame}
            disabled={gameSession.isActive}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              gameSession.isActive 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            Start Game
          </button>
          
          <button
            onClick={endGame}
            disabled={!gameSession.isActive}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              !gameSession.isActive 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
            }`}
          >
            End Game
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset the game? This will clear all data.')) {
                resetGame();
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset Game
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Real-time Overview</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {gameSession.isActive 
            ? 'Current stock and prices for each trading post.' 
            : 'Start the game to see real-time data.'}
        </p>
        
        {gameSession.isActive && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Trading Posts Status</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {gameSession.tradingPosts.map((post) => (
                <div key={post.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h5 className="font-medium text-gray-900">{post.name}</h5>
                  <p className="text-sm text-gray-500 mb-2">{post.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Currency:</span>
                    <span className="text-sm font-medium text-yellow-600">{post.currency} coins</span>
                  </div>
                  <div className="mt-2">
                    <h6 className="text-xs font-medium text-gray-500 mb-1">Inventory:</h6>
                    <ul className="space-y-1">
                      {Object.keys(post.inventory).length > 0 ? (
                        Object.entries(post.inventory).map(([itemId, item]) => (
                          <li key={itemId} className="text-xs flex justify-between">
                            <span>{item.name}</span>
                            <span>{item.quantity} units</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-xs text-gray-400">No items in inventory</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
