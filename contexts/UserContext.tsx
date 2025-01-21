'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getVisitedParks, addVisitedPark, removeVisitedPark, supabase } from '@/lib/supabase';
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

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_OUT') {
        setVisitedParks([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch visited parks when user changes
  useEffect(() => {
    let isMounted = true;

    async function fetchVisitedParks() {
      setLoading(true);
      if (!user) {
        console.log('No user, clearing visited parks');
        setVisitedParks([]);
        setLoading(false);
        return;
      }

      console.log('Fetching visited parks for user:', user.id);
      try {
        const parks = await getVisitedParks(user.id);
        if (isMounted) {
          console.log('Setting visited parks:', parks);
          setVisitedParks(parks);
        }
      } catch (error) {
        console.error('Error fetching visited parks:', error);
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