import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube';
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

function App() {
  const { i18n } = useTranslation();
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
    // When opened, try to play audio automatically
    if (isOpened && playerRef.current) {
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
          onClick={toggleAudio}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-xv-gold flex items-center justify-center text-xl shadow-lg transition-transform active:scale-95"
        >
          {isPlaying ? '🎵' : '🔇'}
        </button>

        <button 
          onClick={toggleLanguage}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-xv-gold flex items-center justify-center text-sm font-bold shadow-lg transition-transform active:scale-95 text-xv-gold uppercase"
        >
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>
      </div>

      {!isOpened ? (
        <EnvelopeScreen onOpen={() => setIsOpened(true)} />
      ) : (
        <main className="animate-fade-in-up">
          <Hero />
          <Itinerary />
          <Locations />
          <Family />
          <Godparents />
          <DressCode />
          <SaveTheDate />
          <FAQ />
          <PhotoUpload />
          <Footer />
        </main>
      )}
    </div>
  );
}

export default App;
