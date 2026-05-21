import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Itinerary = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const events = t('itinerary.events', { returnObjects: true }) as any[];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-xv-pearl text-xv-black-bg relative">
      <h2 className="text-center font-playfair italic text-4xl text-xv-red mb-6 animate-shimmer">{t('itinerary.title')}</h2>
      
      <div className="max-w-[480px] mx-auto text-center mb-16">
        <p className="font-cormorant italic text-gray-600 text-xl px-4 leading-relaxed">
          "Acompáñanos a compartir la alegría de un sueño hecho realidad...Tu presencia es nuestro mejor regalo."
        </p>
      </div>
      
      <div className="max-w-[480px] mx-auto relative">
        {/* Vertical Timeline */}
        <div className="absolute left-[24px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-xv-gold via-xv-red to-xv-gold opacity-30" />

        <div className="flex flex-col gap-8 pb-[70vh]">
          {events.map((event, idx) => {
            return (
              <div 
                key={idx} 
                className="sticky"
                style={{ 
                  top: `${60 + (idx * 75)}px`,
                  zIndex: idx + 10
                }}
              >
                <div
                  className={`relative pl-16 opacity-0 transition-transform duration-500 ease-out ${isVisible ? 'animate-fade-in-up' : ''}`}
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[18px] top-6 w-[14px] h-[14px] rounded-full border-[3px] border-xv-pearl shadow-sm z-10 transition-colors duration-500 bg-xv-gold" />
                  
                  {/* Event Card */}
                  <div className="bg-white p-5 rounded-xl shadow-[0_-10px_20px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.05)] border border-xv-gold/20 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl mt-1">{event.emoji}</div>
                      <div>
                        <h3 className="font-playfair font-bold text-xl text-xv-red mb-1">{event.title}</h3>
                        <div className="font-josefin text-sm text-xv-gold tracking-wider mb-2 font-semibold">{event.time}</div>
                        <p className="font-cormorant italic text-gray-500 text-lg leading-snug whitespace-pre-line">{event.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Itinerary;
