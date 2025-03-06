'use client';

import React, { useState, useEffect } from 'react';
import { stationService, StationDto } from '@/services/station-service';
import { Station } from '@/types/train-schedule.types';
import StationTable from './components/StationTable';
import StationFormModal from './components/StationFormModal';
import { useRouter } from 'next/navigation';

/**
 * Сторінка управління станціями
 */
const StationsPage: React.FC = () => {
  const router = useRouter();
  
  // Стани для даних
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Стани для форми редагування
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  // Стани для полів форми
  const [formData, setFormData] = useState({
    name: '',
    city: ''
  });

  // Завантаження даних
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const stationsData = await stationService.getStations();
        setStations(stationsData);
      } catch (err) {
        console.error('Помилка при завантаженні станцій:', err);
        setError('Не вдалося завантажити дані. Спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStations();
  }, []);

  // Відкриття форми для додавання нової станції
  const handleAddStation = () => {
    setFormMode('add');
    resetForm();
    setIsFormOpen(true);
  };

  // Відкриття форми для редагування існуючої станції
  const handleEditStation = (station: Station) => {
    setFormMode('edit');
    setSelectedStation(station);
    
    // Заповнення форми даними обраної станції
    setFormData({
      name: station.name,
      city: station.city
    });
    
    setIsFormOpen(true);
  };

  // Видалення станції
  const handleDeleteStation = async (stationId: string) => {
    if (!window.confirm('Ви дійсно хочете видалити цю станцію?')) {
      return;
    }
    
    try {
      setIsProcessing(true);
      await stationService.deleteStation(stationId);
      
      // Оновлюємо локальний стан після успішного видалення
      setStations(prevStations => 
        prevStations.filter(station => station.id !== stationId)
      );
      
      // Показуємо повідомлення про успіх
      setError(null);
    } catch (err: any) {
      console.error('Помилка при видаленні станції:', err);
      
      // Перевіряємо, чи є повідомлення про помилку від API
      if (err.response && err.response.error && err.response.error.message) {
        setError(err.response.error.message);
      } else {
        setError('Не вдалося видалити станцію. Спробуйте пізніше.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Скидання форми
  const resetForm = () => {
    setSelectedStation(null);
    setFormData({
      name: '',
      city: ''
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
    if (!formData.name || !formData.city) {
      setError('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Підготовка даних для відправки на API
      const stationData: StationDto = {
        name: formData.name,
        city: formData.city
      };
      
      let updatedStation: Station;
      
      if (formMode === 'add') {
        // Додавання нової станції
        updatedStation = await stationService.createStation(stationData);
      } else if (selectedStation) {
        // Редагування існуючої станції
        updatedStation = await stationService.updateStation(selectedStation.id, stationData);
      } else {
        throw new Error('Не вдалося визначити ID станції для оновлення');
      }
      
      // Оновлюємо стан, залежно від режиму (додавання або редагування)
      if (formMode === 'add') {
        setStations(prevStations => [...prevStations, updatedStation]);
      } else {
        setStations(prevStations => 
          prevStations.map(station => 
            station.id === updatedStation.id ? updatedStation : station
          )
        );
      }
      
      // Очищення помилок
      setError(null);
    } catch (err) {
      console.error('Помилка при збереженні станції:', err);
      setError('Не вдалося зберегти станцію. Спробуйте пізніше.');
    } finally {
      setIsProcessing(false);
      // Закриття форми після збереження
      setIsFormOpen(false);
      resetForm();
    }
  };

  if (loading && stations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-accent-muted">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-10">
      {/* Заголовок сторінки з кнопкою додавання */}
      <div className="flex justify-between items-center mb-6 bg-dark-800 p-4 rounded-lg">
        <h1 className="text-xl font-medium text-accent-bright">Управління станціями</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-accent rounded-md transition-colors"
          >
            На головну
          </button>
          <button
            onClick={handleAddStation}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-dark-900 rounded-md transition-colors"
            disabled={isProcessing}
          >
            Додати станцію
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

      {/* Таблиця станцій */}
      <StationTable 
        stations={stations} 
        onEdit={handleEditStation} 
        onDelete={handleDeleteStation}
        isProcessing={isProcessing}
      />

      {/* Модальне вікно для додавання/редагування станції */}
      <StationFormModal
        isOpen={isFormOpen}
        mode={formMode}
        onClose={handleCloseForm}
        onSave={handleSaveForm}
        formData={formData}
        onInputChange={handleInputChange}
        isProcessing={isProcessing}
        error={error}
      />
    </div>
  );
};

export default StationsPage; 