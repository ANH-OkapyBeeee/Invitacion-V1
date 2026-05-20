import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const RecentGallery = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const timeoutRef = useRef<any>(null);

  // Drag & Swipe states
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartTime, setDragStartTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [thrownCards, setThrownCards] = useState<Record<string, number>>({});

  // Particle explosion state
  const [particles, setParticles] = useState<any[]>([]);

  // Responsive and screen size state tracking
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWinSize({ w: window.innerWidth, h: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Subscribe to approved photos in real-time
  useEffect(() => {
    const q = query(collection(db, 'photos'), where('status', '==', 'approved'));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPhotos(list.slice(0, 7)); // limit to 7 photos
    });
    return () => unsub();
  }, []);

  // Sync thrown cards when database photos list changes
  useEffect(() => {
    const photoIds = photos.map(p => p.id);
    setThrownCards((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id in next) {
        if (!photoIds.includes(id)) {
          delete next[id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [photos]);

  // Close active card if clicked outside anywhere in the invitation
  useEffect(() => {
    if (activeIdx === null) return;

    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      const deckEl = document.getElementById('recent-gallery-deck');
      const clickedEl = e.target as HTMLElement;

      // Close if user clicked outside the deck area or if they click the deck background directly
      if (deckEl && (!deckEl.contains(clickedEl) || clickedEl === deckEl)) {
        setActiveIdx(null);
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener('click', handleGlobalClick);
      window.addEventListener('touchstart', handleGlobalClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [activeIdx]);

  // Image load aspect ratio detector
  const handleImgLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const aspect = img.naturalWidth / img.naturalHeight;
      setAspects((prev) => ({ ...prev, [id]: aspect }));
    }
  };

  // Particle physics update loop (~60fps)
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.32, // high gravity for snappy physics
            rotation: p.rotation + p.vr, // high spin
            opacity: p.opacity - 0.05, // faster fade-out for a snappy burst
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles]);

  const triggerExplosion = (clientX: number, clientY: number, url: string) => {
    const rect = document.getElementById('recent-gallery')?.getBoundingClientRect();
    const originX = rect ? clientX - rect.left : window.innerWidth / 2;
    const originY = rect ? clientY - rect.top : 200;

    const newParticles: any[] = [];

    // Spawn 45 small rectangular card fragment remnants
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8.5; // energetic starting velocity
      newParticles.push({
        id: Math.random() + i,
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4.5, // burst upwards with high velocity
        vr: (Math.random() - 0.5) * 24, // rapid spin speed
        rotation: Math.random() * 360,
        url: url,
        bgX: Math.random() * 100,
        bgY: Math.random() * 100,
        width: 3 + Math.random() * 4, // small, crisp particles
        height: 4 + Math.random() * 6,
        opacity: 1,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Scattered Deck Layout Styles
  const getDeckStyle = (idx: number, total: number, photoId: string): React.CSSProperties => {
    if (total === 0) return {};
    const baseCardW = isMobile ? 115 : 155;
    const baseCardH = isMobile ? 160 : 215;

    // Filter remaining active cards that are NOT thrown
    const activePhotos = photos.filter(p => thrownCards[p.id] === undefined);
    const layoutIdx = activePhotos.findIndex(p => p.id === photoId);

    const isThrown = thrownCards[photoId] !== undefined;
    const throwDir = thrownCards[photoId];

    // Use remaining active deck size for positions if active, or original index if thrown
    const useIdx = isThrown ? idx : layoutIdx;
    const useTotal = isThrown ? total : activePhotos.length;

    // Setting step to 55% of card width means exactly 45% overlap.
    const step = baseCardW * 0.55;

    // Calculate center-based positions based on the active layout index
    const totalWidth = baseCardW + (useTotal - 1) * step;
    const startX = -totalWidth / 2 + baseCardW / 2;
    const x = startX + useIdx * step;

    // Scattered angles and vertical offsets
    const rotations = [-12, 10, -7, 14, -9, 8, -5];
    const yOffsets = [-10, 8, -6, 12, -8, 6, -4];

    const rot = rotations[useIdx % rotations.length];
    const yVal = yOffsets[useIdx % yOffsets.length];

    const isActive = activeIdx === idx;
    const isAnyCardActive = activeIdx !== null;
    const isCurrentlyDragged = draggedIdx === idx;

    // Calculate dynamic dimensions for current card
    let currentW = baseCardW;
    let currentH = baseCardH;
    const activeScale = 1.35;

    if (isActive) {
      const aspect = aspects[photoId] || 0.72; // fallback to portrait aspect
      const isVertical = aspect < 1.0;
      
      // Screen-fitting constraints: vertical cards on mobile can utilize up to 90% width and 88% height
      // to maximize visual size. Horizontal photos remain bounded at 55% height and 82% width.
      const maxVisualW = winSize.w * (isVertical && isMobile ? 0.90 : 0.82);
      const maxVisualH = winSize.h * (isVertical ? (isMobile ? 0.88 : 0.75) : 0.55);

      const maxCardW = maxVisualW / activeScale;
      const maxCardH = maxVisualH / activeScale;

      let targetH = isVertical 
        ? (isMobile ? 290 : 320)   // Much taller vertical limit for mobile/desktop
        : (isMobile ? 180 : 250);  // Standard horizontal limit
      let targetW = targetH * aspect;

      // Constrain target dimensions proportionally
      if (targetW > maxCardW) {
        targetW = maxCardW;
        targetH = targetW / aspect;
      }
      if (targetH > maxCardH) {
        targetH = maxCardH;
        targetW = targetH * aspect;
      }

      currentH = targetH;
      currentW = targetW;
    }

    // Default card styles
    let transformStr = `rotate(${rot}deg)`;
    // Include width and height transition to morph dynamically from portrait/landscape sizes smoothly
    let transitionStr = 'transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.4s, left 0.4s, top 0.4s, opacity 0.4s, width 0.4s cubic-bezier(.34,1.56,.64,1), height 0.4s cubic-bezier(.34,1.56,.64,1)';
    let opacityVal = 1;
    let pointerEventsVal: React.CSSProperties['pointerEvents'] = 'auto';

    if (isThrown) {
      // Fly card off-screen in the swiped direction
      transformStr = `translate(${throwDir * 500}px, 80px) rotate(${throwDir * 90}deg) scale(0.3)`;
      opacityVal = 0;
      pointerEventsVal = 'none';
    } else if (isCurrentlyDragged && isDragging) {
      // Direct drag tracking with dynamic tilt rotation
      transformStr = `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rot + dragOffset.x * 0.08}deg) scale(1.05)`;
      transitionStr = 'none';
    } else if (isActive) {
      // CENTER AND SCALE UP: Transform dynamically translates the card back to the center of the deck container
      // Using scale(1.35) on top of the screen-fitting original aspect-ratio dimensions
      transformStr = `translate(${-x}px, ${-yVal - 35}px) scale(${activeScale}) rotate(0deg)`;
    } else if (isAnyCardActive && !isActive) {
      // Dim all other cards in the deck
      opacityVal = 0.35;
    }

    return {
      position: 'absolute',
      width: `${currentW}px`,
      height: `${currentH}px`,
      left: `calc(50% + ${x}px - ${currentW / 2}px)`,
      top: `calc(50% + ${yVal}px - ${currentH / 2}px)`,
      transform: transformStr,
      zIndex: isCurrentlyDragged ? 100 : (isActive ? 50 : idx + 1),
      transition: transitionStr,
      opacity: opacityVal,
      pointerEvents: pointerEventsVal,
      boxShadow: isActive || isCurrentlyDragged
        ? '0 25px 50px rgba(0,0,0,0.4)'
        : '0 8px 20px rgba(0,0,0,0.15)',
      borderRadius: '12px',
      overflow: isActive ? 'visible' : 'hidden', // Let close button float outside the card bounds when active
      border: '3px solid white',
      cursor: isCurrentlyDragged ? 'grabbing' : 'grab',
      touchAction: 'none', // Block system scrolls so drag gesture is fluid
    };
  };

  // Pointer Event Handlers for Drag & Throw gestures
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: 0, y: 0 });
    setDraggedIdx(idx);
    setIsDragging(false);
    setDragStartTime(Date.now());
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggedIdx === null) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    // Enable dragging mode if user moved mouse/finger more than 15 pixels
    if (!isDragging && Math.sqrt(dx * dx + dy * dy) > 15) {
      setIsDragging(true);
    }

    if (isDragging) {
      setDragOffset({ x: dx, y: dy });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, photoId: string) => {
    if (draggedIdx === null) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    const idx = draggedIdx;
    const duration = Date.now() - dragStartTime;
    const distance = Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y);

    // Snappy Touch detection: If clicked for under 280ms OR moved less than 15px, treat as TAP
    const isActuallyTap = duration < 280 || distance < 15;

    if (isDragging && !isActuallyTap) {
      const threshold = isMobile ? 80 : 120;
      if (Math.abs(dragOffset.x) > threshold) {
        // SWIPE THROW SUCCESS: Fly off-screen left/right
        const direction = dragOffset.x > 0 ? 1 : -1;
        
        // Trigger explosion at the point of release using the thrown card's photo url
        const photoUrl = photos[idx]?.url || '';
        triggerExplosion(e.clientX, e.clientY, photoUrl);

        setThrownCards((prev) => {
          const next = { ...prev, [photoId]: direction };
          // If all cards in the deck have been thrown off-screen, wait 1.0s before resetting!
          if (Object.keys(next).length >= photos.length) {
            setTimeout(() => {
              setThrownCards({});
            }, 1000);
          }
          return next;
        });
        navigator.vibrate?.([40, 20]);
      }
    } else {
      // TAP: Toggle active state directly on the deck with absolute snappy responsiveness
      if (activeIdx === idx) {
        navigator.vibrate?.(20);
        setActiveIdx(null); // Deselect on second tap
      } else {
        navigator.vibrate?.(20);
        setActiveIdx(idx); // Scale up immediately
      }
    }

    setDraggedIdx(null);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggedIdx === null) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDraggedIdx(null);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // Responsive arena height
  const containerHeight = photos.length > 0 ? (isMobile ? 210 : 280) : (isMobile ? 150 : 190);

  return (
    <section id="recent-gallery" className="py-20 px-4 bg-xv-pearl text-center relative overflow-hidden border-t border-xv-gold/20">
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-xv-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-xv-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Particle Explosion Layer (Torn card fragments) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none z-[1000] border border-white/20 shadow-[0_2px_5px_rgba(0,0,0,0.15)]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            backgroundImage: `url(${p.url})`,
            backgroundSize: '150px 200px', // matches card size ratio
            backgroundPosition: `${p.bgX}% ${p.bgY}%`,
            opacity: p.opacity,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            transition: 'opacity 0.05s linear',
          }}
        />
      ))}

      <div className="max-w-[800px] mx-auto">
        <span className="font-josefin text-xv-gold text-[10px] tracking-[0.2em] uppercase font-bold block mb-2">
          MOMENTOS COMPARTIDOS
        </span>
        <h2 className="font-playfair italic text-4xl text-xv-red mb-10 animate-shimmer">
          Galería de la Fiesta
        </h2>

        {/* ── Scattered Deck Area ── */}
        <div
          id="recent-gallery-deck"
          className="relative mx-auto overflow-visible"
          style={{ height: `${containerHeight}px`, maxWidth: '640px' }}
        >
          {photos.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-xv-gold/40 bg-white/50">
              <span className="text-5xl">📷</span>
              <p className="font-cormorant text-sm italic text-xv-gold leading-relaxed">
                Aquí aparecerán las fotos que tomen los invitados
              </p>
            </div>
          ) : (
            photos.map((photo, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={photo.id}
                  style={getDeckStyle(idx, photos.length, photo.id)}
                  onPointerDown={(e) => handlePointerDown(e, idx)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(e) => handlePointerUp(e, photo.id)}
                  onPointerCancel={handlePointerCancel}
                >
                  <img
                    src={photo.url}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover select-none rounded-[9px]"
                    loading="lazy"
                    draggable={false}
                    onLoad={(e) => handleImgLoad(photo.id, e)}
                  />
                  {/* Glossy overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[9px]"
                    style={{ background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, transparent 65%)' }}
                  />

                  {/* Circular Close Button floating OUTSIDE the Active Card */}
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigator.vibrate?.(20);
                        setActiveIdx(null);
                      }}
                      className="absolute -top-3.5 -right-3.5 z-[60] w-7 h-7 flex items-center justify-center rounded-full bg-xv-red hover:bg-red-700 border border-white text-white text-xs font-bold transition-all active:scale-90 shadow-md cursor-pointer"
                      title="Cerrar"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Description — responsive */}
        <p className="font-cormorant italic text-gray-500 text-sm mt-10 mx-auto leading-relaxed max-w-[420px]">
          {/* Mobile: 3 lines */}
          <span className="md:hidden">
            Estas son las fotos más recientes<br />
            aprobadas por los administradores.<br />
            ¡Sigue compartiendo tus momentos!
          </span>
          {/* Desktop: 2 lines */}
          <span className="hidden md:inline">
            Estas son las fotos más recientes aprobadas por los administradores.<br />
            ¡Sigue compartiendo tus momentos!
          </span>
        </p>
      </div>
    </section>
  );
};

export default RecentGallery;
