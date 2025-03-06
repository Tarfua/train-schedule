'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
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
  
  // Обробник для введення тексту пошуку
  const handleSearchChange = (type: StationType, value: string) => {
    updateSelector(type, { search: value });
  };
  
  // Обробники вибору станції
  const handleStationSelect = (type: StationType, station: Station) => {
    // Перевірка, чи вибрана станція не збігається з іншою вже вибраною станцією
    if (type === 'departure' && formData.arrivalStation && station.id === formData.arrivalStation.id) {
      return; // Не дозволяємо вибрати станцію, яка вже вибрана як станція прибуття
    }
    if (type === 'arrival' && formData.departureStation && station.id === formData.departureStation.id) {
      return; // Не дозволяємо вибрати станцію, яка вже вибрана як станція відправлення
    }
    
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
                    {getFilteredStationsForType(type).map((station) => (
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
                    {getFilteredStationsForType(type).length === 0 && (
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
  
  // Функція для фільтрації станцій, виключаючи вже вибрані
  const filterStationsBySelected = useCallback((stationsList: Station[], type: StationType): Station[] => {
    // Виключаємо станцію, яка вже вибрана в іншому селекторі
    if (type === 'departure' && formData.arrivalStation) {
      return stationsList.filter(s => s.id !== formData.arrivalStation!.id);
    }
    if (type === 'arrival' && formData.departureStation) {
      return stationsList.filter(s => s.id !== formData.departureStation!.id);
    }
    return stationsList;
  }, [formData.departureStation, formData.arrivalStation]);
  
  // Оптимізовані відфільтровані списки станцій за допомогою useMemo
  const filteredDepartureStations = useMemo(() => 
    filterStationsBySelected(stationSelectors.departure.filteredStations, 'departure'),
    [filterStationsBySelected, stationSelectors.departure.filteredStations]
  );
  
  const filteredArrivalStations = useMemo(() => 
    filterStationsBySelected(stationSelectors.arrival.filteredStations, 'arrival'),
    [filterStationsBySelected, stationSelectors.arrival.filteredStations]
  );
  
  // Оновлюємо фільтрований список станцій при зміні основного списку
  useEffect(() => {
    setStationSelectors(prev => ({
      departure: {
        ...prev.departure,
        filteredStations: stations
      },
      arrival: {
        ...prev.arrival,
        filteredStations: stations
      }
    }));
  }, [stations]);
  
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
  
  // Для відображення правильного списку станцій
  const getFilteredStationsForType = (type: StationType) => {
    return type === 'departure' ? filteredDepartureStations : filteredArrivalStations;
  };
  
  // Забезпечення коректності дат
  const handleDateChange = (type: 'departure' | 'arrival', date: string) => {
    // Встановлюємо нову дату
    onInputChange(type === 'departure' ? 'departureDate' : 'arrivalDate', date);
    
    // Перевірка, що дата прибуття не раніше за дату відправлення
    const departureDate = type === 'departure' ? date : formData.departureDate;
    const arrivalDate = type === 'arrival' ? date : formData.arrivalDate;
    
    if (departureDate && arrivalDate) {
      const departureDateObj = new Date(departureDate);
      const arrivalDateObj = new Date(arrivalDate);
      
      // Якщо дата прибуття раніше за дату відправлення, автоматично змінюємо її
      if (arrivalDateObj < departureDateObj) {
        onInputChange('arrivalDate', departureDate);
      }
    }
  };
  
  // Встановлення мінімальної дати прибуття
  const minArrivalDate = formData.departureDate || '';
  
  // Отримання поточної дати у форматі YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900 bg-opacity-75">
      <div className="bg-dark-800 rounded-lg shadow-lg w-full max-w-2xl p-5 border border-dark-600">
        <h3 className="text-xl font-medium text-accent-bright mb-4">
          {mode === 'add' ? 'Додати новий рейс' : 'Редагувати рейс'}
        </h3>
        
        <form onSubmit={onSave}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Номер потяга */}
            <div>
              <label htmlFor="trainNumber" className="block mb-1 text-accent">
                Номер потяга *
              </label>
              <input
                type="text"
                id="trainNumber"
                value={formData.trainNumber}
                onChange={(e) => {
                  // Обмежуємо довжину номеру потяга до 10 символів
                  if (e.target.value.length <= 10) {
                    onInputChange('trainNumber', e.target.value);
                  }
                }}
                className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                placeholder="Наприклад: 123"
                maxLength={10}
                required
              />
            </div>
            
            {/* Селектори станцій */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderStationSelector('departure', 'Станція відправлення')}
              {renderStationSelector('arrival', 'Станція прибуття')}
            </div>
            
            {/* Блок відправлення */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Дата відправлення */}
              <div>
                <label htmlFor="departureDate" className="block mb-1 text-accent">
                  Дата відправлення *
                </label>
                <input
                  type="date"
                  id="departureDate"
                  value={formData.departureDate}
                  min={getCurrentDate()}
                  onChange={(e) => handleDateChange('departure', e.target.value)}
                  className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                  required
                />
              </div>
              
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
              
              {/* Колія відправлення */}
              <div>
                <label htmlFor="departurePlatform" className="block mb-1 text-accent">
                  Колія відправлення
                </label>
                <input
                  type="number"
                  id="departurePlatform"
                  value={formData.departurePlatform}
                  onChange={(e) => {
                    // Обмежуємо значення колії до 30
                    const value = Number(e.target.value);
                    if (value <= 30 || e.target.value === '') {
                      onInputChange('departurePlatform', e.target.value);
                    }
                  }}
                  className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                  placeholder="Наприклад: 1"
                  min="1"
                  max="30"
                />
              </div>
            </div>
            
            {/* Блок прибуття */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Дата прибуття */}
              <div>
                <label htmlFor="arrivalDate" className="block mb-1 text-accent">
                  Дата прибуття *
                </label>
                <input
                  type="date"
                  id="arrivalDate"
                  value={formData.arrivalDate}
                  min={minArrivalDate || getCurrentDate()}
                  onChange={(e) => handleDateChange('arrival', e.target.value)}
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
              
              {/* Колія прибуття */}
              <div>
                <label htmlFor="arrivalPlatform" className="block mb-1 text-accent">
                  Колія прибуття
                </label>
                <input
                  type="number"
                  id="arrivalPlatform"
                  value={formData.arrivalPlatform}
                  onChange={(e) => {
                    // Обмежуємо значення колії до 30
                    const value = Number(e.target.value);
                    if (value <= 30 || e.target.value === '') {
                      onInputChange('arrivalPlatform', e.target.value);
                    }
                  }}
                  className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                  placeholder="Наприклад: 1"
                  min="1"
                  max="30"
                />
              </div>
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