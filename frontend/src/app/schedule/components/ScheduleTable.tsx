'use client';

import React from 'react';
import { TrainSchedule } from '@/types/train-schedule.types';

interface ScheduleTableProps {
  title: string;
  schedules: TrainSchedule[];
  type: 'departures' | 'arrivals';
}

/**
 * Компонент для відображення таблиці розкладу потягів
 */
const ScheduleTable: React.FC<ScheduleTableProps> = ({ title, schedules, type }) => {
  if (!schedules.length) {
    return (
      <div className="mt-1">
        <h2 className="text-xl font-medium text-accent-bright mb-4 flex items-center">
          {type === 'departures' ? (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
          {title}
        </h2>
        <div className="bg-dark-800 rounded-lg p-4 text-center text-accent">
          Немає інформації про розклад
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1">
      <h2 className="text-xl font-medium text-accent-bright mb-4 flex items-center">
        {type === 'departures' ? (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
        {title}
      </h2>
      
      <div className="overflow-x-auto bg-dark-800 rounded-lg">
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr className="text-accent-muted text-sm border-b border-dark-700">
              <th scope="col" className="py-3 px-4 text-left">Потяг</th>
              <th scope="col" className="py-3 px-4 text-left">Сполучення</th>
              <th scope="col" className="py-3 px-4 text-right">Час</th>
              <th scope="col" className="py-3 px-4 text-right">Колія</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr 
                key={`${schedule.trainNumber}-${schedule.departureTime || schedule.arrivalTime}`}
                className="border-b border-dark-700 text-accent hover:bg-dark-750 transition-colors"
              >
                <td className="py-3 px-4 font-mono font-medium text-accent-hover">
                  {schedule.trainNumber}
                </td>
                <td className="py-3 px-4">
                  {type === 'departures' ? (
                    <div className="flex items-center">
                      <span className="text-accent-bright">{schedule.departureStation.name}</span>
                      <svg className="w-4 h-4 mx-2 text-accent-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="text-accent-bright">{schedule.arrivalStation.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-accent-bright">{schedule.departureStation.name}</span>
                      <svg className="w-4 h-4 mx-2 text-accent-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="text-accent-bright">{schedule.arrivalStation.name}</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-mono font-medium text-accent-bright">
                  {type === 'departures' ? schedule.departureTime : schedule.arrivalTime}
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  {(type === 'departures' ? schedule.departurePlatform : schedule.arrivalPlatform) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable; 