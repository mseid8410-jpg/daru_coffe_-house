import React from 'react';
import { ArrowRight, Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface AboutSectionProps {
  onExploreMenu: () => void;
  onBookCeremony: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreMenu,
  onBookCeremony,
}) => {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#fffdf9] border-b border-[#281a13]/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column Image Collage / Craft Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#281a13] border-4 border-[#f8f3eb]">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85"
                alt="Traditional Ethiopian Coffee House Hospitality"
                className="w-full h-[450px] object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#dfb679] font-bold block mb-1">
                  CULTURE & HOSPITALITY
                </span>
                <p className="font-serif text-lg leading-snug text-[#f8f3eb]">
                  &ldquo;Coffee is not merely sipped in Ethiopia. It is lived, shared, and celebrated.&rdquo;
                </p>
              </div>
            </div>

            {/* Accent Card */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#543522] text-white p-5 rounded-xl shadow-xl max-w-xs border border-[#c99a55]/30 hidden sm:block">
              <div className="flex items-center gap-2 text-[#dfb679] text-xs font-bold uppercase mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>The Daru Promise</span>
              </div>
              <p className="text-xs text-[#d4c7ba] leading-relaxed">
                Freshly roasted on site daily. Never pre-ground. Always brewed with reverence and warm smiles.
              </p>
            </div>
          </div>

          {/* Right Column Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#a7783e] uppercase mb-3">
              <span>MORE THAN JUST COFFEE</span>
              <span aria-hidden="true">·</span>
              <span>የዳሩ ታሪክ</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-[#281a13] tracking-tight leading-tight mb-6">
              Where Tradition<br />
              Meets Every Sip
            </h2>

            <p className="text-base text-[#543522] leading-relaxed mb-4">
              At <strong className="font-semibold text-[#281a13]">Daru Coffee House</strong>, coffee is far more than a morning beverage. It is an enduring social ritual, a warm sanctuary for dialogue, and an invitation to pause the rushed world.
            </p>

            <p className="text-sm sm:text-base text-[#6f472e] leading-relaxed mb-8">
              Founded in honor of Ethiopia&rsquo;s unmatched botanical heritage, we source exclusively heirloom Arabica cherries cultivated by heritage farming families in Yirgacheffe, Sidama, Guji, and Harrar. Every cup connects you directly with the high misty plateaus where coffee was first discovered over a thousand years ago.
            </p>

            {/* 3 Pillars */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#c99a55]/20 text-[#8c5b3c] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#281a13]">Direct-Trade Single Origins</h4>
                  <p className="text-xs text-[#7b7067] leading-relaxed">
                    Sourced with transparent compensation paid directly to Ethiopian coffee grower cooperatives.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#c99a55]/20 text-[#8c5b3c] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#281a13]">Authentic Clay Jebena Brewing</h4>
                  <p className="text-xs text-[#7b7067] leading-relaxed">
                    Brewed in custom hand-thrown highland clay pots that soften water minerals and preserve natural fruit acidity.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#543522] border-b-2 border-[#c99a55] pb-1 hover:text-[#c99a55] transition-colors"
              >
                <span>Discover Our Complete Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <span className="text-[#a89a8c] hidden sm:inline">|</span>

              <button
                onClick={onBookCeremony}
                className="text-sm font-bold text-[#8c5b3c] hover:text-[#281a13] transition-colors"
              >
                Book a Private Ceremony Table →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
