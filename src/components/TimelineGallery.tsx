import React, { useState, useEffect, useRef } from 'react';

// Photos ordered from HIGHEST number to LOWEST (most recent → baby)
const TIMELINE_PHOTOS = [
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/16.mp4?v=4', era: 'Hoy', isVideo: true },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/15.webp?v=4', era: 'Hoy' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/14.webp?v=4', era: 'Hoy' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/13.webp?v=4', era: 'Casi allá' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/12.webp?v=4', era: 'Creciendo' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/11.webp?v=4', era: 'Creciendo' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/10.webp?v=4', era: 'La niñez' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/9.webp?v=4', era: 'La niñez' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/8.webp?v=4', era: 'Los primeros pasos' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/7.webp?v=4', era: 'Los primeros pasos' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/6.webp?v=4', era: 'Los primeros pasos' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/5.webp?v=4', era: 'La infancia' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/4.webp?v=4', era: 'La infancia' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/3.webp?v=4', era: 'Los primeros años' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/2.webp?v=4', era: 'Los primeros años' },
  { src: '/Fotos/Fotos%20Carrusel%20del%20Index/1.webp?v=4', era: 'Bebé' },
];

const GRID_ROWS = 6;
const GRID_COLS = 5;

const TimelineGallery = () => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const photo = TIMELINE_PHOTOS[current];

  // Force video play when a video item is active AND visible
  useEffect(() => {
    if (photo.isVideo && videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [current, isVisible]);

  // Auto-advance
  useEffect(() => {
    // No avanzar si el usuario no está viendo la sección
    if (!isVisible) return;
    
    // Si es video, no usamos setTimeout. El evento onEnded del video avanzará.
    if (photo.isVideo) return;

    const t = setTimeout(handleNext, 3000);
    return () => clearTimeout(t);
  }, [current, photo.isVideo, isVisible]);

  // Section entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        setIsVisible(entry.isIntersecting);
        // Reiniciar el carrusel al video siempre que la sección vuelva a entrar en pantalla
        if (entry.isIntersecting) {
          setCurrent(0);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 text-center text-white overflow-hidden"
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
        <h2 className="font-playfair italic text-4xl md:text-5xl text-[#F5D76E] animate-shimmer mb-2 leading-tight">
          <span className="block md:hidden">
            Un viaje en el<br />tiempo
          </span>
          <span className="hidden md:inline">
            ✦ Un viaje en el tiempo ✦
          </span>
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
                : 'w-2 h-2 bg-white/40'
            }`}
          />
        ))}
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
              backgroundImage: TIMELINE_PHOTOS[prev].isVideo ? 'none' : `url(${TIMELINE_PHOTOS[prev].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: TIMELINE_PHOTOS[prev].isVideo ? '#1a0f0f' : undefined,
            }}
          >
            {TIMELINE_PHOTOS[prev].isVideo && (
              <video 
                src={`${TIMELINE_PHOTOS[prev].src}#t=0.1`} 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                muted 
                playsInline 
              />
            )}
            <div className="absolute inset-y-0 right-1.5 md:right-3 flex items-center justify-end z-20 pointer-events-none">
              <div className="p-2 md:p-2.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-sm text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:bg-white transition-all duration-500 animate-bounce-left pointer-events-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
            </div>
          </button>

          {/* Center card (active, puzzle effect or video) */}
          <div className="relative flex-shrink-0 z-10">
            {/* Glowing gold border */}
            <div className="p-[2px] bg-gradient-to-r from-xv-gold via-[#F5D76E] to-xv-gold rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.45)] animate-glow">
              <div className="w-[190px] h-[270px] sm:w-[210px] sm:h-[300px] md:w-[260px] md:h-[370px] bg-[#1a0f0f] rounded-[14px] overflow-hidden relative">

                {photo.isVideo ? (
                  /* Video player */
                  <video
                    ref={videoRef}
                    key={photo.src}
                    className="absolute inset-0 w-full h-full object-cover animate-fade-in"
                    src={photo.src}
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleNext}
                  />
                ) : (
                  /* Simple fade transition for images */
                  <img
                    key={photo.src}
                    src={photo.src}
                    alt={photo.era}
                    className="absolute inset-0 w-full h-full object-cover animate-fade-in"
                  />
                )}



              </div>
            </div>

          </div>

          {/* Right card (next) */}
          <button
            onClick={() => { navigator.vibrate?.([40, 20, 40]); handleNext(); }}
            className="group w-[120px] h-[170px] sm:w-[135px] sm:h-[190px] md:w-[195px] md:h-[275px] rounded-xl overflow-hidden border border-white/20 filter grayscale opacity-35 transition-all duration-700 hover:opacity-80 hover:scale-105 active:scale-95 shadow-md flex-shrink-0 cursor-pointer focus:outline-none translate-x-3 sm:translate-x-4 md:translate-x-0 relative"
            style={{
              backgroundImage: TIMELINE_PHOTOS[next].isVideo ? 'none' : `url(${TIMELINE_PHOTOS[next].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: TIMELINE_PHOTOS[next].isVideo ? '#1a0f0f' : undefined,
            }}
          >
            {TIMELINE_PHOTOS[next].isVideo && (
              <video 
                src={`${TIMELINE_PHOTOS[next].src}#t=0.1`} 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                muted 
                playsInline 
              />
            )}
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
        &larr; Desliza para viajar en el tiempo &rarr;
      </p>
    </section>
  );
};

export default TimelineGallery;
