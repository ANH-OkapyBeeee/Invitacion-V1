import React from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';

const SaveTheDate = () => {
  const { t } = useTranslation();

  const handleCalendar = () => {
    const title = encodeURIComponent(`XV Años - ${CONFIG.quinceañeraName}`);
    const details = encodeURIComponent(t('saveTheDate.desc'));
    const location = encodeURIComponent(CONFIG.venue.name);
    // Format: YYYYMMDDTHHMMSS (local time)
    const dateObj = new Date(CONFIG.eventDate);
    const formatStr = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15);
    const endDate = new Date(dateObj.getTime() + 5 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15);
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatStr}/${endDate}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 px-4 bg-[radial-gradient(ellipse_at_top,_#2D0808_0%,_#0D0305_100%)] text-center text-white">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-gold mb-2 animate-shimmer">{t('saveTheDate.title')}</h2>
        <h3 className="font-josefin uppercase tracking-widest text-xv-gold opacity-80 mb-10 text-sm">
          {t('saveTheDate.subtitle')}
        </h3>

        {/* Visual Calendar */}
        <div className="bg-white/5 border border-xv-gold/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="font-playfair text-2xl text-xv-gold-light mb-6 uppercase">
            {t('saveTheDate.calendar.month')} {new Date(CONFIG.eventDate).getFullYear()}
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-sm font-josefin mb-2 text-gray-400">
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
                days.push(
                  <div 
                    key={i} 
                    className={`flex items-center justify-center h-8 w-8 mx-auto rounded-full transition-all duration-300 ${
                      isEventDay 
                        ? 'bg-gradient-to-br from-xv-gold to-[#D4AF37] text-xv-black-bg font-bold scale-[1.15] shadow-[0_0_15px_rgba(212,175,55,0.6)]' 
                        : 'text-white'
                    }`}
                  >
                    {i}
                  </div>
                );
              }
              return days;
            })()}
          </div>
        </div>

        <p className="font-cormorant italic text-lg text-white/65 mb-10">
          {t('saveTheDate.desc')}
        </p>

        <button 
          onClick={handleCalendar}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-xv-gold to-[#F5D76E] text-xv-black-bg font-josefin uppercase font-bold text-sm tracking-wider animate-beat shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          📅 {t('saveTheDate.addToCalendar')}
        </button>
      </div>
    </section>
  );
};

export default SaveTheDate;
