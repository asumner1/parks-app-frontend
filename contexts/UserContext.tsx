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
  console.log('[UserContext] Initializing provider');
  const [visitedParks, setVisitedParks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    console.log('[UserContext] User changed:', user?.id);
    let mounted = true;

    const fetchVisitedParks = async () => {
      console.log('[UserContext] Starting fetchVisitedParks');
      if (!user) {
        console.log('[UserContext] No user, clearing visited parks');
        setVisitedParks([]);
        setLoading(false);
        return;
      }

      try {
        console.log('[UserContext] Fetching parks for user:', user.id);
        const parks = await getVisitedParks(user.id);
        if (mounted) {
          console.log('[UserContext] Setting visited parks:', parks);
          setVisitedParks(parks);
        } else {
          console.log('[UserContext] Component unmounted, skipping state update');
        }
      } catch (error) {
        console.error('[UserContext] Error fetching parks:', error);
        if (mounted) {
          console.log('[UserContext] Clearing visited parks due to error');
          setVisitedParks([]);
        }
      } finally {
        if (mounted) {
          console.log('[UserContext] Setting loading to false');
          setLoading(false);
        }
      }
    };

    fetchVisitedParks();
    return () => {
      console.log('[UserContext] Cleaning up effect');
      mounted = false;
    };
  }, [user]);

  const toggleVisitedPark = async (parkId: string) => {
    console.log('[UserContext] Toggling visited park:', parkId);
    if (!user) {
      console.log('[UserContext] No user, skipping toggle');
      return;
    }

    const isCurrentlyVisited = visitedParks.includes(parkId);
    console.log('[UserContext] Park is currently visited:', isCurrentlyVisited);

    try {
      if (isCurrentlyVisited) {
        console.log('[UserContext] Removing park from visited');
        await removeVisitedPark(user.id, parkId);
        setVisitedParks(prev => {
          console.log('[UserContext] Updating state: removing park');
          return prev.filter(id => id !== parkId);
        });
      } else {
        console.log('[UserContext] Adding park to visited');
        await addVisitedPark(user.id, parkId);
        setVisitedParks(prev => {
          console.log('[UserContext] Updating state: adding park');
          return [...prev, parkId];
        });
      }
      console.log('[UserContext] Toggle completed successfully');
    } catch (error) {
      console.error('[UserContext] Error toggling visited park:', error);
    }
  };

  const isVisited = (parkId: string) => {
    const visited = visitedParks.includes(parkId);
    console.log('[UserContext] Checking if park is visited:', parkId, visited);
    return visited;
  };

  console.log('[UserContext] Rendering provider with parks:', visitedParks.length);
  return (
    <UserContext.Provider value={{ visitedParks, toggleVisitedPark, isVisited, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    console.error('[UserContext] Hook used outside of provider');
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
} 