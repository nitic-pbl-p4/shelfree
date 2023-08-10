'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { FC, ReactNode } from 'react';

type AppProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export const AppProvider: FC<AppProviderProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="data-theme">{children}</ThemeProvider>
  </QueryClientProvider>
);
