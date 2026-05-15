import React, { useEffect, useState } from 'react';

interface Props {
  type?: 'confetti' | 'emoji';
  emoji?: string;
  onComplete?: () => void;
}

const Confetti: React.FC<Props> = ({ type = 'confetti', emoji, onComplete }) => {
  const [particles, setParticles] = useState<{ id: number; color?: string; x: number; y: number; r: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const colors = ['#D4AF37', '#6E1423', '#FDFBF7', '#FFF3CD', '#FFFFFF', '#400B14'];
    const count = type === 'confetti' ? 50 : 35; 
    
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 500 + 100; // Explode out to 500px
      return {
        id: i,
        color: type === 'confetti' ? colors[Math.floor(Math.random() * colors.length)] : undefined,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        r: Math.random() * 720 - 360,
        delay: Math.random() * 0.1, 
        duration: Math.random() * 0.5 + 0.8,
        size: type === 'confetti' ? Math.random() * 10 + 5 : Math.random() * 30 + 20,
      };
    });
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [type, emoji]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-emojiBurst flex items-center justify-center"
          style={{
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: type === 'confetti' ? `${p.size}px` : 'auto',
            height: type === 'confetti' ? `${p.size}px` : 'auto',
            fontSize: type === 'emoji' ? `${p.size}px` : undefined,
            borderRadius: type === 'confetti' ? '2px' : '0',
            '--x': `${p.x}px`,
            '--y': `${p.y}px`,
            '--r': `${p.r}deg`
          } as React.CSSProperties}
        >
          {type === 'emoji' && emoji}
        </div>
      ))}
    </div>
  );
};

export default Confetti;
