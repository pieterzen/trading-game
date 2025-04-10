'use client';

import { GameProvider } from '@/lib/GameContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
