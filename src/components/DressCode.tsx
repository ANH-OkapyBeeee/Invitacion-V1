import React from 'react';
import { useTranslation } from 'react-i18next';

const DressCode = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-xv-pearl text-center">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-red mb-8 animate-shimmer">{t('dresscode.title')}</h2>

        <div className="font-josefin uppercase tracking-[0.15em] text-lg text-xv-black-bg mb-4 font-bold">
          {t('dresscode.subtitle')}
        </div>
        
        <p className="font-cormorant text-lg text-gray-600 mb-10 leading-relaxed px-2">
          {t('dresscode.desc')}
        </p>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 mb-12 border border-xv-red/20 shadow-lg">
          <p className="font-cormorant text-xl text-xv-black-bg mb-8 italic leading-relaxed px-2 font-medium">
            {t('dresscode.reservedColors')}
          </p>
          
          <div className="flex justify-center gap-8">
            {/* Colors */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6E1423] relative border border-gray-200 shadow-sm">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/40 -rotate-45" />
              </div>
              <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('dresscode.noRed')}</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-xv-gold relative border border-gray-200 shadow-sm">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#0D0305]/40 -rotate-45" />
              </div>
              <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('dresscode.noGold')}</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-xv-pearl relative border border-gray-200 shadow-sm">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#0D0305]/40 -rotate-45" />
              </div>
              <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('dresscode.noPearl')}</span>
            </div>
          </div>
        </div>

        {/* Charro Theme block */}
        <div className="bg-[#1a0f0f] text-white p-8 rounded-3xl border border-xv-gold/30 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
          <h3 className="font-playfair italic text-3xl text-xv-gold mb-4 relative z-10">{t('dresscode.charroTitle')}</h3>
          <div className="w-16 h-0.5 bg-xv-gold/40 mx-auto mb-6 relative z-10" />
          <p className="font-cormorant text-lg text-white/90 relative z-10 leading-relaxed italic">
            {t('dresscode.charroDesc')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DressCode;
