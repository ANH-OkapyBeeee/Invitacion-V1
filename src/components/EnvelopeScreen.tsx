import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Confetti from './Confetti';
import { CONFIG } from '../config';
import { requestShakePermission } from './ShakeCelebration';

interface Props {
  onOpen: () => void;
}

const EnvelopeScreen: React.FC<Props> = ({ onOpen }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpen = async () => {
    if (isOpen) return;
    
    // Request permission for shake effect
    await requestShakePermission();

    setIsOpen(true);
    
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle,_#2D0808_0%,_#0D0305_100%)] z-50 overflow-hidden transition-opacity duration-1000">
      
      {/* Twinkling Stars Background with Safe Zone Mask */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at center, transparent 35%, black 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 35%, black 75%)',
        }}
      >
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-twinkle ${i % 3 === 0 ? 'text-xv-gold' : 'text-white'}`}
            style={{
              fontSize: `calc(var(--star-base-size) * ${i % 8 === 0 ? 2.4 : (i % 3 === 0 ? 1.6 : 1)})`,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              '--duration': (Math.random() * 2 + 2) + 's',
              animationDelay: (Math.random() * 3) + 's',
              filter: 'drop-shadow(0 0 5px currentColor)',
            } as React.CSSProperties}
          >
            {i % 4 === 0 ? '✦' : '★'}
          </div>
        ))}
      </div>

      {/* Title */}
      <h1 className="mt-6 mb-10 text-4xl md:text-5xl font-josefin tracking-[0.3em] text-xv-gold animate-shimmer uppercase relative z-10 text-center">
        {t('envelopeTitle')}
      </h1>

      {/* Envelope wrapper */}
      <div className="relative w-80 h-56 max-w-[85vw] perspective-[1000px] z-10">
        
        {/* Envelope back */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8DEC1] to-[#D5C69A] shadow-2xl rounded-sm" />
        
        {/* Envelope front flaps (left, right, bottom) */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Left flap with defined edge */}
          <div className="absolute inset-0 bg-[#F6EECC] origin-left border-r border-[#D5C69A]" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
          </div>
          {/* Right flap with defined edge */}
          <div className="absolute inset-0 bg-[#F6EECC] origin-right border-l border-[#D5C69A]" style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent" />
          </div>
          {/* Bottom flap with shadow and defined top edge */}
          <div className="absolute inset-0 bg-[#F6EECC] origin-bottom border-t border-[#D5C69A] shadow-[0_-10px_20px_rgba(0,0,0,0.15)]" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
          </div>
        </div>

        {/* Envelope top flap (The one that opens) */}
        <div 
          className="absolute inset-0 origin-top bg-[#F9F4E0] transition-transform duration-800 ease-in-out z-20"
          style={{ 
            clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
            transform: isOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            backfaceVisibility: 'hidden',
            filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))'
          }}
        >
          {/* Definition lines for the top flap (The V shape) */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" style={{ clipPath: 'polygon(0 0, 50% 60%, 100% 0)' }} />
          <div className="absolute inset-0 border-b-2 border-[#D5C69A]/60" style={{ clipPath: 'polygon(0 0, 50% 60%, 100% 0)' }} />
        </div>

        {/* Wax seal */}
        <div 
          className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
          onClick={() => {
            navigator.vibrate?.(60);
            handleOpen();
          }}
          style={{ transition: 'opacity 0.3s', opacity: isOpen ? 0 : 1 }}
        >
          <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#4A050A] to-[#1A0404] flex items-center justify-center animate-glow shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-[2.5px] border-xv-gold relative hover:scale-105 transition-transform">
            <div className="absolute inset-1 rounded-full border border-xv-gold opacity-50" />
            <div className="flex flex-col items-center animate-beat pointer-events-none">
              <span className="font-cormorant italic text-xv-pearl text-[17px] leading-none mt-1">{t('open')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center relative z-10 transition-opacity duration-500" style={{ opacity: isOpen ? 0 : 1 }}>
        <h2 className="font-playfair italic text-3xl text-xv-gold-light mb-2">{CONFIG.quinceañeraName}</h2>
        <p className="font-josefin uppercase text-sm md:text-base text-xv-gold opacity-80 tracking-widest mb-4">
          {new Date(CONFIG.eventDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default EnvelopeScreen;
