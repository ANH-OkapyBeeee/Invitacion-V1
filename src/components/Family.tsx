import React from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';

const Family = () => {
  const { t } = useTranslation();
  const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  const quotes = [
    "La familia es donde la vida comienza y el amor nunca termina.",
    "Gracias por ser los cimientos de mi felicidad y los arquitectos de mis sueños.",
    "No elegimos a nuestra familia, pero si pudiera, los elegiría mil veces más.",
    "Mi familia es mi mejor equipo y mi hogar el lugar más seguro.",
    "En cada abrazo suyo encuentro la fuerza para conquistar el mundo.",
    "Gracias por enseñarme que el amor no tiene límites y la familia es el tesoro más grande.",
    "Detrás de cada una de mis sonrisas, están ustedes dándome motivos para ser feliz.",
    "Agradezco a la vida por ponerme en sus brazos y a ustedes por sostenerme siempre."
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 500); // Wait for fade out
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 bg-xv-pearl text-center">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-red mb-6 animate-shimmer">{t('family.title')}</h2>
        
        <div className="min-h-[80px] flex items-center justify-center mb-12">
          <p className={`font-cormorant italic text-gray-600 text-xl px-4 leading-relaxed transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            "{quotes[currentQuoteIndex]}"
          </p>
        </div>

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
