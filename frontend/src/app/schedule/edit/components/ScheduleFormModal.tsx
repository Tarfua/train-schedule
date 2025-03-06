'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Station } from '@/types/train-schedule.types';
import { stationService } from '@/services';

type StationType = 'departure' | 'arrival';

interface ScheduleFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  formData: {
    trainNumber: string;
    departureStation: Station | null;
    arrivalStation: Station | null;
    departureTime: string;
    arrivalTime: string;
    departurePlatform: string;
    arrivalPlatform: string;
  };
  stations: Station[];
  onDepartureStationSelect: (station: Station) => void;
  onArrivalStationSelect: (station: Station) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  onInputChange: (name: string, value: string) => void;
}

/**
 * Компонент модального вікна для форми редагування/додавання розкладу
 */
const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({
  isOpen,
  mode,
  formData,
  stations,
  onDepartureStationSelect,
  onArrivalStationSelect,
  onSave,
  onClose,
  onInputChange
}) => {
  // Стан для селекторів станцій
  const [stationSelectors, setStationSelectors] = useState({
    departure: {
      isOpen: false,
      search: '',
      isSearching: false,
      filteredStations: stations
    },
    arrival: {
      isOpen: false,
      search: '',
      isSearching: false,
      filteredStations: stations
    }
  });
  
  // Референції для обробників кліків
  const dropdownRefs = {
    departure: useRef<HTMLDivElement>(null),
    arrival: useRef<HTMLDivElement>(null)
  };
  
  // Обробник кліку поза випадаючими списками
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      ['departure', 'arrival'].forEach((type) => {
        const selectorType = type as StationType;
        if (
          dropdownRefs[selectorType].current && 
          !dropdownRefs[selectorType].current!.contains(event.target as Node) &&
          stationSelectors[selectorType].isOpen
        ) {
          updateSelector(selectorType, { isOpen: false });
        }
      });
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [stationSelectors]);
  
  // Оновлення стану селектора
  const updateSelector = (type: StationType, updates: Partial<typeof stationSelectors.departure>) => {
    setStationSelectors(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...updates
      }
    }));
  };
  
  // Пошук станцій
  useEffect(() => {
    const searchStations = async (type: StationType) => {
      const searchText = stationSelectors[type].search;
      
      if (searchText.trim().length === 0) {
        updateSelector(type, { filteredStations: stations });
        return;
      }
      
      updateSelector(type, { isSearching: true });
      try {
        if (searchText.length >= 2) {
          const results = await stationService.searchStations(searchText);
          updateSelector(type, { filteredStations: results });
        } else {
          // Локальна фільтрація для коротких запитів
          const filtered = stations.filter(station => 
            station.name.toLowerCase().includes(searchText.toLowerCase())
          );
          updateSelector(type, { filteredStations: filtered });
        }
      } catch (error) {
        console.error(`Помилка при пошуку станцій для ${type}:`, error);
      } finally {
        updateSelector(type, { isSearching: false });
      }
    };

    const departureTimer = setTimeout(() => {
      if (stationSelectors.departure.search) {
        searchStations('departure');
      }
    }, 300);
    
    const arrivalTimer = setTimeout(() => {
      if (stationSelectors.arrival.search) {
        searchStations('arrival');
      }
    }, 300);

    return () => {
      clearTimeout(departureTimer);
      clearTimeout(arrivalTimer);
    };
  }, [stationSelectors.departure.search, stationSelectors.arrival.search, stations]);
  
  // Обробник для введення тексту пошуку
  const handleSearchChange = (type: StationType, value: string) => {
    updateSelector(type, { search: value });
  };
  
  // Обробники вибору станції
  const handleStationSelect = (type: StationType, station: Station) => {
    if (type === 'departure') {
      onDepartureStationSelect(station);
    } else {
      onArrivalStationSelect(station);
    }
    
    updateSelector(type, { 
      isOpen: false,
      search: '' 
    });
  };
  
  // Відображення селектора станції
  const renderStationSelector = (type: StationType, label: string) => {
    const selector = stationSelectors[type];
    const station = type === 'departure' ? formData.departureStation : formData.arrivalStation;
    
    return (
      <div>
        <label className="block mb-1 text-accent">
          {label} *
        </label>
        <div className="relative" ref={dropdownRefs[type]}>
          <div
            className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent cursor-pointer flex justify-between items-center"
            onClick={() => updateSelector(type, { isOpen: !selector.isOpen })}
          >
            <span>{station?.name || 'Виберіть станцію'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {selector.isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-dark-800 border border-dark-600 rounded-md shadow-lg">
              <div className="p-2">
                <input
                  type="text"
                  value={selector.search}
                  onChange={(e) => handleSearchChange(type, e.target.value)}
                  className="w-full p-2 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                  placeholder="Пошук станції..."
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {selector.isSearching ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-pulse text-accent-muted">Пошук...</div>
                  </div>
                ) : (
                  <ul className="py-1">
                    {selector.filteredStations.map((station) => (
                      <li key={station.id}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-dark-700 text-accent"
                          onClick={() => handleStationSelect(type, station)}
                        >
                          {station.name}
                        </button>
                      </li>
                    ))}
                    {selector.filteredStations.length === 0 && (
                      <li className="px-3 py-2 text-accent-muted">Станції не знайдено</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900 bg-opacity-75">
      <div className="bg-dark-800 rounded-lg shadow-lg w-full max-w-2xl p-5 border border-dark-600">
        <h3 className="text-xl font-medium text-accent-bright mb-4">
          {mode === 'add' ? 'Додати новий рейс' : 'Редагувати рейс'}
        </h3>
        
        <form onSubmit={onSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Номер потяга */}
            <div>
              <label htmlFor="trainNumber" className="block mb-1 text-accent">
                Номер потяга *
              </label>
              <input
                type="text"
                id="trainNumber"
                value={formData.trainNumber}
                onChange={(e) => onInputChange('trainNumber', e.target.value)}
                className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                placeholder="Наприклад: 123"
                required
              />
            </div>
            
            {/* Селектори станцій */}
            {renderStationSelector('departure', 'Станція відправлення')}
            {renderStationSelector('arrival', 'Станція прибуття')}
            
            {/* Час відправлення */}
            <div>
              <label htmlFor="departureTime" className="block mb-1 text-accent">
                Час відправлення *
              </label>
              <input
                type="time"
                id="departureTime"
                value={formData.departureTime}
                onChange={(e) => onInputChange('departureTime', e.target.value)}
                className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                required
              />
            </div>
            
            {/* Час прибуття */}
            <div>
              <label htmlFor="arrivalTime" className="block mb-1 text-accent">
                Час прибуття *
              </label>
              <input
                type="time"
                id="arrivalTime"
                value={formData.arrivalTime}
                onChange={(e) => onInputChange('arrivalTime', e.target.value)}
                className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                required
              />
            </div>
            
            {/* Колія відправлення */}
            <div>
              <label htmlFor="departurePlatform" className="block mb-1 text-accent">
                Колія відправлення
              </label>
              <input
                type="number"
                id="departurePlatform"
                value={formData.departurePlatform}
                onChange={(e) => onInputChange('departurePlatform', e.target.value)}
                className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                placeholder="Наприклад: 1"
                min="1"
              />
            </div>
            
            {/* Колія прибуття */}
            <div>
              <label htmlFor="arrivalPlatform" className="block mb-1 text-accent">
                Колія прибуття
              </label>
              <input
                type="number"
                id="arrivalPlatform"
                value={formData.arrivalPlatform}
                onChange={(e) => onInputChange('arrivalPlatform', e.target.value)}
                className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                placeholder="Наприклад: 1"
                min="1"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-accent rounded-md transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-dark-900 rounded-md transition-colors"
            >
              {mode === 'add' ? 'Додати' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleFormModal; 