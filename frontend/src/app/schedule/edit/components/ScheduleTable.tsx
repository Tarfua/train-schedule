'use client';

import React from 'react';
import { TrainSchedule } from '@/types/train-schedule.types';

// Розширюємо тип TrainSchedule для нашого використання
interface ScheduleWithDisplayTime extends TrainSchedule {
  displayDepartureTime?: string;
  displayArrivalTime?: string;
}

interface ScheduleTableProps {
  schedules: ScheduleWithDisplayTime[];
  onEdit: (schedule: ScheduleWithDisplayTime) => void;
  onDelete: (scheduleId: string) => void;
  isProcessing?: boolean;
}

/**
 * Компонент таблиці розкладів потягів для редагування
 */
const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onEdit, onDelete, isProcessing = false }) => {
  return (
    <div className="bg-dark-800 rounded-lg overflow-hidden">
      <table className="w-full border-collapse border-spacing-0">
        <thead>
          <tr className="text-accent-muted text-sm border-b border-dark-700">
            <th scope="col" className="py-3 px-4 text-left">Потяг</th>
            <th scope="col" className="py-3 px-4 text-left">Станція відправлення</th>
            <th scope="col" className="py-3 px-4 text-left">Станція прибуття</th>
            <th scope="col" className="py-3 px-4 text-center">Час відправлення</th>
            <th scope="col" className="py-3 px-4 text-center">Час прибуття</th>
            <th scope="col" className="py-3 px-4 text-center">Колія відпр.</th>
            <th scope="col" className="py-3 px-4 text-center">Колія приб.</th>
            <th scope="col" className="py-3 px-4 text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-4 text-center text-accent-muted">
                Немає даних про розклад
              </td>
            </tr>
          ) : (
            schedules.map((schedule) => (
              <tr 
                key={schedule.id}
                className="border-b border-dark-700 text-accent hover:bg-dark-750 transition-colors"
              >
                <td className="py-3 px-4 font-mono font-medium text-accent-hover">
                  {schedule.trainNumber}
                </td>
                <td className="py-3 px-4">
                  {schedule.departureStation.name}
                </td>
                <td className="py-3 px-4">
                  {schedule.arrivalStation.name}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {schedule.displayDepartureTime || schedule.departureTime}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {schedule.displayArrivalTime || schedule.arrivalTime}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {schedule.departurePlatform || '-'}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {schedule.arrivalPlatform || '-'}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(schedule)}
                      disabled={isProcessing}
                      className={`p-1.5 ${isProcessing ? 'bg-dark-600 text-accent-muted cursor-not-allowed' : 'bg-dark-700 hover:bg-dark-600 text-accent cursor-pointer'} rounded transition-colors`}
                      title="Редагувати"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(schedule.id)}
                      disabled={isProcessing}
                      className={`p-1.5 ${isProcessing ? 'bg-dark-600 text-accent-muted cursor-not-allowed' : 'bg-dark-700 hover:bg-error hover:text-dark-900 text-accent cursor-pointer'} rounded transition-colors`}
                      title="Видалити"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable; 