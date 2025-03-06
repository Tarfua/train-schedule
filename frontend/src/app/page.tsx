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
        <h1 className="text-4xl md:text-6xl font-semibold text-accent-bright mb-6 tracking-tight">
          TrainSchedule
        </h1>
        <p className="text-xl text-accent mx-auto leading-relaxed">
          Зручний додаток для перегляду та управління розкладом руху потягів
        </p>
      </div>

      {/* Основна секція */}
      <div className="w-full max-w-4xl bg-dark-900 p-8 md:p-10 rounded-2xl shadow-lg border border-dark-700">
        <h2 className="text-2xl font-medium text-accent-bright mb-6">
          Про додаток
        </h2>
        <p className="text-accent mb-6 leading-relaxed">
          TrainSchedule - це сервіс для перегляду та редагування розкладу руху потягів між станціями. Додаток дозволяє зручно керувати інформацією про рейси.
        </p>
        <ul className="grid gap-3 text-accent mb-8">
          <li className="flex items-start gap-3 p-3 rounded-lg bg-dark-800 hover:bg-dark-750 transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent-bright mt-2"></span>
            <span>Перегляд актуального розкладу потягів з датами та часом</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-dark-800 hover:bg-dark-750 transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent-bright mt-2"></span>
            <span>Додавання та редагування рейсів з вибором станцій</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-dark-800 hover:bg-dark-750 transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent-bright mt-2"></span>
            <span>Фільтрація розкладу за станціями відправлення та прибуття</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-dark-800 hover:bg-dark-750 transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent-bright mt-2"></span>
            <span>Відображення тільки актуальних рейсів</span>
          </li>
        </ul>
        <div className="p-5 bg-dark-600 rounded-xl border border-dark-500">
          <p className="text-accent-bright">
            <span className="font-medium">Увага:</span> Для редагування розкладу необхідно <Link href="/auth/login" className="text-accent-hover hover:text-accent-bright underline underline-offset-4 transition-colors">увійти</Link> в систему
          </p>
        </div>
      </div>
    </div>
  );
}
