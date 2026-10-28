import React from 'react';
import { EthiopianJebenaScene } from '../3d/EthiopianJebenaScene';
import { Sparkles, Compass, Flame, Droplets, Layers } from 'lucide-react';

interface Ceremony3DSectionProps {
  onExploreMenu: () => void;
  onBookCeremony: () => void;
}

export const Ceremony3DSection: React.FC<Ceremony3DSectionProps> = ({
  onExploreMenu,
  onBookCeremony,
}) => {
  return (
    <section id="ceremony-3d" className="relative bg-[#1c120c] text-white py-20 md:py-24 border-b border-[#c99a55]/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#dfb679] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c99a55]" />
            <span>INTERACTIVE 3D FEATURE</span>
            <span aria-hidden="true">·</span>
            <span>ጀበና የባህል ትዕይንት</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mb-4">
            The Living 3D Coffee Ceremony
          </h2>

          <p className="text-sm sm:text-base text-[#d4c7ba] leading-relaxed">
            Interact with our virtual Ethiopian Jebena in real-time 3D. Inspect the hand-shaped clay contour, test different pottery finishes, simulate bean roasting, and watch the ceremonial pour.
          </p>
        </div>

        {/* 3D Scene Viewport Wrapper */}
        <div className="rounded-2xl overflow-hidden border border-[#c99a55]/30 shadow-2xl relative">
          <EthiopianJebenaScene
            onExploreMenu={onExploreMenu}
            onBookCeremony={onBookCeremony}
          />
        </div>

        {/* Feature Highlights Grid Below 3D Viewport */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <div className="p-5 rounded-xl bg-[#281a13]/80 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-[#c99a55]/20 text-[#dfb679] flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-semibold text-white mb-1">
              360° Free Orbit
            </h4>
            <p className="text-xs text-[#b8a99c] leading-relaxed">
              Drag anywhere on the 3D canvas to rotate and inspect every angle of the traditional Rekebot table and clay Jebena.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#281a13]/80 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-semibold text-white mb-1">
              Live Roasting Simulation
            </h4>
            <p className="text-xs text-[#b8a99c] leading-relaxed">
              Toggle the roasting switch to watch green heirloom beans darken over glowing embers with procedural audio crackles.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#281a13]/80 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-semibold text-white mb-1">
              Ceremonial High Pour
            </h4>
            <p className="text-xs text-[#b8a99c] leading-relaxed">
              Experience the master pour: the Jebena tilts gracefully, streaming fresh Buna into porcelain Sini cups from height.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#281a13]/80 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-semibold text-white mb-1">
              Anatomy Deconstruction
            </h4>
            <p className="text-xs text-[#b8a99c] leading-relaxed">
              Slide the deconstruction slider in the bottom dock to lift the woven straw Kifto stopper and view the neck assembly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
