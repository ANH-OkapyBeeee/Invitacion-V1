import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube';
import confetti from 'canvas-confetti';
import EnvelopeScreen from './components/EnvelopeScreen';
import Hero from './components/Hero';
import Itinerary from './components/Itinerary';
import Locations from './components/Locations';
import Family from './components/Family';
import Godparents from './components/Godparents';
import DressCode from './components/DressCode';
import SaveTheDate from './components/SaveTheDate';
import FAQ from './components/FAQ';
import PhotoUpload from './components/PhotoUpload';
import Footer from './components/Footer';
import ShakeCelebration from './components/ShakeCelebration';
import Preloader from './components/Preloader';

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

  const [activeTip, setActiveTip] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Prevent background scrolling when any detail modal or admin panel is active
  useEffect(() => {
    if (activeTip !== null || isAdminOpen) {
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
  }, [activeTip, isAdminOpen]);


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

      // Trigger magical star shower
      const duration = 4 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#D4AF37', '#FDFBF7', '#FFF3CD'],
          shapes: ['star']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#D4AF37', '#FDFBF7', '#FFF3CD'],
          shapes: ['star']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

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
    <div className={`relative w-full max-w-[100vw] overflow-x-hidden font-josefin text-xv-pearl bg-xv-black-bg min-h-[100svh] ${isPearlTheme ? 'theme-pearl' : ''}`}>
      
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
        className={`fixed bottom-6 right-6 z-[60] flex flex-row-reverse items-center transition-all duration-[2000ms] ease-out ${
          isFABVisible 
            ? `${isTenue ? 'opacity-30' : 'opacity-100'} scale-100` 
            : 'opacity-0 scale-75 pointer-events-none'
        } ${isCollapsed ? 'gap-0' : 'gap-3'}`}
        onMouseEnter={resetIdleTimers}
        onMouseMove={resetIdleTimers}
        onTouchStart={resetIdleTimers}
      >
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

        {/* Language Button */}
        <button 
          onClick={() => {
            navigator.vibrate?.(40);
            toggleLanguage();
          }}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-gray-800 flex items-center justify-center text-sm md:text-base font-bold shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100 select-none ${
            isCollapsed 
              ? 'opacity-0 scale-50 pointer-events-none w-0 h-0 border-none shadow-none gap-0 overflow-hidden' 
              : 'opacity-100 scale-100'
          }`}
          title="Idioma"
        >
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>

        {/* Elegant Pearl Theme Toggle Button */}
        <button 
          onClick={togglePearlTheme}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-gray-800 flex items-center justify-center text-xl md:text-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100 select-none ${
            isCollapsed 
              ? 'opacity-0 scale-50 pointer-events-none w-0 h-0 border-none shadow-none gap-0 overflow-hidden' 
              : 'opacity-100 scale-100'
          }`}
          title="Tema"
        >
          {isPearlTheme ? '🔴' : '⚪'}
        </button>

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
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-gray-800 flex items-center justify-center text-xl md:text-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-gray-100 select-none ${
            isCollapsed 
              ? 'opacity-0 scale-50 pointer-events-none w-0 h-0 border-none shadow-none gap-0 overflow-hidden' 
              : 'opacity-100 scale-100'
          }`}
          title="Administrador"
        >
          ⚙️
        </button>
      </div>

      {/* Panel de administrador */}
      {isAdminOpen && (
        <div className="fixed left-4 bottom-6 z-[10000] bg-black/90 backdrop-blur-xl border border-xv-gold/30 rounded-3xl p-5 shadow-2xl w-72 animate-scale-up">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-xv-gold animate-pulse" />
              <h3 className="font-josefin text-xv-gold text-[10px] uppercase tracking-widest font-bold">Panel Administrador</h3>
            </div>
            <button onClick={() => setIsAdminOpen(false)} className="text-white/40 hover:text-white text-xs transition-colors">✕</button>
          </div>

          <div className="space-y-2">
            {[
              { icon: '🕐', label: 'Simulador de Tiempo', available: false },
              { icon: '👥', label: 'Gestión de Invitados', available: false },
              { icon: '🎬', label: 'Video Cronológico', available: false },
              { icon: '📸', label: 'Subir Fotos', available: false },
              { icon: '🎙️', label: 'Mensajes de Voz', available: false },
            ].map((item, idx) => (
              <button
                key={idx}
                disabled={!item.available}
                className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all group disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <span className="font-josefin text-[11px] uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  {!item.available && (
                    <p className="text-xv-gold/40 text-[8px] font-josefin uppercase tracking-wider mt-0.5">Próximamente</p>
                  )}
                </div>
                <span className="text-white/20 text-xs">›</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <p className="text-[8px] font-josefin text-xv-gold/40 tracking-wider">
              Bienvenido, Ing. Alexis Nicolás Hurtado.
            </p>
          </div>
        </div>
      )}

      {/* Main Content (Pre-rendered but hidden) */}
      <div className={!isOpened ? 'fixed inset-0 opacity-0 pointer-events-none -z-10' : 'block relative'}>
        <ShakeCelebration />
        <main className="animate-fade-in-up">
          <Hero />
          <Itinerary />
          <Locations />
          <Family />
          <Godparents />
          <DressCode onTipSelect={setActiveTip} activeTip={activeTip} />
          <SaveTheDate />
          <FAQ />
          <PhotoUpload />
          <Footer />
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
                    <div className="text-6xl mb-6">📝</div>
                    <h3 className="font-playfair italic text-3xl text-xv-red mb-4">
                      {t('dresscode.charroTitle')}
                    </h3>
                    <div className="w-16 h-0.5 bg-xv-gold/40 mx-auto mb-6" />
                    <p className="font-cormorant text-xl text-xv-black-bg mb-8 italic leading-relaxed font-medium">
                      {t('dresscode.charroDesc')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

    </div>
  );
}

export default App;
