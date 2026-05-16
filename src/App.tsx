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

function App() {
  const { t, i18n } = useTranslation();
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true);
  const playerRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetButtonsTimer = () => {
    setIsButtonsVisible(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsButtonsVisible(false);
    }, 5000);
  };

  useEffect(() => {
    resetButtonsTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const [activeTip, setActiveTip] = useState<number | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);
  const [hasPromptedMusic, setHasPromptedMusic] = useState(false);

  useEffect(() => {
    if (isOpened && !hasPromptedMusic) {
      const timer = setTimeout(() => {
        // If music is playing after 15s, ask if they want to keep it
        if (isPlaying) {
          setShowMusicPrompt(true);
          setHasPromptedMusic(true);
        }
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isOpened, isPlaying, hasPromptedMusic]);

  const toggleLanguage = () => {
    resetButtonsTimer();
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  const toggleAudio = () => {
    resetButtonsTimer();
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
      }
    } catch (e) {
      console.error("Error toggling audio:", e);
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
      start: 142, // 2:22 in seconds
      playsinline: 1,
      loop: 1,
      playlist: 'okIQYRE_t3s',
    },
  };


  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden font-josefin text-xv-pearl bg-xv-black-bg min-h-[100svh]">
      
      {/* Hidden YouTube Player for Background Music */}
      <div className="fixed top-[-1000px] left-[-1000px] opacity-0 w-[10px] h-[10px] pointer-events-none overflow-hidden -z-50">
        <YouTube 
          videoId="okIQYRE_t3s" 
          opts={opts} 
          onReady={onPlayerReady} 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Floating Buttons */}
      <div 
        className={`absolute top-4 right-4 z-[60] flex gap-3 transition-opacity duration-1000 ${isButtonsVisible ? 'opacity-100' : 'opacity-20'}`}
        onClick={resetButtonsTimer}
        onTouchStart={resetButtonsTimer}
      >
        <button 
          onClick={() => {
            navigator.vibrate?.(40);
            toggleAudio();
          }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-xv-gold flex items-center justify-center text-xl shadow-lg transition-transform active:scale-95"
        >
          {isPlaying ? '🎵' : '🔇'}
        </button>

        <button 
          onClick={() => {
            navigator.vibrate?.(40);
            toggleLanguage();
          }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-xv-gold flex items-center justify-center text-sm font-bold shadow-lg transition-transform active:scale-95 text-xv-gold uppercase"
        >
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>

        <button 
          onClick={() => {
            navigator.vibrate?.(40);
            const user = prompt('Usuario:');
            if (user === null) return;
            if (user !== 'ANH') { alert('Usuario incorrecto'); return; }
            const pass = prompt('Contraseña:');
            if (pass === 'lupita#15./') setIsAdminOpen(prev => !prev);
            else if (pass !== null) alert('Contraseña incorrecta');
          }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-xv-gold flex items-center justify-center text-lg shadow-lg transition-transform active:scale-95"
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

      {!isOpened ? (
        <EnvelopeScreen onOpen={() => setIsOpened(true)} />
      ) : (
        <>
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

          {/* Focus Modal Overlay (Outside of main to avoid transform issues) */}
          {activeTip !== null && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto bg-black/70 backdrop-blur-lg"
              onClick={() => setActiveTip(null)}
            >
              <div 
                className="relative bg-xv-pearl w-full max-w-[440px] my-auto rounded-3xl shadow-2xl overflow-hidden border border-xv-gold/30 animate-scale-up"
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
                  <div className="p-8 md:p-10 text-center">
                    <div className="text-6xl mb-6">👗</div>
                    <h3 className="font-playfair italic text-3xl text-xv-red mb-4">Tip de Vestimenta</h3>
                    <div className="w-16 h-0.5 bg-xv-gold/40 mx-auto mb-6" />
                    <p className="font-cormorant text-xl text-xv-black-bg mb-8 italic leading-relaxed font-medium">
                      {t('dresscode.reservedColors')}
                    </p>
                    
                    <div className="flex justify-center gap-6">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#6E1423] relative border border-gray-200 shadow-sm">
                          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/40 -rotate-45" />
                        </div>
                        <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('dresscode.noRed')}</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-xv-gold relative border border-gray-200 shadow-sm">
                          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#0D0305]/40 -rotate-45" />
                        </div>
                        <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('dresscode.noGold')}</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-xv-pearl relative border border-gray-200 shadow-sm">
                          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#0D0305]/40 -rotate-45" />
                        </div>
                        <span className="font-josefin text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('dresscode.noPearl')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 md:p-10 text-center">
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
        </>
      )}
      {/* Delayed Music Confirmation Prompt */}
      {showMusicPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1a0f0f] border border-xv-gold/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up relative">
            {/* Close button for convenience */}
            <button 
              onClick={() => {
                navigator.vibrate?.(40);
                setShowMusicPrompt(false);
              }}
              className="absolute top-4 right-4 text-xv-gold/50 hover:text-xv-gold transition-colors"
            >
              ✕
            </button>

            <div className="text-4xl mb-4 animate-float">🎵</div>
            
            <h3 className="font-playfair text-xl text-xv-gold mb-10 leading-relaxed">
              {i18n.language === 'es' 
                ? '¿Deseas silenciar el audio?' 
                : 'Would you like to mute the audio?'}
            </h3>
            
            <div className="flex justify-center gap-10">
              {/* Continue Button */}
              <div className="flex flex-col items-center gap-3 group">
                <button 
                  onClick={() => {
                    navigator.vibrate?.(40);
                    setShowMusicPrompt(false);
                  }}
                  className="w-16 h-16 rounded-full bg-xv-gold text-xv-black-bg flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(212,175,55,0.5)] animate-pulse hover:scale-110 transition-transform active:scale-95"
                >
                  {i18n.language === 'es' ? '▶️' : '▶️'}
                </button>
                <span className="font-josefin text-[10px] uppercase tracking-[0.2em] text-xv-gold font-bold">
                  {i18n.language === 'es' ? 'Continuar' : 'Continue'}
                </span>
              </div>
              
              {/* Mute Button */}
              <div className="flex flex-col items-center gap-3 group">
                <button 
                  onClick={() => {
                    navigator.vibrate?.(40);
                    toggleAudio();
                    setShowMusicPrompt(false);
                  }}
                  className="w-16 h-16 rounded-full bg-white/5 border border-white/20 text-white flex items-center justify-center text-2xl hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
                >
                  {i18n.language === 'es' ? '🔇' : '🔇'}
                </button>
                <span className="font-josefin text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold group-hover:text-white transition-colors">
                  {i18n.language === 'es' ? 'Silenciar' : 'Mute'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
