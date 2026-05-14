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
          <div className="text-4xl mb-3 animate-float">⛪</div>
          <h3 className="font-playfair italic text-2xl text-xv-gold-light mb-2">{t('locations.ceremony')}</h3>
          <p className="font-cormorant text-[#F5EEB0] text-lg mb-1">{CONFIG.church.name}</p>
          <p className="font-josefin text-sm text-gray-300 mb-4">{CONFIG.church.address}</p>
          <div className="font-josefin text-xv-gold mb-6 font-semibold flex items-center justify-center gap-2">
            🕐 {CONFIG.church.time}
          </div>
          
          <div className="w-full h-32 bg-black/20 rounded-xl mb-6 relative border border-white/10 flex items-center justify-center overflow-hidden">
            {/* Simple Map Placeholder */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <MapPin className="text-xv-gold w-8 h-8 animate-pulse relative z-10" />
          </div>

          <a 
            href={CONFIG.church.mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-xv-black-bg font-josefin uppercase font-bold text-sm tracking-wider animate-beat shadow-[0_0_15px_rgba(212,175,55,0.4)] relative z-10"
          >
            {t('locations.btnText')}
          </a>
        </div>

        {/* Reception */}
        <div className="bg-white/5 border border-xv-gold rounded-2xl p-6 text-center backdrop-blur-sm relative overflow-hidden">
          <div className="text-4xl mb-3 animate-float" style={{ animationDelay: '0.5s' }}>🥂</div>
          <h3 className="font-playfair italic text-2xl text-xv-gold-light mb-2">{t('locations.reception')}</h3>
          <p className="font-cormorant text-[#F5EEB0] text-lg mb-1">{CONFIG.venue.name}</p>
          <p className="font-josefin text-sm text-gray-300 mb-4">{CONFIG.venue.address}</p>
          <div className="font-josefin text-xv-gold mb-6 font-semibold flex items-center justify-center gap-2">
            🕐 {CONFIG.venue.time}
          </div>
          
          <div className="w-full h-32 bg-black/20 rounded-xl mb-6 relative border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <MapPin className="text-xv-gold w-8 h-8 animate-pulse relative z-10" />
          </div>

          <a 
            href={CONFIG.venue.mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
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
