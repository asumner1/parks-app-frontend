'use client';

import { useState, useEffect } from 'react';
import { getUser, supabase } from '@/lib/supabase';

// Global state to cache user data and subscription
let globalUser: any = null;
let globalLoading = true;
let globalSubscription: any = null;
const subscribers = new Set<(user: any) => void>();

const notifySubscribers = async (user: any) => {
  console.log('[useUser] Notifying subscribers with user:', user?.id);
  const promises = Array.from(subscribers).map(callback => callback(user));
  await Promise.all(promises);
};

export function useUser() {
  const [user, setUser] = useState<any>(globalUser);
  const [loading, setLoading] = useState(globalLoading);

  useEffect(() => {
    console.log('[useUser] Hook initialized');
    let mounted = true;
    let initializationAttempted = false;

    // Add subscriber
    subscribers.add(setUser);
    console.log('[useUser] Current subscriber count:', subscribers.size);

    // Initial state sync
    setUser(globalUser);
    setLoading(globalLoading);

    // Function to update user state
    const updateUser = async (session: any) => {
      if (!mounted) return;
      console.log('[useUser] Updating user with session:', session?.user?.id);

      try {
        if (session?.user) {
          const userData = await getUser();
          console.log('[useUser] Got user data:', userData?.id);
          globalUser = userData;
          await notifySubscribers(userData);
        } else {
          console.log('[useUser] No session, clearing user');
          globalUser = null;
          await notifySubscribers(null);
        }
      } catch (error) {
        console.error('[useUser] Error updating user:', error);
        globalUser = null;
        await notifySubscribers(null);
      } finally {
        globalLoading = false;
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize session
    const initSession = async () => {
      if (initializationAttempted) {
        console.log('[useUser] Session initialization already attempted, skipping');
        return;
      }
      initializationAttempted = true;

      console.log('[useUser] Initializing session');
      try {
        console.log('[useUser] Calling auth.getSession()');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[useUser] auth.getSession() returned:', error ? 'error' : 'success');
        
        if (!mounted) {
          console.log('[useUser] Component unmounted during session init');
          return;
        }
        
        if (error) {
          console.log('[useUser] Session error:', error);
          throw error;
        }
        
        console.log('[useUser] Got session:', session?.user?.id);
        await updateUser(session);
      } catch (error) {
        console.error('[useUser] Error getting session:', error);
        if (mounted) {
          globalUser = null;
          globalLoading = false;
          await notifySubscribers(null);
          setLoading(false);
        }
      }
    };

    // Initialize session first
    const init = async () => {
      await initSession();
      
      // Only set up subscription after initial session check
      if (!globalSubscription && mounted) {
        console.log('[useUser] Setting up auth state change listener');
        globalSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('[useUser] Auth state changed:', event, 'Session:', session?.user?.id);
          if (!mounted) return;
          
          try {
            switch (event) {
              case 'SIGNED_IN':
              case 'TOKEN_REFRESHED':
              case 'USER_UPDATED':
                await updateUser(session);
                break;
              case 'SIGNED_OUT':
                console.log('[useUser] User signed out');
                globalUser = null;
                globalLoading = false;
                await notifySubscribers(null);
                break;
            }
          } catch (error) {
            console.error('[useUser] Error in auth state change:', error);
          }
        });
      }
    };

    init();

    return () => {
      console.log('[useUser] Cleaning up hook');
      mounted = false;
      subscribers.delete(setUser);
      
      // Only remove global subscription when last subscriber is removed
      if (subscribers.size === 0 && globalSubscription) {
        console.log('[useUser] Removing global subscription');
        globalSubscription.unsubscribe();
        globalSubscription = null;
      }
    };
  }, []);

  return { user, loading };
} 