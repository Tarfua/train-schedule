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
   * Фільтрує розклад, щоб показувати тільки майбутні або нещодавні (в межах 10 хвилин) відправлення/прибуття
   * @param schedules Масив розкладів
   * @param stationType Тип станції ('departures' або 'arrivals')
   * @returns Відфільтрований масив розкладів
   */
  public filterRecentAndUpcomingSchedules(
    schedules: TrainSchedule[], 
    stationType: 'departures' | 'arrivals'
  ): TrainSchedule[] {
    const now = new Date();
    // 10 хвилин тому
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    
    return schedules.filter(schedule => {
      // Вибираємо час залежно від типу (відправлення чи прибуття)
      const timeStr = stationType === 'departures' 
        ? schedule.departureTime 
        : schedule.arrivalTime;
      
      // Створюємо повний об'єкт Date з часом з розкладу
      const scheduleTime = new Date(timeStr);
      
      // Залишаємо тільки ті, що в майбутньому або відбулися не більше 10 хвилин тому
      return scheduleTime >= tenMinutesAgo;
    });
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
      return await apiService.post<TrainSchedule>(this.baseUrl, data);
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
      // Наразі використовуємо PATCH, але можна замінити на PUT якщо API використовує його
      return await apiService.patch<TrainSchedule>(`${this.baseUrl}/${id}`, data);
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
   * Функція для перевірки правильності дати та часу
   * @param departureDateTime Дата та час відправлення
   * @param arrivalDateTime Дата та час прибуття
   * @returns Чи правильно задані дати та час
   */
  public validateDatesOrder(departureDateTime: string, arrivalDateTime: string): boolean {
    const departureDate = new Date(departureDateTime);
    const arrivalDate = new Date(arrivalDateTime);
    return departureDate <= arrivalDate;
  }

  /**
   * Форматує дату у зручний для відображення формат (ДД.ММ.РРРР)
   * @param dateString Рядок дати/часу
   * @returns Відформатована дата
   */
  public formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    } catch {
      return '--.--.----';
    }
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

  /**
   * Форматує дату та час у зручний для читання формат (ДД.ММ.РРРР HH:MM)
   * @param dateString Рядок дати/часу
   * @returns Відформатовані дата та час
   */
  public formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      const formattedDate = this.formatDate(dateString);
      const formattedTime = this.formatTime(dateString);
      return `${formattedDate} ${formattedTime}`;
    } catch {
      return '--.--.---- --:--';
    }
  }
}

// Створюємо екземпляр сервісу для використання в додатку
export const trainScheduleService = new TrainScheduleService(); 