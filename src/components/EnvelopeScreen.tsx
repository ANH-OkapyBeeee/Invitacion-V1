import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Confetti from './Confetti';
import { CONFIG } from '../config';
import { requestShakePermission } from './ShakeCelebration';
import confetti from 'canvas-confetti';

interface Props {
  onOpen: () => void;
  active?: boolean;
}

const EnvelopeScreen: React.FC<Props> = ({ onOpen, active = true }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate stable coordinates and random properties for background stars once on mount
  const [backgroundStars] = useState(() => {
    return [...Array(65)].map((_, i) => ({
      id: i,
      isGold: i % 3 === 0,
      sizeMultiplier: i % 8 === 0 ? 2.4 : (i % 3 === 0 ? 1.6 : 1),
      top: Math.random() * 100,
      left: Math.random() * 100,
      fallDuration: (Math.random() * 1.2 + 1.8) + 's', // Fall duration between 1.8s and 3.0s
      fallDelay: (Math.random() * 0.8) + 's', // Staggered delay
      driftX: (Math.random() * 80 - 40) + 'px', // Elegant wind drift
      twinkleDuration: (Math.random() * 2 + 2) + 's',
      twinkleDelay: (Math.random() * 3) + 's',
      char: i % 4 === 0 ? '✦' : '★'
    }));
  });

  // Transition orchestration states for a magical progressive entry
  const [isBackgroundStarsVisible, setIsBackgroundStarsVisible] = useState(false);
  const [areStarsSettled, setAreStarsSettled] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  
  // Origami envelope assembly states
  const [isBackVisible, setIsBackVisible] = useState(false);
  const [isFlapsVisible, setIsFlapsVisible] = useState(false);
  const [isBottomFlapVisible, setIsBottomFlapVisible] = useState(false);
  const [isTopFlapVisible, setIsTopFlapVisible] = useState(false);
  const [isWaxSealVisible, setIsWaxSealVisible] = useState(false);

  // Trigger majestic golden star explosion automatically when opening the link / reloading
  useEffect(() => {
    if (!active) return;

    // Detect if current screen is desktop (width >= 1024px)
    const isDesktop = window.innerWidth >= 1024;
    
    // We rasterize at scalar 6.0 for desktop to keep the textures ultra-crisp at massive sizes, and 3.8 for mobile
    const textScalar = isDesktop ? 6.0 : 3.8;
    
    // Create custom shapes with colors explicitly defined at creation to prevent the black rendering bug.
    const customShapes = [
      // Gold Sparkles (✦)
      confetti.shapeFromText({ text: '✦', color: '#D4AF37', scalar: textScalar }),
      confetti.shapeFromText({ text: '✦', color: '#F5D76E', scalar: textScalar }),
      // White/Silver Sparkles (✦)
      confetti.shapeFromText({ text: '✦', color: '#FFFFFF', scalar: textScalar }),
      confetti.shapeFromText({ text: '✦', color: '#FDFBF7', scalar: textScalar }),
      
      // Gold Classics (★)
      confetti.shapeFromText({ text: '★', color: '#D4AF37', scalar: textScalar }),
      confetti.shapeFromText({ text: '★', color: '#F5D76E', scalar: textScalar }),
      // White/Silver Classics (★)
      confetti.shapeFromText({ text: '★', color: '#FFFFFF', scalar: textScalar }),
      confetti.shapeFromText({ text: '★', color: '#FDFBF7', scalar: textScalar })
    ];

    // Responsive size scales - enlarged even further!
    const burstScalar = isDesktop ? 4.8 : 2.6;
    const rainMinScalar = isDesktop ? 3.0 : 1.8;
    const rainRangeScalar = isDesktop ? 2.0 : 1.2;

    // 1. Initial Left Corner Burst (Shoots towards center-top)
    confetti({
      particleCount: 85,
      angle: 45,
      spread: 60,
      origin: { x: 0, y: 0.3 },
      shapes: customShapes,
      scalar: burstScalar,
      gravity: 0.75,
      ticks: 180
    });

    // 2. Initial Right Corner Burst (Shoots towards center-top)
    confetti({
      particleCount: 85,
      angle: 135,
      spread: 60,
      origin: { x: 1, y: 0.3 },
      shapes: customShapes,
      scalar: burstScalar,
      gravity: 0.75,
      ticks: 180
    });

    // 3. Immersive Continuous Rain of Stars across the whole screen width
    const duration = 2.5 * 1000; // 2.5 seconds of star rain
    const end = Date.now() + duration;

    let animId: number;
    const rainFrame = () => {
      // Spawn 3 stars randomly across the horizontal screen top
      confetti({
        particleCount: 3,
        angle: 270, // Direct downward gravity
        spread: 90,
        origin: { x: Math.random(), y: Math.random() * 0.15 }, // Top of screen
        shapes: customShapes,
        scalar: Math.random() * rainRangeScalar + rainMinScalar, // Responsive sparkling stars
        gravity: Math.random() * 0.3 + 0.45,
        drift: (Math.random() - 0.5) * 1.5, // Elegant sway
        ticks: 150
      });

      if (Date.now() < end) {
        animId = requestAnimationFrame(rainFrame);
      }
    };

    rainFrame();

    // Orchestrated progressive entry of elements
    const t1 = setTimeout(() => setIsBackgroundStarsVisible(true), 300); // Container fades in
    const tStars = setTimeout(() => setAreStarsSettled(true), 3800); // Fall finishes, start continuous twinkle loop
    const t2 = setTimeout(() => setIsTitleVisible(true), 750); // Title, names and date fade in
    
    // Origami Envelope progressive assembly delays
    const tBack = setTimeout(() => setIsBackVisible(true), 1100); // Envelope Back card fades and spins straight
    const tFlaps = setTimeout(() => setIsFlapsVisible(true), 1500); // Left and Right flaps fold in
    const tBottom = setTimeout(() => setIsBottomFlapVisible(true), 1900); // Bottom flap folds up
    const tTop = setTimeout(() => setIsTopFlapVisible(true), 2300); // Top opening flap folds down
    const tSeal = setTimeout(() => setIsWaxSealVisible(true), 2700); // Glowing wax seal bounces into the center!

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(t1);
      clearTimeout(tStars);
      clearTimeout(t2);
      clearTimeout(tBack);
      clearTimeout(tFlaps);
      clearTimeout(tBottom);
      clearTimeout(tTop);
      clearTimeout(tSeal);
    };
  }, [active]);

  const handleOpen = async () => {
    if (isOpen) return;
    
    // Request permission for shake effect
    await requestShakePermission();

    setIsOpen(true);
    
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-start pt-12 sm:pt-12 md:pt-8 bg-[radial-gradient(circle,_#2D0808_0%,_#0D0305_100%)] z-50 overflow-hidden transition-opacity duration-700 ease-in-out"
      style={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? 'none' : 'auto' }}
    >
      
      {/* Falling and Settling Background Stars with Safe Zone Mask */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-[2000ms] ease-out"
        style={{
          maskImage: 'radial-gradient(ellipse at center, transparent 35%, black 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 35%, black 75%)',
          opacity: isBackgroundStarsVisible ? 1 : 0
        }}
      >
        {backgroundStars.map((star) => (
          <div
            key={star.id}
            className={`absolute ${areStarsSettled ? 'animate-twinkle' : 'animate-star-fall'} ${star.isGold ? 'text-xv-gold' : 'text-white'}`}
            style={{
              fontSize: `calc(var(--star-base-size) * ${star.sizeMultiplier})`,
              top: star.top + '%',
              left: star.left + '%',
              '--fall-duration': star.fallDuration,
              '--fall-delay': star.fallDelay,
              '--drift-x': star.driftX,
              '--duration': star.twinkleDuration,
              animationDelay: star.twinkleDelay,
              filter: 'drop-shadow(0 0 5px currentColor)',
            } as React.CSSProperties}
          >
            {star.char}
          </div>
        ))}
      </div>

      {/* Majestic Crown Image above Title */}
      <div 
        className="w-[155px] h-[110px] md:w-[195px] md:h-[135px] relative z-10 transition-all duration-[2000ms] ease-out mt-4 -mb-4 crown-container"
        style={{
          opacity: isTitleVisible ? 1 : 0,
          transform: isTitleVisible ? 'scale(1)' : 'scale(0.95)'
        }}
      >
        <img 
          src="/Fotos/Corona/corona.png" 
          alt="Corona Real" 
          className="w-full h-full object-contain filter-gold-to-burgundy"
        />
      </div>

      {/* Title - Progressive entry */}
      <h1 
        className="mt-6 mb-10 text-5xl md:text-6xl font-playfair text-xv-gold animate-shimmer relative z-10 text-center transition-all duration-[2000ms] ease-out envelope-title"
        style={{
          opacity: isTitleVisible ? 1 : 0,
          transform: isTitleVisible ? 'scale(1)' : 'scale(0.95)'
        }}
      >
        {t('envelopeTitle')}
      </h1>

      {/* Envelope wrapper - progressive origami entry perspective */}
      <div 
        className="relative w-80 h-56 lg:w-[480px] lg:h-[336px] max-w-[85vw] perspective-[1000px] z-10 transition-all duration-[2000ms] ease-out flex-shrink-0 envelope-wrapper"
        style={{
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(1.05)' : 'scale(1)',
          pointerEvents: isWaxSealVisible && !isOpen ? 'auto' : 'none'
        }}
      >
        
        {/* Envelope back - Part 1: Scales and rotates straight */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#FAF6E5] via-[#E8DCB8] to-[#C7B787] shadow-[0_20px_50px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-sm transition-all duration-[1200ms] ease-out"
          style={{
            opacity: isBackVisible ? 1 : 0,
            transform: isBackVisible ? 'scale(1) rotate(0deg)' : 'scale(0.85) rotate(-3deg)',
          }}
        />
        
        {/* Envelope front flaps (left, right, bottom) - Part 2 & 3: Fold in from 3D axis */}
        <div className="absolute inset-0 overflow-hidden rounded-sm">
          {/* Left flap - folds in from 3D Y axis */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-[#FCF9EC] via-[#EADBAC] to-[#C7B787] transition-all duration-[1000ms] ease-out" 
            style={{ 
              clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
              opacity: isFlapsVisible ? 1 : 0,
              transform: isFlapsVisible ? 'rotateY(0deg)' : 'rotateY(-90deg)',
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden',
              filter: 'drop-shadow(2px 0 4px rgba(0,0,0,0.15))'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/10 pointer-events-none" />
            {/* Fold highlight crease */}
            <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-white/30 pointer-events-none" />
          </div>
          
          {/* Right flap - folds in from 3D Y axis */}
          <div 
            className="absolute inset-0 bg-gradient-to-bl from-[#FCF9EC] via-[#EADBAC] to-[#C7B787] transition-all duration-[1000ms] ease-out" 
            style={{ 
              clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
              opacity: isFlapsVisible ? 1 : 0,
              transform: isFlapsVisible ? 'rotateY(0deg)' : 'rotateY(90deg)',
              transformOrigin: 'right center',
              backfaceVisibility: 'hidden',
              filter: 'drop-shadow(-2px 0 4px rgba(0,0,0,0.15))'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-white/20 via-transparent to-black/10 pointer-events-none" />
            {/* Fold highlight crease */}
            <div className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-white/30 pointer-events-none" />
          </div>
          
          {/* Bottom flap - folds up from 3D X axis */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-[#EADBAC] via-[#F6F0D5] to-[#BCAF7F] transition-all duration-[1000ms] ease-out" 
            style={{ 
              clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
              opacity: isBottomFlapVisible ? 1 : 0,
              transform: isBottomFlapVisible ? 'rotateX(0deg)' : 'rotateX(-90deg)',
              transformOrigin: 'bottom center',
              backfaceVisibility: 'hidden',
              filter: 'drop-shadow(0 -5px 8px rgba(0,0,0,0.22))'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white/25 via-transparent to-black/15 pointer-events-none" />
            {/* Fold highlight crease */}
            <div className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Envelope top flap container - Part 4: Folds down from 3D X axis with photorealistic cast shadow */}
        <div 
          className="absolute inset-0 transition-all duration-[1000ms] ease-out z-20"
          style={{ 
            transform: isOpen ? 'rotateX(-180deg)' : (isTopFlapVisible ? 'rotateX(0deg)' : 'rotateX(90deg)'),
            opacity: isTopFlapVisible ? 1 : 0,
            transformOrigin: 'top center',
            backfaceVisibility: 'hidden',
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.4))'
          }}
        >
          {/* Clipped Top Flap inner content */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[#FCF9EC] via-[#EADBAC] to-[#C0B081]"
            style={{ 
              clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
            }}
          >
            {/* Crease highlights and soft shadowing to give paper depth and thickness */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/15 pointer-events-none" />
            <div className="absolute inset-0 border-b-2 border-xv-gold/40 pointer-events-none" style={{ clipPath: 'polygon(0 0, 50% 60%, 100% 0)' }} />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Left Horse stretching from left-0 to seal border - Styled to look blind-embossed inside the paper */}
        <div 
          className="absolute left-0 right-1/2 mr-[54px] lg:mr-[71px] top-[55%] h-[205px] lg:h-[295px] pointer-events-none z-20 transition-all duration-[800ms] left-horse"
          style={{ 
            opacity: isOpen ? 0 : (isWaxSealVisible ? 1 : 0),
            transform: `translateY(-50%) ${isOpen ? 'scale(0.8)' : (isWaxSealVisible ? 'scale(1)' : 'scale(0)')}`,
            transitionTimingFunction: isWaxSealVisible && !isOpen ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease-in-out',
            transformOrigin: 'left center'
          }}
        >
          <img 
            src="/Fotos/Sobre/Sobre.png" 
            alt="Caballo Izquierdo" 
            className="w-full h-full object-contain mix-blend-multiply opacity-[0.35]" 
            style={{ 
              objectPosition: 'right center',
              filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.7)) drop-shadow(-1px -1px 1px rgba(0,0,0,0.12)) sepia(0.3) saturate(1.2)'
            }}
          />
        </div>

        {/* Right Horse stretching from seal border to right-0 - Styled to look blind-embossed inside the paper */}
        <div 
          className="absolute left-1/2 ml-[54px] lg:ml-[71px] right-0 top-[55%] h-[205px] lg:h-[295px] pointer-events-none z-20 transition-all duration-[800ms] right-horse"
          style={{ 
            opacity: isOpen ? 0 : (isWaxSealVisible ? 1 : 0),
            transform: `translateY(-50%) ${isOpen ? 'scale(0.8)' : (isWaxSealVisible ? 'scale(1)' : 'scale(0)')}`,
            transitionTimingFunction: isWaxSealVisible && !isOpen ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease-in-out',
            transformOrigin: 'right center'
          }}
        >
          <img 
            src="/Fotos/Sobre/Sobre.png" 
            alt="Caballo Derecho" 
            className="w-full h-full object-contain mix-blend-multiply opacity-[0.35]" 
            style={{ 
              objectPosition: 'right center', 
              transform: 'scaleX(-1)',
              filter: 'drop-shadow(-1px 1px 1px rgba(255,255,255,0.7)) drop-shadow(1px -1px 1px rgba(0,0,0,0.12)) sepia(0.3) saturate(1.2)'
            }}
          />
        </div>

        {/* Wax seal - Part 5: Pops in with an elastic spring scale */}
        <div 
          className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer transition-all duration-[800ms]"
          onClick={() => {
            if (!isWaxSealVisible || isOpen) return;
            navigator.vibrate?.(60);
            handleOpen();
          }}
          style={{ 
            opacity: isOpen ? 0 : (isWaxSealVisible ? 1 : 0),
            transform: `translate(-50%, -50%) ${isOpen ? 'scale(0.8)' : (isWaxSealVisible ? 'scale(1)' : 'scale(0)')}`,
            transitionTimingFunction: isWaxSealVisible && !isOpen ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease-in-out'
          }}
        >
          {/* Sello Rojo Button */}
          <div className="w-[115px] h-[115px] lg:w-[150px] lg:h-[150px] rounded-full flex items-center justify-center relative hover:scale-105 transition-transform z-30 filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.55)] wax-seal-btn">
            <img 
              src="/Fotos/Sobre/sello.png" 
              alt="Sello de Cera" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none animate-glow-soft rounded-full" 
            />
            <div className="absolute inset-0 flex items-center justify-center animate-beat pointer-events-none z-10 w-full h-full">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Repositioned curve path to fit PERFECTLY inside the gold horseshoe shape as a smile curve raised slightly */}
                <path 
                  id="textCurve" 
                  d="M 30,44 A 24,24 0 0,0 70,44" 
                  fill="none" 
                />
                <text className="font-josefin font-bold fill-[#D4AF37]" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>
                  <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
                    {t('open')}
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Wrapper (Names/Date) - Progressive entry */}
      <div 
        className="mt-6 md:mt-12 text-center relative z-10 transition-all duration-[2000ms] ease-out envelope-footer" 
        style={{ 
          opacity: isOpen ? 0 : (isTitleVisible ? 1 : 0),
          transform: isTitleVisible ? 'scale(1)' : 'scale(0.95)'
        }}
      >
        <h2 className="font-playfair italic text-3xl text-xv-gold-light mb-2">{CONFIG.quinceañeraName}</h2>
        <p className="font-josefin uppercase text-sm md:text-base text-xv-gold opacity-80 tracking-widest mb-4">
          {new Date(CONFIG.eventDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default EnvelopeScreen;
