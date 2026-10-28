import React from 'react';
import { Sparkles, Sun, Users, Shield, Compass } from 'lucide-react';

export const HeritageSection: React.FC = () => {
  return (
    <section id="culture" className="py-20 md:py-28 bg-[#20140d] text-white border-b border-[#c99a55]/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#dfb679] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c99a55]" />
            <span>ROOTED IN ETHIOPIAN CULTURE</span>
            <span aria-hidden="true">·</span>
            <span>የቡና ባህልና ታሪክ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mb-4">
            The Three Sacred Rounds
          </h2>

          <p className="text-sm sm:text-base text-[#d4c7ba] leading-relaxed">
            In Ethiopian tradition, Buna is not a rushed takeaway. It is an unhurried social covenant served in three deliberate rounds, each carrying profound spiritual and communal meaning.
          </p>
        </div>

        {/* 3 Rounds Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Round 1: Abol */}
          <div className="relative p-8 rounded-2xl bg-[#281a13] border border-[#c99a55]/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-widest text-[#dfb679]">
                  ROUND 01
                </span>
                <span className="font-serif text-2xl text-[#c99a55] font-bold">
                  አቦል
                </span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Abol — The Awakening
              </h3>

              <p className="text-xs text-[#dfb679] font-medium mb-4">
                The First & Strongest Pour
              </p>

              <p className="text-xs text-[#d4c7ba] leading-relaxed">
                Extracted from the fresh freshly ground roast. Bold, intense, and deeply aromatic. Abol awakens the senses, settles the mind, and invites contemplative silence as guests savor the pure essence of the bean.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#a89a8c]">
              <Sun className="w-4 h-4 text-[#c99a55]" />
              <span>For contemplation and clarity</span>
            </div>
          </div>

          {/* Round 2: Tona */}
          <div className="relative p-8 rounded-2xl bg-[#281a13] border border-[#c99a55]/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-widest text-[#dfb679]">
                  ROUND 02
                </span>
                <span className="font-serif text-2xl text-[#c99a55] font-bold">
                  ቶና
                </span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Tona — Fellowship
              </h3>

              <p className="text-xs text-[#dfb679] font-medium mb-4">
                The Second Pour · Dialogue
              </p>

              <p className="text-xs text-[#d4c7ba] leading-relaxed">
                Water is re-added to the Jebena and brought to a gentle boil. Softer and smoother on the palate. Tona breaks down barriers, sparking honest dialogue, storytelling, laughter, and deepening friendships.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#a89a8c]">
              <Users className="w-4 h-4 text-[#c99a55]" />
              <span>For communion and kinship</span>
            </div>
          </div>

          {/* Round 3: Bereka */}
          <div className="relative p-8 rounded-2xl bg-[#281a13] border border-[#c99a55]/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-widest text-[#dfb679]">
                  ROUND 03
                </span>
                <span className="font-serif text-2xl text-[#c99a55] font-bold">
                  በረካ
                </span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Bereka — The Blessing
              </h3>

              <p className="text-xs text-[#dfb679] font-medium mb-4">
                The Final Pour · Abundance
              </p>

              <p className="text-xs text-[#d4c7ba] leading-relaxed">
                Derived from the root word for &ldquo;Blessing&rdquo;. Delicate, smooth, and restorative. Elders bestow blessings of peace, health, and prosperity upon everyone assembled before parting.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#a89a8c]">
              <Shield className="w-4 h-4 text-[#c99a55]" />
              <span>The gift of lasting peace</span>
            </div>
          </div>
        </div>

        {/* Legend of Kaldi Split Feature */}
        <div className="rounded-2xl bg-[#2b1910] border border-[#c99a55]/25 p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-widest text-[#dfb679] font-bold block mb-2">
                C. 850 CE · KAFFA PROVINCE
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-4">
                The Legend of Kaldi & The Dancing Goats
              </h3>
              <p className="text-sm text-[#d4c7ba] leading-relaxed mb-4">
                Centuries ago in the ancient highland forests of Kaffa, an observant young goat herder named Kaldi noticed something extraordinary: his herd was frolicking, leaping with boundless vigor after nibbling red berries from an unfamiliar shrub.
              </p>
              <p className="text-sm text-[#d4c7ba] leading-relaxed mb-6">
                Kaldi tried the berries himself and felt an invigorating surge of vitality. He brought them to a local monastery where monks initially threw them into the fire as strange spirits. As the beans roasted in the flames, an exquisite aroma filled the sanctuary. The monks raked the glowing beans from the embers, crushed them, and steeped them in hot water—discovering the world&rsquo;s first cup of coffee.
              </p>

              <div className="flex items-center gap-6 text-xs text-[#dfb679] font-semibold">
                <span>✓ 100% Wild Coffea Arabica Origin</span>
                <span>✓ Unbroken Ethiopian Ceremony Lineage</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="p-6 rounded-2xl bg-[#1e110a] border border-white/10 text-center max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#543522] flex items-center justify-center text-3xl mb-4 border border-[#c99a55]/40 shadow-inner">
                  🌿
                </div>
                <h4 className="font-serif text-lg font-bold text-white mb-2">
                  The Four Ceremony Sacreds
                </h4>
                <ul className="text-xs text-[#b8a99c] space-y-2 text-left mt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-[#c99a55] font-bold">1. Itan (ዕጣን):</span> Frankincense smoke purifying the air
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#c99a55] font-bold">2. Fendisha (ፈንዲሻ):</span> Warm popcorn signifying harvest
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#c99a55] font-bold">3. Tena&apos;adam:</span> Fragrant rue herb sprig in the cup
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#c99a55] font-bold">4. Rekebot (ረከቦት):</span> The ornate communal serving stand
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
