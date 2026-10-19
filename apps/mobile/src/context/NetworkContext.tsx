import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NetworkContextValue {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  toggleNetwork: () => void;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  const toggleNetwork = () => {
    setIsOnline((prev) => !prev);
  };

  return (
    <NetworkContext.Provider value={{ isOnline, setIsOnline, toggleNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return ctx;
}
