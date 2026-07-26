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
  // We only inject Navbar/Footer globally for non-homepage routes.
  const isHomePage = pathname === '/';

  return (
    <>
      {!isHomePage && (
        <Navbar
          onOpenDiscuss={() => handleOpenDiscuss('General Consultation')}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAccount={() => setAccountOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartCount={cartItems.length}
        />
      )}

      {children}

      {!isHomePage && (
        <Footer onOpenDiscuss={() => handleOpenDiscuss('Footer Inquiry')} />
      )}

      {!isHomePage && (
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
