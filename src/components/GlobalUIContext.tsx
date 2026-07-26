"use client";
import React, { createContext, useContext, useState } from 'react';

interface GlobalUIContextType {
  discussOpen: boolean;
  setDiscussOpen: (open: boolean) => void;
  discussType: string;
  setDiscussType: (type: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  accountOpen: boolean;
  setAccountOpen: (open: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  handleOpenDiscuss: (type?: string) => void;
}

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(undefined);

export function GlobalUIProvider({ children }: { children: React.ReactNode }) {
  const [discussOpen, setDiscussOpen] = useState(false);
  const [discussType, setDiscussType] = useState('General Consultation');
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const handleOpenDiscuss = (type?: string) => {
    if (type) setDiscussType(type);
    setDiscussOpen(true);
  };

  return (
    <GlobalUIContext.Provider value={{
      discussOpen, setDiscussOpen,
      discussType, setDiscussType,
      searchOpen, setSearchOpen,
      accountOpen, setAccountOpen,
      cartOpen, setCartOpen,
      handleOpenDiscuss
    }}>
      {children}
    </GlobalUIContext.Provider>
  );
}

export function useGlobalUI() {
  const context = useContext(GlobalUIContext);
  if (context === undefined) {
    throw new Error('useGlobalUI must be used within a GlobalUIProvider');
  }
  return context;
}
