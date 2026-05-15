import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DressCode = () => {
  const { t } = useTranslation();
  const [activeNote, setActiveNote] = useState<number | null>(null);

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

        {/* Note Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Nota 1 */}
          <div 
            onClick={() => setActiveNote(activeNote === 1 ? null : 1)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 shadow-md flex flex-col items-center justify-center min-h-[140px]
              ${activeNote === 1 
                ? 'bg-[#4A0008] border-xv-gold text-white scale-105 shadow-xl' 
                : 'bg-[#6E1423] border-xv-gold/30 text-white hover:bg-[#5a101c] animate-vibrate-1 shadow-[0_0_15px_rgba(212,175,55,0.25)]'}`}
          >
            <div className="text-4xl mb-2">{activeNote === 1 ? '👗' : '👗'}</div>
            <h3 className="font-josefin font-bold text-xv-gold uppercase tracking-widest text-sm mb-1">Nota 1</h3>
            <p className={`font-cormorant italic text-white/70 text-xs ${activeNote !== 1 ? 'animate-strong-pulse' : ''}`}>
              {activeNote === 1 ? 'Cerrar detalles' : 'Toca para más detalles'}
            </p>
          </div>

          {/* Nota 2 */}
          <div 
            onClick={() => setActiveNote(activeNote === 2 ? null : 2)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 shadow-md flex flex-col items-center justify-center min-h-[140px]
              ${activeNote === 2 
                ? 'bg-[#4A0008] border-xv-gold text-white scale-105 shadow-xl' 
                : 'bg-[#6E1423] border-xv-gold/30 text-white hover:bg-[#5a101c] animate-vibrate-2 shadow-[0_0_15px_rgba(212,175,55,0.25)]'}`}
          >
            <div className="text-4xl mb-2">{activeNote === 2 ? '🤠' : '🤠'}</div>
            <h3 className="font-josefin font-bold text-xv-gold uppercase tracking-widest text-sm mb-1">Nota 2</h3>
            <p className={`font-cormorant italic text-white/70 text-xs ${activeNote !== 2 ? 'animate-strong-pulse' : ''}`}>
              {activeNote === 2 ? 'Cerrar detalles' : 'Toca para más detalles'}
            </p>
          </div>
        </div>

        {/* Expanded Content Area */}
        <div className="relative min-h-[50px]">
          {/* Contenido Nota 1 */}
          <div className={`transition-all duration-500 ease-in-out transform origin-top ${activeNote === 1 ? 'scale-y-100 opacity-100 max-h-[1000px] mb-8' : 'scale-y-0 opacity-0 max-h-0 overflow-hidden'}`}>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-xv-red/20 shadow-lg">
              <p className="font-cormorant text-xl text-xv-black-bg mb-8 italic leading-relaxed font-medium">
                {t('dresscode.reservedColors')}
              </p>
              
              <div className="flex justify-center gap-6 md:gap-8">
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
          </div>

          {/* Contenido Nota 2 */}
          <div className={`transition-all duration-500 ease-in-out transform origin-top ${activeNote === 2 ? 'scale-y-100 opacity-100 max-h-[1000px] mb-8' : 'scale-y-0 opacity-0 max-h-0 overflow-hidden'}`}>
            <div className="bg-[#1a0f0f] text-white p-6 md:p-8 rounded-3xl border border-xv-gold/30 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
              <h3 className="font-playfair italic text-2xl md:text-3xl text-xv-gold mb-4 relative z-10">{t('dresscode.charroTitle')}</h3>
              <div className="w-16 h-0.5 bg-xv-gold/40 mx-auto mb-6 relative z-10" />
              <p className="font-cormorant text-lg text-white/90 relative z-10 leading-relaxed italic">
                {t('dresscode.charroDesc')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DressCode;
