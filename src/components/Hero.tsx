import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG } from '../config';

const Hero = () => {
  const { t } = useTranslation();
  const { days, hours, minutes, seconds } = useCountdown(CONFIG.eventDate);

  const timeBlocks = [
    { value: days, label: t('countdown.days') },
    { value: hours, label: t('countdown.hours') },
    { value: minutes, label: t('countdown.minutes') },
    { value: seconds, label: t('countdown.seconds') }
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-[radial-gradient(circle,_#2D0808_0%,_#0D0305_100%)] overflow-hidden py-20 px-4 text-center">
      
      {/* Decorative rings */}
      <div className="absolute w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] border-[1px] border-xv-gold opacity-10 rounded-full" />
      <div className="absolute w-[100vw] h-[100vw] max-w-[650px] max-h-[650px] border-[1px] border-xv-gold opacity-15 rounded-full" />
      <div className="absolute w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] border-[1px] border-xv-gold opacity-20 rounded-full" />

      {/* Floating horseshoe */}
      <div className="text-4xl animate-float drop-shadow-[0_0_10px_rgba(212,175,55,0.6)] mb-6 z-10">🧲</div>

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
      <div className="absolute bottom-8 z-10 font-josefin uppercase text-xs tracking-widest text-xv-gold opacity-35 animate-float">
        ↓ {t('scroll')} ↓
      </div>
    </section>
  );
};

export default Hero;
