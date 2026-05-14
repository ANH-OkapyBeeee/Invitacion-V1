import React from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

const PhotoUpload = () => {
  const { t } = useTranslation();
  
  // Default URL to the same site if not provided
  const uploadUrl = window.location.href; 

  const handleUploadClick = () => {
    window.open(uploadUrl, '_blank');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-xv-red to-xv-dark-red text-center text-white">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-gold mb-6 animate-shimmer">{t('photoUpload.title')}</h2>
        
        <p className="font-cormorant text-lg text-white/80 mb-10 px-4 leading-relaxed">
          {t('photoUpload.desc')}
        </p>

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
          className="w-full py-4 px-6 rounded-full bg-white text-xv-red font-josefin uppercase font-bold text-sm tracking-wider animate-beat shadow-lg"
        >
          📷 {t('photoUpload.btnText')}
        </button>
      </div>
    </section>
  );
};

export default PhotoUpload;
