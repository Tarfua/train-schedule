'use client';

import React, { useState, useEffect } from 'react';

/**
 * Компонент для відображення поточного часу
 */
const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Форматування часу у формат HH:MM
    const formatTime = (): string => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // Встановлення початкового часу
    setCurrentTime(formatTime());

    // Оновлення часу кожну хвилину
    const interval = setInterval(() => {
      setCurrentTime(formatTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-2xl font-mono font-medium text-accent-bright">
      {currentTime}
    </div>
  );
};

export default CurrentTime; 