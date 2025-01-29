import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { SITE_CONFIG } from '@/config';
import { cn } from '@/lib/utils';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata = SITE_CONFIG

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={cn('bg-background text-foreground antialiased', inter.className)}>
        {children}
      </body>
    </html>
  );
}
