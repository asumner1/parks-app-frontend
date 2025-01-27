'use client';

import { createContext, useContext, useState, useEffect, ReactNode, cache } from 'react';
import { getAllAirports } from '@/lib/supabase';
import { AirportData } from '@/app/types/airports';

interface AirportContextType {
  airports: AirportData[];
  sortedAirports: AirportData[];
  loading: boolean;
  refreshAirports: () => Promise<void>;
}

const AirportContext = createContext<AirportContextType | undefined>(undefined);

export function AirportProvider({ children }: { children: ReactNode }) {
  const [airports, setAirports] = useState<AirportData[]>([]);
  const [sortedAirports, setSortedAirports] = useState<AirportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [getCachedAirports] = useState(() => cache(getAllAirports));

  const fetchAirports = async () => {
    try {
      setLoading(true);
      const data = await getCachedAirports();
      setAirports(data);
      setSortedAirports([...data].sort((a, b) => a.iata.localeCompare(b.iata)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const refreshAirports = async () => {
    cache(getAllAirports);
    await fetchAirports();
  };

  return (
    <AirportContext.Provider value={{ airports, sortedAirports, loading, refreshAirports }}>
      {children}
    </AirportContext.Provider>
  );
}

export function useAirports() {
  const context = useContext(AirportContext);
  if (context === undefined) {
    throw new Error('useAirports must be used within an AirportProvider');
  }
  return context;
} 