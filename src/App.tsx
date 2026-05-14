import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // When opened, try to play audio automatically
    if (isOpened && audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Audio autoplay prevented by browser:", err);
      });
    }
  }, [isOpened]);

  return (
    <div className="relative font-josefin text-xv-pearl bg-xv-black-bg min-h-[100svh]">
      
      {/* Audio Element - source can be set later */}
      <audio ref={audioRef} loop>
        <source src="/music/background.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Buttons */}
      <div className="fixed top-4 right-4 z-[60] flex gap-3">
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
