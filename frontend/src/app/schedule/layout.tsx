import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Розклад потягів | TrainSchedule',
  description: 'Перегляд розкладу руху потягів по станціях',
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-8">
      {children}
    </div>
  );
} 