'use client';

import { useState, useEffect } from 'react';
import { userStore } from '@/stores/UserStore';

export function useUser() {
  const [user, setUser] = useState(userStore.getUser());
  const [loading, setLoading] = useState(userStore.isLoading());

  useEffect(() => {
    userStore.initialize();
    
    return userStore.subscribe((newUser) => {
      setUser(newUser);
      setLoading(userStore.isLoading());
    });
  }, []);

  return { user, loading };
} 