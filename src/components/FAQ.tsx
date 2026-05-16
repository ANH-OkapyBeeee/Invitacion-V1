import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.7,
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 bg-xv-pearl overflow-hidden">
      <div className="max-w-[480px] mx-auto mb-10 text-center">
        <h2 className="font-playfair italic text-4xl text-xv-red mb-4 animate-shimmer">{t('faq.title')}</h2>
        <p className="font-cormorant text-lg text-gray-500 italic px-4">
          Desliza para ver más preguntas y toca para leer la respuesta
        </p>
      </div>

      <div className="relative max-w-[500px] mx-auto group px-4">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-12 no-scrollbar scroll-smooth px-[12%]"
        >
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              ref={el => cardRefs.current[idx] = el}
              data-index={idx}
              className={`flex-shrink-0 w-[260px] h-[340px] perspective-1000 snap-center transition-all duration-500 
                ${flippedIndex !== idx ? 'animate-vibrate' : ''} 
                ${activeIndex === idx ? 'scale-[1.02] z-10' : 'scale-95 opacity-60'}`}
              onClick={() => setFlippedIndex(flippedIndex === idx ? null : idx)}
            >
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flippedIndex === idx ? 'rotate-y-180' : ''}`}>
                
                {/* Front Side (Question) */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border border-xv-gold/20 shadow-lg flex flex-col items-center justify-center p-6 text-center group">
                  <div className="w-16 h-16 rounded-full bg-xv-pearl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    ❓
                  </div>
                  <h3 className="font-playfair text-xv-red text-xl font-bold leading-snug px-2">
                    {faq.q}
                  </h3>
                  <div className="mt-8 text-xv-gold font-josefin text-[10px] uppercase tracking-widest font-bold border-b border-xv-gold/30 pb-1">
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
