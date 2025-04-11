'use client';

import { GameProvider } from '@/lib/GameContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/LanguageContext';

function MainNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image 
            src="/scouting-nl-logo.svg" 
            alt="Nederlandse Scouting Logo" 
            width={40} 
            height={40} 
            className="mr-2"
          />
          <span className="text-xl font-bold">{t.tradingGame || 'Trading Game'}</span>
        </div>
        
        <div className="flex items-center gap-2 ml-8">
          <Link 
            href="/admin" 
            className={`px-4 py-2 rounded-md transition-colors ${
              isActive('/admin') 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            {t.admin || 'Admin'}
          </Link>
          <Link 
            href="/trading-post" 
            className={`px-4 py-2 rounded-md transition-colors ${
              isActive('/trading-post') 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            {t.tradingPosts || 'Trading Posts'}
          </Link>
        </div>
      </div>
      
      <LanguageSwitcher />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Trading Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LanguageProvider>
          <GameProvider>
            <div className="flex flex-col min-h-screen">
              <MainNavigation />
              <main className="flex-1 p-6">
                {children}
              </main>
              <div className="fixed bottom-6 right-6">
                <Image
                  src="/scouting-nl-logo.svg"
                  alt="Nederlandse Scouting Logo"
                  width={80}
                  height={80}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </GameProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
