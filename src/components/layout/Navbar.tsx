import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Calendar } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fffdf9]/95 backdrop-blur-md border-b border-[#281a13]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <a href="#home" className="flex items-center gap-2.5 text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#281a13] whitespace-nowrap shrink-0">
          <span className="text-[#c99a55] text-2xl" aria-hidden="true">☕</span>
          <span className="tracking-wider">DARU</span>
          <span className="text-xs font-sans font-semibold tracking-widest text-[#6f472e] uppercase ml-1 hidden sm:inline">
            COFFEE HOUSE
          </span>
        </a>

        {/* Zone 2: 4–5 clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#543522]">
          <a href="#ceremony-3d" className="hover:text-[#c99a55] transition-colors whitespace-nowrap shrink-0">
            3D Ceremony
          </a>
          <a href="#about" className="hover:text-[#c99a55] transition-colors whitespace-nowrap shrink-0">
            Our Story
          </a>
          <a href="#menu" className="hover:text-[#c99a55] transition-colors whitespace-nowrap shrink-0">
            Coffee Menu
          </a>
          <a href="#terroir" className="hover:text-[#c99a55] transition-colors whitespace-nowrap shrink-0">
            Aroma Terroir
          </a>
          <a href="#culture" className="hover:text-[#c99a55] transition-colors whitespace-nowrap shrink-0">
            Heritage
          </a>
          <a href="#contact" className="hover:text-[#c99a55] transition-colors whitespace-nowrap shrink-0">
            Visit Us
          </a>
        </nav>

        {/* Zone 3: Actions (Cart & Book Table Primary Action) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-lg border border-[#281a13]/15 text-[#281a13] hover:bg-[#f8f3eb] transition-colors"
            title="View Your Order"
            aria-label="View Order Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#c99a55] text-[#281a13] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide text-white bg-[#543522] rounded-lg hover:bg-[#c99a55] hover:text-[#281a13] transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Ceremony</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#281a13] hover:bg-[#f8f3eb]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fffdf9] border-b border-[#281a13]/10 px-6 py-5 flex flex-col gap-4 text-sm font-medium text-[#543522]">
          <a
            href="#ceremony-3d"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#c99a55]"
          >
            3D Ethiopian Ceremony
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#c99a55]"
          >
            Our Story & Heritage
          </a>
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#c99a55]"
          >
            Coffee Menu & Prices
          </a>
          <a
            href="#terroir"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#c99a55]"
          >
            3D Aroma Terroir
          </a>
          <a
            href="#culture"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#c99a55]"
          >
            The 3 Sacred Rounds
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 hover:text-[#c99a55]"
          >
            Contact & Location
          </a>
          <div className="pt-3 border-t border-[#281a13]/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-[#543522] rounded-lg hover:bg-[#c99a55] hover:text-[#281a13] transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Coffee Ceremony</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
