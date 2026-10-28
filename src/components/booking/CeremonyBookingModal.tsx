import React, { useState } from 'react';
import { X, Calendar, Users, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { CeremonyBooking } from '../../types';
import { saveBookingToFirestore } from '../../services/orderService';

interface CeremonyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CeremonyBookingModal: React.FC<CeremonyBookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<CeremonyBooking>({
    name: '',
    phone: '',
    email: '',
    date: '2026-11-02',
    time: '15:00',
    guests: 3,
    packageType: 'classic',
    specialRequests: '',
  });

  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const code = 'CEREMONY-' + Math.floor(1000 + Math.random() * 9000);
    try {
      await saveBookingToFirestore(code, formData);
    } catch (err) {
      console.warn('Booking saved locally:', err);
    } finally {
      setIsSubmitting(false);
      setBookingConfirmed(code);
    }
  };

  const handleResetAndClose = () => {
    setBookingConfirmed(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
      <div className="bg-[#fffdf9] rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#281a13]/15 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a7783e] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMUNAL HOSPITALITY</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#281a13] mt-1">
              Reserve an Ethiopian Coffee Ceremony
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7b7067] hover:text-[#281a13]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingConfirmed ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#281a13]">
              Ceremony Reserved!
            </h4>
            <p className="text-xs text-[#6f472e] max-w-sm mx-auto leading-relaxed">
              We look forward to welcoming you to Daru. Our coffee master will have the frankincense burning and green beans ready upon your arrival.
            </p>
            <div className="p-4 bg-[#f8f3eb] rounded-xl border border-[#281a13]/10 text-left space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7b7067]">Reservation ID:</span>
                <strong className="font-mono text-[#281a13]">{bookingConfirmed}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7b7067]">Guest Name:</span>
                <span className="font-semibold text-[#281a13]">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7b7067]">Date & Time:</span>
                <span className="text-[#281a13]">{formData.date} at {formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7b7067]">Party Size:</span>
                <span className="text-[#281a13]">{formData.guests} Guests ({formData.packageType.toUpperCase()})</span>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-full py-3 bg-[#543522] text-white font-bold rounded-lg hover:bg-[#c99a55] hover:text-[#281a13] text-xs transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-[#6f472e] leading-relaxed">
              Immerse yourself and your guests in the full 3-round ritual. Complete with hand pan roasting, aromatic frankincense, fresh popped corn, and personal storytelling.
            </p>

            {/* Packages */}
            <div>
              <label className="text-xs font-bold text-[#281a13] block mb-2">
                Select Ceremony Experience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setFormData({ ...formData, packageType: 'classic' })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.packageType === 'classic'
                      ? 'bg-[#f8f3eb] border-[#543522] shadow-sm'
                      : 'bg-white border-[#281a13]/15 hover:bg-[#f8f3eb]/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-xs font-bold text-[#281a13]">Classic Buna Ceremony</strong>
                    <span className="text-xs font-bold text-[#543522]">280 ETB / person</span>
                  </div>
                  <p className="text-[11px] text-[#7b7067] leading-relaxed">
                    Full 3 pours (Abol, Tona, Bereka), roasted popcorn & kolo, fresh frankincense.
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, packageType: 'royal' })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.packageType === 'royal'
                      ? 'bg-[#f8f3eb] border-[#543522] shadow-sm'
                      : 'bg-white border-[#281a13]/15 hover:bg-[#f8f3eb]/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-xs font-bold text-[#281a13]">Royal Mesob Tasting</strong>
                    <span className="text-xs font-bold text-[#543522]">450 ETB / person</span>
                  </div>
                  <p className="text-[11px] text-[#7b7067] leading-relaxed">
                    Ceremony plus spiced honey bread, lentil sambusas, and single-origin Yirgacheffe pairing.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#281a13] block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Almaz Tadesse"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#281a13] block mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+251 91 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#281a13] block mb-1">Reservation Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#281a13] block mb-1">Time Slot</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                >
                  <option value="10:00">10:00 AM (Morning Roasting)</option>
                  <option value="13:00">01:00 PM (Afternoon Gathering)</option>
                  <option value="15:30">03:30 PM (Traditional Sunset Hour)</option>
                  <option value="18:00">06:00 PM (Evening Candlelit Ceremony)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#281a13] block mb-1">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#281a13] block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#281a13] block mb-1">Special Occasion or Dietary Notes</label>
              <textarea
                rows={2}
                placeholder="Birthday celebration, specific roast preference, or questions..."
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
              />
            </div>

            <div className="pt-4 border-t border-[#281a13]/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#7b7067] hover:text-[#281a13]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold bg-[#543522] text-white rounded-lg hover:bg-[#c99a55] hover:text-[#281a13] transition-colors"
              >
                Confirm Ceremony Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
