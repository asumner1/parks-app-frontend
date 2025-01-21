'use client';

import { useState, useEffect } from 'react';
import { getUser, supabase } from '@/lib/supabase';

// Global state to cache user data and subscription
let globalUser: any = null;
let globalLoading = true;
let globalSubscription: any = null;
let initialSessionChecked = false;
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

    // Only check initial session once across all instances
    if (!initialSessionChecked) {
      initialSessionChecked = true;
      
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          getUser().then(userData => {
            globalUser = userData;
            globalLoading = false;
            notifySubscribers(userData);
          });
        } else {
          globalUser = null;
          globalLoading = false;
          notifySubscribers(null);
        }
      });

      // Set up auth state change listener only once
      if (!globalSubscription) {
        globalSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
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
      }
    }

    return () => {
      subscribers.delete(setUser);
    };
  }, []);

  return { user, loading };
} 