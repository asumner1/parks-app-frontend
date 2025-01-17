'use client';

import { createContext, useContext, useState } from 'react';

type AccountPitchContextType = {
  showAccountPitch: () => void;
  hideAccountPitch: () => void;
  isVisible: boolean;
};

const AccountPitchContext = createContext<AccountPitchContextType | undefined>(undefined);

export function AccountPitchProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  const showAccountPitch = () => setIsVisible(true);
  const hideAccountPitch = () => setIsVisible(false);

  return (
    <AccountPitchContext.Provider value={{ showAccountPitch, hideAccountPitch, isVisible }}>
      {children}
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