import React from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

const PhotoUpload = () => {
  const { t } = useTranslation();
  
  // URL to the same site with the hash anchor so it scrolls to this section when scanned
  const uploadUrl = `${window.location.origin}${window.location.pathname}#photo-upload`; 

  const handleUploadClick = () => {
    navigator.vibrate?.(50);
    window.open(uploadUrl, '_blank');
  };

  return (
    <section id="photo-upload" className="py-20 px-4 bg-gradient-to-b from-xv-red to-xv-dark-red text-center text-white bg-pearl-toggle transition-all duration-1000 ease-in-out">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-gold mb-6 animate-shimmer">{t('photoUpload.title')}</h2>
        
        <div className="font-cormorant text-left text-lg text-white/80 mb-10 px-6 space-y-4 max-w-[440px] mx-auto leading-relaxed text-pearl-toggle-desc transition-all duration-1000 ease-in-out">
          <div className="flex gap-3 items-start">
            <span className="font-josefin font-bold text-xv-gold text-sm bg-white/10 border border-xv-gold/20 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">1</span>
            <p className="pt-0.5">{t('photoUpload.instructions.step1')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="font-josefin font-bold text-xv-gold text-sm bg-white/10 border border-xv-gold/20 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">2</span>
            <p className="pt-0.5">{t('photoUpload.instructions.step2')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="font-josefin font-bold text-xv-gold text-sm bg-white/10 border border-xv-gold/20 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">3</span>
            <p className="pt-0.5">{t('photoUpload.instructions.step3')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl inline-block mb-10 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
          <QRCodeSVG 
            value={uploadUrl} 
            size={200}
            bgColor="#ffffff"
            fgColor="#6E1423"
            level="H"
            includeMargin={false}
          />
        </div>

        <button 
          onClick={handleUploadClick}
          className="w-full py-4 px-6 rounded-full bg-white text-xv-red font-josefin uppercase font-bold text-sm tracking-wider animate-beat shadow-lg btn-pearl-toggle transition-all duration-1000 ease-in-out"
        >
          📷 {t('photoUpload.btnText')}
        </button>
      </div>
    </section>
  );
};

export default PhotoUpload;
