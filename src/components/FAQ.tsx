import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') }
  ];

  return (
    <section className="py-20 px-4 bg-xv-pearl overflow-hidden">
      <div className="max-w-[480px] mx-auto mb-10 text-center">
        <h2 className="font-playfair italic text-4xl text-xv-red mb-4 animate-shimmer">{t('faq.title')}</h2>
        <p className="font-cormorant text-lg text-gray-500 italic px-4">
          Desliza para ver más preguntas y toca para leer la respuesta
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 pb-12 no-scrollbar scroll-smooth">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-[280px] h-[340px] perspective-1000 snap-center first:ml-4 last:mr-4"
            onClick={() => setFlippedIndex(flippedIndex === idx ? null : idx)}
          >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flippedIndex === idx ? 'rotate-y-180' : ''}`}>
              
              {/* Front Side (Question) */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border border-xv-gold/20 shadow-xl flex flex-col items-center justify-center p-8 text-center group">
                <div className="w-16 h-16 rounded-full bg-xv-pearl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  ❓
                </div>
                <h3 className="font-playfair text-xv-red text-xl font-bold leading-snug">
                  {faq.q}
                </h3>
                <div className="mt-8 text-xv-gold font-josefin text-[10px] uppercase tracking-widest font-bold border-b border-xv-gold/30 pb-1 animate-strong-pulse">
                  Toca para ver respuesta
                </div>
              </div>

              {/* Back Side (Answer) */}
              <div className="absolute inset-0 backface-hidden bg-[#6E1423] text-white rounded-3xl border border-xv-gold/40 shadow-2xl flex flex-col items-center justify-center p-8 text-center rotate-y-180">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-3xl mb-6">
                  ✨
                </div>
                <div className="overflow-y-auto max-h-[180px] px-2 custom-scrollbar">
                  <p className="font-cormorant italic text-lg leading-relaxed text-xv-pearl">
                    {faq.a}
                  </p>
                </div>
                <div className="mt-8 text-xv-gold font-josefin text-[10px] uppercase tracking-widest font-bold opacity-80">
                  Toca para cerrar
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {/* Visual scroll indicator */}
      <div className="flex justify-center gap-3">
        <div className="w-10 h-1 bg-xv-gold/20 rounded-full overflow-hidden">
          <div className="h-full bg-xv-red w-1/3 animate-float" />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
