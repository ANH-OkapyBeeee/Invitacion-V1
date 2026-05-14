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
      <h2 className="text-center font-playfair italic text-4xl text-xv-red mb-16 animate-shimmer">{t('itinerary.title')}</h2>
      
      <div className="max-w-[480px] mx-auto relative">
        {/* Vertical Timeline */}
        <div className="absolute left-[24px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-xv-gold via-xv-red to-xv-gold opacity-30" />

        <div className="flex flex-col gap-8">
          {events.map((event, idx) => (
            <div 
              key={idx} 
              className={`relative pl-16 opacity-0 ${isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              {/* Timeline Dot */}
              <div className="absolute left-[18px] top-6 w-[14px] h-[14px] rounded-full bg-xv-gold border-[3px] border-xv-pearl shadow-sm z-10" />
              
              {/* Event Card */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-xv-gold/10 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">{event.emoji}</div>
                  <div>
                    <h3 className="font-playfair font-bold text-xl text-xv-red mb-1">{event.title}</h3>
                    <div className="font-josefin text-sm text-xv-gold tracking-wider mb-2 font-semibold">{event.time}</div>
                    <p className="font-cormorant italic text-gray-500 text-lg leading-snug">{event.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Itinerary;
