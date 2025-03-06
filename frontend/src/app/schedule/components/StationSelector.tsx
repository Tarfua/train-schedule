'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Station } from '@/types/train-schedule.types';
import { stationService } from '@/services';

interface StationSelectorProps {
  selectedStation: Station | null;
  stations: Station[];
  onSelect: (station: Station) => void;
  className?: string;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  selectedStation,
  stations,
  onSelect,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>('');
  const [filteredStations, setFilteredStations] = useState<Station[]>(stations);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchStations = async () => {
      if (filterText.trim().length === 0) {
        setFilteredStations(stations);
        return;
      }
      
      setIsSearching(true);
      try {
        if (filterText.length >= 2) {
          const results = await stationService.searchStations(filterText);
          setFilteredStations(results);
        } else {
          setFilteredStations(stations.filter(station => 
            station.name.toLowerCase().includes(filterText.toLowerCase())
          ));
        }
      } catch (error) {
        console.error('Помилка при пошуку станцій:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchStations, 300);
    return () => clearTimeout(debounceTimer);
  }, [filterText, stations]);

  // Закриття модального вікна при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Обробник вибору станції
  const handleStationSelect = (station: Station) => {
    onSelect(station);
    setIsOpen(false);
    setFilterText('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-accent-bright" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-xl text-accent-bright">
            {selectedStation?.name || 'Виберіть станцію'}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-1.5 bg-dark-700 hover:bg-dark-600 text-accent rounded-md transition-colors"
        >
          Змінити
        </button>
      </div>

      {/* Модальне вікно для вибору станції */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900 bg-opacity-75">
          <div 
            ref={modalRef}
            className="bg-dark-800 rounded-lg shadow-lg w-full max-w-md p-5 border border-dark-600"
          >
            <h3 className="text-xl font-medium text-accent-bright mb-4">Виберіть станцію</h3>
            
            <div className="mb-4">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Пошук станції..."
                className="w-full p-2.5 rounded-md bg-dark-700 border border-dark-600 text-accent focus:ring-accent-hover focus:border-accent-hover outline-none"
                autoFocus
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse text-accent-muted">Пошук...</div>
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredStations.map((station) => (
                    <li key={station.id}>
                      <button
                        onClick={() => handleStationSelect(station)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-dark-700 text-accent transition-colors"
                      >
                        {station.name}
                      </button>
                    </li>
                  ))}
                  {filteredStations.length === 0 && (
                    <li className="px-3 py-2 text-accent-muted">Станції не знайдено</li>
                  )}
                </ul>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-accent rounded-md transition-colors"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationSelector; 