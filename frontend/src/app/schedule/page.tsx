'use client';

import React, { useState, useEffect } from 'react';
import { trainScheduleService, stationService } from '@/services';
import { Station, TrainSchedule } from '@/types/train-schedule.types';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import StationSelector from './components/StationSelector';
import ScheduleTable from './components/ScheduleTable';
import CurrentTime from './components/CurrentTime';
import { useRouter } from 'next/navigation';
import { handleApiError } from '@/utils';

/**
 * Сторінка розкладу потягів
 */
const SchedulePage: React.FC = () => {
  const router = useRouter();
  
  // Стани для даних
  const [stations, setStations] = useState<Station[]>([]);
  const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Завантаження даних
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stationsData = await stationService.getStations();
        setStations(stationsData);
        
        // Встановлюємо першу станцію як вибрану за замовчуванням
        if (stationsData.length > 0 && !selectedStation) {
          setSelectedStation(stationsData[0]);
          await fetchSchedules(stationsData[0].id);
        }
      } catch (err) {
        console.error('Помилка при завантаженні станцій:', err);
        setError(handleApiError(err, 'Не вдалося завантажити список станцій. Спробуйте пізніше.'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Завантаження розкладу для конкретної станції
  const fetchSchedules = async (stationId: string) => {
    try {
      setLoading(true);
      const schedulesData = await trainScheduleService.getScheduleByStation(stationId);
      
      // Форматуємо час у формат HH:MM
      const formattedSchedules = schedulesData.map(schedule => ({
        ...schedule,
        departureTime: trainScheduleService.formatTime(schedule.departureTime),
        arrivalTime: trainScheduleService.formatTime(schedule.arrivalTime)
      }));
      
      setSchedules(formattedSchedules);
    } catch (err) {
      console.error('Помилка при завантаженні розкладу:', err);
      setError(handleApiError(err, 'Не вдалося завантажити розклад. Спробуйте пізніше.'));
    } finally {
      setLoading(false);
    }
  };

  // Обробник вибору станції
  const handleStationSelect = async (station: Station) => {
    setSelectedStation(station);
    await fetchSchedules(station.id);
  };

  // Фільтрація розкладів на відправлення та прибуття
  const departureSchedules = schedules.filter(
    schedule => schedule.departureStationId === selectedStation?.id
  );
  
  const arrivalSchedules = schedules.filter(
    schedule => schedule.arrivalStationId === selectedStation?.id
  );

  if (loading && !selectedStation) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-accent-muted">Завантаження...</div>
      </div>
    );
  }

  if (error && !selectedStation) {
    return (
      <div className="p-4 bg-dark-800 rounded-lg text-error">
        {error}
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Верхня панель з вибором станції та поточним часом */}
      <div className="flex justify-between items-center mb-6 bg-dark-800 p-4 rounded-lg">
        <StationSelector 
          selectedStation={selectedStation} 
          stations={stations} 
          onSelect={handleStationSelect} 
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/schedule/edit')}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-accent rounded-md transition-colors"
          >
            Редагувати розклад
          </button>
          <CurrentTime />
        </div>
      </div>

      {/* Завантаження даних розкладу */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-accent-muted">Завантаження розкладу...</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Розклад відправлення */}
          <ScheduleTable 
            title="Відправлення" 
            schedules={departureSchedules} 
            type="departures" 
          />
          
          {/* Розклад прибуття */}
          <ScheduleTable 
            title="Прибуття" 
            schedules={arrivalSchedules} 
            type="arrivals" 
          />
        </div>
      )}
    </div>
  );
};

export default SchedulePage; 