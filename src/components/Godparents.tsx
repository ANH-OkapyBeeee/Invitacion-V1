import React from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';

const Godparents = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#8B0000] to-[#C41E3A] text-center">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-gold mb-4 animate-shimmer">{t('godparents.title')}</h2>
        <p className="font-cormorant italic text-white/80 text-lg mb-12 px-2">
          {t('godparents.desc')}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Godfather */}
          <div className="bg-white/10 backdrop-blur-md border border-xv-gold rounded-xl p-6 flex flex-col items-center">
            <div className="text-5xl mb-4">🤠</div>
            <div className="font-josefin text-xv-gold uppercase text-xs tracking-widest font-bold mb-2">
              {t('godparents.godfather')}
            </div>
            <div className="font-playfair text-xl text-white">
              {CONFIG.godparents.godfatherName}
            </div>
          </div>

          {/* Godmother */}
          <div className="bg-white/10 backdrop-blur-md border border-xv-gold rounded-xl p-6 flex flex-col items-center">
            <div className="text-5xl mb-4">💐</div>
            <div className="font-josefin text-xv-gold uppercase text-xs tracking-widest font-bold mb-2">
              {t('godparents.godmother')}
            </div>
            <div className="font-playfair text-xl text-white">
              {CONFIG.godparents.godmotherName}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Godparents;
