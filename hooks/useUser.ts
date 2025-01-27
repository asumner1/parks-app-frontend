'use client';

import { useState, useEffect } from 'react';
import { getUser, supabase } from '@/lib/supabase';

// Global state to cache user data and subscription
let globalUser: any = null;
let globalLoading = true;
let globalSubscription: any = null;
const subscribers = new Set<(user: any) => void>();

const notifySubscribers = (user: any) => {
  console.log('[useUser] Notifying subscribers with user:', user?.id);
  subscribers.forEach(callback => callback(user));
};

export function useUser() {
  const [user, setUser] = useState<any>(globalUser);
  const [loading, setLoading] = useState(globalLoading);

  useEffect(() => {
    console.log('[useUser] Hook initialized');
    let mounted = true;

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
          notifySubscribers(userData);
        } else {
          console.log('[useUser] No session, clearing user');
          globalUser = null;
          notifySubscribers(null);
        }
      } catch (error) {
        console.error('[useUser] Error updating user:', error);
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
      console.log('[useUser] Initializing session');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[useUser] Got session:', session?.user?.id);
        if (error) throw error;
        await updateUser(session);
      } catch (error) {
        console.error('[useUser] Error getting session:', error);
        globalUser = null;
        globalLoading = false;
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    if (!globalSubscription) {
      console.log('[useUser] Setting up auth state change listener');
      globalSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('[useUser] Auth state changed:', event, 'Session:', session?.user?.id);
        
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
            notifySubscribers(null);
            break;
          default:
            console.log('[useUser] Unhandled auth event:', event);
            break;
        }
      });
    }

    // Initialize
    initSession();

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