import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';

const SaveTheDate = () => {
  const { t } = useTranslation();
  const [animPhase, setAnimPhase] = useState<'static' | 'exploding'>('static');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const runCycle = () => {
      setAnimPhase('static');
      timeout = setTimeout(() => {
        setAnimPhase('exploding');
        timeout = setTimeout(() => {
          runCycle();
        }, 3000); // Explotar 3s
      }, 1500); // Estático 1.5s
    };

    runCycle();
    return () => clearTimeout(timeout);
  }, []);

  const handleCalendar = () => {
    navigator.vibrate?.(50);
    const title = `XV Años - ${CONFIG.quinceañeraName}`;
    const encodedTitle = encodeURIComponent(title);
    
    // Detailed Description
    const detailsText = `¡No te puedes perder este gran evento tan especial para nosotros!

📍 MISA:
Iglesia de Nuestra Señora de Guadalupe
Fecha Sábado, 22 de agosto de 2026
Hora: 3:00 PM
Dirección: Ajuchitlán, Colón, Qro.

✨ RECEPCIÓN:
Salón Salitrito
Fecha Sábado, 22 de agosto de 2026
Hora: 4:00 PM
Dirección: Camino a el CBTA 115, Colonia Salitre, 76286 Colón, Qro.

👗 CÓDIGO DE VESTIMENTA:
Queremos que disfrutes al máximo, por lo que puedes venir con el estilo que te haga sentir más cómodo: ya sea formal, casual o lo que tú prefieras.
( 🔔 Recordatorio: Favor de evitar vestidos en Rojo, Dorado o Blanco Perla).

Atentamente:
Betzy Guadalupe Balderas Vega
Y Sus padres: Manuel Balderas Ibarra y Ma. de la Luz Vega Feregrino`;

    const encodedDetails = encodeURIComponent(detailsText);
    const locationName = `${CONFIG.venue.name}, ${CONFIG.venue.address}`;
    const encodedLocation = encodeURIComponent(locationName);
    
    // Dates
    const startDate = new Date(CONFIG.eventDate);
    const endDate = new Date(startDate.getTime() + 11 * 60 * 60 * 1000); // 3 PM + 11h = 2 AM next day
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';
    };

    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    // Detect if it is iOS (iPhone/iPad) to use the native Calendar (.ics download)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // Dynamic iCalendar (.ics) format for native iOS Apple Calendar
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        `UID:event-${Date.now()}@lupitaxvanos.com`,
        `DTSTART:${startStr}`,
        `DTEND:${endStr}`,
        `DESCRIPTION:${detailsText.replace(/\n/g, '\\n')}`,
        `LOCATION:${locationName}`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT1D', // 1 day before notification
        'ACTION:DISPLAY',
        'DESCRIPTION:Recordatorio de XV Años',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `xvanos-${CONFIG.quinceañeraName.toLowerCase()}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Non-iOS: standard Google Calendar web integration
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startStr}/${endStr}&details=${encodedDetails}&location=${encodedLocation}`;
      window.open(url, '_blank');
    }
  };

  return (
    <section className="py-20 px-4 bg-[radial-gradient(ellipse_at_top,_#2D0808_0%,_#0D0305_100%)] text-center text-white bg-pearl-toggle transition-all duration-1000 ease-in-out">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-gold mb-2 animate-shimmer">{t('saveTheDate.title')}</h2>
        <h3 className="font-josefin uppercase tracking-widest text-xv-gold opacity-80 mb-10 text-sm">
          {t('saveTheDate.subtitle')}
        </h3>

        {/* Visual Calendar */}
        <div className="bg-white/5 border border-xv-gold/30 rounded-2xl p-6 mb-10 backdrop-blur-sm card-pearl-toggle transition-all duration-1000 ease-in-out">
          <div className="font-playfair text-2xl text-xv-gold-light mb-6 uppercase">
            {t('saveTheDate.calendar.month')} {new Date(CONFIG.eventDate).getFullYear()}
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-sm font-josefin mb-2 text-gray-400 text-pearl-toggle-desc transition-all duration-1000 ease-in-out">
            <div>{t('saveTheDate.calendar.su')}</div>
            <div>{t('saveTheDate.calendar.mo')}</div>
            <div>{t('saveTheDate.calendar.tu')}</div>
            <div>{t('saveTheDate.calendar.we')}</div>
            <div>{t('saveTheDate.calendar.th')}</div>
            <div>{t('saveTheDate.calendar.fr')}</div>
            <div>{t('saveTheDate.calendar.sa')}</div>
            
            {(() => {
              const date = new Date(CONFIG.eventDate);
              const year = date.getFullYear();
              const month = date.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const firstDayOfMonth = new Date(year, month, 1).getDay();
              const eventDay = date.getDate();
              
              const days = [];
              for (let i = 0; i < firstDayOfMonth; i++) {
                days.push(<div key={`empty-${i}`} />);
              }
              for (let i = 1; i <= daysInMonth; i++) {
                const isEventDay = i === eventDay;
                const isExploding = isEventDay && animPhase === 'exploding';

                days.push(
                  <div key={i} className="relative flex items-center justify-center">
                    <div 
                      className={`flex items-center justify-center h-8 w-8 mx-auto rounded-full transition-all duration-500 ${
                        isEventDay 
                          ? `bg-xv-gold text-xv-black-bg font-bold scale-[1.7] shadow-[0_0_30px_rgba(212,175,55,0.6)] relative z-10 ring-1 ring-xv-gold/40` 
                          : 'text-white name-pearl-toggle transition-all duration-1000 ease-in-out'
                      }`}
                    >
                      {i}
                    </div>
                    {isExploding && (
                      <div className="absolute inset-0 pointer-events-none z-20">
                        {[...Array(24)].map((_, idx) => {
                          const angle = (idx / 24) * 360 + (Math.random() * 15);
                          const dist = 100 + Math.random() * 250;
                          const x = Math.cos(angle * Math.PI / 180) * dist;
                          const y = Math.sin(angle * Math.PI / 180) * dist;
                          return (
                            <div 
                              key={idx}
                              className="absolute left-1/2 top-1/2 w-6 h-6 text-xv-gold-light animate-star-burst pointer-events-none"
                              style={{
                                '--x': `${x}px`,
                                '--y': `${y}px`,
                              } as React.CSSProperties}
                            >
                              ✦
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              return days;
            })()}
          </div>
        </div>


        <button 
          onClick={handleCalendar}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-xv-gold to-[#F5D76E] text-xv-black-bg font-josefin uppercase font-bold text-sm tracking-wider animate-beat shadow-[0_0_20px_rgba(212,175,55,0.3)] btn-pearl-toggle transition-all duration-1000 ease-in-out"
        >
          📅 {t('saveTheDate.addToCalendar')}
        </button>
      </div>
    </section>
  );
};

export default SaveTheDate;
