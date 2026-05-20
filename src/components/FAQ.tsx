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

  const handlePrev = () => {
    const newIdx = Math.max(0, activeIndex - 1);
    setFlippedIndex(null);
    const card = cardRefs.current[newIdx];
    if (card) {
      navigator.vibrate?.(40);
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const handleNext = () => {
    const newIdx = Math.min(faqs.length - 1, activeIndex + 1);
    setFlippedIndex(null);
    const card = cardRefs.current[newIdx];
    if (card) {
      navigator.vibrate?.(40);
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

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
        {/* Left Arrow */}
        {activeIndex > 0 && (
          <button 
            onClick={handlePrev}
            className="absolute left-6 top-[45%] -translate-y-1/2 z-20 p-3.5 md:p-2.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-sm text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 md:w-4 md:h-4 text-xv-red">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {activeIndex < faqs.length - 1 && (
          <button 
            onClick={handleNext}
            className="absolute right-6 top-[45%] -translate-y-1/2 z-20 p-3.5 md:p-2.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-sm text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 md:w-4 md:h-4 text-xv-red">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-12 no-scrollbar scroll-smooth px-[12%]"
        >
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              ref={el => { cardRefs.current[idx] = el; }}
              data-index={idx}
              className={`flex-shrink-0 w-[260px] h-[340px] perspective-1000 snap-center transition-all duration-500 
                ${flippedIndex !== idx ? 'animate-vibrate' : ''} 
                ${activeIndex === idx ? 'scale-[1.02] z-10' : 'scale-95 opacity-60'}`}
              onClick={() => {
                navigator.vibrate?.(40);
                setFlippedIndex(flippedIndex === idx ? null : idx);
              }}
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
