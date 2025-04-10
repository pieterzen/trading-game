'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Trading Game
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          A game of trading, stock management, and price fluctuations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <Link 
                href="/admin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Admin Dashboard
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                Manage game sessions, items, and trading posts
              </p>
            </div>
            
            <div>
              <Link 
                href="/trading-post"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Trading Post View
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                Manage inventory and currency at trading posts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
