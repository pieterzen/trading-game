'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, Settings, Users, Building } from 'lucide-react';
import { useGameContext } from '@/lib/GameContext';
import { useLanguage } from '@/lib/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

export function Navigation() {
  const pathname = usePathname();
  const { gameSession } = useGameContext();
  const { t } = useLanguage();

  // Check if we're on any admin page
  const isAdminPage = pathname.startsWith('/admin');

  const navItems: NavItem[] = [
    { name: t.home || 'Home', href: '/', icon: <Home /> },
    { name: t.tradingPosts || 'Trading Posts', href: '/trading-post', icon: <ShoppingCart /> },
    { name: t.admin || 'Admin', href: '/admin', icon: <Settings />, adminOnly: true },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Image src="/scouting-nl-logo.svg" alt="Nederlandse Scouting Logo" width={24} height={24} />
          </div>
          <div className="font-semibold">{t.tradingGame || 'Trading Game'}</div>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground px-2 py-1">{t.navigation || 'Navigation'}</div>
        <nav className="flex flex-col gap-1">
          {navItems
            .filter(item => !item.adminOnly || gameSession.isAdmin)
            .map(item => {
              const isActive = 
                pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
                
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="size-5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>{item.name}</div>
                </Link>
              );
            })}
        </nav>
      </div>

      {gameSession.isActive && (
        <div className="mt-auto">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Users size={18} />
              </div>
              <div>
                <div className="text-sm font-medium">{t.gameStatus || 'Game Status'}</div>
                <div className="text-xs text-muted-foreground">{t.gameActive || 'Game Active'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
