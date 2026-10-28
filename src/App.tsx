import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { Ceremony3DSection } from './components/ceremony/Ceremony3DSection';
import { AboutSection } from './components/about/AboutSection';
import { MenuSection } from './components/menu/MenuSection';
import { AromaTerroir3D } from './components/3d/AromaTerroir3D';
import { HeritageSection } from './components/culture/HeritageSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { CeremonyBookingModal } from './components/booking/CeremonyBookingModal';
import { CartItem, CoffeeItem } from './types';
import { COFFEE_MENU } from './data/coffeeData';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      item: COFFEE_MENU[0], // Traditional Ethiopian Buna
      quantity: 2,
      customization: {
        rueHerb: true,
        sugar: 'A little',
        shots: 'Traditional',
      },
    },
    {
      item: COFFEE_MENU[8], // Fresh Popcorn & Kolo
      quantity: 1,
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currency, setCurrency] = useState<'ETB' | 'USD'>('ETB');

  const handleAddToCart = (item: CoffeeItem, customization?: any) => {
    setCartItems((prev) => {
      // Check if identical item + customization already exists
      const existingIdx = prev.findIndex(
        (ci) =>
          ci.item.id === item.id &&
          JSON.stringify(ci.customization || {}) === JSON.stringify(customization || {})
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      } else {
        return [...prev, { item, quantity: 1, customization }];
      }
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      setCartItems((prev) => {
        const next = [...prev];
        next[index].quantity = newQty;
        return next;
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fffdf9] text-[#281a13] font-sans selection:bg-[#c99a55] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <HeroSection
          onExploreMenu={() => {
            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExplore3D={() => {
            document.getElementById('ceremony-3d')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookCeremony={() => setIsBookingOpen(true)}
        />

        {/* 3D Ethiopian Ceremony Studio (Interactive Feature) */}
        <Ceremony3DSection
          onExploreMenu={() => {
            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookCeremony={() => setIsBookingOpen(true)}
        />

        {/* About Daru Coffee House */}
        <AboutSection
          onExploreMenu={() => {
            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookCeremony={() => setIsBookingOpen(true)}
        />

        {/* Coffee Menu with Cart & Currency Toggle */}
        <MenuSection
          onAddToCart={handleAddToCart}
          currency={currency}
          setCurrency={setCurrency}
        />

        {/* 3D Aroma & Terroir Section */}
        <section id="terroir" className="py-20 md:py-24 bg-[#180f0a] border-b border-[#c99a55]/20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <AromaTerroir3D
              onSelectCoffee={(origin) => {
                const menuEl = document.getElementById('menu');
                if (menuEl) {
                  menuEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        </section>

        {/* Ethiopian Culture & 3 Sacred Rounds */}
        <HeritageSection />

        {/* Contact, Location & FAQs */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out Order Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currency={currency}
      />

      {/* Ceremony Table Booking Modal */}
      <CeremonyBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
