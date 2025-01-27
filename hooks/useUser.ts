'use client';

import { useState, useEffect } from 'react';
import { getUser, supabase } from '@/lib/supabase';

// Global state to cache user data and subscription
let globalUser: any = null;
let globalLoading = true;
let globalSubscription: any = null;
const subscribers = new Set<(user: any) => void>();

const notifySubscribers = (user: any) => {
  subscribers.forEach(callback => callback(user));
};

export function useUser() {
  const [user, setUser] = useState<any>(globalUser);
  const [loading, setLoading] = useState(globalLoading);

  useEffect(() => {
    let mounted = true;

    // Add subscriber
    subscribers.add(setUser);

    // Initial state sync
    setUser(globalUser);
    setLoading(globalLoading);

    // Function to update user state
    const updateUser = async (session: any) => {
      if (!mounted) return;

      try {
        if (session?.user) {
          const userData = await getUser();
          globalUser = userData;
          notifySubscribers(userData);
        } else {
          globalUser = null;
          notifySubscribers(null);
        }
      } catch (error) {
        console.error('Error updating user:', error);
        globalUser = null;
        notifySubscribers(null);
      } finally {
        globalLoading = false;
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        await updateUser(session);
      } catch (error) {
        console.error('Error getting session:', error);
        globalUser = null;
        globalLoading = false;
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    if (!globalSubscription) {
      globalSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event); // Helpful for debugging
        
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            await updateUser(session);
            break;
          case 'SIGNED_OUT':
            globalUser = null;
            globalLoading = false;
            notifySubscribers(null);
            break;
          default:
            // Handle other events if needed
            break;
        }
      });
    }

    // Initialize
    initSession();

    return () => {
      mounted = false;
      subscribers.delete(setUser);
      
      // Only remove global subscription when last subscriber is removed
      if (subscribers.size === 0 && globalSubscription) {
        globalSubscription.unsubscribe();
        globalSubscription = null;
      }
    };
  }, []);

  return { user, loading };
} 