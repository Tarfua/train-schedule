'use client';

import React, { useState, useEffect } from 'react';
import { trainScheduleService, stationService } from '@/services';
import { Station, TrainSchedule } from '@/types/train-schedule.types';
import { useRouter } from 'next/navigation';
import ScheduleFormModal from './components/ScheduleFormModal';
import ScheduleTable from './components/ScheduleTable';
import { TrainScheduleDto } from '@/services/train-schedule-service';

/**
 * Сторінка редагування розкладу потягів
 */
const ScheduleEditPage: React.FC = () => {
  const router = useRouter();
  
  // Стани для даних
  const [stations, setStations] = useState<Station[]>([]);
  const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Стани для форми редагування
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedSchedule, setSelectedSchedule] = useState<TrainSchedule | null>(null);
  
  // Стани для полів форми
  const [formData, setFormData] = useState({
    trainNumber: '',
    departureStation: null as Station | null,
    arrivalStation: null as Station | null,
    departureTime: '',
    arrivalTime: '',
    departurePlatform: '',
    arrivalPlatform: ''
  });

  // Завантаження даних
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stationsData = await stationService.getStations();
        const schedulesData = await trainScheduleService.getTrainSchedules();
        
        // Форматуємо час для відображення
        const formattedSchedules = schedulesData.map(schedule => ({
          ...schedule,
          departureTime: trainScheduleService.formatTime(schedule.departureTime),
          arrivalTime: trainScheduleService.formatTime(schedule.arrivalTime)
        }));
        
        setStations(stationsData);
        setSchedules(formattedSchedules);
      } catch (err) {
        console.error('Помилка при завантаженні даних:', err);
        setError('Не вдалося завантажити дані. Спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Відкриття форми для додавання нового розкладу
  const handleAddSchedule = () => {
    setFormMode('add');
    resetForm();
    setIsFormOpen(true);
  };

  // Відкриття форми для редагування існуючого розкладу
  const handleEditSchedule = (schedule: TrainSchedule) => {
    setFormMode('edit');
    setSelectedSchedule(schedule);
    
    // Заповнення форми даними обраного розкладу
    setFormData({
      trainNumber: schedule.trainNumber,
      departureStation: schedule.departureStation,
      arrivalStation: schedule.arrivalStation,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      departurePlatform: schedule.departurePlatform?.toString() || '',
      arrivalPlatform: schedule.arrivalPlatform?.toString() || ''
    });
    
    setIsFormOpen(true);
  };

  // Видалення розкладу
  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      setIsProcessing(true);
      await trainScheduleService.deleteTrainSchedule(scheduleId);
      
      // Оновлюємо локальний стан після успішного видалення
      setSchedules(prevSchedules => 
        prevSchedules.filter(schedule => schedule.id !== scheduleId)
      );
      
      // Показуємо повідомлення про успіх
      setError(null);
    } catch (err) {
      console.error('Помилка при видаленні розкладу:', err);
      setError('Не вдалося видалити розклад. Спробуйте пізніше.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Скидання форми
  const resetForm = () => {
    setSelectedSchedule(null);
    setFormData({
      trainNumber: '',
      departureStation: null,
      arrivalStation: null,
      departureTime: '',
      arrivalTime: '',
      departurePlatform: '',
      arrivalPlatform: ''
    });
  };

  // Закриття форми
  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Обробка змін у полях форми
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Збереження форми
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація форми
    if (!formData.trainNumber || !formData.departureStation || !formData.arrivalStation || !formData.departureTime || !formData.arrivalTime) {
      setError('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Підготовка даних для відправки на API
      const scheduleData: TrainScheduleDto = {
        trainNumber: formData.trainNumber,
        departureStationId: formData.departureStation.id,
        arrivalStationId: formData.arrivalStation.id,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        departurePlatform: formData.departurePlatform ? parseInt(formData.departurePlatform) : undefined,
        arrivalPlatform: formData.arrivalPlatform ? parseInt(formData.arrivalPlatform) : undefined
      };
      
      let updatedSchedule: TrainSchedule;
      
      if (formMode === 'add') {
        // Додавання нового розкладу
        updatedSchedule = await trainScheduleService.createTrainSchedule(scheduleData);
      } else if (selectedSchedule) {
        // Редагування існуючого розкладу
        updatedSchedule = await trainScheduleService.updateTrainSchedule(selectedSchedule.id, scheduleData);
      } else {
        throw new Error('Не вдалося визначити ID розкладу для оновлення');
      }
      
      // Форматуємо час для відображення
      updatedSchedule = {
        ...updatedSchedule,
        departureTime: trainScheduleService.formatTime(updatedSchedule.departureTime),
        arrivalTime: trainScheduleService.formatTime(updatedSchedule.arrivalTime)
      };
      
      // Оновлюємо стан, залежно від режиму (додавання або редагування)
      if (formMode === 'add') {
        setSchedules(prevSchedules => [...prevSchedules, updatedSchedule]);
      } else {
        setSchedules(prevSchedules => 
          prevSchedules.map(schedule => 
            schedule.id === updatedSchedule.id ? updatedSchedule : schedule
          )
        );
      }
      
      // Очищення помилок
      setError(null);
    } catch (err) {
      console.error('Помилка при збереженні розкладу:', err);
      setError('Не вдалося зберегти розклад. Спробуйте пізніше.');
    } finally {
      setIsProcessing(false);
      // Закриття форми після збереження
      setIsFormOpen(false);
      resetForm();
    }
  };

  // Обробник вибору станції відправлення
  const handleDepartureStationSelect = (station: Station) => {
    setFormData(prev => ({
      ...prev,
      departureStation: station
    }));
  };

  // Обробник вибору станції прибуття
  const handleArrivalStationSelect = (station: Station) => {
    setFormData(prev => ({
      ...prev,
      arrivalStation: station
    }));
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-accent-muted">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Заголовок сторінки з кнопкою додавання */}
      <div className="flex justify-between items-center mb-6 bg-dark-800 p-4 rounded-lg">
        <h1 className="text-xl font-medium text-accent-bright">Редагування розкладу потягів</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/schedule')}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-accent rounded-md transition-colors"
          >
            Назад до розкладу
          </button>
          <button
            onClick={handleAddSchedule}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-dark-900 rounded-md transition-colors"
            disabled={isProcessing}
          >
            Додати рейс
          </button>
        </div>
      </div>

      {/* Повідомлення про помилку */}
      {error && (
        <div className="p-4 mb-6 bg-dark-800 rounded-lg text-error">
          {error}
        </div>
      )}

      {/* Індикатор обробки */}
      {isProcessing && (
        <div className="p-4 mb-6 bg-dark-800 rounded-lg text-accent-muted">
          Обробка запиту...
        </div>
      )}

      {/* Таблиця розкладів */}
      <ScheduleTable 
        schedules={schedules} 
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
      />

      {/* Модальне вікно для додавання/редагування розкладу */}
      <ScheduleFormModal
        isOpen={isFormOpen}
        mode={formMode}
        formData={formData}
        stations={stations}
        onDepartureStationSelect={handleDepartureStationSelect}
        onArrivalStationSelect={handleArrivalStationSelect}
        onSave={handleSaveForm}
        onClose={handleCloseForm}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default ScheduleEditPage; 