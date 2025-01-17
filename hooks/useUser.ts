'use client';

import { useState, useEffect } from 'react';
import { getUser } from '@/lib/supabase';

export function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      }
    };

    checkUser();
  }, []);

  return { user };
} 