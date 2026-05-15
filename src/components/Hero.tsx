import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG } from '../config';

const GRID_ROWS = 6;
const GRID_COLS = 5;

const Hero = () => {
  const { t } = useTranslation();
  const { days, hours, minutes, seconds } = useCountdown(CONFIG.eventDate);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [visiblePieces, setVisiblePieces] = useState<number[]>([]);

  const photos = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
  ];

  // Cycle through photos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 7500); // 7.5 seconds per photo
    return () => clearInterval(timer);
  }, []);

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
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-[radial-gradient(circle,_#2D0808_0%,_#0D0305_100%)] overflow-hidden py-20 px-4 text-center">
      
      {/* Decorative rings removed as requested */}

      {/* Floating horseshoe removed */}

      {/* Photo Slideshow with Puzzle Effect and Gold Glow Border */}
      <div className="z-10 mb-10 relative">
        <div className="p-[2px] bg-gradient-to-r from-xv-gold via-[#F5D76E] to-xv-gold rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.35)] animate-glow">
          <div className="w-[200px] h-[280px] md:w-[240px] md:h-[330px] bg-[#1a0f0f] rounded-[14px] overflow-hidden relative">
            
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

      {/* Main Title */}
      <div className="z-10 animate-shimmer text-xv-gold font-josefin tracking-[0.2em] mb-2">
        ✦ {t('heroTitle')} ✦
      </div>
      
      <h1 className="z-10 font-playfair italic text-[#F5D76E] leading-tight mb-4" style={{ fontSize: 'clamp(2.6rem, 9vw, 4.2rem)' }}>
        {CONFIG.quinceañeraName}
      </h1>

      <div className="z-10 font-josefin uppercase text-xv-gold opacity-55 tracking-widest mb-12">
        {new Date(CONFIG.eventDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>

      {/* Faltan Text */}
      <div className="z-10 font-josefin uppercase text-xv-gold tracking-[0.4em] mb-4 text-sm animate-pulse">
        FALTAN
      </div>

      {/* Countdown */}
      <div className="z-10 flex gap-3 md:gap-4 mb-16">
        {timeBlocks.map((block, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center w-[70px] h-[80px] md:w-[85px] md:h-[95px] bg-xv-gold/5 border border-xv-gold/20 rounded-lg animate-border-pulse backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
            <span className="font-playfair text-3xl md:text-4xl text-xv-pearl mb-1">{block.value}</span>
            <span className="font-josefin uppercase text-[10px] md:text-xs text-xv-gold opacity-55">{block.label}</span>
          </div>
        ))}
      </div>

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
