'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/" className="inline-flex items-center gap-1">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
