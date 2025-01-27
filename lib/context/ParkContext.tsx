'use client';

import { createContext, useContext, useState, useEffect, ReactNode, cache } from 'react';
import { ParkData } from '@/app/types/parks';
import { getAllParks } from '@/lib/supabase';

interface ParkContextType {
  parks: ParkData[];
  sortedParks: ParkData[];
  loading: boolean;
  refreshParks: () => Promise<void>;
}

const ParkContext = createContext<ParkContextType | undefined>(undefined);

export function ParkProvider({ children }: { children: ReactNode }) {
  const [parks, setParks] = useState<ParkData[]>([]);
  const [sortedParks, setSortedParks] = useState<ParkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [getCachedParks] = useState(() => cache(getAllParks));

  const fetchParks = async () => {
    try {
      setLoading(true);
      const data = await getCachedParks();
      setParks(data);
      setSortedParks([...data].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error fetching parks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParks();
  }, []);

  const refreshParks = async () => {
    const freshCachedParks = cache(getAllParks);
    await fetchParks();
  };

  return (
    <ParkContext.Provider value={{ parks, sortedParks, loading, refreshParks }}>
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