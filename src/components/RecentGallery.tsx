import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const RecentGallery = () => {
  const { t } = useTranslation();
  const [approvedPhotos, setApprovedPhotos] = useState<any[]>([]);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'photos'),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort in memory: newer first (to avoid requiring manual composite indexes in Firestore console)
      photos.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      // Show last 5 photos
      setApprovedPhotos(photos.slice(0, 5));
    });

    return () => unsubscribe();
  }, []);

  // Don't render the section if there are no approved photos yet
  if (approvedPhotos.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#4A0D15] to-[#2B050B] text-center text-white relative overflow-hidden border-t border-xv-gold/20">
      {/* Decorative golden background highlights */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-xv-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-xv-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[800px] mx-auto">
        <span className="font-josefin text-xv-gold text-[10px] tracking-[0.2em] uppercase font-bold block mb-2">
          {t('gallery.subtitle', { defaultValue: 'MOMENTOS COMPARTIDOS' })}
        </span>
        <h2 className="font-playfair italic text-4xl text-xv-gold mb-10 animate-shimmer">
          {t('gallery.title', { defaultValue: 'Galería de la Fiesta' })}
        </h2>

        {/* CSS grid for the last 5 photos */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4">
          {approvedPhotos.map((photo, idx) => (
            <div 
              key={photo.id}
              onClick={() => {
                navigator.vibrate?.(30);
                setLightboxUrl(photo.url);
              }}
              className={`relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-lg group border border-white/10 hover:border-xv-gold/40 transition-all duration-500 hover:-translate-y-1 ${
                idx === 0 && approvedPhotos.length === 5 ? 'col-span-2 md:col-span-1 md:scale-105' : ''
              }`}
            >
              <img 
                src={photo.url} 
                alt={`Foto de la fiesta ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                <span className="font-josefin text-[9px] text-xv-gold tracking-widest uppercase">Ver Imagen</span>
              </div>
            </div>
          ))}
        </div>

        <p className="font-cormorant italic text-white/50 text-sm mt-8 max-w-[400px] mx-auto leading-relaxed">
          {t('gallery.desc', { defaultValue: 'Las fotos más recientes aprobadas por los administradores. ¡Sigue compartiendo tus momentos!' })}
        </p>
      </div>

      {/* Lightbox / Modal view */}
      {lightboxUrl && (
        <div 
          className="fixed inset-0 z-[20000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl font-light"
            onClick={() => setLightboxUrl(null)}
          >
            ✕
          </button>
          <img 
            src={lightboxUrl} 
            alt="Foto ampliada" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10 animate-scale-up" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default RecentGallery;
