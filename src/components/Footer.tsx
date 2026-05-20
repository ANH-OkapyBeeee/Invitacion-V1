import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';
import { QRCodeSVG } from 'qrcode.react';

const serviceMetadata = [
  { emoji: "🖥️", shortEs: "Web & Tiendas", shortEn: "Web & Shops", large: true },
  { emoji: "🎨", shortEs: "Diseño & Video", shortEn: "Design & Video" },
  { emoji: "💻", shortEs: "Software", shortEn: "Software" },
  { emoji: "🤖", shortEs: "I.A. & Bots", shortEn: "A.I. & Bots" },
  { emoji: "📊", shortEs: "ERP (Odoo/SAP)", shortEn: "ERP (Odoo/SAP)" },
  { emoji: "🧊", shortEs: "Modelado 3D", shortEn: "3D Modeling" },
  { emoji: "☁️", shortEs: "Nube Cloud", shortEn: "Cloud & Devops" },
  { emoji: "📈", shortEs: "Marketing", shortEn: "Marketing" },
  { emoji: "🔍", shortEs: "Forense", shortEn: "Forensics" },
  { emoji: "🔒", shortEs: "Ciberseguridad", shortEn: "Cybersecurity", large: true },
  { emoji: "💾", shortEs: "Recuperar Datos", shortEn: "Data Recovery" },
  { emoji: "📱", shortEs: "Tuning Móvil", shortEn: "Mobile Tuning", large: true }
];


interface FooterProps {
  onOpenLegal: (tab: 'privacy' | 'terms' | 'cookies') => void;
}

const Footer = ({ onOpenLegal }: FooterProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isShakingWA, setIsShakingWA] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
  const footerRef = useRef<HTMLElement>(null);
  const developerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const hasTriggeredInitial = useRef(false);



  // Separate effect for hand pointers cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

    const runWACycle = () => {
      // Shake for 3.5s
      setIsShakingWA(true);
      const tw1 = window.setTimeout(() => {
        setIsShakingWA(false);
        // Rest for 2s
        const tw2 = window.setTimeout(() => {
          runWACycle();
        }, 2000);
        timersRef.current.push(tw2);
      }, 3500);
      timersRef.current.push(tw1);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggeredInitial.current) {
        hasTriggeredInitial.current = true;
        clearAllTimers();

        // Step 1: Initial 5s vibration for logo
        setIsShaking(true);
        const t0 = window.setTimeout(() => {
          setIsShaking(false);
          runCycle();
        }, 5000);
        timersRef.current.push(t0);

        // Start WA cycle immediately when visible
        runWACycle();

        // Delay 'Back to Top' button for 5 seconds
        const tBack = window.setTimeout(() => {
          setShowBackToTop(true);
        }, 5000);
        timersRef.current.push(tBack);
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
    navigator.vibrate?.([40, 30, 40]);
    setTimeout(() => {
      navigator.clipboard.writeText(text);
      alert(t('footer.copied'));
      setActiveMenu(null);
    }, 150);
  };

  const toggleMenu = (menu: string) => {
    navigator.vibrate?.(40);
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const scrollToTop = () => {
    navigator.vibrate?.([40, 40]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContactMenu = (id: string, value: string, type: 'phone' | 'email', index: number) => {
    const isPhone = type === 'phone';
    const waLink = `https://wa.me/52${value}?text=${defaultMsg}`;
    
    return (
      <div className="relative inline-block">
        {activeHighlight === index && (
          <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-lg animate-hand-pointing pointer-events-none z-10">
            👉
          </span>
        )}
        <button 
          onClick={() => toggleMenu(id)}
          className={`hover:text-xv-gold transition-colors underline decoration-white/30 underline-offset-4 py-1 px-1 inline-block ${activeHighlight === index ? 'animate-pulse' : ''}`}
        >
          {value}
        </button>
        {activeMenu === id && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0A0A0F] border border-xv-gold/45 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),_0_0_15px_rgba(212,175,55,0.2)] overflow-hidden z-20 flex flex-col transition-all duration-300">
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
    <footer ref={footerRef} className="bg-[#000000] text-gray-400 py-10 px-4 text-center transition-all duration-500">
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
                <div className="relative">
                  <div className={`bg-white rounded-xl p-2 shadow-lg border border-white/10 w-20 h-20 flex items-center justify-center transition-all duration-300 ${isShaking ? 'animate-earthquake' : ''}`}>
                    <img src="/logo-gugu.jpg" alt="GuGu Laboratorio Creativo" className="w-full h-full object-contain" />
                  </div>
                  {/* Floating WhatsApp Button */}
                  <a 
                    href={`https://wa.me/${CONFIG.contact.whatsapp}?text=${defaultMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.vibrate?.([40, 30, 40]);
                    }}
                    className={`absolute -bottom-3 -right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 border border-gray-100 z-20 cursor-pointer ${isShaking ? 'animate-earthquake' : ''}`}
                    title="Contactar por WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-[21px] h-[21px] fill-[#25D366]">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <div className="font-josefin text-sm uppercase tracking-widest animate-pulse relative inline-block">
                  {t('footer.tapMore')}
                  {/* Animated Hand Emoji 👆 tapping where the ↓ arrow used to be */}
                  <span className="inline-block ml-1 animate-hand-1 text-base pointer-events-none relative top-[-1px]">
                    👆
                  </span>
                </div>
              </div>
            </>
          )}
        </button>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[2500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                onClick={() => {
                  navigator.vibrate?.([30, 20, 30]);
                  developerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`bg-white rounded-xl p-2 shadow-[0_15px_40px_rgba(0,0,0,0.6),_0_0_20px_rgba(212,175,55,0.15)] border-2 border-xv-gold w-20 h-20 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),_0_0_30px_rgba(212,175,55,0.35)] ${isShaking ? 'animate-earthquake' : ''}`}
                title="Ver datos del desarrollador"
              >
                <img src="/logo-gugu.jpg" alt="GuGu Laboratorio Creativo" className="w-full h-full object-contain" />
              </div>
              {/* Floating WhatsApp Button for Expanded Logo */}
              <a 
                href={`https://wa.me/${CONFIG.contact.whatsapp}?text=${defaultMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.vibrate?.([40, 30, 40]);
                }}
                className={`absolute -bottom-3 -right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 border border-gray-100 z-20 cursor-pointer ${isShaking ? 'animate-earthquake' : ''}`}
                title="Contactar por WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-[21px] h-[21px] fill-[#25D366]">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </a>
            </div>
          </div>

          <p className="font-josefin text-sm md:text-base text-gray-300 mb-6 px-6 leading-relaxed tracking-wide font-medium">
            "{t('footer.slogan')}"
          </p>

          <div className="bg-white/5 border border-white/10 rounded-[2.2rem] p-8 mb-6 mx-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/10 hover:border-xv-gold/35 transition-all duration-500 backdrop-blur-lg">
            <h5 className="font-josefin text-sm md:text-base text-xv-gold uppercase tracking-[0.25em] mb-4 font-bold">
              Más allá de las invitaciones
            </h5>
            
            <p className="font-josefin text-base md:text-[17px] text-white/95 leading-relaxed tracking-wide font-medium">
              Somos expertos en consultoría estratégica, transformación digital, implementación, despliegue y soporte para la modernización de PyMEs.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.2rem] py-8 mb-8 mx-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/10 hover:border-xv-gold/35 transition-all duration-500 backdrop-blur-lg overflow-hidden relative">
            <p className="font-josefin text-base md:text-[17px] text-xv-gold-light mb-4 leading-relaxed font-semibold tracking-wide px-6">
              Estas son algunas de las soluciones tecnológicas que diseñamos para potenciar tu crecimiento:
            </p>

            {/* 3-Column Responsive Grid Canvas */}
            <div className="relative w-full my-4 px-2 md:px-4">
              <div className="w-full bg-black/60 rounded-3xl border border-white/5 shadow-inner p-6 md:p-10">
                <div className="grid grid-cols-3 gap-y-8 md:gap-y-12 gap-x-2 md:gap-x-6 justify-items-center items-center w-full max-w-3xl mx-auto">
                  {(() => {
                    const servicesArray = t('footer.services', { returnObjects: true }) as string[];
                    const isEnglishList = servicesArray.length === 13;
                    
                    const getBubbleMetadata = (idx: number, isEn: boolean) => {
                      if (isEn) {
                        if (idx === 0) {
                          return { emoji: "✨", shortLabel: "Invitations", large: false };
                        }
                        const meta = serviceMetadata[idx - 1] || { emoji: "✨", shortEs: "Servicio", shortEn: "Service", large: false };
                        return { emoji: meta.emoji, shortLabel: meta.shortEn, large: !!(meta as any).large };
                      } else {
                        const meta = serviceMetadata[idx] || { emoji: "✨", shortEs: "Servicio", shortEn: "Service", large: false };
                        return { emoji: meta.emoji, shortLabel: meta.shortEs, large: !!(meta as any).large };
                      }
                    };

                    return servicesArray.map((_, idx) => {
                      const { emoji, shortLabel, large } = getBubbleMetadata(idx, isEnglishList);
                      const isSelected = activeServiceIndex === idx;
                      const isLastItemEn = isEnglishList && idx === 12;

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            navigator.vibrate?.([30, 20]);
                            setActiveServiceIndex(idx);
                          }}
                          style={{
                            animationDelay: `${idx * 0.35}s`
                          }}
                          className={`rounded-full flex flex-col items-center justify-center select-none cursor-pointer transition-[background-color,border-color,box-shadow,color,transform] duration-300 ${idx % 2 === 0 ? 'animate-float-organic-a' : 'animate-float-organic-b'}
                            ${large ? 'w-[84px] h-[84px] md:w-[106px] md:h-[106px]' : 'w-[76px] h-[76px] md:w-[92px] md:h-[92px]'}
                            ${isLastItemEn ? 'col-span-3 justify-self-center' : ''}
                            ${isSelected 
                              ? 'bg-gradient-to-br from-[#D4AF37] to-[#8A5A19] border-2 border-white shadow-[0_0_25px_rgba(212,175,55,0.45)] scale-110 z-20' 
                              : 'bg-white/95 border border-xv-gold/40 hover:border-xv-gold shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 z-10'}`}
                        >
                          <span className={`text-xl md:text-2xl mb-0.5 transition-transform ${isSelected ? 'scale-110' : ''}`}>
                            {emoji}
                          </span>
                          <span className={`text-[8px] md:text-[9px] uppercase tracking-wider font-extrabold font-josefin leading-tight px-1 text-center line-clamp-2
                            ${isSelected ? 'text-white' : 'text-[#080108]'}`}>
                            {shortLabel}
                          </span>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Backdrop-blur Focus concentration detailed popup popover */}
              {activeServiceIndex !== null && (() => {
                const servicesArray = t('footer.services', { returnObjects: true }) as string[];
                const isEnglishList = servicesArray.length === 13;
                
                const getBubbleMetadata = (idx: number, isEn: boolean) => {
                  if (isEn) {
                    if (idx === 0) {
                      return { emoji: "✨", shortLabel: "Invitations" };
                    }
                    const meta = serviceMetadata[idx - 1] || { emoji: "✨", shortEs: "Servicio", shortEn: "Service" };
                    return { emoji: meta.emoji, shortLabel: meta.shortEn };
                  } else {
                    const meta = serviceMetadata[idx] || { emoji: "✨", shortEs: "Servicio", shortEn: "Service" };
                    return { emoji: meta.emoji, shortLabel: meta.shortEs };
                  }
                };

                const { emoji, shortLabel } = getBubbleMetadata(activeServiceIndex, isEnglishList);
                const selectedServiceText = servicesArray[activeServiceIndex] || "";

                return (
                  <div 
                    onClick={() => {
                      navigator.vibrate?.(20);
                      setActiveServiceIndex(null);
                    }}
                    className="absolute inset-0 z-30 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-scale-up cursor-pointer"
                  >
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gradient-to-br from-white to-gray-50 text-[#080108] p-6 rounded-3xl border-2 border-xv-gold shadow-[0_12px_40px_rgba(212,175,55,0.3)] w-full max-w-[290px] text-center transform scale-100 transition-all duration-300 cursor-default"
                    >
                      <div className="text-5xl mb-3 select-none animate-bounce-slow">
                        {emoji}
                      </div>
                      <h5 className="font-josefin text-xs uppercase tracking-[0.2em] text-[#8A5A19] font-extrabold mb-3 select-none">
                        {shortLabel}
                      </h5>
                      <p className="font-josefin text-sm text-gray-800 leading-relaxed font-semibold mb-6 px-1">
                        {selectedServiceText}
                      </p>
                      <button 
                        onClick={() => {
                          navigator.vibrate?.(20);
                          setActiveServiceIndex(null);
                        }}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8A5A19] text-white font-josefin text-xs uppercase tracking-widest font-bold shadow-[0_4px_12px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all duration-200"
                      >
                        Entendido
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div ref={developerRef} className="bg-white/5 border border-white/10 rounded-[2.2rem] p-6 mb-8 mx-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/10 hover:border-xv-gold/35 transition-all duration-500 backdrop-blur-lg">
            <h4 className="font-josefin uppercase tracking-widest text-xs text-xv-gold mb-4">{t('footer.dev')}</h4>
            <p className="font-playfair text-lg text-white mb-6">Ing. Alexis Nicolás Hurtado</p>
            
            <div className="flex flex-col gap-6 font-josefin text-sm mb-8">
              
              <div className="flex flex-col items-center gap-1">
                <span className="text-xv-gold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span>📞</span> Teléfonos
                </span>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-white items-center">
                  {renderContactMenu('phone1', CONFIG.contact.devPhone, 'phone', 0)}
                  <span className="hidden md:inline opacity-50">/</span>
                  {renderContactMenu('phone2', CONFIG.contact.devPhone2, 'phone', 1)}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xv-gold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span>✉️</span> E-Mails
                </span>
                <div className="flex flex-col gap-2 text-white items-center">
                  {renderContactMenu('email1', CONFIG.contact.devEmail, 'email', 2)}
                  {renderContactMenu('email2', CONFIG.contact.devEmail2, 'email', 3)}
                </div>
              </div>

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
              className={`inline-block w-full py-3 px-6 rounded-full bg-[#25D366] text-white font-josefin uppercase font-bold text-sm tracking-wider mb-6 shadow-lg transition-transform ${isShakingWA ? 'animate-earthquake' : ''}`}
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
          
          <div className="font-josefin text-[10px] uppercase tracking-[0.25em] flex flex-col gap-3 select-none">
            {/* Split legal terms into individual hoverable buttons with pointer cursor */}
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 opacity-50 hover:opacity-85 transition-opacity duration-300">
              {t('footer.legal').split(' · ').map((term, i, arr) => (
                <React.Fragment key={i}>
                  <button 
                    onClick={() => {
                      navigator.vibrate?.(30);
                      const tabs: ('privacy' | 'terms' | 'cookies')[] = ['privacy', 'terms', 'cookies'];
                      onOpenLegal(tabs[i]);
                    }}
                    className="hover:text-xv-gold hover:opacity-100 transition-all duration-300 cursor-pointer focus:outline-none font-semibold"
                  >
                    {term}
                  </button>
                  {i < arr.length - 1 && <span className="opacity-50">·</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Copyright with hoverable developer brand and pointer cursor */}
            <div className="opacity-50 hover:opacity-85 transition-opacity duration-300">
              © 2026{' '}
              <button 
                onClick={() => {
                  navigator.vibrate?.(40);
                  setExpanded(true);
                  setTimeout(() => {
                    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="hover:text-xv-gold hover:opacity-100 transition-all duration-300 cursor-pointer focus:outline-none font-bold"
              >
                {t('footer.gugu')}
              </button>{' '}
              {t('footer.rights').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Delayed 'Back to Top' Button */}
        {showBackToTop && (
          <div className="mt-16 animate-scale-up pb-8">
            <button 
              onClick={scrollToTop}
              className="flex flex-col items-center justify-center w-full py-6 px-4 group focus:outline-none cursor-pointer select-none active:scale-95 transition-all duration-300 pointer-events-auto"
            >
              {/* Elegant pill button to guarantee massive tap area on mobile */}
              <div className="flex items-center justify-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 rounded-full transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-xv-gold/30">
                <span className="text-xv-gold text-base animate-bounce select-none">↑</span>
                <span className="font-josefin text-xs uppercase tracking-[0.25em] text-xv-gold font-bold transition-colors group-hover:text-xv-gold-light">
                  Volver al Inicio
                </span>
                <span className="text-xv-gold text-base animate-bounce select-none">↑</span>
              </div>
            </button>
          </div>
        )}

      </div>
    </footer>
  );
};

export default Footer;
