'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';

const Eye = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const isMobile = useIsMobile();

  const eyeFrames = [
    '/default-eye-white.png',
    '/moving-eye-white.png',
    '/moving-eye-white-2.png',
    '/moving-eye-white-3.png',
    '/moving-eye-white-4.png',
    '/blinking-eye-white-2.png',
    '/blinking-eye-white-3.png',
    '/blinking-eye-white-4.png',
    '/blinking-eye-white-5.png',
    '/blinking-eye-white-3.png',
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
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <Image
      src={eyeFrames[currentFrame]}
      alt="Project Manager Logo"
      width={isMobile ? 100 : 170}
      height={isMobile ? 100 : 170}
    />
  );
};

export default Eye;
