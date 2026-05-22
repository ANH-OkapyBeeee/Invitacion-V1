import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube';
import confetti from 'canvas-confetti';
import EnvelopeScreen from './components/EnvelopeScreen';
import Hero from './components/Hero';
import ShakeCelebration from './components/ShakeCelebration';
import Preloader from './components/Preloader';

// Lazy load below-the-fold components
const TimelineGallery = lazy(() => import('./components/TimelineGallery'));
const Itinerary = lazy(() => import('./components/Itinerary'));
const Locations = lazy(() => import('./components/Locations'));
const Family = lazy(() => import('./components/Family'));
const Godparents = lazy(() => import('./components/Godparents'));
const DressCode = lazy(() => import('./components/DressCode'));
const SaveTheDate = lazy(() => import('./components/SaveTheDate'));
const FAQ = lazy(() => import('./components/FAQ'));
const PhotoUpload = lazy(() => import('./components/PhotoUpload'));
const RecentGallery = lazy(() => import('./components/RecentGallery'));
const Footer = lazy(() => import('./components/Footer'));
const LegalModal = lazy(() => import('./components/LegalModal'));
import { db } from './firebase';
import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';


function App() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [startEnvelopeMagic, setStartEnvelopeMagic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Default playing state active from the envelope screen
  const playerRef = useRef<any>(null);

  // Custom Floating Action Buttons (FAB) State Machine
  const [isCollapsed, setIsCollapsed] = useState(false); // Start expanded on load
  const [isTenue, setIsTenue] = useState(false);
  const [isFABVisible, setIsFABVisible] = useState(false); // Magical organic delay timed with stars
  const [isPearlTheme, setIsPearlTheme] = useState(false);
  
  const collapseTimerRef = useRef<any>(null);
  const tenueTimerRef = useRef<any>(null);
  const longPressTimerRef = useRef<any>(null);
  const isLongPressActive = useRef(false);

  const resetIdleTimers = () => {
    setIsTenue(false);
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    if (tenueTimerRef.current) clearTimeout(tenueTimerRef.current);

    // 1. Auto-collapse expanded options after 3 seconds of no interaction
    collapseTimerRef.current = setTimeout(() => {
      setIsCollapsed(true);
    }, 3000);

    // 2. Go tenue/semi-transparent after 3.5 seconds of no interaction
    tenueTimerRef.current = setTimeout(() => {
      setIsTenue(true);
    }, 3500);
  };

  useEffect(() => {
    // Organically materialize the buttons from the magical stardust
    const materializationTimer = setTimeout(() => {
      setIsFABVisible(true);
      resetIdleTimers();
    }, 4500); // timed perfectly with the falling stars rainfall and envelope origami card

    return () => {
      clearTimeout(materializationTimer);
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      if (tenueTimerRef.current) clearTimeout(tenueTimerRef.current);
    };
  }, []);

  // Bypass envelope and preloader and scroll directly if any hash is present on load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setIsOpened(true);
      setIsLoading(false);
      const timer = setTimeout(() => {
        const targetId = hash.replace('#', '');
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // GLOBAL ANTI-THEFT / ANTI-DOWNLOAD PROTECTIONS
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      // Block Ctrl+P / Cmd+P (Print Page)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
      }
      // Attempt to block PrintScreen key (Note: limited support across OS)
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText(''); // Clear clipboard as a deterrent
        // Note: We cannot intercept the OS-level screenshot itself, but we clear clipboard.
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [activeTip, setActiveTip] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');
  const [adminSubView, setAdminSubView] = useState<'menu' | 'moderation' | 'published' | 'developer'>('menu');
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [approvedPhotos, setApprovedPhotos] = useState<any[]>([]);
  const [globalSettings, setGlobalSettings] = useState<any>({});

  // Real-time subscription to global settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        setGlobalSettings(snap.data());
      }
    });
    return () => unsub();
  }, []);

  const toggleDevMode = async () => {
    const newValue = !globalSettings.devMode;
    try {
      await updateDoc(doc(db, 'settings', 'global'), { devMode: newValue });
    } catch (e: any) {
      if (e.code === 'not-found') {
        await setDoc(doc(db, 'settings', 'global'), { devMode: newValue });
      }
    }
  };

  // Real-time subscription to pending photos when moderation panel is open
  useEffect(() => {
    if (!isAdminOpen || adminSubView !== 'moderation') return;

    const q = query(
      collection(db, 'photos'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      photos.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setPendingPhotos(photos);
    });

    return () => unsubscribe();
  }, [isAdminOpen, adminSubView]);

  // Real-time subscription to approved/published photos
  useEffect(() => {
    if (!isAdminOpen || adminSubView !== 'published') return;

    const q = query(
      collection(db, 'photos'),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      photos.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setApprovedPhotos(photos);
    });

    return () => unsubscribe();
  }, [isAdminOpen, adminSubView]);

  const handleApprovePhoto = async (photoId: string) => {
    navigator.vibrate?.(40);
    try {
      await updateDoc(doc(db, 'photos', photoId), {
        status: 'approved'
      });
    } catch (err) {
      console.error("Error approving photo:", err);
    }
  };

  const handleRejectPhoto = async (photoId: string, _fileName: string) => {
    navigator.vibrate?.(60);
    try {
      // Photos are stored on ImgBB (external service) - we only remove the Firestore record
      await deleteDoc(doc(db, 'photos', photoId));
    } catch (err) {
      console.error("Error rejecting photo:", err);
    }
  };

  const handleUnpublishPhoto = async (photoId: string) => {
    navigator.vibrate?.(50);
    try {
      // Move back to pending so it disappears from the public gallery
      await updateDoc(doc(db, 'photos', photoId), { status: 'pending' });
    } catch (err) {
      console.error('Error unpublishing photo:', err);
    }
  };

  const handleDownloadAllPhotos = async () => {
    navigator.vibrate?.(50);
    try {
      const q = query(collection(db, 'photos'), where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      const photos = snapshot.docs.map(d => d.data() as { url: string; fileName: string });

      if (photos.length === 0) {
        alert('No hay fotos aprobadas para descargar todavía.');
        return;
      }

      // Download each photo sequentially using a temporary anchor element
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = photo.fileName || `foto_${i + 1}.webp`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Small delay between downloads so the browser doesn't block them
        await new Promise(res => setTimeout(res, 600));
      }
    } catch (err) {
      console.error('Error downloading photos:', err);
      alert('Hubo un error al descargar las fotos. Intenta de nuevo.');
    }
  };

  // Prevent background scrolling when any detail modal or admin panel is active
  useEffect(() => {
    if (activeTip !== null || isAdminOpen || legalModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [activeTip, isAdminOpen, legalModalOpen]);


  const toggleLanguage = () => {
    resetIdleTimers();
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  const togglePearlTheme = () => {
    resetIdleTimers();
    setIsPearlTheme(prev => !prev);
    navigator.vibrate?.(50);
  };

  const handleShareWhatsApp = () => {
    resetIdleTimers();
    navigator.vibrate?.(40);
    const invitationUrl = window.location.origin + window.location.pathname;
    const shareText = `¡Hola! Te invito a celebrar mis XV Años. 🌟 Aquí puedes ver todos los detalles en mi invitación digital: ${invitationUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleAudio = () => {
    resetIdleTimers();
    try {
      if (playerRef.current) {
        const state = playerRef.current.getPlayerState();
        // 1 = playing, 3 = buffering
        if (state === 1 || state === 3) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(prev => !prev);
      }
    } catch (e) {
      console.error("Error toggling audio:", e);
      setIsPlaying(prev => !prev);
    }
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    
    // Set medium volume (50%) to not startle the user
    try {
      event.target.setVolume(50);
      event.target.setPlaybackQuality('small'); // Hints YT to use lowest quality for speed
    } catch (e) {
      console.warn("Could not set volume/quality:", e);
    }

    // If the envelope was already opened before player became ready, try to play
    if (isOpened) {
      try {
        event.target.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.error("Error autoplaying on ready:", e);
      }
    }
  };

  useEffect(() => {
    // When opened, try to play audio automatically and trigger celebration
    if (isOpened) {
      // Wake up the FAB buttons and make them fully opaque so the user can easily see and interact with them immediately!
      resetIdleTimers();

      // Trigger magical elegant confetti (Optimized for no lag)
      // Left burst
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.6 },
        colors: ['#D4AF37', '#FDFBF7', '#F5D76E', '#C0C0C0'],
        shapes: ['circle', 'square'],
        scalar: 1.2
      });
      // Right burst
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.6 },
        colors: ['#D4AF37', '#FDFBF7', '#F5D76E', '#C0C0C0'],
        shapes: ['circle', 'square'],
        scalar: 1.2
      });
      // Center burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FDFBF7', '#F5D76E', '#C0C0C0'],
        shapes: ['circle', 'square'],
        scalar: 1.2
      });

      if (playerRef.current) {
        try {
          const state = playerRef.current.getPlayerState();
          if (state !== 1 && state !== 3) {
            playerRef.current.playVideo();
            setIsPlaying(true);
          }
        } catch (e) {
          console.error("Error autoplaying on open:", e);
        }
      }
    }
  }, [isOpened]);

  const opts: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      playsinline: 1,
      loop: 1,
      playlist: 'M3CbRJ6jgQc',
    },
  };

  const handleMusicClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLongPressActive.current) {
      isLongPressActive.current = false;
      return;
    }
    resetIdleTimers();
    navigator.vibrate?.(40);
    toggleAudio();
  };

  const handleStartPress = () => {
    resetIdleTimers();
    isLongPressActive.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      isLongPressActive.current = true;
      setIsCollapsed(prev => !prev); // Toggle collapsed/expanded on long press!
      navigator.vibrate?.([60, 30, 60]); // Premium vibration feedback!
    }, 500); // 500ms long press threshold
  };

  const handleEndPress = (e: React.MouseEvent | React.TouchEvent) => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    if (isLongPressActive.current) {
      e.preventDefault(); // Prevent standard click event if it was a long press!
      e.stopPropagation();
    }
  };

  return (
    <div className={`relative w-full max-w-[100vw] overflow-x-clip font-josefin text-xv-pearl bg-xv-black-bg min-h-[100svh] ${isPearlTheme ? 'theme-pearl' : ''}`}>
      
      {isLoading && (
        <Preloader 
          onStartFadeOut={() => setStartEnvelopeMagic(true)} 
          onComplete={() => setIsLoading(false)} 
        />
      )}
      
      {/* Hidden YouTube Player for Background Music */}
      <div className="fixed top-[-1000px] left-[-1000px] opacity-0 w-[10px] h-[10px] pointer-events-none overflow-hidden -z-50">
        <YouTube 
          videoId="M3CbRJ6jgQc" 
          opts={opts} 
          onReady={onPlayerReady} 
          onPlay={() => {
            setIsPlaying(true);
            resetIdleTimers();
          }}
          onPause={() => {
            setIsPlaying(false);
            resetIdleTimers();
          }}
        />
      </div>

      {/* Custom Floating Action Buttons (FAB) System */}
      <div 
        className={`fixed bottom-6 right-6 z-[60] flex flex-row-reverse items-end transition-all duration-[2000ms] ease-out ${
          isFABVisible 
            ? `${isTenue ? 'opacity-30' : 'opacity-100'} scale-100` 
            : 'opacity-0 scale-75 pointer-events-none'
        } ${isCollapsed ? 'gap-0' : 'gap-3'}`}
        onMouseEnter={resetIdleTimers}
        onMouseMove={resetIdleTimers}
        onTouchStart={resetIdleTimers}
      >
        {/* Right column: Music + WhatsApp stack */}
        <div className="flex flex-col-reverse items-center gap-3 transition-all duration-500">
          {/* Primary Music Button */}
          <button 
            onClick={handleMusicClick}
            onTouchStart={handleStartPress}
            onTouchEnd={handleEndPress}
            onMouseDown={handleStartPress}
            onMouseUp={handleEndPress}
            onMouseLeave={handleEndPress}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-gray-800 flex items-center justify-center text-2xl md:text-3xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100 relative group select-none"
            title={isPlaying ? 'Silenciar' : 'Reproducir'}
          >
            {isPlaying && (
              <span className="absolute inset-0 rounded-full bg-green-500/10 animate-ping pointer-events-none" />
            )}
            {isPlaying ? '🎵' : '🔇'}
          </button>

          {/* WhatsApp Share Button */}
          <button 
            onClick={handleShareWhatsApp}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100 relative select-none"
            title="Compartir por WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-7 h-7 md:w-8 md:h-8 fill-[#25D366]">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </button>
        </div>



        {/* Admin/Config Button */}
        <button 
          onClick={() => {
            navigator.vibrate?.(40);
            resetIdleTimers();
            const user = prompt('Usuario:');
            if (user === null) return;
            if (user !== 'ANH') { alert('Usuario incorrecto'); return; }
            const pass = prompt('Contraseña:');
            if (pass === 'lupita#15./') setIsAdminOpen(prev => !prev);
            else if (pass !== null) alert('Contraseña incorrecta');
          }}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-gray-800 flex items-center justify-center text-xl md:text-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100 select-none mb-1 ${
            isCollapsed 
              ? 'opacity-0 scale-50 pointer-events-none w-0 h-0 border-none shadow-none gap-0 overflow-hidden mb-0' 
              : 'opacity-100 scale-100'
          }`}
          title="Administrador"
        >
          ⚙️
        </button>
      </div>

      {/* Panel de administrador */}
      {isAdminOpen && (
        <div 
          className={`fixed z-[10000] bg-black/95 backdrop-blur-xl border border-xv-gold/30 rounded-3xl p-5 shadow-2xl transition-all duration-300 animate-scale-up ${
            (adminSubView === 'moderation' || adminSubView === 'published')
              ? 'left-4 right-4 bottom-6 md:left-auto md:right-6 md:w-[460px] max-h-[85vh] flex flex-col' 
              : 'left-4 bottom-6 w-72'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-xv-gold animate-pulse" />
              <h3 className="font-josefin text-xv-gold text-[10px] uppercase tracking-widest font-bold">
                {adminSubView === 'moderation' ? 'Fotos Pendientes' : adminSubView === 'published' ? 'Fotos Publicadas' : 'Panel Administrador'}
              </h3>
            </div>
            <button 
              onClick={() => {
                setIsAdminOpen(false);
                setAdminSubView('menu');
              }} 
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          {/* SubView: Menu */}
          {adminSubView === 'menu' && (
            <div className="space-y-2">
              {[
                { 
                  icon: '🎨', 
                  label: 'Cambiar Tema (Rojo / Perla)', 
                  available: true, 
                  onClick: togglePearlTheme 
                },
                { 
                  icon: '🌐', 
                  label: `Cambiar Idioma (${i18n.language === 'es' ? 'ES -> EN' : 'EN -> ES'})`, 
                  available: true, 
                  onClick: toggleLanguage 
                },
                { icon: '🕐', label: 'Simulador de Tiempo', available: false },
                { icon: '👥', label: 'Gestión de Invitados', available: false },
                { icon: '🎬', label: 'Video Cronológico', available: false },
                { 
                  icon: '📸', 
                  label: `Moderar Fotos`, 
                  badge: pendingPhotos.length > 0 ? pendingPhotos.length : undefined,
                  available: true, 
                  onClick: () => setAdminSubView('moderation') 
                },
                { 
                  icon: '🛠️', 
                  label: 'Modo Desarrollador', 
                  available: true, 
                  onClick: () => setAdminSubView('developer') 
                },
                { icon: '🎙️', label: 'Mensajes de Voz', available: false },
              ].map((item, idx) => (
                <button
                  key={idx}
                  disabled={!item.available}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all group disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-josefin text-[11px] uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className="bg-xv-gold text-xv-black-bg font-josefin font-bold text-[9px] px-2 py-0.5 rounded-full animate-bounce">
                        {item.badge}
                      </span>
                    )}
                    {!item.available && (
                      <p className="text-xv-gold/40 text-[8px] font-josefin uppercase tracking-wider mt-0.5">Próximamente</p>
                    )}
                  </div>
                  <span className="text-white/20 text-xs">›</span>
                </button>
              ))}

              {/* Download All Photos Button */}
              <div className="pt-2 mt-2 border-t border-white/10">
                <button
                  onClick={handleDownloadAllPhotos}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all group hover:bg-xv-gold/10 border border-xv-gold/20"
                >
                  <span className="text-xl">📥</span>
                  <div className="flex-1">
                    <span className="font-josefin text-[11px] uppercase tracking-wider text-xv-gold group-hover:text-xv-gold transition-colors">
                      Descargar Todas las Fotos
                    </span>
                    <p className="text-xv-gold/40 text-[8px] font-josefin mt-0.5">Solo fotos aprobadas</p>
                  </div>
                  <span className="text-xv-gold/40 text-xs">↓</span>
                </button>
              </div>
            </div>
          )}

          {/* SubView: Moderation (Pending Photos) */}
          {adminSubView === 'moderation' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Back + Tabs */}
              <div className="flex items-center gap-3 mb-4">
                <button 
                  onClick={() => setAdminSubView('menu')}
                  className="text-[10px] font-josefin text-xv-gold/60 hover:text-xv-gold uppercase tracking-wider flex items-center gap-1 flex-shrink-0"
                >
                  ← Menú
                </button>
                <div className="flex flex-1 gap-1 bg-white/5 rounded-xl p-1">
                  <button
                    onClick={() => setAdminSubView('moderation')}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-josefin uppercase tracking-wider bg-xv-gold text-xv-black-bg font-bold"
                  >
                    Pendientes {pendingPhotos.length > 0 && `(${pendingPhotos.length})`}
                  </button>
                  <button
                    onClick={() => setAdminSubView('published')}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-josefin uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                  >
                    Publicadas
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin max-h-[50vh]">
                {pendingPhotos.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-xl font-playfair italic text-xv-gold mb-2">🎉 ¡Todo al día!</p>
                    <p className="text-xs font-cormorant text-white/60">No hay fotos pendientes de moderación en este momento.</p>
                  </div>
                ) : (
                  pendingPhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 items-center justify-between group hover:bg-white/10 transition-all"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                        <img 
                          src={photo.url} 
                          alt="Pendiente" 
                          className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => window.open(photo.url, '_blank')}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-josefin text-white/40 truncate">
                          {photo.fileName}
                        </p>
                        <p className="text-[10px] font-josefin text-white/80 mt-1">
                          {(photo.size / 1024).toFixed(0)} KB
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprovePhoto(photo.id)}
                          className="px-3 py-2 bg-green-600/20 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-600 hover:text-white transition-all text-xs font-josefin font-bold uppercase tracking-wider"
                        >
                          Aprobar
                        </button>
                        <button 
                          onClick={() => handleRejectPhoto(photo.id, photo.fileName)}
                          className="px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs font-josefin font-bold uppercase tracking-wider"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SubView: Published Photos */}
          {adminSubView === 'published' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Back + Tabs */}
              <div className="flex items-center gap-3 mb-4">
                <button 
                  onClick={() => setAdminSubView('menu')}
                  className="text-[10px] font-josefin text-xv-gold/60 hover:text-xv-gold uppercase tracking-wider flex items-center gap-1 flex-shrink-0"
                >
                  ← Menú
                </button>
                <div className="flex flex-1 gap-1 bg-white/5 rounded-xl p-1">
                  <button
                    onClick={() => setAdminSubView('moderation')}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-josefin uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                  >
                    Pendientes
                  </button>
                  <button
                    onClick={() => setAdminSubView('published')}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-josefin uppercase tracking-wider bg-xv-gold text-xv-black-bg font-bold"
                  >
                    Publicadas {approvedPhotos.length > 0 && `(${approvedPhotos.length})`}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin max-h-[50vh]">
                {approvedPhotos.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-xl font-playfair italic text-xv-gold mb-2">📷 Sin fotos</p>
                    <p className="text-xs font-cormorant text-white/60">Aún no hay fotos aprobadas en la galería.</p>
                  </div>
                ) : (
                  approvedPhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 items-center justify-between group hover:bg-white/10 transition-all"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                        <img 
                          src={photo.url} 
                          alt="Publicada" 
                          className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => window.open(photo.url, '_blank')}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-josefin text-white/40 truncate">
                          {photo.fileName}
                        </p>
                        <p className="text-[10px] font-josefin text-green-400 mt-1">
                          ✓ En galería pública
                        </p>
                      </div>

                      <button 
                        onClick={() => handleUnpublishPhoto(photo.id)}
                        className="px-3 py-2 bg-orange-600/20 text-orange-400 border border-orange-500/20 rounded-xl hover:bg-orange-600 hover:text-white transition-all text-xs font-josefin font-bold uppercase tracking-wider flex-shrink-0"
                      >
                        Quitar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Footer info */}
          <div className="mt-4 pt-3 border-t border-white/10 text-center flex-shrink-0">
            <p className="text-[8px] font-josefin text-xv-gold/40 tracking-wider">
              Bienvenido, Ing. Alexis Nicolás Hurtado.
            </p>
          </div>
        </div>
      )}

      {/* Main Content (Pre-rendered but hidden) */}
      <div className={!isOpened ? 'fixed inset-0 opacity-0 pointer-events-none -z-10' : 'block relative'}>
        {isOpened && <ShakeCelebration />}
        <main className="animate-fade-in-up">
          <div className="bg-[radial-gradient(ellipse_at_top,_#2D0808_0%,_transparent_70%)] relative">
            <div className="relative z-10">
              <Hero />
              <Suspense fallback={<div className="h-40 flex items-center justify-center text-xv-gold font-josefin">Cargando nuestra historia...</div>}>
                <TimelineGallery />
              </Suspense>
            </div>
          </div>
          <Suspense fallback={<div className="h-screen flex items-center justify-center text-xv-gold font-josefin">Cargando detalles...</div>}>
            <Itinerary />
            <Locations />
            <Family />
            <Godparents />
            <DressCode onTipSelect={setActiveTip} activeTip={activeTip} />
            <SaveTheDate />
            <FAQ />
            <PhotoUpload />
            <RecentGallery />
            <Footer 
              onOpenLegal={(tab) => {
                setActiveLegalTab(tab);
                setLegalModalOpen(true);
              }}
            />
          </Suspense>
        </main>
      </div>

      {/* Envelope Screen */}
      {!isOpened && (
        <EnvelopeScreen active={startEnvelopeMagic} onOpen={() => setIsOpened(true)} />
      )}

          {/* Focus Modal Overlay (Outside of main to avoid transform issues) */}
          {activeTip !== null && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg touch-none"
              onClick={() => setActiveTip(null)}
            >
              <div 
                className="relative bg-xv-pearl w-full max-w-[440px] my-auto rounded-3xl shadow-2xl overflow-hidden border border-xv-gold/30 animate-scale-up flex flex-col max-h-[85vh] touch-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button 
                  onClick={() => {
                    navigator.vibrate?.(40);
                    setActiveTip(null);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-xv-red text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[10000]"
                >
                  ✕
                </button>

                {activeTip === 1 ? (
                  <div className="p-8 md:p-10 text-center overflow-y-auto flex-1 touch-auto scrollbar-thin">
                    <div className="text-6xl mb-6">👗</div>
                    <h3 className="font-playfair italic text-3xl text-xv-red mb-4">Tip de Vestimenta</h3>
                    <div className="w-16 h-0.5 bg-xv-gold/40 mx-auto mb-6" />
                    <div className="font-cormorant text-xl text-xv-black-bg mb-8 italic leading-relaxed font-medium space-y-4">
                      <p>
                        Con mucho cariño, pedimos a nuestras invitadas evitar 🚫 los vestidos en:
                      </p>
                      
                      <div className="flex justify-center gap-6 my-6">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#6E1423] relative border border-gray-200 shadow-sm transition-transform hover:scale-105">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/40 -rotate-45" />
                          </div>
                          <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold not-italic">{t('dresscode.noRed')}</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-xv-gold relative border border-gray-200 shadow-sm transition-transform hover:scale-105">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#0D0305]/40 -rotate-45" />
                          </div>
                          <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold not-italic">{t('dresscode.noGold')}</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-xv-pearl relative border border-gray-200 shadow-sm transition-transform hover:scale-105">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#0D0305]/40 -rotate-45" />
                          </div>
                          <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold not-italic text-center block leading-tight">
                            {t('dresscode.noPearl').split(' ').map((word, i, arr) => (
                              <React.Fragment key={i}>
                                {word}
                                {i < arr.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </span>
                        </div>
                      </div>
                      
                      <p>
                        ya que estos colores son exclusivos para el vestido de la Quinceañera y sus damas.
                      </p>
                      
                      <p className="text-xv-red font-semibold not-italic mt-6 pt-2 border-t border-xv-gold/10">
                        ¡Agradecemos profundamente su amable comprensión 🙏!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 md:p-10 text-center overflow-y-auto flex-1 touch-auto scrollbar-thin">
                    <div className="text-6xl mb-6">🤠</div>
                    <h3 className="font-playfair italic text-3xl text-xv-red mb-4">¡Fiesta con Temática Charra!</h3>
                    <div className="w-16 h-0.5 bg-xv-gold/40 mx-auto mb-6" />
                    
                    <div className="font-cormorant text-xl text-xv-black-bg mb-8 italic leading-relaxed font-medium space-y-6">
                      <p>
                        Te invitamos a portar con toda confianza alguna prenda o accesorio tradicional charro como, por ejemplo:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-w-[360px] mx-auto text-left not-italic font-josefin font-semibold text-xv-black-bg text-[13px] sm:text-sm border-y border-xv-gold/15 py-4 my-4 bg-xv-pearl/30 rounded-xl px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👢</span>
                          <span>Botas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🧣</span>
                          <span>Rebozo</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🤠</span>
                          <span>Sombrero</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👗</span>
                          <span className="leading-tight">Vestido de escaramuza</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-lg">✨</span>
                          <span className="leading-tight">Cinturones piteados</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👨🏻</span>
                          <span>El bigotazo</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👔</span>
                          <span className="leading-tight">Moños charros</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👧🏻</span>
                          <span className="leading-tight">Trenzas con listones</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

      <LegalModal 
        isOpen={legalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        defaultTab={activeLegalTab} 
      />

    </div>
  );
}

export default App;
