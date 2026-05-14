import React from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';

const Family = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-xv-pearl text-center">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-red mb-6 animate-shimmer">{t('family.title')}</h2>
        
        <p className="font-cormorant italic text-gray-600 text-xl mb-12 px-4 leading-relaxed">
          "{t('family.quote')}" ❤️
        </p>

        <div className="grid grid-cols-1 gap-10">
          {/* Dad */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-xv-red to-[#4A0008] border-2 border-xv-gold flex items-center justify-center text-4xl shadow-lg mb-4">
              👨
            </div>
            <div className="font-josefin text-xv-red uppercase text-xs tracking-widest font-bold mb-1">
              {t('family.dad')}
            </div>
            <div className="font-cormorant text-2xl text-xv-black-bg">
              {CONFIG.family.dadName}
            </div>
          </div>

          {/* Mom */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-xv-red to-[#4A0008] border-2 border-xv-gold flex items-center justify-center text-4xl shadow-lg mb-4">
              👩
            </div>
            <div className="font-josefin text-xv-red uppercase text-xs tracking-widest font-bold mb-1">
              {t('family.mom')}
            </div>
            <div className="font-cormorant text-2xl text-xv-black-bg">
              {CONFIG.family.momName}
            </div>
          </div>

          {/* Sister */}
          {CONFIG.family.sisterName && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-xv-red to-[#4A0008] border-2 border-xv-gold flex items-center justify-center text-4xl shadow-lg mb-4">
                👧
              </div>
              <div className="font-josefin text-xv-red uppercase text-xs tracking-widest font-bold mb-1">
                {t('family.sister')}
              </div>
              <div className="font-cormorant text-2xl text-xv-black-bg">
                {CONFIG.family.sisterName}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Family;
