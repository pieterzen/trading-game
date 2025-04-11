'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'en' ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8 p-1 rounded-md"
        onClick={() => setLanguage('en')}
      >
        <Image
          src="/flags/gb.svg"
          alt="English"
          width={24}
          height={24}
          className="rounded-sm"
        />
      </Button>

      <Button
        variant={language === 'nl' ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8 p-1 rounded-md"
        onClick={() => setLanguage('nl')}
      >
        <Image
          src="/flags/nl.svg"
          alt="Nederlands"
          width={24}
          height={24}
          className="rounded-sm"
        />
      </Button>
    </div>
  );
}
