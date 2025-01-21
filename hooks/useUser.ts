'use client';

import { useState, useEffect } from 'react';
import { getUser, supabase } from '@/lib/supabase';

// Global state to cache user data
let globalUser: any = null;
let globalLoading = true;
let subscribers = new Set<(user: any) => void>();

const notifySubscribers = (user: any) => {
  subscribers.forEach(callback => callback(user));
};

export function useUser() {
  const [user, setUser] = useState<any>(globalUser);
  const [loading, setLoading] = useState(globalLoading);

  useEffect(() => {
    // Add subscriber
    subscribers.add(setUser);

    // Initial state sync
    setUser(globalUser);
    setLoading(globalLoading);

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user && !globalUser) {
          const userData = await getUser();
          globalUser = userData;
          globalLoading = false;
          notifySubscribers(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        globalUser = null;
        globalLoading = false;
        notifySubscribers(null);
      }
    });

    // Only fetch user data if we haven't done it yet
    if (globalLoading) {
      getUser().then(userData => {
        globalUser = userData;
        globalLoading = false;
        notifySubscribers(userData);
      });
    }

    return () => {
      subscribers.delete(setUser);
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
} 