import React, { useState, useMemo } from 'react';
import { CoffeeItem } from '../../types';
import { COFFEE_MENU } from '../../data/coffeeData';
import { Plus, Search, Check, Sparkles, SlidersHorizontal, X } from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (item: CoffeeItem, customization?: any) => void;
  currency: 'ETB' | 'USD';
  setCurrency: (c: 'ETB' | 'USD') => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onAddToCart,
  currency,
  setCurrency,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<CoffeeItem | null>(null);

  // Customization state for modal
  const [customRue, setCustomRue] = useState<boolean>(true);
  const [customSugar, setCustomSugar] = useState<'None' | 'A little' | 'Normal' | 'Sweet'>('A little');
  const [customMilk, setCustomMilk] = useState<'Whole' | 'Oat' | 'Almond' | 'None'>('Whole');
  const [customShots, setCustomShots] = useState<'Single' | 'Double' | 'Traditional'>('Traditional');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return COFFEE_MENU.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.amharicName.includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.origin && item.origin.toLowerCase().includes(q)) ||
        (item.tastingNotes && item.tastingNotes.some((t) => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleQuickAdd = (item: CoffeeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
    setAddedNoticeId(item.id);
    setTimeout(() => {
      setAddedNoticeId(null);
    }, 1500);
  };

  const handleConfirmCustomAdd = () => {
    if (!selectedItemForModal) return;
    onAddToCart(selectedItemForModal, {
      rueHerb: customRue,
      sugar: customSugar,
      milk: selectedItemForModal.category === 'espresso' ? customMilk : 'None',
      shots: customShots,
    });
    setAddedNoticeId(selectedItemForModal.id);
    setSelectedItemForModal(null);
    setTimeout(() => {
      setAddedNoticeId(null);
    }, 1500);
  };

  return (
    <section id="menu" className="py-20 md:py-28 bg-[#f8f3eb] border-b border-[#281a13]/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#a7783e] uppercase mb-3">
            <span>AUTHENTIC ETHIOPIAN BREWS</span>
            <span aria-hidden="true">·</span>
            <span>የቡና ዝርዝር</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-[#281a13] tracking-tight mb-4">
            Our Coffee Menu
          </h2>

          <p className="text-sm sm:text-base text-[#6f472e] leading-relaxed">
            From clay-brewed ceremonial Buna to single-origin washed pour overs and artisanal espresso drinks, handcrafted with reverence.
          </p>
        </div>

        {/* Filter Bar & Currency Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs (Segmented controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'traditional', label: 'Ceremony Buna' },
              { id: 'single_origin', label: 'Single Origins' },
              { id: 'espresso', label: 'Espresso Bar' },
              { id: 'cold', label: 'Cold & Nitro' },
              { id: 'bites', label: 'Traditional Bites' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#543522] text-white shadow-sm'
                    : 'bg-[#fffdf9] text-[#543522] hover:bg-[#ebdcc8] border border-[#281a13]/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input & Currency Selector */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#7b7067] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search origins or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#fffdf9] border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55] placeholder:text-[#a89a8c]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7b7067] hover:text-[#281a13]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center p-1 bg-[#fffdf9] rounded-lg border border-[#281a13]/15 shrink-0">
              <button
                onClick={() => setCurrency('ETB')}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                  currency === 'ETB' ? 'bg-[#543522] text-white' : 'text-[#7b7067] hover:text-[#281a13]'
                }`}
                title="Ethiopian Birr"
              >
                ETB
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                  currency === 'USD' ? 'bg-[#543522] text-white' : 'text-[#7b7067] hover:text-[#281a13]'
                }`}
                title="US Dollars"
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const displayPrice =
              currency === 'ETB' ? `${item.priceETB} ETB` : `$${item.priceUSD.toFixed(2)}`;
            const isAdded = addedNoticeId === item.id;

            return (
              <article
                key={item.id}
                onClick={() => setSelectedItemForModal(item)}
                className="group relative bg-[#fffdf9] rounded-xl border border-[#281a13]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Container with Fallback */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-[#241710]">
                  <img
                    src={item.imageFallback}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                  {/* Amharic Script Tag */}
                  <div className="absolute top-3 left-3 bg-[#281a13]/85 text-[#dfb679] text-xs font-semibold px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
                    {item.amharicName}
                  </div>

                  {item.popular && (
                    <div className="absolute top-3 right-3 bg-[#c99a55] text-[#281a13] font-bold text-[11px] px-2.5 py-1 rounded shadow flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Signature</span>
                    </div>
                  )}

                  {/* Origin tag */}
                  {item.origin && (
                    <div className="absolute bottom-3 left-3 text-xs text-[#f8f3eb] font-medium drop-shadow">
                      {item.origin}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-serif text-lg font-bold text-[#281a13] group-hover:text-[#8c5b3c] transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-serif text-base font-bold text-[#543522] tabular-nums whitespace-nowrap">
                        {displayPrice}
                      </span>
                    </div>

                    <p className="text-xs text-[#6f472e] leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Tasting notes */}
                    {item.tastingNotes && item.tastingNotes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tastingNotes.slice(0, 3).map((note, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#f8f3eb] text-[#6f472e] border border-[#281a13]/10"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Customize / Quick Add */}
                  <div className="pt-3 border-t border-[#281a13]/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemForModal(item);
                      }}
                      className="text-xs font-semibold text-[#8c5b3c] hover:text-[#281a13] transition-colors flex items-center gap-1"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Options</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(item, e)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#543522] text-white hover:bg-[#c99a55] hover:text-[#281a13]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#fffdf9] rounded-xl border border-[#281a13]/10 p-8">
            <p className="text-base font-serif text-[#281a13] mb-2">No matching coffees found</p>
            <p className="text-xs text-[#7b7067] mb-4">
              Try adjusting your search terms or select "All Items"
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-bold bg-[#543522] text-white rounded-lg hover:bg-[#c99a55] hover:text-[#281a13]"
            >
              Reset Filters
            </button>
          </div>
        )}

        <p className="text-center text-xs text-[#7b7067] mt-10">
          * Prices in ETB are representative of Daru Coffee House menu. Customizations like fresh Tena&apos;adam rue herb are served complimentary.
        </p>
      </div>

      {/* Item Customization Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#fffdf9] rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#281a13]/15 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#a7783e] uppercase tracking-wider block">
                  {selectedItemForModal.amharicName}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#281a13]">
                  {selectedItemForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="p-1 rounded-lg text-[#7b7067] hover:text-[#281a13]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6f472e] leading-relaxed mb-6">
              {selectedItemForModal.description}
            </p>

            {/* Customization Options */}
            <div className="space-y-4 pt-4 border-t border-[#281a13]/10">
              {/* Tena'adam Rue Herb */}
              {selectedItemForModal.category === 'traditional' && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8f3eb] border border-[#281a13]/10">
                  <div>
                    <span className="text-xs font-bold text-[#281a13] block">
                      Tena&apos;adam (ጤና አዳም) Herb
                    </span>
                    <span className="text-[11px] text-[#7b7067]">
                      Traditional aromatic rue twig dipped in cup
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={customRue}
                    onChange={(e) => setCustomRue(e.target.checked)}
                    className="w-4 h-4 accent-[#543522] cursor-pointer"
                  />
                </div>
              )}

              {/* Sugar Level */}
              <div>
                <label className="text-xs font-bold text-[#281a13] block mb-2">
                  Sugar Preference
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['None', 'A little', 'Normal', 'Sweet'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setCustomSugar(s)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        customSugar === s
                          ? 'bg-[#543522] text-white border-[#543522]'
                          : 'bg-white text-[#543522] border-[#281a13]/15 hover:bg-[#f8f3eb]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Option for Espresso items */}
              {selectedItemForModal.category === 'espresso' && (
                <div>
                  <label className="text-xs font-bold text-[#281a13] block mb-2">
                    Milk Selection
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Whole', 'Oat', 'Almond', 'None'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setCustomMilk(m)}
                        className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          customMilk === m
                            ? 'bg-[#543522] text-white border-[#543522]'
                            : 'bg-white text-[#543522] border-[#281a13]/15 hover:bg-[#f8f3eb]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shot / Serving */}
              <div>
                <label className="text-xs font-bold text-[#281a13] block mb-2">
                  Serving Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Single', 'Double', 'Traditional'] as const).map((shot) => (
                    <button
                      key={shot}
                      onClick={() => setCustomShots(shot)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        customShots === shot
                          ? 'bg-[#543522] text-white border-[#543522]'
                          : 'bg-white text-[#543522] border-[#281a13]/15 hover:bg-[#f8f3eb]'
                      }`}
                    >
                      {shot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-[#281a13]/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#7b7067] block">Price</span>
                <span className="font-serif text-xl font-bold text-[#281a13] tabular-nums">
                  {currency === 'ETB'
                    ? `${selectedItemForModal.priceETB} ETB`
                    : `$${selectedItemForModal.priceUSD.toFixed(2)}`}
                </span>
              </div>

              <button
                onClick={handleConfirmCustomAdd}
                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#543522] text-white hover:bg-[#c99a55] hover:text-[#281a13] transition-colors"
              >
                Add Customized to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
