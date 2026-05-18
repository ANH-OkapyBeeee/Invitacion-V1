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

  useEffect(() => {
    const keyImages = [
      '/logo-gugu.jpg',
      '/sobre-bg.jpg', // Closed envelope backplate
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#FDFBF7] to-[#F5F1E9] transition-opacity duration-1000 ease-in-out select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs text-center px-4">
        {/* Pulsing Star SVG Logo */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Inner Pulsing Glow Rings */}
          <div className="absolute w-24 h-24 rounded-full bg-[#D4AF37]/15 animate-ping opacity-75" />
          <div className="absolute w-16 h-16 rounded-full bg-[#6E1423]/10 animate-pulse" />
          
          {/* Core Star Logo */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-16 h-16 text-[#D4AF37] stroke-[1.5] filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] animate-pulse relative z-10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.44.869-.44 1.04 0l2.584 6.594 7.039.605c.477.041.667.632.31.956l-5.32 4.887 1.584 6.911c.108.47-.406.844-.816.588L12 17.755l-6.223 3.69c-.41.256-.924-.117-.816-.588l1.584-6.911-5.32-4.887c-.357-.324-.167-.915.31-.956l7.039-.605 2.584-6.594z" />
          </svg>
        </div>

        {/* Brand / Quinceañera Subtitle */}
        <div className="font-josefin text-[10px] uppercase tracking-[0.25em] text-[#6E1423]/70 mb-2 font-bold">
          {CONFIG.quinceañeraName} • {t('heroTitle', 'XV AÑOS')}
        </div>

        {/* Pulsing Star Accent Divider */}
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6 opacity-60" />

        {/* Loading Text */}
        <p className="font-playfair italic text-lg text-[#400B14] tracking-wide animate-pulse">
          {t('preloader.loadingText', 'Cargando contenido...')}
        </p>

        {/* Elegant Micro-Progress Bar */}
        <div className="w-32 h-[2px] bg-[#6E1423]/10 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-[#D4AF37] via-[#6E1423] to-[#D4AF37] animate-loading-bar rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
