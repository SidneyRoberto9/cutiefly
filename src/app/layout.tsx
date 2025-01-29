import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

import type { Metadata } from 'next';
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cutiefly',
  description: 'Shortener URLs',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={cn('bg-background text-foreground antialiased', inter.className)}>
        {children}
      </body>
    </html>
  );
}
