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
    console.log('[UserContext] User changed:', user?.id);
    let isMounted = true;

    async function fetchVisitedParks() {
      console.log('[UserContext] Fetching visited parks');
      setLoading(true);
      
      if (!user) {
        console.log('[UserContext] No user, clearing visited parks');
        setVisitedParks([]);
        setLoading(false);
        return;
      }

      try {
        console.log('[UserContext] Fetching parks for user:', user.id);
        const parks = await getVisitedParks(user.id);
        if (isMounted) {
          console.log('[UserContext] Setting visited parks:', parks);
          setVisitedParks(parks);
        }
      } catch (error) {
        console.error('[UserContext] Error fetching visited parks:', error);
        if (isMounted) {
          setVisitedParks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchVisitedParks();

    return () => {
      console.log('[UserContext] Cleaning up effect');
      isMounted = false;
    };
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
      console.error('Error toggling park visit:', error);
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