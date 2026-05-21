import React, { useState, useEffect, useRef } from 'react';

// Photos ordered from HIGHEST number to LOWEST (most recent → baby)
const TIMELINE_PHOTOS = [
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/14.png',  era: 'Hoy' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/13.png',  era: 'Casi allá' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/12.png',  era: 'Creciendo' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/10.jpg',  era: 'La niñez' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/9.JPG',   era: 'La niñez' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/7.jpg',   era: 'Los primeros pasos' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/6.png',   era: 'Los primeros pasos' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/5.JPG',   era: 'La infancia' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/4.4.jpg', era: 'La infancia' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/4.JPG',   era: 'Los primeros años' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/3.JPG',   era: 'Los primeros años' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/2.JPG',   era: 'Bebé' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/1.JPG',   era: 'Bebé' },
];

const GRID_ROWS = 6;
const GRID_COLS = 5;

const TimelineGallery = () => {
  const [current, setCurrent] = useState(0);
  const [visiblePieces, setVisiblePieces] = useState<number[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const total = TIMELINE_PHOTOS.length;
  const prev = (current - 1 + total) % total;
  const next = (current + 1) % total;

  const handleNext = () => setCurrent(c => (c + 1) % total);
  const handlePrev = () => setCurrent(c => (c - 1 + total) % total);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 55) { navigator.vibrate?.([40, 20, 40]); handleNext(); }
    else if (diff < -55) { navigator.vibrate?.([40, 20, 40]); handlePrev(); }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto-advance every 7.5s
  useEffect(() => {
    const t = setTimeout(handleNext, 7500);
    return () => clearTimeout(t);
  }, [current]);

  // Puzzle piece reveal
  useEffect(() => {
    setVisiblePieces([]);
    const totalPieces = GRID_ROWS * GRID_COLS;
    const indices = Array.from({ length: totalPieces }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.forEach((pieceIdx, i) => {
      setTimeout(() => setVisiblePieces(prev => [...prev, pieceIdx]), i * 90);
    });
  }, [current]);

  // Section entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const photo = TIMELINE_PHOTOS[current];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 bg-[radial-gradient(ellipse_at_top,_#2D0808_0%,_#0D0305_100%)] text-center text-white overflow-hidden"
    >
      {/* Subtle golden particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-xv-gold opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Section Title */}
      <div className={`mb-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="font-josefin uppercase text-xv-gold tracking-[0.3em] text-xs mb-3 opacity-70">
          ✦ Un viaje en el tiempo ✦
        </div>
        <h2 className="font-playfair italic text-4xl md:text-5xl text-[#F5D76E] animate-shimmer mb-2">
          De entonces a hoy
        </h2>
        <p className="font-cormorant italic text-white/60 text-lg max-w-[400px] mx-auto leading-relaxed">
          Cada foto guarda un instante irrepetible en el camino de convertirse en quinceañera
        </p>
      </div>

      {/* Timeline progress bar */}
      <div className={`flex items-center justify-center gap-1.5 mt-6 mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {TIMELINE_PHOTOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-500 rounded-full ${
              idx === current
                ? 'w-8 h-2 bg-xv-gold shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                : idx < current
                ? 'w-2 h-2 bg-xv-gold/50'
                : 'w-2 h-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Era badge */}
      <div className={`transition-all duration-500 mb-6 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="inline-flex items-center gap-2 font-josefin text-xs uppercase tracking-[0.25em] text-xv-gold bg-xv-gold/10 border border-xv-gold/30 px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-xv-gold animate-pulse" />
          {photo.era}
        </span>
      </div>

      {/* Carousel */}
      <div
        className="w-screen max-w-full overflow-y-visible overflow-x-clip pt-2 pb-4 flex justify-center touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-8 relative">

          {/* Left card (prev) */}
          <button
            onClick={() => { navigator.vibrate?.([40, 20, 40]); handlePrev(); }}
            className="group w-[120px] h-[170px] sm:w-[135px] sm:h-[190px] md:w-[195px] md:h-[275px] rounded-xl overflow-hidden border border-white/20 filter grayscale opacity-35 transition-all duration-700 hover:opacity-80 hover:scale-105 active:scale-95 shadow-md flex-shrink-0 cursor-pointer focus:outline-none -translate-x-3 sm:-translate-x-4 md:-translate-x-0 relative"
            style={{
              backgroundImage: `url(${TIMELINE_PHOTOS[prev].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-y-0 right-1.5 md:right-3 flex items-center justify-end z-20 pointer-events-none">
              <div className="p-2 md:p-2.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-sm text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:bg-white transition-all duration-500 animate-bounce-left pointer-events-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
            </div>
          </button>

          {/* Center card (active, puzzle effect) */}
          <div className="relative flex-shrink-0 z-10">
            {/* Glowing gold border + puzzle reveal */}
            <div className="p-[2px] bg-gradient-to-r from-xv-gold via-[#F5D76E] to-xv-gold rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.45)] animate-glow">
              <div className="w-[190px] h-[270px] sm:w-[210px] sm:h-[300px] md:w-[260px] md:h-[370px] bg-[#1a0f0f] rounded-[14px] overflow-hidden relative">

                {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
                  const row = Math.floor(i / GRID_COLS);
                  const col = i % GRID_COLS;
                  const visible = visiblePieces.includes(i);
                  return (
                    <div
                      key={i}
                      className="absolute transition-all duration-1000 ease-out"
                      style={{
                        width: `${100 / GRID_COLS + 0.4}%`,
                        height: `${100 / GRID_ROWS + 0.4}%`,
                        left: `${col * (100 / GRID_COLS)}%`,
                        top: `${row * (100 / GRID_ROWS)}%`,
                        backgroundImage: `url(${photo.src})`,
                        backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
                        backgroundPosition: `${(col / (GRID_COLS - 1)) * 100}% ${(row / (GRID_ROWS - 1)) * 100}%`,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'scale(1) rotate(0deg)' : `scale(0.2) rotate(${(Math.random() - 0.5) * 90}deg)`,
                      }}
                    />
                  );
                })}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

                {/* Counter badge */}
                <div className="absolute bottom-3 right-3 z-20 bg-black/55 text-white font-josefin text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {current + 1}/{total}
                </div>
              </div>
            </div>

          </div>

          {/* Right card (next) */}
          <button
            onClick={() => { navigator.vibrate?.([40, 20, 40]); handleNext(); }}
            className="group w-[120px] h-[170px] sm:w-[135px] sm:h-[190px] md:w-[195px] md:h-[275px] rounded-xl overflow-hidden border border-white/20 filter grayscale opacity-35 transition-all duration-700 hover:opacity-80 hover:scale-105 active:scale-95 shadow-md flex-shrink-0 cursor-pointer focus:outline-none translate-x-3 sm:translate-x-4 md:translate-x-0 relative"
            style={{
              backgroundImage: `url(${TIMELINE_PHOTOS[next].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-y-0 left-1.5 md:left-3 flex items-center justify-start z-20 pointer-events-none">
              <div className="p-2 md:p-2.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-sm text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:bg-white transition-all duration-500 animate-bounce-right pointer-events-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Direction hint */}
      <p className="font-cormorant italic text-white/40 text-sm mt-2">
        Desliza para viajar en el tiempo →
      </p>
    </section>
  );
};

export default TimelineGallery;
