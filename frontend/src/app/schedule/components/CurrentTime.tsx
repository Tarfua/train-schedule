'use client';

import React, { useState, useEffect } from 'react';

/**
 * Компонент для відображення поточного часу з автоматичним оновленням та індикацією
 */
const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [blinkSeparator, setBlinkSeparator] = useState<boolean>(true);

  useEffect(() => {
    // Форматування часу у формат HH:MM
    const formatTime = (): string => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}${blinkSeparator ? ':' : ' '}${minutes}`;
    };

    // Встановлення початкового часу
    setCurrentTime(formatTime());

    // Оновлення часу кожну секунду
    const interval = setInterval(() => {
      setCurrentTime(formatTime());
      // Інвертуємо стан мерехтіння двокрапки кожну секунду
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