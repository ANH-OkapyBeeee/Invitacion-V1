import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';
import { QRCodeSVG } from 'qrcode.react';

const Footer = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const timersRef = useRef<number[]>([]);
  const hasTriggeredInitial = useRef(false);

  useEffect(() => {
    const clearAllTimers = () => {
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current = [];
    };

    const runCycle = () => {
      // Step 2: Stop for 2s
      const t1 = window.setTimeout(() => {
        setIsShaking(true);
        // Step 3: Vibrate for 3s
        const t2 = window.setTimeout(() => {
          setIsShaking(false);
          runCycle(); // Repeat cycle
        }, 3000);
        timersRef.current.push(t2);
      }, 2000);
      timersRef.current.push(t1);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggeredInitial.current) {
        hasTriggeredInitial.current = true;
        clearAllTimers();

        // Step 1: Initial 5s vibration
        setIsShaking(true);
        const t0 = window.setTimeout(() => {
          setIsShaking(false);
          runCycle();
        }, 5000);
        timersRef.current.push(t0);
      }
    }, { threshold: 0.1 });

    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      observer.disconnect();
      clearAllTimers();
    };
  }, []);

  const defaultMsg = encodeURIComponent("¡Hola! Me gustaría información sobre sus servicios de diseño e invitaciones digitales.");
  const waUrl = `https://wa.me/${CONFIG.contact.whatsapp}?text=${defaultMsg}`;

  const copyToClipboard = (text: string) => {
    navigator.vibrate?.(50); // Vibrar primero
    navigator.clipboard.writeText(text);
    
    // Pequeño retraso para que la vibración se sienta antes del alert bloqueante
    setTimeout(() => {
      alert("¡Copiado al portapapeles!");
      setActiveMenu(null);
    }, 100);
  };

  const toggleMenu = (menu: string) => {
    navigator.vibrate?.(40);
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
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#150a15] border border-xv-gold/30 rounded-2xl shadow-2xl overflow-hidden z-20 flex flex-col">
            <button 
              onClick={() => copyToClipboard(value)} 
              className="p-3 text-xs tracking-wider border-b border-white/10 hover:bg-white/10 transition-colors uppercase text-white"
            >
              Copiar {isPhone ? 'Número' : 'Correo'}
            </button>
            {isPhone ? (
              <>
                <a 
                  href={`tel:${value}`} 
                  onClick={() => navigator.vibrate?.(40)}
                  className="p-3 text-xs tracking-wider border-b border-white/10 hover:bg-white/10 transition-colors uppercase block text-center text-white"
                >
                  Llamar
                </a>
                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => navigator.vibrate?.(40)}
                  className="p-3 text-xs tracking-wider hover:bg-white/10 transition-colors uppercase block text-center text-[#25D366] font-bold"
                >
                  WhatsApp
                </a>
              </>
            ) : (
              <a 
                href={`mailto:${value}`} 
                onClick={() => navigator.vibrate?.(40)}
                className="p-3 text-xs tracking-wider hover:bg-white/10 transition-colors uppercase block text-center text-white"
              >
                Enviar Correo
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <footer ref={footerRef} className="bg-[#080108] text-gray-400 py-10 px-4 text-center transition-all duration-500">
      <div className="max-w-[480px] mx-auto">
        
        <button 
          onClick={() => {
            navigator.vibrate?.(40);
            setExpanded(!expanded);
          }}
          className="w-full touch-manipulation focus:outline-none"
        >
          <div className="font-josefin text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">
            {t('footer.developedBy')}
          </div>
          <div className="font-playfair text-xl text-xv-gold mb-4 animate-vibrate-footer">{t('footer.gugu')}</div>
          
          {!expanded && (
            <>
              <div className="flex justify-center mb-4">
                <div className={`bg-white rounded-xl p-2 shadow-lg border border-white/10 w-20 h-20 flex items-center justify-center overflow-hidden transition-all duration-300 ${isShaking ? 'animate-earthquake' : ''}`}>
                  <img src="/logo-gugu.jpg" alt="GuGu Laboratorio Creativo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="font-josefin text-sm uppercase tracking-widest animate-pulse mt-2">
                {t('footer.tapMore')}
              </div>
            </>
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

          {/* Block 1: Strategic Vision */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-6 mx-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <h5 className="font-playfair text-xs text-xv-gold uppercase tracking-[0.25em] mb-4 font-bold">
              Más allá de las invitaciones
            </h5>
            
            <p className="font-josefin text-sm text-white/90 leading-relaxed tracking-wide">
              Somos expertos en consultoría estratégica, transformación digital, implementación, despliegue y soporte para la modernización de PyMEs.
            </p>
          </div>

          {/* Block 2: Specific Solutions */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8 mx-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <p className="font-josefin text-sm text-xv-gold-light mb-8 leading-relaxed italic">
              Estas son algunas de las soluciones tecnológicas que diseñamos para potenciar tu crecimiento:
            </p>

            <div className="flex flex-col gap-4 text-left font-josefin text-sm">
              {(t('footer.services', { returnObjects: true }) as string[]).map((service, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <span className="text-xv-gold mt-[2px] text-xs transition-transform group-hover:scale-125">✦</span>
                  <span className="text-gray-300 leading-tight group-hover:text-white transition-colors">{service}</span>
                </div>
              ))}
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
              onClick={() => navigator.vibrate?.(50)}
              className="inline-block w-full py-3 px-6 rounded-full bg-[#25D366] text-white font-josefin uppercase font-bold text-sm tracking-wider mb-6 shadow-lg"
            >
              Contactar por WhatsApp
            </a>

            <div className="bg-white p-3 rounded-xl inline-block mx-auto mb-4">
               <QRCodeSVG value={waUrl} size={120} bgColor="#ffffff" fgColor="#080108" level="L" />
            </div>
          </div>

        </div>

        {/* Legal Section with prominent separator */}
        <div className="mt-16 pt-12 pb-4 relative">
          {/* Gold Gradient Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-xv-gold to-transparent opacity-40" />
          
          <div className="font-josefin text-[10px] uppercase tracking-[0.25em] opacity-40 flex flex-col gap-2">
            <div>{t('footer.legal')}</div>
            <div>© 2026 {t('footer.gugu')} {t('footer.rights')}</div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
