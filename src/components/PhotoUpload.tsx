import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ImgBB API Key (free, no credit card required)
const IMGBB_API_KEY = 'dd1c7dfc9a1a5b931163b804b6d4a566';

// Upload a Blob to ImgBB and return the direct image URL
const uploadToImgBB = async (blob: Blob, fileName: string): Promise<string> => {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
  });

  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', base64);
  formData.append('name', fileName);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`ImgBB upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error('ImgBB returned an error: ' + JSON.stringify(data));
  }

  return data.data.url as string;
};

// Native client-side image compression helper
const compressImage = (file: File, maxW = 1920, maxH = 1920, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxW || height > maxH) {
          if (width > height) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          } else {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // fallback
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const PhotoUpload = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedPhotos, setSelectedPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // URL to the same site with the hash anchor so it scrolls to this section when scanned
  const uploadUrl = `${window.location.origin}${window.location.pathname}#photo-upload`; 

  const handleSelectClick = () => {
    navigator.vibrate?.(50);
    setUploadStatus('idle');
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    
    const newPhotos = filesArray.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedPhotos(prev => [...prev, ...newPhotos]);
    // Reset file input value so same files can be selected again if removed
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    navigator.vibrate?.(30);
    setSelectedPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleUpload = async () => {
    if (selectedPhotos.length === 0) return;
    navigator.vibrate?.(50);
    setIsUploading(true);
    setUploadStatus('idle');
    setUploadProgress({ current: 0, total: selectedPhotos.length });

    try {
      for (let i = 0; i < selectedPhotos.length; i++) {
        const photo = selectedPhotos[i];
        
        // 1. Compress image client-side to keep uploads fast & lightweight
        const compressedBlob = await compressImage(photo.file);

        // 2. Create a unique file name
        const fileExtension = photo.file.name.split('.').pop() || 'jpg';
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        // 3. Upload to ImgBB (free, no credit card required)
        const downloadUrl = await uploadToImgBB(compressedBlob, uniqueFileName);

        // 4. Save metadata + ImgBB URL in Firestore
        await addDoc(collection(db, 'photos'), {
          url: downloadUrl,
          status: 'pending',
          createdAt: serverTimestamp(),
          fileName: uniqueFileName,
          size: compressedBlob.size
        });

        setUploadProgress(prev => ({ ...prev, current: i + 1 }));
      }

      // Success cleanup
      selectedPhotos.forEach(p => URL.revokeObjectURL(p.preview));
      setSelectedPhotos([]);
      setUploadStatus('success');
      navigator.vibrate?.([100, 50, 100]);
    } catch (error) {
      console.error("Upload error: ", error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
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

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* Photo Previews */}
        {selectedPhotos.length > 0 && (
          <div className="mb-8 bg-black/30 p-4 rounded-3xl border border-white/10 max-h-[300px] overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-3 gap-3">
              {selectedPhotos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg">
                  <img src={photo.preview} alt="Vista previa" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="font-josefin text-xs text-white/60 uppercase tracking-wider">
                {selectedPhotos.length} {selectedPhotos.length === 1 ? 'Foto seleccionada' : 'Fotos seleccionadas'}
              </span>
              <button 
                onClick={() => setSelectedPhotos([])}
                className="font-josefin text-xs text-xv-gold hover:underline uppercase tracking-wider"
              >
                Limpiar todo
              </button>
            </div>
          </div>
        )}

        {/* Upload Status / Feedback Messages */}
        {isUploading && (
          <div className="mb-8 p-4 bg-white/5 rounded-3xl border border-xv-gold/20">
            <div className="flex justify-between text-xs text-white/60 mb-2 font-josefin uppercase tracking-wider">
              <span>Subiendo fotos...</span>
              <span>{uploadProgress.current} de {uploadProgress.total}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-xv-gold h-full transition-all duration-300"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="mb-8 p-4 bg-green-950/40 border border-green-500/30 rounded-3xl text-sm font-cormorant leading-relaxed text-green-200">
            ✨ ¡Muchas gracias! Tus fotos han sido enviadas al moderador y aparecerán pronto en la galería si son aprobadas. 🎉
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mb-8 p-4 bg-red-950/40 border border-red-500/30 rounded-3xl text-sm font-cormorant leading-relaxed text-red-200">
            ❌ Hubo un error al subir tus fotos. Por favor, inéntalo de nuevo o comprueba tu conexión.
          </div>
        )}

        {/* Primary Action Buttons */}
        {selectedPhotos.length > 0 ? (
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-4 px-6 rounded-full bg-xv-gold text-xv-black-bg font-josefin uppercase font-bold text-sm tracking-wider animate-pulse shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            🚀 Enviar Fotos para Aprobación
          </button>
        ) : (
          <button 
            onClick={handleSelectClick}
            className="w-full py-4 px-6 rounded-full bg-white text-xv-red font-josefin uppercase font-bold text-sm tracking-wider animate-beat shadow-lg btn-pearl-toggle transition-all duration-1000 ease-in-out"
          >
            📷 {t('photoUpload.btnText')}
          </button>
        )}

        {/* QR Code container (only shown when not uploading to avoid clutter) */}
        {selectedPhotos.length === 0 && !isUploading && (
          <div className="mt-10 bg-white p-4 rounded-2xl inline-block shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <QRCodeSVG 
              value={uploadUrl} 
              size={200}
              bgColor="#ffffff"
              fgColor="#6E1423"
              level="H"
              includeMargin={false}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoUpload;
