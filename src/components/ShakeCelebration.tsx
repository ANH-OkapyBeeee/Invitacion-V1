import React, { useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

/**
 * Request permission for device motion on iOS 13+
 * This MUST be called from a user gesture (like a button click)
 */
export const requestShakePermission = async () => {
  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof (DeviceMotionEvent as any).requestPermission === 'function'
  ) {
    try {
      const permissionState = await (DeviceMotionEvent as any).requestPermission();
      return permissionState === 'granted';
    } catch (error) {
      console.error('Error requesting device motion permission:', error);
      return false;
    }
  }
  return true; // Already granted or not required (Android/Desktop)
};

const ShakeCelebration: React.FC = () => {
  const lastShakeTime = useRef<number>(0);
  const SHAKE_THRESHOLD = 15; // Sensitivity
  const COOLDOWN = 1500; // ms between shakes

  const triggerConfetti = useCallback(() => {
    const now = Date.now();
    if (now - lastShakeTime.current < COOLDOWN) return;
    
    lastShakeTime.current = now;

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    // Elegant Confetti shower effect
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#D4AF37', '#FDFBF7', '#F5D76E', '#C0C0C0'],
        shapes: ['circle', 'square'],
        scalar: 1.2
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#D4AF37', '#FDFBF7', '#F5D76E', '#C0C0C0'],
        shapes: ['circle', 'square'],
        scalar: 1.2
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Center burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FDFBF7', '#F5D76E', '#C0C0C0'],
      shapes: ['circle', 'square'],
      scalar: 1.2
    });

    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const { x, y, z } = acc;
      const acceleration = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2);

      // Simple shake detection
      if (acceleration > SHAKE_THRESHOLD) {
        triggerConfetti();
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [triggerConfetti]);

  return null;
};

export default ShakeCelebration;
