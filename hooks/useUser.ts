'use client';

import { useState, useEffect } from 'react';
import { getUser } from '@/lib/supabase';

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const userData = await getUser();
        if (isMounted) {
          console.log('User data fetched:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading };
} 