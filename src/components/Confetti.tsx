import React, { useEffect, useState } from 'react';

const Confetti = () => {
  const [particles, setParticles] = useState<{ id: number; color: string; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const colors = ['#D4AF37', '#6E1423', '#FDFBF7', '#FFF3CD', '#FFFFFF', '#400B14'];
    const newParticles = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
    }));
    setParticles(newParticles);

    // Remove particles after 4 seconds
    const timer = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 w-3 h-3 rounded-sm animate-confettiFall"
          style={{
            backgroundColor: p.color,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
