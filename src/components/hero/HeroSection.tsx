import React from 'react';
import { ArrowRight, Sparkles, Coffee, Box } from 'lucide-react';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onExplore3D: () => void;
  onBookCeremony: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onExplore3D,
  onBookCeremony,
}) => {
  return (
    <section id="home" className="relative bg-[#f8f3eb] pt-12 pb-20 md:py-24 overflow-hidden border-b border-[#281a13]/10">
      {/* Subtle traditional Ethiopian background watermark pattern */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (Headline & Content) */}
          <div className="lg:col-span-7 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#a7783e] uppercase mb-4">
              <span>WELCOME TO DARU COFFEE HOUSE</span>
              <span aria-hidden="true">·</span>
              <span>EST. ETHIOPIAN HEIRLOOM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#281a13] leading-[1.08] tracking-tight mb-6">
              Every Cup Has<br />
              <span className="text-[#c99a55] italic">A Story.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6f472e] leading-relaxed mb-8 max-w-xl">
              Experience the ancient birthplace of coffee. At Daru, green beans are roasted over frankincense, brewed in clay Jebenas, and poured from height into porcelain cups.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#ceremony-3d"
                onClick={onExplore3D}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-bold bg-[#543522] text-white hover:bg-[#c99a55] hover:text-[#281a13] transition-all shadow-md"
              >
                <Box className="w-4 h-4 text-[#dfb679]" />
                <span>Launch 3D Ceremony</span>
              </a>

              <a
                href="#menu"
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-bold border border-[#543522] text-[#543522] hover:bg-[#543522] hover:text-white transition-all"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onBookCeremony}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#8c5b3c] hover:text-[#281a13] transition-colors"
              >
                <span>Reserve a Table Ceremony →</span>
              </button>
            </div>

            {/* 3 Pillars Metadata */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#281a13]/10">
              <div>
                <strong className="block font-serif text-2xl sm:text-3xl text-[#543522] tabular-nums">
                  100%
                </strong>
                <span className="text-xs text-[#7b7067] font-medium">Heirloom Arabica</span>
              </div>
              <div>
                <strong className="block font-serif text-2xl sm:text-3xl text-[#543522]">
                  ጀበና
                </strong>
                <span className="text-xs text-[#7b7067] font-medium">Clay Pot Brewed</span>
              </div>
              <div>
                <strong className="block font-serif text-2xl sm:text-3xl text-[#543522] tabular-nums">
                  3 Pours
                </strong>
                <span className="text-xs text-[#7b7067] font-medium">Abol · Tona · Bereka</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with 3D Preview Launcher */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer arched frame mimicking traditional Ethiopian architecture */}
              <div className="relative h-[480px] sm:h-[540px] rounded-t-[140px] sm:rounded-t-[180px] rounded-b-2xl overflow-hidden shadow-2xl border-4 border-[#fffdf9] bg-[#241710]">
                {/* Fallback image with robust onError handling */}
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1100&q=85"
                  alt="Daru Ethiopian Coffee Ceremony"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Styled graceful fallback container if network fails
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />

                {/* Dark gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* Floating 3D Interactive Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 bg-[#fffdf9]/95 backdrop-blur-md rounded-xl border border-[#c99a55]/30 shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#543522] text-[#dfb679] flex items-center justify-center font-serif font-bold text-lg shadow">
                        ☕
                      </div>
                      <div>
                        <strong className="block font-serif text-sm text-[#281a13]">
                          Interactive 3D Ceremony
                        </strong>
                        <span className="text-[11px] text-[#7b7067]">
                          Rotate, explode & simulate roasting
                        </span>
                      </div>
                    </div>

                    <a
                      href="#ceremony-3d"
                      className="px-3 py-1.5 rounded-md bg-[#c99a55] text-[#281a13] font-bold text-xs hover:bg-[#543522] hover:text-white transition-colors shrink-0"
                    >
                      Interact 3D
                    </a>
                  </div>
                </div>
              </div>

              {/* Decorative accent stamp */}
              <div className="absolute -top-4 -right-4 bg-[#c99a55] text-[#281a13] p-3 rounded-full shadow-lg border-2 border-white hidden sm:flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
