import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';
import { QRCodeSVG } from 'qrcode.react';

const Footer = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const defaultMsg = encodeURIComponent("¡Hola! Me gustaría información sobre sus servicios de diseño e invitaciones digitales.");
  const waUrl = `https://wa.me/${CONFIG.contact.whatsapp}?text=${defaultMsg}`;

  return (
    <footer className="bg-[#080108] text-gray-400 py-10 px-4 text-center transition-all duration-500">
      <div className="max-w-[480px] mx-auto">
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full touch-manipulation focus:outline-none"
        >
          <div className="font-playfair text-xl text-xv-gold mb-2">{t('footer.gugu')}</div>
          {!expanded && (
            <div className="font-josefin text-xs uppercase tracking-widest animate-pulse">
              {t('footer.tapMore')}
            </div>
          )}
        </button>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
          
          <p className="font-cormorant italic text-lg text-gray-300 mb-6 px-4">
            "{t('footer.slogan')}"
          </p>

          <p className="font-josefin text-sm text-xv-gold mb-6 px-4 leading-relaxed">
            {t('footer.servicesIntro')}
          </p>

          <div className="flex flex-col gap-3 text-left font-josefin text-sm mb-8 px-6">
            {(t('footer.services', { returnObjects: true }) as string[]).map((service, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-xv-gold mt-[2px] text-xs">✦</span>
                <span className="text-gray-300 leading-tight">{service}</span>
              </div>
            ))}
          </div>

          <p className="font-josefin text-xs text-gray-400 mb-10 px-6 italic leading-relaxed text-justify">
            {t('footer.servicesOutro')}
          </p>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
            <h4 className="font-josefin uppercase tracking-widest text-xs text-xv-gold mb-4">{t('footer.dev')}</h4>
            <p className="font-playfair text-lg text-white mb-1">Ing. Alexis Nicolás Hurtado</p>
            <p className="font-josefin text-sm mb-6">{CONFIG.contact.devPhone} • {CONFIG.contact.devEmail}</p>
            
            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full py-3 px-6 rounded-full bg-[#25D366] text-white font-josefin uppercase font-bold text-sm tracking-wider mb-6 shadow-lg"
            >
              Contactar por WhatsApp
            </a>

            <div className="bg-white p-3 rounded-xl inline-block mx-auto mb-4">
               <QRCodeSVG value={waUrl} size={120} bgColor="#ffffff" fgColor="#080108" level="L" />
            </div>
          </div>

          <div className="font-josefin text-[10px] uppercase tracking-wider mb-4 opacity-50 flex flex-col gap-2">
            <div>{t('footer.legal')}</div>
            <div>© 2026 {t('footer.gugu')} {t('footer.rights')}</div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
