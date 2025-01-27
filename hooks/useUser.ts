'use client';

import { useState, useEffect } from 'react';
import { userStore } from '@/lib/stores/UserStore';

export function useUser() {
  console.log('[useUser] Hook initializing');
  const [user, setUser] = useState(() => {
    const initialUser = userStore.getUser();
    console.log('[useUser] Initial user state:', initialUser?.id);
    return initialUser;
  });
  
  const [loading, setLoading] = useState(() => {
    const initialLoading = userStore.isLoading();
    console.log('[useUser] Initial loading state:', initialLoading);
    return initialLoading;
  });

  useEffect(() => {
    console.log('[useUser] Setting up effect');
    
    // Initialize store on first mount
    userStore.initialize().then(() => {
      console.log('[useUser] Store initialized');
    });

    // Subscribe to changes
    const unsubscribe = userStore.subscribe((newUser) => {
      console.log('[useUser] Received user update:', newUser?.id);
      setUser(newUser);
      const newLoading = userStore.isLoading();
      console.log('[useUser] Updated loading state:', newLoading);
      setLoading(newLoading);
    });

    return () => {
      console.log('[useUser] Cleaning up effect');
      unsubscribe();
    };
  }, []);

  return { user, loading };
} 