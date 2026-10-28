import React, { useState } from 'react';
import { CartItem } from '../../types';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { saveOrderToFirestore } from '../../services/orderService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  currency: 'ETB' | 'USD';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency,
}) => {
  const [orderType, setOrderType] = useState<'Dine-in' | 'Pick-up' | 'Delivery'>('Dine-in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notesOrTable, setNotesOrTable] = useState('');
  const [confirmedOrderCode, setConfirmedOrderCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalETB = items.reduce((sum, item) => sum + item.item.priceETB * item.quantity, 0);
  const totalUSD = items.reduce((sum, item) => sum + item.item.priceUSD * item.quantity, 0);

  const formattedTotal = currency === 'ETB' ? `${totalETB} ETB` : `$${totalUSD.toFixed(2)}`;

  const handleSendWhatsApp = async () => {
    if (items.length === 0) return;

    const code = 'DARU-' + Math.floor(1000 + Math.random() * 9000);
    // Save to Firestore in background
    saveOrderToFirestore(
      code,
      customerName,
      customerPhone,
      orderType,
      notesOrTable,
      items,
      totalETB
    );

    let text = `☕ *Daru Coffee House Order* [Ref: ${code}]\n`;
    text += `👤 *Customer:* ${customerName || 'Guest'}\n`;
    text += `📞 *Phone:* ${customerPhone || 'Not provided'}\n`;
    text += `📍 *Order Type:* ${orderType} ${notesOrTable ? `(${notesOrTable})` : ''}\n\n`;
    text += `📋 *Items:*\n`;

    items.forEach((cItem, i) => {
      text += `${i + 1}. *${cItem.item.name}* (x${cItem.quantity}) - ${cItem.item.priceETB * cItem.quantity} ETB\n`;
      if (cItem.customization) {
        const cust = cItem.customization;
        const details = [];
        if (cust.rueHerb) details.push("With Tena'adam");
        if (cust.sugar) details.push(`Sugar: ${cust.sugar}`);
        if (cust.milk && cust.milk !== 'None') details.push(`Milk: ${cust.milk}`);
        if (cust.shots) details.push(`Serving: ${cust.shots}`);
        if (details.length > 0) text += `   └ _${details.join(' · ')}_\n`;
      }
    });

    text += `\n💰 *Total:* ${totalETB} ETB\n`;
    text += `✨ Sent from Daru Coffee House 3D Web App`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/251993807667?text=${encoded}`, '_blank');
  };

  const handleDirectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    const code = 'DARU-' + Math.floor(1000 + Math.random() * 9000);
    try {
      await saveOrderToFirestore(
        code,
        customerName,
        customerPhone,
        orderType,
        notesOrTable,
        items,
        totalETB
      );
    } catch (err) {
      console.warn('Proceeding with local confirmation:', err);
    } finally {
      setIsSubmitting(false);
      setConfirmedOrderCode(code);
    }
  };

  const handleFinishOrder = () => {
    onClearCart();
    setConfirmedOrderCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#fffdf9] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#281a13]/10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#281a13]/10 flex items-center justify-between bg-[#f8f3eb]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#543522]" />
            <h3 className="font-serif text-lg font-bold text-[#281a13]">
              Your Coffee Order
            </h3>
            <span className="text-xs bg-[#543522] text-white px-2 py-0.5 rounded-full font-bold">
              {items.reduce((acc, curr) => acc + curr.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7b7067] hover:text-[#281a13]"
            aria-label="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {confirmedOrderCode ? (
            /* Order Confirmation View */
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#281a13]">
                Order Confirmed!
              </h4>
              <p className="text-xs text-[#6f472e] max-w-xs mx-auto leading-relaxed">
                Your Buna is being prepared fresh in our handcrafted clay Jebena over glowing coals.
              </p>
              <div className="p-4 bg-[#f8f3eb] rounded-xl border border-[#281a13]/10 text-left space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#7b7067]">Order Reference:</span>
                  <strong className="text-[#281a13] font-mono">{confirmedOrderCode}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#7b7067]">Type:</span>
                  <span className="font-medium text-[#281a13]">{orderType}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-[#281a13]/10">
                  <span className="font-bold text-[#281a13]">Amount Paid:</span>
                  <span className="font-bold text-[#543522]">{formattedTotal}</span>
                </div>
              </div>
              <button
                onClick={handleFinishOrder}
                className="w-full py-3 bg-[#543522] text-white font-bold rounded-lg hover:bg-[#c99a55] hover:text-[#281a13] text-xs transition-colors"
              >
                Close & Return to Menu
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty state */
            <div className="py-16 text-center space-y-3">
              <span className="text-4xl block" aria-hidden="true">☕</span>
              <h4 className="font-serif text-lg font-bold text-[#281a13]">
                Your cart is empty
              </h4>
              <p className="text-xs text-[#7b7067] max-w-xs mx-auto">
                Discover our traditional clay-brewed Buna and single-origin beans in the menu!
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#543522] text-white text-xs font-bold rounded-lg hover:bg-[#c99a55] hover:text-[#281a13] transition-colors"
              >
                Browse Coffee Menu
              </button>
            </div>
          ) : (
            /* Item list */
            <>
              <div className="space-y-4">
                {items.map((cartItem, idx) => {
                  const itemTotal =
                    currency === 'ETB'
                      ? `${cartItem.item.priceETB * cartItem.quantity} ETB`
                      : `$${(cartItem.item.priceUSD * cartItem.quantity).toFixed(2)}`;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#f8f3eb] border border-[#281a13]/10 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#281a13]">
                            {cartItem.item.name}
                          </h4>
                          <span className="text-[11px] text-[#8c5b3c]">
                            {cartItem.item.amharicName}
                          </span>
                        </div>
                        <span className="font-bold text-xs text-[#543522] tabular-nums">
                          {itemTotal}
                        </span>
                      </div>

                      {/* Customization tags */}
                      {cartItem.customization && (
                        <div className="text-[11px] text-[#7b7067] bg-white/70 p-1.5 rounded flex flex-wrap gap-x-2 gap-y-0.5">
                          {cartItem.customization.rueHerb && <span>• With Tena&apos;adam</span>}
                          {cartItem.customization.sugar && (
                            <span>• Sugar: {cartItem.customization.sugar}</span>
                          )}
                          {cartItem.customization.milk && cartItem.customization.milk !== 'None' && (
                            <span>• Milk: {cartItem.customization.milk}</span>
                          )}
                          {cartItem.customization.shots && (
                            <span>• {cartItem.customization.shots}</span>
                          )}
                        </div>
                      )}

                      {/* Stepper & Delete */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-[#281a13]/15 px-2 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                            className="p-1 text-[#543522] hover:text-[#c99a55]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#281a13] tabular-nums px-1">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                            className="p-1 text-[#543522] hover:text-[#c99a55]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-[#a89a8c] hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Details Form */}
              <div className="pt-4 border-t border-[#281a13]/10 space-y-3">
                <h4 className="text-xs font-bold text-[#281a13] uppercase tracking-wider">
                  Order Details
                </h4>

                {/* Dine-in vs Takeaway vs Delivery */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#f8f3eb] rounded-lg border border-[#281a13]/10">
                  {(['Dine-in', 'Pick-up', 'Delivery'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`py-1.5 text-xs font-semibold rounded transition-colors ${
                        orderType === type
                          ? 'bg-[#543522] text-white shadow-sm'
                          : 'text-[#543522] hover:bg-white/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                  />
                  <input
                    type="text"
                    placeholder={
                      orderType === 'Dine-in'
                        ? 'Table Number or seating area'
                        : orderType === 'Delivery'
                        ? 'Delivery address in town'
                        : 'Pick-up time / notes'
                    }
                    value={notesOrTable}
                    onChange={(e) => setNotesOrTable(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!confirmedOrderCode && items.length > 0 && (
          <div className="p-6 border-t border-[#281a13]/10 bg-[#f8f3eb] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7b7067]">Order Subtotal:</span>
              <strong className="font-serif text-xl font-bold text-[#281a13] tabular-nums">
                {formattedTotal}
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </button>

              <button
                type="button"
                onClick={handleDirectConfirm}
                className="w-full py-2.5 px-3 bg-[#543522] hover:bg-[#c99a55] hover:text-[#281a13] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Order</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
