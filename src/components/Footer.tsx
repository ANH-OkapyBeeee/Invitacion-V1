import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';
import { QRCodeSVG } from 'qrcode.react';

const Footer = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShaking(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const defaultMsg = encodeURIComponent("¡Hola! Me gustaría información sobre sus servicios de diseño e invitaciones digitales.");
  const waUrl = `https://wa.me/${CONFIG.contact.whatsapp}?text=${defaultMsg}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("¡Copiado al portapapeles!");
    setActiveMenu(null);
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const renderContactMenu = (id: string, value: string, type: 'phone' | 'email') => {
    const isPhone = type === 'phone';
    const waLink = `https://wa.me/52${value}?text=${defaultMsg}`;
    
    return (
      <div className="relative inline-block">
        <button 
          onClick={() => toggleMenu(id)}
          className="hover:text-xv-gold transition-colors underline decoration-white/30 underline-offset-4 py-1 px-1"
        >
          {value}
        </button>
        {activeMenu === id && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#150a15] border border-xv-gold/30 rounded-xl shadow-2xl overflow-hidden z-20 flex flex-col">
            <button onClick={() => copyToClipboard(value)} className="p-3 text-xs tracking-wider border-b border-white/10 hover:bg-white/10 transition-colors uppercase text-white">Copiar {isPhone ? 'Número' : 'Correo'}</button>
            {isPhone ? (
              <>
                <a href={`tel:${value}`} className="p-3 text-xs tracking-wider border-b border-white/10 hover:bg-white/10 transition-colors uppercase block text-center text-white">Llamar</a>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="p-3 text-xs tracking-wider hover:bg-white/10 transition-colors uppercase block text-center text-[#25D366] font-bold">WhatsApp</a>
              </>
            ) : (
              <a href={`mailto:${value}`} className="p-3 text-xs tracking-wider hover:bg-white/10 transition-colors uppercase block text-center text-white">Enviar Correo</a>
            )}
          </div>
        )}
      </div>
    );
  };

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

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[2500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
          
          <div className="flex justify-center mb-8">
            <div className={`bg-white rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-white/10 transition-all duration-300 ${isShaking ? 'animate-earthquake' : ''}`}>
              <img src="/logo-gugu.jpg" alt="GuGu Laboratorio Creativo" className="h-28 object-contain" />
            </div>
          </div>

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

          {/* Enhanced Outro */}
          <div className="relative p-[1px] bg-gradient-to-r from-xv-gold via-[#F5D76E] to-xv-gold rounded-xl mb-10 mx-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <div className="bg-[#080108] rounded-xl px-4 py-6 text-center">
              <h5 className="font-playfair text-xs text-xv-gold-light uppercase tracking-widest mb-3 font-bold">
                Más allá de las invitaciones
              </h5>
              <p className="font-cormorant text-[1.35rem] text-white leading-relaxed italic">
                {t('footer.servicesOutro')}
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
            <h4 className="font-josefin uppercase tracking-widest text-xs text-xv-gold mb-4">{t('footer.dev')}</h4>
            <p className="font-playfair text-lg text-white mb-6">Ing. Alexis Nicolás Hurtado</p>
            
            <div className="flex flex-col gap-6 font-josefin text-sm mb-8">
              
              {/* Phones */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xv-gold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span>📞</span> Teléfonos
                </span>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-white items-center">
                  {renderContactMenu('phone1', CONFIG.contact.devPhone, 'phone')}
                  <span className="hidden md:inline opacity-50">/</span>
                  {renderContactMenu('phone2', CONFIG.contact.devPhone2, 'phone')}
                </div>
              </div>

              {/* Emails */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xv-gold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span>✉️</span> E-Mails
                </span>
                <div className="flex flex-col gap-2 text-white items-center">
                  {renderContactMenu('email1', CONFIG.contact.devEmail, 'email')}
                  {renderContactMenu('email2', CONFIG.contact.devEmail2, 'email')}
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xv-gold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span>📍</span> Dirección
                </span>
                <span className="text-gray-300 text-center leading-relaxed max-w-[250px]">
                  {CONFIG.contact.address}
                </span>
              </div>

            </div>
            
            <a 
              href={`https://wa.me/${CONFIG.contact.whatsapp}?text=${defaultMsg}`}
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
