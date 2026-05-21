import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CARD_PEEK = 90; // px visible per stacked card (emoji + title + time)

const Itinerary = () => {
  const { t } = useTranslation();
  const events = t('itinerary.events', { returnObjects: true }) as any[];
  const numEvents = events.length;

  // How many cards are "revealed" (0 = none, numEvents = all)
  const [revealed, setRevealed] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      // The sticky panel starts when the section top hits 0
      // We allocate 260px of scroll per card to reveal it
      const scrolled = -rect.top; // positive when scrolled past section top
      const scrollPerCard = 260;
      const newRevealed = Math.min(
        numEvents,
        Math.max(0, Math.floor(scrolled / scrollPerCard) + 1)
      );
      setRevealed(newRevealed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [numEvents]);

  // Total scroll height: enough room for all cards to reveal one by one
  // plus some breathing room at the end before section exits
  const sectionHeight = `${numEvents * 260 + 400}px`;

  return (
    <div
      ref={sectionRef}
      style={{ minHeight: sectionHeight }}
      className="relative bg-xv-pearl"
    >
      {/* Sticky panel that stays on screen while user scrolls through section */}
      <div className="sticky top-0 py-16 px-6 bg-xv-pearl">
        <h2 className="text-center font-playfair italic text-4xl text-xv-red mb-4 animate-shimmer">
          {t('itinerary.title')}
        </h2>

        <div className="max-w-[480px] mx-auto text-center mb-8">
          <p className="font-cormorant italic text-gray-600 text-xl px-4 leading-relaxed">
            "Acompáñanos a compartir la alegría de un sueño hecho realidad...Tu presencia es nuestro mejor regalo."
          </p>
        </div>

        <div className="max-w-[480px] mx-auto relative">
          {/* Vertical Timeline */}
          <div className="absolute left-[24px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-xv-gold via-xv-red to-xv-gold opacity-30" />

          {/* Cards container — fixed height so it doesn't grow */}
          <div
            className="relative"
            style={{
              // Height = last card's top offset + full last card height (~220px)
              height: `${CARD_PEEK * (numEvents - 1) + 220}px`,
            }}
          >
            {events.map((event, idx) => {
              const isRevealed = idx < revealed;
              const isLast = idx === numEvents - 1;

              return (
                <div
                  key={idx}
                  className="absolute w-full pl-16 transition-all duration-500 ease-out"
                  style={{
                    top: `${idx * CARD_PEEK}px`,
                    zIndex: idx + 10,
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'translateY(0)' : 'translateY(30px)',
                  }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[18px] top-5 w-[14px] h-[14px] rounded-full bg-xv-gold border-[3px] border-xv-pearl shadow-sm z-10" />

                  {/* Event Card */}
                  <div className="bg-white rounded-xl border border-xv-gold/20 shadow-[0_4px_14px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="flex items-center gap-4 px-5 py-4">
                      <div className="text-2xl flex-shrink-0">{event.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-playfair font-bold text-lg text-xv-red leading-tight">
                          {event.title}
                        </h3>
                        <div className="font-josefin text-sm text-xv-gold tracking-wider font-semibold">
                          {event.time}
                        </div>
                      </div>
                    </div>

                    {/* Description shown on all cards */}
                    {event.desc && (
                      <div className="px-5 pb-4 -mt-1">
                        <p className="font-cormorant italic text-gray-500 text-lg leading-snug whitespace-pre-line">
                          {event.desc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
