import React from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';
import { MapPin } from 'lucide-react';

const Locations = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#180404] to-[#2D0A0A] text-xv-pearl">
      <div className="max-w-[480px] mx-auto flex flex-col gap-8">
        
        {/* Ceremony */}
        <div className="bg-white/5 border border-xv-gold rounded-2xl p-6 text-center backdrop-blur-sm relative overflow-hidden">
          <div className="text-4xl mb-3">⛪</div>
          <h3 className="font-playfair italic text-2xl text-xv-gold-light mb-2">{t('locations.ceremony')}</h3>
          <p className="font-cormorant text-[#F5EEB0] text-lg mb-1">{CONFIG.church.name}</p>
          <p className="font-josefin text-sm text-gray-300 mb-4">{CONFIG.church.address}</p>
          <div className="font-josefin text-xv-gold mb-6 font-semibold flex items-center justify-center gap-2">
            ⏳ {CONFIG.church.time}
          </div>
          
          <div className="w-full h-48 bg-black/20 rounded-xl mb-6 relative border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.church.name + ", " + CONFIG.church.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full opacity-80 mix-blend-luminosity hover:opacity-100 hover:mix-blend-normal transition-all duration-500"
              style={{ border: 0, filter: 'contrast(1.2) sepia(0.3) hue-rotate(-10deg)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-xv-gold/20 rounded-xl"></div>
          </div>

          <a 
            href={CONFIG.church.dirUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => navigator.vibrate?.(50)}
            className="inline-block w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-xv-black-bg font-josefin uppercase font-bold text-sm tracking-wider animate-beat shadow-[0_0_15px_rgba(212,175,55,0.4)] relative z-10"
          >
            {t('locations.btnText')}
          </a>
        </div>

        {/* Reception */}
        <div className="bg-white/5 border border-xv-gold rounded-2xl p-6 text-center backdrop-blur-sm relative overflow-hidden">
          <div className="text-4xl mb-3">🥂</div>
          <h3 className="font-playfair italic text-2xl text-xv-gold-light mb-2">{t('locations.reception')}</h3>
          <p className="font-cormorant text-[#F5EEB0] text-lg mb-1">{CONFIG.venue.name}</p>
          <p className="font-josefin text-sm text-gray-300 mb-4">{CONFIG.venue.address}</p>
          <div className="font-josefin text-xv-gold mb-6 font-semibold flex items-center justify-center gap-2">
            ⏳ {CONFIG.venue.time}
          </div>
          
          <div className="w-full h-48 bg-black/20 rounded-xl mb-6 relative border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent("20°45'37.0\"N 100°02'25.9\"W")}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full opacity-80 mix-blend-luminosity hover:opacity-100 hover:mix-blend-normal transition-all duration-500"
              style={{ border: 0, filter: 'contrast(1.2) sepia(0.3) hue-rotate(-10deg)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-xv-gold/20 rounded-xl"></div>
          </div>

          <a 
            href={CONFIG.venue.dirUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => navigator.vibrate?.(50)}
            className="inline-block w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-xv-black-bg font-josefin uppercase font-bold text-sm tracking-wider animate-beat shadow-[0_0_15px_rgba(212,175,55,0.4)] relative z-10"
            style={{ animationDelay: '0.5s' }}
          >
            {t('locations.btnText')}
          </a>
        </div>

      </div>
    </section>
  );
};

export default Locations;
