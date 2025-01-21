'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { usePathname } from 'next/navigation';
import AccountPitch from '@/components/AccountPitch';

// Create a variable outside the component to persist across re-renders
let hasShownInitialPitch = false;

type AccountPitchContextType = {
  showAccountPitch: () => void;
  hideAccountPitch: () => void;
  isVisible: boolean;
};

const AccountPitchContext = createContext<AccountPitchContextType | undefined>(undefined);

export function AccountPitchProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();
  const showInitialPitch = false;

  // Show the pitch after a delay on first homepage visit
  useEffect(() => {
    if (pathname === '/' && !hasShownInitialPitch && !user && showInitialPitch) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        hasShownInitialPitch = true;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pathname, user, showInitialPitch]);

  // Hide the pitch when user logs in
  useEffect(() => {
    if (user) {
      setIsVisible(false);
    }
  }, [user]);

  const showAccountPitch = () => {
    if (!user) {
      setIsVisible(true);
    }
  };

  const hideAccountPitch = () => setIsVisible(false);

  return (
    <AccountPitchContext.Provider value={{ showAccountPitch, hideAccountPitch, isVisible }}>
      {children}
      <AccountPitch />
    </AccountPitchContext.Provider>
  );
}

export function useAccountPitch() {
  const context = useContext(AccountPitchContext);
  if (context === undefined) {
    throw new Error('useAccountPitch must be used within an AccountPitchProvider');
  }
  return context;
} 