import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Confetti from './Confetti';
import { CONFIG } from '../config';

interface Props {
  onOpen: () => void;
}

const EnvelopeScreen: React.FC<Props> = ({ onOpen }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    setTimeout(() => {
      setShowConfetti(true);
    }, 700);

    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle,_#2D0808_0%,_#0D0305_100%)] z-50 overflow-hidden transition-opacity duration-1000">
      
      {/* Decorative rings */}
      <div className="absolute w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] border-[1px] border-xv-gold opacity-10 rounded-full" />
      <div className="absolute w-[100vw] h-[100vw] max-w-[650px] max-h-[650px] border-[1px] border-xv-gold opacity-15 rounded-full" />
      <div className="absolute w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] border-[1px] border-xv-gold opacity-20 rounded-full" />

      {/* Floating horseshoe */}
      <div className="absolute top-16 text-4xl animate-float drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">🧲</div>

      {/* Title */}
      <h1 className="mt-8 mb-12 text-2xl md:text-3xl font-josefin tracking-[0.3em] text-xv-gold animate-shimmer uppercase relative z-10 text-center">
        {t('envelopeTitle')}
      </h1>

      {/* Envelope wrapper */}
      <div className="relative w-80 h-56 max-w-[85vw] perspective-[1000px] z-10">
        
        {/* Envelope back */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8DEC1] to-[#D5C69A] shadow-2xl rounded-sm" />
        
        {/* Envelope front flaps (left, right, bottom) */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Left flap */}
          <div className="absolute inset-0 bg-[#F6EECC] origin-left border-r border-[#D5C69A]" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }} />
          {/* Right flap */}
          <div className="absolute inset-0 bg-[#F6EECC] origin-right border-l border-[#D5C69A]" style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }} />
          {/* Bottom flap */}
          <div className="absolute inset-0 bg-[#FDF8E8] origin-bottom border-t border-[#D5C69A] shadow-[0_-5px_15px_rgba(0,0,0,0.1)]" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }} />
        </div>

        {/* Envelope top flap */}
        <div 
          className="absolute inset-0 origin-top bg-[#F6EECC] shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-transform duration-800 ease-in-out z-20"
          style={{ 
            clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
            transform: isOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="absolute inset-0 shadow-[inset_0_20px_20px_rgba(212,175,55,0.25)]" style={{ clipPath: 'polygon(0 0, 50% 60%, 100% 0)' }} />
        </div>

        {/* Wax seal */}
        <div 
          className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
          onClick={handleOpen}
          style={{ transition: 'opacity 0.3s', opacity: isOpen ? 0 : 1 }}
        >
          <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#D4202C] to-[#4A0008] flex items-center justify-center animate-glow shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-[2.5px] border-xv-gold relative hover:scale-105 transition-transform">
            <div className="absolute inset-1 rounded-full border border-xv-gold opacity-50" />
            <div className="flex flex-col items-center animate-beat pointer-events-none">
              <span className="text-xl mb-0.5 leading-none">⭐</span>
              <span className="font-cormorant italic text-xv-pearl text-[17px] leading-none mt-1">{t('open')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center relative z-10 transition-opacity duration-500" style={{ opacity: isOpen ? 0 : 1 }}>
        <h2 className="font-playfair italic text-3xl text-xv-gold-light mb-2">{CONFIG.quinceañeraName}</h2>
        <p className="font-josefin uppercase text-xs text-xv-gold opacity-55 tracking-widest mb-4">
          {new Date(CONFIG.eventDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <div className="text-xv-gold animate-shimmer text-xl">❧ ✦ ❧</div>
      </div>

      {showConfetti && <Confetti />}
    </div>
  );
};

export default EnvelopeScreen;
