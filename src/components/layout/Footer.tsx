import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#180f0a] text-white py-14 border-t border-[#c99a55]/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center space-y-6">
        <a href="#home" className="inline-flex items-center gap-2 font-serif text-2xl font-bold tracking-wider text-white">
          <span className="text-[#c99a55]">☕</span>
          <span>DARU COFFEE HOUSE</span>
        </a>

        <p className="text-xs text-[#d4c7ba] max-w-md mx-auto leading-relaxed">
          Every cup has a story. Handcrafted Ethiopian Buna, ancient clay Jebena tradition, and sacred hospitality from the birthplace of coffee.
        </p>

        <div className="text-xs font-serif text-[#dfb679] tracking-wide">
          ሰላም እና በረከት ከዳሩ ቡና ቤት · Peace and blessings from Daru
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#b8a99c] pt-2">
          <a href="#home" className="hover:text-[#dfb679] transition-colors">Home</a>
          <a href="#ceremony-3d" className="hover:text-[#dfb679] transition-colors">3D Ceremony</a>
          <a href="#about" className="hover:text-[#dfb679] transition-colors">Our Story</a>
          <a href="#menu" className="hover:text-[#dfb679] transition-colors">Coffee Menu</a>
          <a href="#terroir" className="hover:text-[#dfb679] transition-colors">Aroma Terroir</a>
          <a href="#culture" className="hover:text-[#dfb679] transition-colors">Heritage</a>
          <a href="#contact" className="hover:text-[#dfb679] transition-colors">Contact</a>
        </div>

        <div className="pt-6 border-t border-white/10 text-[11px] text-[#8c7b6e]">
          © {new Date().getFullYear()} Daru Coffee House. All rights reserved. Addis Ababa · Certified Ethiopian Specialty Coffee.
        </div>
      </div>
    </footer>
  );
};
