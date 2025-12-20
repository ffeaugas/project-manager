'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Eye = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const isMobile = useIsMobile();

  const eyeFrames = [
    '/default-eye.svg',
    '/moving-eye-1.svg',
    '/moving-eye-2.svg',
    '/moving-eye-3.svg',
    '/moving-eye-4.svg',
    '/blinking-eye-1.svg',
    '/blinking-eye-2.svg',
    '/blinking-eye-3.svg',
    '/blinking-eye-4.svg',
    '/blinking-eye-2.svg',
  ];

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCurrentFrame(1);
      setTimeout(() => setCurrentFrame(2), 100);
      setTimeout(() => setCurrentFrame(3), 200);
      setTimeout(() => setCurrentFrame(4), 300);
      setTimeout(() => setCurrentFrame(0), 400);

      setTimeout(() => setCurrentFrame(5), 1410);
      setTimeout(() => setCurrentFrame(6), 1450);
      setTimeout(() => setCurrentFrame(7), 1480);
      setTimeout(() => setCurrentFrame(8), 1510);
      setTimeout(() => setCurrentFrame(9), 1540);
      setTimeout(() => setCurrentFrame(0), 1570);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <img
      src={eyeFrames[currentFrame]}
      alt="Project Manager Logo"
      width={isMobile ? 100 : 170}
      height={isMobile ? 100 : 170}
    />
  );
};

export default Eye;
