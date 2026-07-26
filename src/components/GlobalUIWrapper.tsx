"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DiscussionModal } from './DiscussionModal';
import { SearchAccountCartModals } from './SearchAccountCartModals';
import { useGlobalUI } from './GlobalUIContext';

export function GlobalUIWrapper({ children }: { children: React.ReactNode }) {
  const {
    discussOpen, setDiscussOpen,
    discussType, setDiscussType,
    searchOpen, setSearchOpen,
    accountOpen, setAccountOpen,
    cartOpen, setCartOpen,
    handleOpenDiscuss
  } = useGlobalUI();

  const [cartItems, setCartItems] = useState<string[]>(['iot-weather-station', 'robotic-arm-6dof']);

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item !== id));
  };

  const pathname = usePathname();
  
  // If we are on the homepage, the homepage manages its own UI rendering for Navbar/Footer to preserve animations.
  // We also don't show the global UI (Navbar/Footer) on the /admin pages.
  const isHomePage = pathname === '/';
  const isAdminPage = pathname?.startsWith('/admin');
  const showGlobalUI = !isHomePage && !isAdminPage;

  return (
    <>
      {showGlobalUI && (
        <Navbar
          onOpenDiscuss={() => handleOpenDiscuss('General Consultation')}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAccount={() => setAccountOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartCount={cartItems.length}
        />
      )}

      {children}

      {showGlobalUI && (
        <Footer onOpenDiscuss={() => handleOpenDiscuss('Footer Inquiry')} />
      )}

      {showGlobalUI && (
        <>
          <DiscussionModal
            isOpen={discussOpen}
            onClose={() => setDiscussOpen(false)}
            initialType={discussType}
          />
          <SearchAccountCartModals
            searchOpen={searchOpen}
            accountOpen={accountOpen}
            cartOpen={cartOpen}
            onCloseSearch={() => setSearchOpen(false)}
            onCloseAccount={() => setAccountOpen(false)}
            onCloseCart={() => setCartOpen(false)}
            onOpenDiscuss={() => handleOpenDiscuss('Search/Account Portal Inquiry')}
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
          />
        </>
      )}
    </>
  );
}
