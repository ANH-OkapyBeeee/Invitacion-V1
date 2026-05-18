import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG } from '../config';

const GRID_ROWS = 6;
const GRID_COLS = 5;

const Hero = () => {
  const { t } = useTranslation();
  const now = new Date();
  const eventDay = 22;
  const eventMonth = 7; // August is 7 (0-indexed)
  const eventYear = 2026;
  
  // Determine target date (reset to next year after Aug 24, 2026)
  const resetLimit = new Date(2026, 7, 24);
  const eventDateStr = now >= resetLimit 
    ? "2027-08-22T15:00:00" 
    : CONFIG.eventDate;

  const { days, hours, minutes, seconds } = useCountdown(eventDateStr);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [visiblePieces, setVisiblePieces] = useState<number[]>([]);

  // Swipe detection refs & handlers
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const diffX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 55;
    
    if (diffX > swipeThreshold) {
      navigator.vibrate?.([40, 20, 40]);
      handleNext();
    } else if (diffX < -swipeThreshold) {
      navigator.vibrate?.([40, 20, 40]);
      handlePrev();
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Phase Logic for Messages
  const isEventDay = now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 22;
  const isAfterReset = now >= resetLimit;

  let countdownTitle = t('hero.faltan'); // Default: "FALTAN"
  let statusMessage = "";
  let showCountdown = true;

  if (isEventDay) {
    const currentHour = now.getHours();
    const eventTime = new Date(CONFIG.eventDate);
    
    if (now < eventTime) {
      countdownTitle = "¡Recuerda que hoy es el gran día!";
    } else {
      showCountdown = false;
      countdownTitle = ""; // Remove 'FALTAN'
      if (currentHour < 16) {
        statusMessage = "Prepárate porque ya está por comenzar la misa";
      } else if (currentHour < 17) {
        statusMessage = "Ya es hora de irnos al salón";
      } else {
        statusMessage = "¡Gracias por acompañarnos! Es un honor compartir este día tan especial con todos ustedes.";
      }
    }
  } else if (isAfterReset) {
    countdownTitle = t('hero.faltan');
  }

  const photos = [
    '/Fotos/1.JPG',
    '/Fotos/2.JPG',
    '/Fotos/3.JPG',
    '/Fotos/4.JPG',
    '/Fotos/4.2.jpeg',
    '/Fotos/5.JPG',
    '/Fotos/7.jpg',
    '/Fotos/9.JPG',
    '/Fotos/10.jpg'
  ];

  const prevPhoto = (currentPhoto - 1 + photos.length) % photos.length;
  const nextPhoto = (currentPhoto + 1) % photos.length;

  const handleNext = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Cycle through photos
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 7500); // 7.5 seconds per photo
    return () => clearTimeout(timer);
  }, [currentPhoto]);

  // Handle puzzle piece assembly
  useEffect(() => {
    setVisiblePieces([]); // Clear for new photo
    const totalPieces = GRID_ROWS * GRID_COLS;
    const pieceIndices = Array.from({ length: totalPieces }, (_, i) => i);
    
    // Shuffle indices for random entrance
    for (let i = pieceIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieceIndices[i], pieceIndices[j]] = [pieceIndices[j], pieceIndices[i]];
    }

    // Sequence pieces
    pieceIndices.forEach((pieceIdx, i) => {
      setTimeout(() => {
        setVisiblePieces(prev => [...prev, pieceIdx]);
      }, i * 90); // ~1.8s for full assembly
    });
  }, [currentPhoto]);

  const timeBlocks = [
    { value: days, label: t('countdown.days') },
    { value: hours, label: t('countdown.hours') },
    { value: minutes, label: t('countdown.minutes') },
    { value: seconds, label: t('countdown.seconds') }
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-start bg-[radial-gradient(circle,_#2D0808_0%,_#0D0305_100%)] overflow-hidden pt-36 sm:pt-40 md:pt-44 pb-20 px-4 text-center bg-pearl-toggle transition-all duration-1000 ease-in-out">
      
      {/* Decorative rings removed as requested */}

      {/* Floating horseshoe removed */}

      {/* Premium Carousel Section with viewport-clipped edges */}
      <div 
        className="z-10 mb-10 md:mb-6 w-screen max-w-full overflow-y-visible overflow-x-clip pt-2 pb-4 flex justify-center touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-8 relative">
          
          {/* Left Rectangle (Previous Photo) */}
          <button
            onClick={() => {
              navigator.vibrate?.([40, 20, 40]);
              handlePrev();
            }}
            className="group w-[120px] h-[170px] sm:w-[135px] sm:h-[190px] md:w-[195px] md:h-[275px] rounded-xl overflow-hidden border border-white/20 filter grayscale opacity-35 transition-all duration-700 hover:opacity-80 hover:scale-105 active:scale-95 shadow-md flex-shrink-0 cursor-pointer focus:outline-none -translate-x-3 sm:-translate-x-4 md:-translate-x-0 relative"
            style={{
              backgroundImage: `url(${photos[prevPhoto]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Left Chevron Overlay (Desktop only, high-contrast gray/black design) */}
            <div className="hidden md:flex absolute inset-0 bg-black/5 items-center justify-center transition-all duration-700 group-hover:bg-black/20 z-20">
              <div className="p-2.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-sm text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500 animate-bounce-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
            </div>
          </button>

          {/* Center Rectangle (Active Photo with Gold Glow Border & Puzzle Effect) */}
          <div className="relative flex-shrink-0 transition-all duration-700 transform scale-100 z-10">
            
            {/* Crown crowning the central image */}
            <div className="absolute top-[-115px] sm:top-[-130px] md:top-[-165px] left-1/2 -translate-x-1/2 w-[230px] sm:w-[260px] md:w-[330px] h-[115px] sm:h-[130px] md:h-[165px] z-20 pointer-events-none transition-all duration-1000 ease-in-out">
              <img 
                src="/Fotos/Corona/corona.png" 
                alt="Crown Logo" 
                className="w-full h-full object-contain crown-image"
              />
            </div>

            <div className="p-[2px] bg-gradient-to-r from-xv-gold via-[#F5D76E] to-xv-gold rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.45)] animate-glow">
              <div className="w-[190px] h-[270px] sm:w-[210px] sm:h-[300px] md:w-[260px] md:h-[370px] bg-[#1a0f0f] rounded-[14px] overflow-hidden relative">
                
                {/* Puzzle Grid */}
                {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
                  const row = Math.floor(i / GRID_COLS);
                  const col = i % GRID_COLS;
                  const isVisible = visiblePieces.includes(i);
                  
                  return (
                    <div 
                      key={i}
                      className="absolute transition-all duration-1000 ease-out"
                      style={{
                        width: `${100 / GRID_COLS + 0.4}%`, // SLight overlap to prevent lines
                        height: `${100 / GRID_ROWS + 0.4}%`,
                        left: `${col * (100 / GRID_COLS)}%`,
                        top: `${row * (100 / GRID_ROWS)}%`,
                        backgroundImage: `url(${photos[currentPhoto]})`,
                        backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
                        backgroundPosition: `${(col / (GRID_COLS - 1)) * 100}% ${(row / (GRID_ROWS - 1)) * 100}%`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'scale(1) rotate(0deg)' : `scale(0.2) rotate(${(Math.random() - 0.5) * 90}deg)`,
                        zIndex: isVisible ? 1 : 0
                      }}
                    />
                  );
                })}

                {/* Overlay gradient for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-[10]" />
              </div>
            </div>
          </div>

          {/* Right Rectangle (Next Photo) */}
          <button
            onClick={() => {
              navigator.vibrate?.([40, 20, 40]);
              handleNext();
            }}
            className="group w-[120px] h-[170px] sm:w-[135px] sm:h-[190px] md:w-[195px] md:h-[275px] rounded-xl overflow-hidden border border-white/20 filter grayscale opacity-35 transition-all duration-700 hover:opacity-80 hover:scale-105 active:scale-95 shadow-md flex-shrink-0 cursor-pointer focus:outline-none translate-x-3 sm:translate-x-4 md:translate-x-0 relative"
            style={{
              backgroundImage: `url(${photos[nextPhoto]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Right Chevron Overlay (Desktop only, high-contrast gray/black design) */}
            <div className="hidden md:flex absolute inset-0 bg-black/5 items-center justify-center transition-all duration-700 group-hover:bg-black/20 z-20">
              <div className="p-2.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-sm text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500 animate-bounce-right">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* Main Title */}
      <div className="z-10 animate-shimmer text-xv-gold font-josefin text-2xl md:text-3xl font-bold tracking-[0.25em] mb-2 md:mb-1">
        ✦ {t('heroTitle')} ✦
      </div>
      
      <h1 className="z-10 font-playfair italic text-[#F5D76E] leading-tight mb-4 md:mb-2" style={{ fontSize: 'clamp(2.6rem, 9vw, 4.2rem)' }}>
        {CONFIG.quinceañeraName}
      </h1>

      <div className="z-10 font-josefin uppercase text-xv-gold opacity-75 text-[15px] md:text-[18px] font-semibold tracking-[0.25em] mb-12 md:mb-6">
        {new Date(CONFIG.eventDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>

      {/* Faltan Text / Event Day Title */}
      {countdownTitle && (
        <div className="z-10 font-josefin uppercase text-xv-gold tracking-[0.4em] mb-4 md:mb-2 text-sm animate-pulse">
          {countdownTitle}
        </div>
      )}

      {/* Countdown or Status Message */}
      {showCountdown ? (
        <div className="z-10 flex gap-3 md:gap-6 mb-16 md:mb-8">
          {timeBlocks.map((block, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center w-[78px] h-[90px] md:w-[105px] md:h-[115px] bg-xv-gold/[0.08] border border-xv-gold/30 rounded-xl animate-border-pulse backdrop-blur-sm shadow-[0_4px_25px_rgba(212,175,55,0.15)] card-pearl-toggle transition-all duration-1000 ease-in-out">
              <span className="font-playfair text-4xl md:text-5xl text-xv-pearl mb-1 font-bold name-pearl-toggle transition-all duration-1000 ease-in-out">{block.value}</span>
              <span className="font-josefin uppercase text-[11px] md:text-[13px] text-xv-gold tracking-widest opacity-80">{block.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="z-10 mb-16 md:mb-8 max-w-[400px] mx-auto px-4">
          <p className="font-playfair italic text-2xl text-white leading-relaxed animate-fade-in name-pearl-toggle transition-all duration-1000 ease-in-out">
            {statusMessage}
          </p>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 z-10 animate-scroll-hint">
        <div className="font-josefin uppercase text-xs tracking-widest text-xv-gold">
          ↓ {t('scroll')} ↓
        </div>
      </div>
    </section>
  );
};

export default Hero;
