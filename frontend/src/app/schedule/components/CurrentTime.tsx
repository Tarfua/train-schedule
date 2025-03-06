'use client';

import React, { useState, useEffect } from 'react';

const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [blinkSeparator, setBlinkSeparator] = useState<boolean>(true);

  useEffect(() => {
    const formatTime = (): string => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}${blinkSeparator ? ':' : ' '}${minutes}`;
    };

    setCurrentTime(formatTime());

    const interval = setInterval(() => {
      setCurrentTime(formatTime());
      setBlinkSeparator(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, [blinkSeparator]);

  return (
    <div className="text-2xl font-mono font-medium text-accent-bright w-24 text-center">
      {currentTime}
    </div>
  );
};

export default CurrentTime; 