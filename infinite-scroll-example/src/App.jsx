import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InfiniteScrollerSection from './InfiniteScrollerSection';
import TopSection from './TopSection';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <TopSection />
        <InfiniteScrollerSection />
      </div>
    </QueryClientProvider>
  );
}
