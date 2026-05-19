import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';

interface PreloaderProps {
  onComplete: () => void;
  onStartFadeOut?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete, onStartFadeOut }) => {
  const { t } = useTranslation();
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isDay] = useState(() => {
    const hour = new Date().getHours();
    // Day is defined as 7:00 AM (7) to 6:00 PM (18)
    return hour >= 7 && hour < 18;
  });

  useEffect(() => {
    const keyImages = [
      '/logo-gugu.jpg',
      '/sobre-bg.jpg', // Closed envelope backplate
      '/Fotos/Fotos%20Carrusel%20del%20Index/1.JPG',
      '/Fotos/Fotos%20Carrusel%20del%20Index/2.JPG',
      '/Fotos/Fotos%20Carrusel%20del%20Index/3.JPG',
      '/Fotos/Fotos%20Carrusel%20del%20Index/4.JPG',
      '/Fotos/Fotos%20Carrusel%20del%20Index/4.2.jpeg',
      '/Fotos/Fotos%20Carrusel%20del%20Index/5.JPG',
      '/Fotos/Fotos%20Carrusel%20del%20Index/7.jpg',
      '/Fotos/Fotos%20Carrusel%20del%20Index/9.JPG',
      '/Fotos/Fotos%20Carrusel%20del%20Index/10.jpg'
    ];

    let loadedCount = 0;
    const totalToLoad = keyImages.length;
    const startTime = Date.now();

    const checkComplete = () => {
      loadedCount++;
      const timeElapsed = Date.now() - startTime;
      // We guarantee at least 2.5 seconds of display for premium aesthetics
      const minDuration = 2500;
      const remainingTime = Math.max(0, minDuration - timeElapsed);

      if (loadedCount >= totalToLoad || timeElapsed >= 8000) { // Safety timeout of 8s
        setTimeout(() => {
          setFadeOut(true);
          onStartFadeOut?.();
          setTimeout(() => {
            setHidden(true);
            onComplete();
          }, 1000); // match transition duration
        }, remainingTime);
      }
    };

    if (totalToLoad === 0) {
      setTimeout(() => {
        setFadeOut(true);
        onStartFadeOut?.();
        setTimeout(() => {
          setHidden(true);
          onComplete();
        }, 1000);
      }, 2500);
      return;
    }

    // Preload each image
    keyImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkComplete;
      img.onerror = checkComplete; // don't block on error
    });

    // Also wait for window load event if it hasn't fired yet
    if (document.readyState === 'complete') {
      // already loaded, standard flow will handle
    } else {
      const loadListener = () => {
        // safety trigger
        setTimeout(() => {
          setFadeOut(true);
          onStartFadeOut?.();
          setTimeout(() => {
            setHidden(true);
            onComplete();
          }, 1000);
        }, 2500);
      };
      window.addEventListener('load', loadListener);
      return () => window.removeEventListener('load', loadListener);
    }
  }, [onComplete, onStartFadeOut]);

  if (hidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out select-none ${
        isDay ? 'bg-[#ffffff]' : 'bg-[#000000]'
      } ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs text-center px-4">
        {/* Pulsing GUGU Logo in a White Rounded Card (identical to expanded footer style) */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Inner Pulsing Gold & White Glow Rings */}
          <div className="absolute -inset-4 rounded-full bg-[#D4AF37]/8 animate-ping opacity-60 pointer-events-none" />
          <div className="absolute -inset-2 rounded-[24px] animate-pulse pointer-events-none transition-all duration-1000 bg-[#D4AF37]/5" />
          
          {/* Core White Rounded Card */}
          <div className={`relative w-32 h-32 bg-white rounded-2xl p-4 z-10 animate-pulse transition-all duration-1000 ${
            isDay 
              ? 'shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-gray-100' 
              : 'shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/5'
          }`}>
            <img 
              src="/logo-gugu.jpg" 
              alt="GUGU Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        {/* Brand / Developer Credits (identical to footer style) */}
        <div className="flex flex-col items-center gap-1 mb-3">
          <div className="font-josefin text-[9px] uppercase tracking-[0.25em] text-gray-500 font-bold">
            DESARROLLADO POR
          </div>
          <div className={`font-cormorant text-lg font-bold transition-colors duration-1000 ${
            isDay ? 'text-[#6E1423]' : 'text-xv-gold'
          }`}>
            GuGu | Laboratorio Creativo®
          </div>
        </div>

        {/* Pulsing Star Accent Divider */}
        <div className={`w-12 h-[1px] mb-6 opacity-60 transition-all duration-1000 ${
          isDay 
            ? 'bg-gradient-to-r from-transparent via-[#6E1423] to-transparent' 
            : 'bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent'
        }`} />

        {/* Loading Text - Professional, Serious, Non-Italic Sans-Serif */}
        <p className={`font-josefin font-semibold uppercase tracking-[0.22em] text-[11px] animate-pulse transition-colors duration-1000 ${
          isDay ? 'text-[#2D0808]/85' : 'text-[#FDFBF7]/80'
        }`}>
          {t('preloader.loadingText', 'Cargando contenido...').toUpperCase()}
        </p>

        {/* Elegant Micro-Progress Bar */}
        <div className={`w-32 h-[2px] rounded-full overflow-hidden mt-6 transition-colors duration-1000 ${
          isDay ? 'bg-gray-200' : 'bg-white/10'
        }`}>
          <div className="h-full bg-gradient-to-r from-[#D4AF37] via-[#6E1423] to-[#D4AF37] animate-loading-bar rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
