'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="relative inline-block text-left">
      <div>
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label={t.selectLanguage}
        >
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>
      </div>
    </div>
  );
}
