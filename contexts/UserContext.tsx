'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getVisitedParks, addVisitedPark, removeVisitedPark } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

interface UserContextType {
  visitedParks: string[];
  toggleVisitedPark: (parkId: string) => Promise<void>;
  isVisited: (parkId: string) => boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [visitedParks, setVisitedParks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchVisitedParks = async () => {
      if (!user) {
        setVisitedParks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const parks = await getVisitedParks(user.id);
        setVisitedParks(parks);
      } catch (error) {
        console.error('Error fetching visited parks:', error);
        setVisitedParks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitedParks();
  }, [user]);

  const toggleVisitedPark = async (parkId: string) => {
    if (!user) return;

    const isCurrentlyVisited = visitedParks.includes(parkId);

    try {
      if (isCurrentlyVisited) {
        await removeVisitedPark(user.id, parkId);
        setVisitedParks(prev => prev.filter(id => id !== parkId));
      } else {
        await addVisitedPark(user.id, parkId);
        setVisitedParks(prev => [...prev, parkId]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isVisited = (parkId: string) => visitedParks.includes(parkId);

  return (
    <UserContext.Provider value={{ visitedParks, toggleVisitedPark, isVisited, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
} 