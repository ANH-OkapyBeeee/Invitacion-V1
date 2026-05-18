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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0304] bg-[radial-gradient(circle_at_center,_rgba(110,20,35,0.12)_0%,_#0A0304_100%)] transition-opacity duration-1000 ease-in-out select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs text-center px-4">
        {/* Pulsing GUGU Logo with gold gradient border */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Inner Pulsing Glow Rings */}
          <div className="absolute w-28 h-28 rounded-full bg-[#D4AF37]/15 animate-ping opacity-75" />
          <div className="absolute w-24 h-24 rounded-full bg-[#6E1423]/20 animate-pulse" />
          
          {/* Core Logo Image with gold border */}
          <div className="relative w-20 h-20 rounded-full p-[2px] bg-gradient-to-r from-[#8A5A19] via-[#D4AF37] to-[#8A5A19] z-10 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.45)]">
            <img 
              src="/logo-gugu.jpg" 
              alt="GUGU Logo" 
              className="w-full h-full object-cover rounded-full" 
            />
          </div>
        </div>

        {/* Brand / Quinceañera Subtitle */}
        <div className="font-josefin text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 font-bold">
          {CONFIG.quinceañeraName} • {t('heroTitle', 'XV AÑOS')}
        </div>

        {/* Pulsing Star Accent Divider */}
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6 opacity-60" />

        {/* Loading Text */}
        <p className="font-playfair italic text-lg text-[#FDFBF7]/90 tracking-wide animate-pulse">
          {t('preloader.loadingText', 'Cargando contenido...')}
        </p>

        {/* Elegant Micro-Progress Bar */}
        <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-[#D4AF37] via-[#6E1423] to-[#D4AF37] animate-loading-bar rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
