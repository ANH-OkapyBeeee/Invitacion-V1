import React from 'react';
import { useTranslation } from 'react-i18next';

const DressCode = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-xv-pearl text-center">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-red mb-12 animate-shimmer">{t('dresscode.title')}</h2>

        <div className="font-josefin uppercase tracking-[0.2em] text-xl text-xv-black-bg mb-12 font-bold">
          {t('dresscode.formal')}
        </div>

        <div className="flex justify-center gap-6 mb-12">
          {/* Colors */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-xv-red relative border border-gray-300">
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#0D0305] -rotate-45" />
            </div>
            <span className="font-josefin text-xs uppercase tracking-widest text-gray-500">{t('dresscode.noRed')}</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-xv-gold relative border border-gray-300">
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#0D0305] -rotate-45" />
            </div>
            <span className="font-josefin text-xs uppercase tracking-widest text-gray-500">{t('dresscode.noGold')}</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#fdfaf5] relative border border-gray-300">
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#0D0305] -rotate-45" />
            </div>
            <span className="font-josefin text-xs uppercase tracking-widest text-gray-500">{t('dresscode.noPearl')}</span>
          </div>
        </div>

        {/* Charro Theme block */}
        <div className="bg-[#1a0f0f] text-white p-8 rounded-xl border border-xv-gold/30 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
          <h3 className="font-playfair italic text-2xl text-xv-gold mb-3 relative z-10">{t('dresscode.charroTitle')}</h3>
          <div className="w-12 h-0.5 bg-xv-gold/50 mx-auto mb-4" />
          <p className="font-cormorant text-lg text-white/80 relative z-10 leading-relaxed">
            {t('dresscode.charroDesc')}
          </p>
        </div>

        <p className="font-cormorant italic text-gray-500 text-sm">
          {t('dresscode.note')}
        </p>
      </div>
    </section>
  );
};

export default DressCode;
