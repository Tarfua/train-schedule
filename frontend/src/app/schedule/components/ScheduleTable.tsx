'use client';

import React, { useState, useMemo } from 'react';
import { TrainSchedule } from '@/types/train-schedule.types';

type SortField = 'time' | 'trainNumber';
type SortOrder = 'asc' | 'desc';

interface ScheduleTableProps {
  title: string;
  schedules: TrainSchedule[];
  type: 'departures' | 'arrivals';
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ title, schedules, type }) => {
  // Стан для сортування
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const toggleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Відсортований масив розкладів
  const sortedSchedules = useMemo(() => {
    if (!schedules.length) return [];

    return [...schedules].sort((a, b) => {
      if (sortField === 'trainNumber') {
        // Сортування за номером потяга
        const numA = parseInt(a.trainNumber, 10) || 0;
        const numB = parseInt(b.trainNumber, 10) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      } else {
        // Сортування за часом
        const timeA = type === 'departures' ? a.departureTime : a.arrivalTime;
        const timeB = type === 'departures' ? b.departureTime : b.arrivalTime;
        return sortOrder === 'asc' 
          ? timeA.localeCompare(timeB) 
          : timeB.localeCompare(timeA);
      }
    });
  }, [schedules, sortField, sortOrder, type]);

  // Отримання іконки сортування в залежності від поточного стану
  const getSortIcon = (field: SortField): React.ReactNode => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

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
              <th scope="col" className="py-3 px-4 text-left">
                <button 
                  className="flex items-center space-x-1 hover:text-accent-bright transition-colors focus:outline-none"
                  onClick={() => toggleSort('trainNumber')}
                >
                  <span>Потяг</span>
                  <span className="ml-1">{getSortIcon('trainNumber')}</span>
                </button>
              </th>
              <th scope="col" className="py-3 px-4 text-left">Сполучення</th>
              <th scope="col" className="py-3 px-4 text-right">
                <button 
                  className="flex items-center space-x-1 ml-auto hover:text-accent-bright transition-colors focus:outline-none"
                  onClick={() => toggleSort('time')}
                >
                  <span>Час</span>
                  <span className="ml-1">{getSortIcon('time')}</span>
                </button>
              </th>
              <th scope="col" className="py-3 px-4 text-right">Колія</th>
            </tr>
          </thead>
          <tbody>
            {sortedSchedules.map((schedule) => (
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