import { apiService } from './index';
import { TrainSchedule } from '../types/train-schedule.types';

/**
 * Тип для створення або оновлення розкладу потягу
 */
export interface TrainScheduleDto {
  trainNumber: string;
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string;
  arrivalTime: string;
  departurePlatform?: number;
  arrivalPlatform?: number;
}

/**
 * Сервіс для роботи з розкладом потягів
 */
export class TrainScheduleService {
  private readonly baseUrl: string = 'train-schedules';

  /**
   * Отримує список всіх розкладів потягів
   * @returns Проміс зі списком розкладів
   */
  public async getTrainSchedules(): Promise<TrainSchedule[]> {
    try {
      return await apiService.get<TrainSchedule[]>(this.baseUrl);
    } catch (error) {
      console.error('Помилка при отриманні розкладу потягів:', error);
      throw error;
    }
  }

  /**
   * Отримує розклад потягів для конкретної станції
   * @param stationId ID станції
   * @returns Проміс зі списком розкладів для станції
   */
  public async getScheduleByStation(stationId: string): Promise<TrainSchedule[]> {
    try {
      const allSchedules = await this.getTrainSchedules();
      
      // Фільтруємо розклади для вказаної станції
      return allSchedules.filter(schedule => 
        schedule.departureStationId === stationId || 
        schedule.arrivalStationId === stationId
      );
    } catch (error) {
      console.error(`Помилка при отриманні розкладу для станції ${stationId}:`, error);
      throw error;
    }
  }

  /**
   * Отримує розклад потяга за ID
   * @param id ID розкладу
   * @returns Проміс з розкладом
   */
  public async getTrainScheduleById(id: string): Promise<TrainSchedule> {
    try {
      return await apiService.get<TrainSchedule>(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Помилка при отриманні розкладу потяга з ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Створює новий розклад потяга
   * @param data Дані для створення розкладу
   * @returns Проміс зі створеним розкладом
   */
  public async createTrainSchedule(data: TrainScheduleDto): Promise<TrainSchedule> {
    try {
      // Форматуємо час у відповідний формат ISO для API
      const formattedData = this.formatTimeForApi(data);
      return await apiService.post<TrainSchedule>(this.baseUrl, formattedData);
    } catch (error) {
      console.error('Помилка при створенні розкладу потяга:', error);
      throw error;
    }
  }

  /**
   * Оновлює існуючий розклад потяга
   * @param id ID розкладу для оновлення
   * @param data Нові дані розкладу
   * @returns Проміс з оновленим розкладом
   */
  public async updateTrainSchedule(id: string, data: TrainScheduleDto): Promise<TrainSchedule> {
    try {
      // Форматуємо час у відповідний формат ISO для API
      const formattedData = this.formatTimeForApi(data);
      // Наразі використовуємо PATCH, але можна замінити на PUT якщо API використовує його
      return await apiService.patch<TrainSchedule>(`${this.baseUrl}/${id}`, formattedData);
    } catch (error) {
      console.error(`Помилка при оновленні розкладу потяга з ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Видаляє розклад потяга
   * @param id ID розкладу для видалення
   * @returns Проміс з результатом видалення
   */
  public async deleteTrainSchedule(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Помилка при видаленні розкладу потяга з ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Форматує дані розкладу для відправки на API
   * @param data Дані розкладу
   * @returns Відформатовані дані розкладу
   */
  private formatTimeForApi(data: TrainScheduleDto): TrainScheduleDto {
    // Отримуємо поточну дату
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    
    // Створюємо копію даних для форматування
    const formattedData = { ...data };
    
    // Форматуємо час у ISO формат
    if (data.departureTime) {
      const [hours, minutes] = data.departureTime.split(':');
      const date = new Date(year, month, day, parseInt(hours), parseInt(minutes));
      formattedData.departureTime = date.toISOString();
    }
    
    if (data.arrivalTime) {
      const [hours, minutes] = data.arrivalTime.split(':');
      const date = new Date(year, month, day, parseInt(hours), parseInt(minutes));
      formattedData.arrivalTime = date.toISOString();
    }
    
    // Перетворюємо платформи з рядка в число
    if (typeof formattedData.departurePlatform === 'string') {
      const platform = parseInt(formattedData.departurePlatform as any);
      formattedData.departurePlatform = isNaN(platform) ? undefined : platform;
    }
    
    if (typeof formattedData.arrivalPlatform === 'string') {
      const platform = parseInt(formattedData.arrivalPlatform as any);
      formattedData.arrivalPlatform = isNaN(platform) ? undefined : platform;
    }
    
    return formattedData;
  }

  /**
   * Форматує час у формат HH:MM
   * @param dateString Рядок дати/часу
   * @returns Відформатований час
   */
  public formatTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return '--:--';
    }
  }
}

// Створюємо екземпляр сервісу для використання в додатку
export const trainScheduleService = new TrainScheduleService(); 