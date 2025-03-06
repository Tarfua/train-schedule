import React from 'react';
import Link from 'next/link';

/**
 * Компонент головної сторінки
 */
export default function Home() {
  return (
    <div className="flex flex-col items-center gap-10 py-12">
      {/* Заголовок і підзаголовок */}
      <div className="text-center mb-8 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-semibold text-accent-hover mb-6 tracking-tight">
          TrainSchedule
        </h1>
        <p className="text-xl text-accent mx-auto leading-relaxed">
          Сучасний додаток для зручного перегляду та управління розкладом руху потягів
        </p>
      </div>

      {/* Основна секція */}
      <div className="w-full max-w-4xl bg-dark-850 p-8 md:p-10 rounded-2xl shadow-md">
        <h2 className="text-2xl font-medium text-accent-hover mb-6">
          Про додаток
        </h2>
        <p className="text-accent mb-6 leading-relaxed">
          TrainSchedule - це зручний сервіс для перегляду розкладу руху потягів, відстеження їхнього руху в режимі реального часу та планування поїздок.
        </p>
        <ul className="grid gap-3 text-accent mb-8">
          <li className="flex items-start gap-3 p-3 rounded-lg bg-dark-750 transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent mt-2"></span>
            <span>Перегляд актуального розкладу потягів</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-dark-750 transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent mt-2"></span>
            <span>Відстеження місцезнаходження потягів</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-dark-750 transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent mt-2"></span>
            <span>Зручний пошук маршрутів</span>
          </li>
        </ul>
        <div className="p-5 bg-dark-700 rounded-xl">
          <p className="text-accent">
            <span className="font-medium">Увага:</span> Для користування сервісом необхідно <Link href="/auth/login" className="text-accent-hover hover:text-accent underline underline-offset-4 transition-colors">увійти</Link> в систему. 
          </p>
        </div>
      </div>
    </div>
  );
}
