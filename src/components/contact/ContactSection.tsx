import React, { useState } from 'react';
import { MapPin, Clock, Phone, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const faqs = [
    {
      q: 'What makes the Ethiopian Buna ceremony so revered?',
      a: 'The Ethiopian coffee ceremony is an intangible cultural treasure. It is one of the only rituals in the world where green raw beans are roasted in front of you over live coals, wafted for guests to inhale the aroma, crushed by hand in a mortar, and brewed three times in an authentic clay Jebena pot.',
    },
    {
      q: 'Do I have to drink all three rounds (Abol, Tona, Bereka)?',
      a: 'While you are welcome to enjoy at your own pace, traditional customs encourage experiencing all three pours. Abol sets your mind, Tona deepens conversation, and Bereka bestows the host’s sacred blessing of peace and goodwill before you depart.',
    },
    {
      q: 'Can I purchase roasted whole beans to brew at home?',
      a: 'Yes! We roast fresh batches of single-origin Yirgacheffe, Sidama, Guji, and Harrar longberry beans daily. You can order directly through our cart, via WhatsApp, or in person at the coffee house counter.',
    },
    {
      q: 'What is the green leaf often served with the cup?',
      a: 'That is Tena\'adam (ጤና አዳም), commonly known as rue or the "Health of Adam". Dipping a small sprig into the hot Buna adds a crisp, citrusy herbal aroma believed in Ethiopian traditional medicine to aid digestion and uplift the spirit.',
    },
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setInquiryName('');
      setInquiryMessage('');
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#fffdf9] border-b border-[#281a13]/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#a7783e] uppercase mb-3">
            <span>WE WOULD LOVE TO WELCOME YOU</span>
            <span aria-hidden="true">·</span>
            <span>ያግኙን</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-[#281a13] tracking-tight mb-4">
            Come Say Hello
          </h2>

          <p className="text-sm sm:text-base text-[#6f472e] leading-relaxed">
            Your next favorite cup of Ethiopian coffee is waiting. Visit our sanctuary or message us directly via WhatsApp.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-2xl bg-[#f8f3eb] border border-[#281a13]/10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#543522] text-[#dfb679] flex items-center justify-center mb-4 shadow">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#281a13] mb-1">
              Our Location
            </h3>
            <p className="text-xs text-[#6f472e] leading-relaxed max-w-xs">
              Bole Sub-City, Cameroon Street<br />
              Near Edna Mall Promenade<br />
              Addis Ababa, Ethiopia
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#f8f3eb] border border-[#281a13]/10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#543522] text-[#dfb679] flex items-center justify-center mb-4 shadow">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#281a13] mb-1">
              Opening Hours
            </h3>
            <p className="text-xs text-[#6f472e] leading-relaxed">
              <strong>Mon – Fri:</strong> 06:30 AM – 10:00 PM<br />
              <strong>Sat – Sun:</strong> 07:00 AM – 11:00 PM<br />
              <span className="text-[#a7783e] font-semibold text-[11px]">Continuous Weekend Ceremony</span>
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#f8f3eb] border border-[#281a13]/10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#543522] text-[#dfb679] flex items-center justify-center mb-4 shadow">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#281a13] mb-1">
              Direct Contact
            </h3>
            <p className="text-xs text-[#6f472e] leading-relaxed mb-3">
              Tel:{' '}
              <a
                href="tel:+251993807667"
                className="font-medium text-[#281a13] hover:text-[#c99a55] transition-colors"
              >
                +251 99 380 7667
              </a>
              <br />
              Email:{' '}
              <a
                href="mailto:mseid8410@gmail.com"
                className="font-medium text-[#281a13] hover:text-[#c99a55] transition-colors underline decoration-[#c99a55]/40 underline-offset-2"
              >
                mseid8410@gmail.com
              </a>
            </p>
            <a
              href="https://wa.me/251993807667"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba59] transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* FAQ Accordion & Quick Inquiry Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl font-bold text-[#281a13] mb-6">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#281a13]/15 rounded-xl bg-[#f8f3eb] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left font-serif font-semibold text-sm text-[#281a13] flex items-center justify-between gap-4 hover:text-[#c99a55] transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#8c5b3c] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#7b7067] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-[#6f472e] leading-relaxed pt-1 border-t border-[#281a13]/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl bg-[#f8f3eb] border border-[#281a13]/10 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#281a13] mb-2">
              Send a Note to Daru
            </h3>
            <p className="text-xs text-[#7b7067] mb-5 leading-relaxed">
              Inquire about private coffee tastings, wholesale roasted beans, or cultural events.
            </p>

            {messageSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <span className="text-2xl block" aria-hidden="true">💌</span>
                <strong className="text-xs font-bold text-emerald-800 block">
                  Thank you! Message Received.
                </strong>
                <p className="text-[11px] text-emerald-700">
                  Our coffee host will reply promptly with warm Ethiopian hospitality.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="How can we assist you?"
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#281a13]/15 text-[#281a13] focus:outline-none focus:border-[#c99a55]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#543522] hover:bg-[#c99a55] hover:text-[#281a13] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
