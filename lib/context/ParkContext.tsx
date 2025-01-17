'use client';

import { createContext, useContext, useState, useEffect, ReactNode, cache } from 'react';
import { ParkData } from '@/app/types/parks';
import { getAllParks } from '@/lib/supabase';

interface ParkContextType {
  parks: ParkData[];
  sortedParks: ParkData[];
  loading: boolean;
}

const ParkContext = createContext<ParkContextType | undefined>(undefined);

const getCachedParks = cache(async () => {
  return await getAllParks();
});

export function ParkProvider({ children }: { children: ReactNode }) {
  const [parks, setParks] = useState<ParkData[]>([]);
  const [sortedParks, setSortedParks] = useState<ParkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCachedParks().then(data => {
      setParks(data);
      setSortedParks([...data].sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching parks:', error);
      setLoading(false);
    });
  }, []);

  return (
    <ParkContext.Provider value={{ parks, sortedParks, loading }}>
      {children}
    </ParkContext.Provider>
  );
}

export function useParks() {
  const context = useContext(ParkContext);
  if (context === undefined) {
    throw new Error('useParks must be used within a ParkProvider');
  }
  return context;
} 