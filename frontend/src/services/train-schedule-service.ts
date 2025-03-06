import { apiService } from './index';
import { TrainSchedule } from '../types/train-schedule.types';

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
   * Форматує час у формат HH:MM
   * @param dateString Рядок дати/часу
   * @returns Відформатований час
   */
  private formatTime(dateString: string): string {
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